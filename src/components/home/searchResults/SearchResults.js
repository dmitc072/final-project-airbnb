//This components is connected to the home page and displays the results for properties. 

import { Box, Button, Modal, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../../context";
import styles from "./searchResults.module.scss"
import { AvailabilityModal } from "../availability/AvailabilityModal";


export const SearchResults = ({ searchResult }) => {
  const { row } = useContext(AppContext);
  const [open,setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(""); // State to track selected image
  const [openRentModal,setOpenRentModal] = useState(false)
  const [propertyData, setPropertyData] = useState([])


  const handleClose = () =>{setOpen(false)}
  const MainImage = ({ imageUrl }) => (
    <div className={styles.center}>
    <Box className={styles.mainImage}
      sx={{
        ...styles.mainImage,
        backgroundImage: `url(${imageUrl})`,
      }}
      onClick={() => handleImageClick(imageUrl)}  // Call function to set image and open modal
    />
    </div>
  );
  
  const OtherImages = ({ imageUrls }) => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: 'center',
      }}
    >
      {imageUrls.map((imageUrl, imgIndex) => (
        <Box className={styles.otherImages}
          key={imgIndex}
          sx={{
            backgroundImage: `url(${imageUrl})`,
          }}
          onClick={() => handleImageClick(imageUrl)}  // Call function to set image and open modal

        />
      ))}
    </Box>
  );

  const handleImageClick = (imageUrl) => {
      setSelectedImage(imageUrl);  // Set clicked image URL
      setOpen(true);               // Open the modal
  };


  const checkAvailablity = (result) => {
    setPropertyData(result);
    setOpenRentModal(true)//allows availabilityModel.js to open
    
  
  }

  return (
    <div>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box className={styles.modal}>
          <img
            className={styles.modalImage}
            src={selectedImage}  // Use the selected image URL
            alt="Selected"         
            onLoad={() => console.log('Image loaded successfully')}
            onError={(e) => console.error('Error loading image:', e)}
          />
          <div className={styles.button}>
            <Button  sx={{ m: 2 }} onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
      <AvailabilityModal openRentModal={openRentModal} setOpenRentModal={setOpenRentModal} propertyData={propertyData}/>
      {/* Display per property */}
      {searchResult.length > 0 ?
      
      (<Box sx={{ ...row, display: 'flex', flexWrap: 'wrap', alignItems:"flex-start", gap: 2 }}>
        {console.log("length", searchResult)}
        {searchResult.map((result, index) => (
          <Box
            key={index}
            className={styles.container}
          >
            {/* Display all images */}
            {result.imageUrls && result.imageUrls.length > 0 ? (
                <>
                {/* Display the first image */}
                <MainImage imageUrl={result.imageUrls[0]} />
                {/* Display the remaining images */}
                <OtherImages imageUrls={result.imageUrls.slice(1)} />
              </>
              ) : (
              <Box className={styles.noImage}>
                  <Typography variant="body2" color="textSecondary">No Images Available</Typography>
              </Box>
              )}
            <div className={styles.row}>
              <div>
                <Typography variant="h6">State:</Typography>
                <Typography>{result.state}</Typography>
              </div>
              <div>
                <Typography variant="h6">City:</Typography>
                <Typography>{result.city}</Typography>
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <Typography variant="h6">Zip Code:</Typography>
                <Typography>{result.zipCode}</Typography>
              </div>
              <div>
                <Typography variant="h6">Type of Room:</Typography>
                <Typography>{result.roomType}</Typography>
              </div>
            </div>
            <div>
                <Typography variant="h6">Description:</Typography>
                <Typography>{result.description}</Typography>
            </div>
            <Typography variant="h6">Price per Night:</Typography>
            <Typography>{`$${result.pricePerNight}`}</Typography>
            <Button onClick={() => checkAvailablity(result)}>Rent Location</Button>
            </Box>
        ))}
      </Box>):
      (<Typography className={styles.center}> No result!</Typography>)}
    </div>
  );
};
