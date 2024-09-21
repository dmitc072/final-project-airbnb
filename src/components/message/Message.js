import { useState } from "react";
import styles from "./messages.module.scss"
import { Box, Button, Container, Typography, useMediaQuery, TextField } from "@mui/material";


export const Message = () => {
    const mobileView = useMediaQuery("(max-width: 590px)");
    const [message,setMessage] = useState("")

 
    return(
        <>
            <div className={styles.container}>
                <div className={styles.messageTitle}>
        ccd
                </div>
                {!mobileView && <div className={styles.line}></div>}
                <div className={styles.message}>
                <div className={styles.messageContainer}> 
                    <Typography variant="h5">Message</Typography>  
                    <div className={styles.messageBox}>
                        <textarea className={styles.displayMessage} fullWidth  multiline rows={4} onChange={()=>setMessage(message)}>
                            {message}
                        </textarea>
                        <Button>
                            Submit
                        </Button>
                    </div>
                </div>
                <br/>
                {/*map here*/}
                <div className={styles.returnMessageRenter}>
                    <div className={styles.renter}>
                    To have the .message class fit the remaining space on the side of the title and line, you can adjust the CSS to allow it to take up the full width of the container. Here’s how you can modify your styles: 
                    </div>
                </div>
                <div className={styles.returnMessageHost}>
                    <div className={styles.host}>
                        
To have the .message class fit the remaining space on the side of the title and line, you can adjust the CSS to allow it to take up the full width of the container. Here’s how you can modify your styles: 
                    </div>
                </div>
                     
                  
                </div>
            </div>
        </>
    )
}