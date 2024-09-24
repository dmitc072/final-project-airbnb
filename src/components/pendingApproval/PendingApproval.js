import { Typography } from "@mui/material"
import styles from "./pendingApproval.module.scss"
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../api/firebase-config";
import { useSelector } from "react-redux";
import {PendingApprovalforRenter} from "./PendingApprovalforRenter.js";
import {PendingApprovalforHost} from "./PendingApprovalforHost.js";
import {PendingApprovalMessages} from "./PendingApprovalMessages.js"



export const PendingApproval = () => {
const [pendingPropertiesData,setpendingPropertiesData] = useState([])
const { user } = useSelector((state) => state.auth);
const [loading, setLoading] = useState(true)
const {isHostChecked, isRenterChecked} = useSelector(state =>state.auth.user)

const filterPendingPorpertiesData = pendingPropertiesData.filter((property) => property.pendingApprovals[0]?.requestingUser === user.email)

//retrieves the data for from PendingApproval collection for Tentants/Renter
useEffect(() => {
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const locationArray = [];

            await Promise.all(
                querySnapshot.docs.map(async (user) => {
                    const userData = user.data();
                    const checkProperties = await getDocs(collection(db, "users", user.id, "properties"));

                    await Promise.all(
                        checkProperties.docs.map(async (property) => { //getting me docs from properties
                            const propertyRef = doc(db, "users", user.id, "properties", property.id);
                            const pendingApprovalRef = collection(propertyRef, "PendingApproval");
                            const pendingSnapshot = await getDocs(pendingApprovalRef); //retrieving data from PendingApproval

                            // Only process if there are pending approvals
                            if (!pendingSnapshot.empty) {
                                const pendingApprovals = pendingSnapshot.docs.map(doc => ({
                                    id: doc.id,
                                    ...doc.data(), // Include all data from the PendingApproval document
                                }));

                                locationArray.push({
                                    propertyId: property.id,
                                    propertyData: property.data(), // Include the property data since it is in the loop
                                    userId: user.id,
                                    pendingApprovals, // Add the pending approvals
                                });
                            }
                        })
                    );
                })
            );

            setpendingPropertiesData(locationArray);
            setLoading(false)
        } catch (error) {
            console.error("Error Retrieving Data", error);
        }
    };

    fetchData();
}, []);



    // console.log("Properties: ",filterPendingPorpertiesData)
    // console.log("isHostChecked: ",isHostChecked, "isRenterChecked: ",isRenterChecked )

    return (
        <>

        {!loading ? (
            <>
            {isHostChecked ? (
            <>
            <PendingApprovalMessages/>

                <PendingApprovalforHost filterPendingPorpertiesData={filterPendingPorpertiesData}/>
                <br/>
                <PendingApprovalforRenter filterPendingPorpertiesData={filterPendingPorpertiesData}/>
           </>
            ) : isRenterChecked ? (
                /* For tentant/renters */
                <PendingApprovalforRenter filterPendingPorpertiesData={filterPendingPorpertiesData}/>
            ) :null}
            </>
        ) : (
                <div>Loading...</div>
            ) 
        
        }    
        </>
    )
}