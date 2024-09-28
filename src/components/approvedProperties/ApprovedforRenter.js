import { Button, Typography } from "@mui/material"
import styles from "./approvedProperties.module.scss"
import { RatingModal } from "./RatingModal"
import { useState } from "react"
import { compareDateStringToToday } from "../functions/compareDateStringToToday"

export const ApprovedforRenter = ({filterApprovedPropertiesData}) => {
    const [open,setOpen] = useState(false)
    const [openRatingModal,setOpenRatingModal] = useState(false)
    const [data,setData] =useState([])
    //console.log("Approval Information: ", filterApprovedPropertiesData)


    const approveRequest = (approvedProperty, propertyId) => {
        setData({approvedProperty, propertyId})
        setOpenRatingModal(true)
       // console.log(data)
    }
    return (
        <>
            <RatingModal openRatingModal={openRatingModal} setOpenRatingModal={setOpenRatingModal} data={data}/>

            <div className={styles.container}>
                <Typography variant="h5">Approved Property Request to Rent</Typography>
                <br/>
                {filterApprovedPropertiesData.map((approvedProperty) => (
                    <div key={approvedProperty.propertyId} className={styles.approvedProperties}>
                        <div>
                            <Typography>Property Name:</Typography>
                            <div className={styles.data}>{approvedProperty.propertyData.propertyName}</div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <Typography>Address:</Typography>
                            <div className={styles.data}>{approvedProperty.propertyData.address}</div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <Typography>City:</Typography>
                            <div className={styles.data}>{approvedProperty.propertyData.city}</div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <Typography>State:</Typography>
                            <div className={styles.data}>{approvedProperty.propertyData.state}</div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <Typography>Zip Code:</Typography>
                            <div className={styles.data}>{approvedProperty.propertyData.zipCode}</div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <Typography>Price:</Typography>
                            <div className={styles.data}>{`$${approvedProperty.propertyData.pricePerNight}`}</div>
                        </div>
                        <div className={styles.line}></div>
                        <div>
                            <Typography>POC:</Typography>
                            <div className={styles.data}>{approvedProperty.propertyData.contactEmail}</div>
                        </div>
                        <div>
                            
                            {approvedProperty.approved.map((approved,index) =>(
                                <div key={index} className={styles.center}>  
                                    <div className={styles.row}>
                                        <Typography>From:</Typography>
                                        <div >{approved.fromDate}</div>
                                        <Typography>To:</Typography>
                                        <div >{approved.toDate}</div>
                                        
                                        <div className={styles.button}>
                                            {/*compareDateStringToToday() disables it, if it is in the future */}
                                            <Button disabled={compareDateStringToToday(approved.toDate) || approved.reviewSent} onClick={()=>approveRequest(approvedProperty, approved.id)}>Leave Review</Button> 
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}