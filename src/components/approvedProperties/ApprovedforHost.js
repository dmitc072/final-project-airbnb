import { Button, Typography } from "@mui/material"
import styles from "./approvedProperties.module.scss"
import { collection, deleteDoc, doc, getDoc, getDocs, QuerySnapshot, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { db } from "../../api/firebase-config";
import { AppContext } from "../../context";

export const ApprovedforHost = () => {
    const {user} = useSelector(state => state.auth)
    const [approvedProperties,setApprovedProperties] = useState([])
    const filterApprovedProperties = approvedProperties.filter(property => property != undefined)
    const {row,column} =useContext(AppContext)

    useEffect(() => {
        const fetchPropertiesForApproval = async () => {
            try {
                // Create a reference to the collection of properties
                const propertySnapshot = await getDocs(collection(db, "users", user.email, "properties"));
                console.log(propertySnapshot);
    
                if (!propertySnapshot.empty) {
                    // Map through each property, fetching its ApprovedApproval documents
                    const propertyMap = await Promise.all(
                        propertySnapshot.docs.map(async (property) => {
                            const propertyData = await getDocs(collection(db, "users", user.email, "properties", property.id, "ApprovedApproval"));
    
                            if (!propertyData.empty) {
                                const availability = propertyData.docs.map((available) => {
                                    return {
                                        id: available.id,
                                        ...available.data(), // Data from ApprovedApproval documents
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
    
                    setApprovedProperties(propertyMap);
                } else {
                    console.log("No properties found for approval.");
                }
            } catch (error) {
                console.error("Unable to retrieve Data: ", error);
            }
        };
    
        fetchPropertiesForApproval();
    }, [user.email]);
    
    const deleteRequest = async (approvedProperty, approvedRequestID) => {
        console.log("approvedProperty:",approvedProperty, "approvedRequest", approvedRequestID)
        try {
            const docRef = doc(db, "users", user.email, "properties", approvedProperty.id, "ApprovedApproval", approvedRequestID);
            
            // Delete the document
            await deleteDoc(docRef);
            console.log("Deleted requested");
    
            setApprovedProperties((prev) => //prev: Refers to the current state of approvedProperties
                prev.map((property) => {
                    console.log("property", property);
                    
                    // Check if property and approvedProperty exist and have an id
                    if (property?.id && approvedProperty?.id && property.id === approvedProperty.id) {
                        return {
                            ...property,
                            availability: property.availability?.filter(req => req.id !== approvedRequestID) || []
                        };
                    }
                    
                    return property;
                })
            );
            
        } catch (error) {
            console.error("Error in deleting request: ", error);
        }
    };
    
    

    const approveRequest = async (approvedProperty, approvedRequestID) => {
        const querySnapshot = doc(db,"users",user.email,"properties",approvedProperty.id,"ApprovedApproval",approvedRequestID)
        const copyData = await getDoc(querySnapshot)
        //console.log("copied data: ",copyData.data())
        const approvalDoc = doc(db,"users",user.email,"properties",approvedProperty.id,"Approval",approvedRequestID)
        const changeToApproval = await setDoc(approvalDoc,
            copyData.data(),
            {merge:true}
        )
        
        const deleteApproved = await deleteDoc(querySnapshot)
        console.log("Deleted requested");

        setApprovedProperties((prev) => //prev: Refers to the current state of approvedProperties
                prev.map((property) => {
                    console.log("property", property);
                    
                    // Check if property and property.id and approvedProperty exist and have an id
                    if (property?.id && approvedProperty?.id && property.id === approvedProperty.id) {
                        return {
                            ...property,
                            availability: property.availability?.filter(req => req.id !== approvedRequestID) 
                        };
                    }
                    
                    return property;
                })
            );
        
    }

    //console.log(filterApprovedProperties)
    return (
        <>
        <div className={styles.container}>
            <Typography variant="h5">Approved Property Request to Host</Typography>
            {filterApprovedProperties.map((approvedProperty, index)=>(
                <div key={index} className={styles.approvedProperties}>
                     <div>
                        <Typography>Property Name:</Typography>
                        <div className={styles.data}>{approvedProperty.propertyName}</div>
                    </div>
                    <div>
                        
                        {approvedProperty.availability.map((approved,index) =>(
                            <div key={index} className={styles.center}>  
                                <div className={styles.row}>
                                    <Typography>From:</Typography>
                                    <div >{approved.fromDate}</div>
                                    <Typography>To:</Typography>
                                    <div >{approved.toDate}</div>
                                </div>
                                <div className={styles.button}>
                                    <Button onClick={()=>approveRequest(approvedProperty, approved.id)}>Approve</Button>
                                    <Button onClick={() => deleteRequest(approvedProperty, approved.id)}>Disapprove</Button>
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