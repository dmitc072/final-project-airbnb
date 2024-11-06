import { Button, Typography } from "@mui/material"
import styles from "./pendingApproval.module.scss"
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase-config";

export const PendingApprovalforHost = () => {
    const {user} = useSelector(state => state.auth)
    const [pendingProperties,setPendingProperties] = useState([])
    const filterPendingProperties = pendingProperties.filter(property => property !== undefined)

    useEffect(() => {
        const fetchPropertiesForApproval = async () => {
            try {
                // Create a reference to the collection of properties
                const propertySnapshot = await getDocs(collection(db, "users", user.email, "properties"));
                console.log(propertySnapshot);
    
                if (!propertySnapshot.empty) {
                    // Map through each property, fetching its PendingApproval documents
                    const propertyMap = await Promise.all(
                        propertySnapshot.docs.map(async (property) => {
                            const propertyData = await getDocs(collection(db, "users", user.email, "properties", property.id, "PendingApproval"));
    
                            if (!propertyData.empty) {
                                const availability = propertyData.docs.map((available) => {
                                    return {
                                        id: available.id,
                                        ...available.data(), // Data from PendingApproval documents
                                    };
                                });
    
                                return {
                                    id: property.id,
                                    ...property.data(), // Get the property data
                                    availability, // Add availability information to the property object to display becuase it is a child
                                };
                            }
    
                            
                        })
                    );
    
                    setPendingProperties(propertyMap);
                } else {
                    console.log("No properties found for approval.");
                }
            } catch (error) {
                console.error("Unable to retrieve Data: ", error);
            }
        };
    
        fetchPropertiesForApproval();
    }, [user.email]);
    
    const deleteRequest = async (pendingProperty, pendingRequestID) => {
        console.log("pendingProperty:",pendingProperty, "pendingRequest", pendingRequestID)
        try {
            const docRef = doc(db, "users", user.email, "properties", pendingProperty.id, "PendingApproval", pendingRequestID);
            
            // Delete the document
            await deleteDoc(docRef);
          //  console.log("Deleted requested");
    
            setPendingProperties((prev) => //prev: Refers to the current state of pendingProperties
                prev.map((property) => {
                    console.log("property", property);
                    
                    // Check if property and pendingProperty exist and have an id
                    if (property?.id && pendingProperty?.id && property.id === pendingProperty.id) {
                        return {
                            ...property,
                            availability: property.availability?.filter(req => req.id !== pendingRequestID) || []
                        };
                    }
                    
                    return property;
                })
            );
            
        } catch (error) {
            console.error("Error in deleting request: ", error);
        }
    };
    
    

    const approveRequest = async (pendingProperty, pendingRequestID) => {
        const querySnapshot = doc(db,"users",user.email,"properties",pendingProperty.id,"PendingApproval",pendingRequestID);
        const copyData = await getDoc(querySnapshot)
        const getPriceSnapshot = doc(db,"users",user.email,"properties",pendingProperty.id);
        const getPrice = await getDoc(getPriceSnapshot)
        const pricePerNight = getPrice.data().pricePerNight;

        //console.log("copied data: ",copyData.data())
        const approvalDoc = doc(db,"users",user.email,"properties",pendingProperty.id,"Approval",pendingRequestID)

        await setDoc(
            approvalDoc,
            {
                ...copyData.data(), 
                pricePerNight       
            },
            { merge: true }        
        );
        
        await deleteDoc(querySnapshot)
        console.log("Deleted requested");

        setPendingProperties((prev) => //prev: Refers to the current state of pendingProperties
                prev.map((property) => {
                    console.log("property", property);
                    
                    // Check if property and property.id and pendingProperty exist and have an id
                    if (property?.id && pendingProperty?.id && property.id === pendingProperty.id) {
                        return {
                            ...property,
                            availability: property.availability?.filter(req => req.id !== pendingRequestID) 
                        };
                    }
                    
                    return property;
                })
            );
        
    }

    //console.log(filterPendingProperties)
    return (
        <>
        <div className={styles.container}>
            <Typography variant="h5">Pending Property Request to Host</Typography>
            {filterPendingProperties.map((pendingProperty, index)=>(
                <div key={index} className={styles.pendingProperties}>
                     <div>
                        <Typography>Property Name:</Typography>
                        <div className={styles.data}>{pendingProperty.propertyName}</div>
                    </div>
                    <div>
                        
                        {pendingProperty.availability.map((pending,index) =>(
                            <div key={index} className={styles.center}>  
                                <div className={styles.row}>
                                    <Typography>From:</Typography>
                                    <div >{pending.fromDate}</div>
                                    <Typography>To:</Typography>
                                    <div >{pending.toDate}</div>
                                </div>
                                <div className={styles.button}>
                                    <Button onClick={()=>approveRequest(pendingProperty, pending.id)}>Approve</Button>
                                    <Button onClick={() => deleteRequest(pendingProperty, pending.id)}>Disapprove</Button>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                    
                </div>
            ))}
            <br/>
        </div>
        </>
    )
}