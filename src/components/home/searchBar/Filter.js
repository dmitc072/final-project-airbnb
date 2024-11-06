import { Box, Button, Modal, Slider, TextField } from "@mui/material";
import styles from "./filterStyles.scss";
import { useState } from "react";

export const Filter = ({ open, setOpen, priceValue, setPriceValue }) => {
  const [originalPriceValue, setOriginalPriceValue] = useState([priceValue[0], priceValue[1]]);


  const handleClose = () => { 
    setOpen(false) 
  };

  const handleSave = () =>{
    setPriceValue(originalPriceValue)
    console.log(priceValue)
    setOpen(false) 

  }

  function originalPriceValuetext(originalPriceValue) {
    return `$${originalPriceValue}`;
  }

  const handleSliderChange = (event, newValue) => {
    setOriginalPriceValue(newValue);
  };

  // Update the min originalPriceValue
  const handleMinChange = (event) => {
    const newMin = Math.max(0, Math.min(event.target.value, originalPriceValue[1])); // Ensure it doesn’t exceed max
    setOriginalPriceValue([newMin, originalPriceValue[1]]);
  };

  // Update the max originalPriceValue
  const handleMaxChange = (event) => {
    const newMax = Math.min(1000, Math.max(event.target.value, originalPriceValue[0])); // Ensure it doesn’t go below min
    setOriginalPriceValue([originalPriceValue[0], newMax]);
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
          sx={{
            maxWidth: "300px",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            margin: "auto",
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px"
          }}>
          <div>Filter by Price:</div>
          <Slider
            getAriaLabel={() => 'Filter by Price:'}
            value={originalPriceValue}
            min={0}
            max={1000}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaValueText={originalPriceValuetext}
            valueLabelFormat={originalPriceValuetext}
          />
          <div className={styles.row} style={{display:"flex", flexDirection:"row"}}>
            <TextField 
                style={{width:"90px"}}
                id="outlined-min"
                label="Min"
                type="number"
                value={originalPriceValue[0]}
                onChange={handleMinChange}
                inputProps={{
                min: 0,
                max: originalPriceValue[1],
                }}
            />
            <TextField className={styles.textField}
                style={{width:"90px"}}
                id="outlined-max"
                label="Max"
                type="number"
                value={originalPriceValue[1]}
                onChange={handleMaxChange}
                inputProps={{
                min: originalPriceValue[0],
                max: 1000,
                }}
            />
          </div>
          <div>
            <Button sx={{ m: 2 }} onClick={handleSave}>
              Save
            </Button>
            <Button sx={{ m: 2 }} onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};
//206718