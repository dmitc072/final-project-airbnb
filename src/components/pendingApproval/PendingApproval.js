import { Typography } from "@mui/material"
import styles from "./pendingApproval.module.scss"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "../../api/firebase-config"
import { useSelector } from "react-redux"

export const PendingApproval = () => {
const [pendingPropertiesData,setpendingPropertiesData] = useState([])
const { user } = useSelector((state) => state.auth);
const [loading, setLoading] = useState(true)

const filterPendingPorpertiesData = pendingPropertiesData.filter((property) => property.pendingApprovals[0]?.requestingUser === user.email)

//retrieves the data for from PendingApproval collection
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



    console.log("Properties: ",filterPendingPorpertiesData)
    return (
        <>
        {!loading && 
            <div className={styles.container}>
                <Typography variant="h5">Pending Property Request</Typography>
                <br/>
                {filterPendingPorpertiesData.map((pendingProperty) => (
                <div key={pendingProperty.propertyId} className={styles.pendingProperties}>
                    <div>
                        <Typography>Property Name:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyData.propertyName}</div>
                    </div>
                    <div className={styles.line}></div>
                    <div>
                        <Typography>Address:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyData.address}</div>
                    </div>
                    <div className={styles.line}></div>
                    <div>
                        <Typography>City:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyData.city}</div>
                    </div>
                    <div className={styles.line}></div>
                    <div>
                        <Typography>State:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyData.state}</div>
                    </div>
                    <div className={styles.line}></div>
                    <div>
                        <Typography>Zip Code:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyData.zipCode}</div>
                    </div>
                    <div className={styles.line}></div>
                    <div>
                        <Typography>Price:</Typography>
                        <div className={styles.data}>{`$${pendingProperty.propertyData.pricePerNight}`}</div>
                    </div>
                    <div className={styles.line}></div>
                    <div>
                        <Typography>POC:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyData.contactEmail}</div>
                    </div>
                    <div>
                        <Typography>From:</Typography>
                             {pendingProperty.pendingApprovals.map((from, index) => (
                                <div key={index} className={styles.data}>{from.fromDate}</div>
                            ))}
                    </div>
                    <div>
                        <Typography>To:</Typography>
                        {pendingProperty.pendingApprovals.map((to, index)=>(
                             <div key={index} className={styles.data}>{to.toDate}</div>
                        ))}
                       
                    </div>
                </div>
                
                ))}
            </div>
        }
        </>
    )
}