import { Button, Typography } from "@mui/material"
import styles from "./approvedProperties.module.scss"
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import {  useEffect, useState } from "react";
import { db } from "../../api/firebase-config";

export const ApprovedforHost = () => {
    const {user} = useSelector(state => state.auth)
    const [approvedProperties,setApprovedProperties] = useState([])
    const filterApprovedProperties = approvedProperties.filter(property => property !== undefined)
    const [investment,setInvestment] =useState(0);

    useEffect(() => {
        const fetchPropertiesForApproval = async () => {
            try {
                // Create a reference to the collection of properties
                const propertySnapshot = await getDocs(collection(db, "users", user.email, "properties"));
                //console.log(user.email);
                let totalInvestment = 0;
                if (!propertySnapshot.empty) {
                    // Map through each property, fetching its ApprovedApproval documents
                    const propertyMap = await Promise.all(
                        propertySnapshot.docs.map(async (property) => {
                            const propertyData = await getDocs(collection(db, "users", user.email, "properties", property.id, "Approval"));
    
                            if (!propertyData.empty) {
                                const availability = propertyData.docs.map((available) => {
                                const data = available.data();
                                console.log("data",data)
                                totalInvestment += parseInt(data.pricePerNight, 10) || 0; // Parse and add price per night
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
                   
                    setInvestment(totalInvestment)
                    setApprovedProperties(propertyMap);
                } else {
                   // console.log("No properties found for approval.");
                }
            } catch (error) {
                console.error("Unable to retrieve Data: ", error);
            }
        };
    
        fetchPropertiesForApproval();
    }, [user.email]);
    

    
    

    const reviewMessage = async (approvedProperty, reviewMessage) => {
       // console.log(reviewMessage)
        alert(reviewMessage)
    }

    return (
        <>
        <div className={styles.container}>
            <Typography sx={{fontWeight:"bold"}} variant="h5">Approved Property Request to Host</Typography>
            <Typography variant="h5" className={styles.margin}>Total Earnings: ${investment}</Typography>

            {filterApprovedProperties.map((approvedProperty, index)=>(
                <div key={index} className={styles.approvedProperties}>
                     <div>
                        <Typography>Property Name:</Typography>
                        <div className={styles.data}>{approvedProperty.id}</div>
                    </div>
                    <div>
                        
                        {approvedProperty.availability.map((approved,index) =>(
                            <div key={index} className={styles.center}>  
                                <div className={styles.row}>
                                    <div className={styles.row}>
                                        <Typography>From:</Typography>
                                        <div >{approved.fromDate}</div>
                                    </div>
                                    <div className={styles.row}>
                                        <Typography>To:</Typography>
                                        <div >{approved.toDate}</div>
                                    </div>
                                    {/* {console.log(approved.reviewMessage)} */}
                                    
                                    <div className={styles.button}>
                                        <Button disabled={!approved.reviewMessage} onClick={()=>reviewMessage(approvedProperty, approved.reviewMessage)}>{(approved.reviewMessage) ? "See Review": "No Review"}</Button>
                                    </div>
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