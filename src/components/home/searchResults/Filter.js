import { Box, Button, Modal, Slider } from "@mui/material"
import styles from "./filterStyles.scss"
import { useState } from "react"

export const Filter = ({open, setOpen}) => {
    const handleClose = () =>{setOpen(false)}
    const [value, setValue] = useState([0, 1000])

    function valuetext(value) {
        return `$${value}`;
      }
      
      
        const handleChange = (event, newValue) => {
          setValue(newValue);
        };
    return (
        <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box className={styles.modal}
            sx = {{ 
                maxWidth: "300px",
                height: "auto",
                display: "flex",
                alignItems: "center", /* Vertically center content */
                justifyContent: "center", /* Horizontally center content */
                flexDirection: "column",
                margin: "auto",
                backgroundColor: "white",
                position: "absolute",
                top: "50%", /* Position it in the middle */
                left: "50%", /* Position it in the middle */
                transform: "translate(-50%, -50%)", /* Offset by half the modal's width and height */
                boxShadow:" 0px 4px 15px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "16px"
            }}>
          <div>fjfe</div>
          <Slider
            getAriaLabel={() => 'Temperature range'}
            value={value}
            min={0}  // Minimum value
            max={1000}  // Maximum value
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            valueLabelFormat={valuetext}
          
            />  
              {console.log(value)}       
             <div >
            <Button  sx={{ m: 2 }} onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
        </>
    )
}