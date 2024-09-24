import { Typography } from "@mui/material"
import styles from "./pendingApproval.module.scss"

export const PendingApprovalforRenter = ({filterPendingPorpertiesData}) => {
    return (
        <div className={styles.container}>
            <Typography variant="h5">Pending Property Request to Rent</Typography>
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
    )
}