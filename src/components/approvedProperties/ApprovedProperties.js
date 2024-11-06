
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../api/firebase-config.js";
import { useSelector } from "react-redux";
import {ApprovedforRenter} from "./ApprovedforRenter.js";
import {ApprovedforHost} from "./ApprovedforHost.js";
import {ApprovedMessages} from "./ApprovedMessages.js"



export const ApprovedProperties = () => {
const [approvedPropertiesData,setApprovedPropertiesData] = useState([])
const { user } = useSelector((state) => state.auth);
const [loading, setLoading] = useState(true)
const {isHostChecked, isRenterChecked} = useSelector(state =>state.auth.user)

const filterApprovedPropertiesData = approvedPropertiesData.filter((property) => {
    // Filter the `approved` array to include only those with `requestingUser` matching `user.email`
    const matchingApproved = property.approved.filter((individualApproved) => {
       // console.log("Individual Approved:", JSON.stringify(individualApproved));
        return individualApproved.requestingUser === user.email;
    });
    
    return matchingApproved.length > 0;
});


//retrieves the data for from Approved collection for Tentants/Renter
useEffect(() => {
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const locationArray = [];

            await Promise.all(
                querySnapshot.docs.map(async (user) => {
                    const checkProperties = await getDocs(collection(db, "users", user.id, "properties"));

                    await Promise.all(
                        checkProperties.docs.map(async (property) => { //getting me docs from properties
                            const propertyRef = doc(db, "users", user.id, "properties", property.id);
                            const approvedRef = collection(propertyRef, "Approval");
                            const pendingSnapshot = await getDocs(approvedRef); //retrieving data from Approved

                            // Only process if there are pending approvals
                            if (!pendingSnapshot.empty) {
                                const approved = pendingSnapshot.docs.map(doc => ({
                                    id: doc.id,
                                    ...doc.data(), // Include all data from the Approved document
                                }));

                                locationArray.push({
                                    propertyId: property.id,
                                    propertyData: property.data(), // Include the property data since it is in the loop
                                    userId: user.id,
                                    approved, // Add the pending approvals
                                });
                            }
                        })
                    );
                })
            );
            setApprovedPropertiesData(locationArray);
            setLoading(false)
        } catch (error) {
            console.error("Error Retrieving Data", error);
        }
    };

    fetchData();
}, []);


      console.log("Properties: ",filterApprovedPropertiesData)
    // console.log("isHostChecked: ",isHostChecked, "isRenterChecked: ",isRenterChecked )

    return (
        <>

        {!loading ? (
            <>
            {isHostChecked ? (
            <>
            <ApprovedMessages/>

                <ApprovedforHost filterApprovedPropertiesData={filterApprovedPropertiesData}/>
                <br/>
                <ApprovedforRenter filterApprovedPropertiesData={filterApprovedPropertiesData}/>
           </>
            ) : isRenterChecked ? (
                /* For tentant/renters */
                <ApprovedforRenter filterApprovedPropertiesData={filterApprovedPropertiesData}/>
            ) :null}
            </>
        ) : (
                <div>Loading...</div>
            ) 
        
        }    
        </>
    )
}