import React, { useContext, useState, useEffect,useRef } from 'react';

import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    FormControl,
    Select,
    Autocomplete,
    MenuItem,
    Modal
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { db } from '../../api/firebase-config'; // Adjust the import based on your actual file structure
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { AppContext } from '../../context';
import { PhotoCamera } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for unique file naming
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../api/firebase-config'; // Adjust the import based on your actual file structure
import styles from './advertiseProperty.module.scss'
import axios from 'axios';
import { isDateWithin30Days } from './isDateWithin30Days';
import { dateConversion } from './dateConversion';
import { formatDateToString } from './convertDateToString';

export const AdvertiseProperty = () => {
    const navigate = useNavigate();
    const { column,states } = useContext(AppContext);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null)
    const [imageUploaded, setImageUploaded] = useState(true)
    const [open,setOpen] = useState(false)
    const [newPrice, setNewPrice] = useState(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitted },
    } = useForm({
        defaultValues: {
            propertyName: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            pricePerNight: "",
            description: "",
            contactEmail: "",
            images: [], // Handle multiple images
            available:true, //sets the house to avilable
            roomType:"Entire home/apt",
            latitude: latitude,
            longitude: longitude
        }
    });

    const handleClose = () => {setOpen(false)}

    const addressValue = watch('address')
    const cityValue = watch('city')
    const stateValue = watch('state')
    const zipValue = watch('zipCode')

    //const latitudeValue = watch('latitude');
    //const longitudeValue = watch('longitude');
    const roomTypeValue = watch('roomType');

    const onSubmit = async (data) => {
        try {
            console.log("image",imageUploaded)
            if(!imageUploaded){
                return  alert("Waiting to upload Image!")
            }
            const userDocRef = doc(db, "users", user.email);
            const propertyDocRef = doc(userDocRef, "properties", data.propertyName);
            // Save image URLs along with property data
            await setDoc(propertyDocRef, { 
                ...data,
                latitude:latitude,
                longitude:longitude,
                imageUrls });
            alert("Property Saved!")
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving property:", error.message);
            alert("Error saving property. Please try again.");
        }
    };

    const handleImageUpload = async (event) => {
        setImageUploaded(false)
        const files = Array.from(event.target.files);
        const urls = [];
        const imagePreviews = [];

        for (const file of files) {
            try {
                // Create an object URL for local preview
                const previewUrl = URL.createObjectURL(file);
                imagePreviews.push(previewUrl);

                // Upload image to Firebase Storage
                const fileName = `${uuidv4()}-${file.name}`;
                const storageRef = ref(storage, `images/${fileName}`);
                const uploadResult = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(uploadResult.ref);
                urls.push(downloadURL);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Error uploading image. Please try again.");
            }
        }

        // Update state with image URLs and previews
        setImageUrls(urls);
        setSelectedImages(prev => [...prev, ...imagePreviews]);
        setImageUploaded(true)

    };

    useEffect(() => {
        // Cleanup object URLs on component unmount
        return () => {
            selectedImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [selectedImages]);

    const priceCalculator = async () => {
        try {
            // Fetch the properties collection for the user
            const fetchData = await getDocs(collection(db, "users", user.email, "properties"));
            
            const approvedProperties = []; 
    
            // Use for...of loop to handle async operations properly
            for (const property of fetchData.docs) {
                const propertyRef = doc(db, "users", user.email, "properties", property.id);
                const approvedRef = collection(propertyRef, "Approval");
                
                // Wait for the approved documents to be fetched
                const pendingSnapshot = await getDocs(approvedRef);
            
                if (!pendingSnapshot.empty) {
                    const approved = pendingSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(), // Include all data from the Approved document
                    }));
                    //console.log("Approved:", approved);
                    approvedProperties.push(...approved); 
                }
            }
            let numberOfReviews = 0;
            let within30Days = 0;
            let collectDays = [];
            let lastestReview = 0;
            let listingCount = 0;
            //loop through all properties
            approvedProperties.forEach((property)=>{
                const date = property.review_date
                //count the property
                listingCount ++;

                //if there is a review
                if(property.review_date){
                    //function to check if it is within 30 days
                    const withinRange = isDateWithin30Days(date)

                    //count within the range
                    if(withinRange){
                            within30Days++;
                     }

                    numberOfReviews++;
                    //array is used to see later for the latest review
                    collectDays.push(date)
                }

            })

            for(let day of collectDays){
                if(dateConversion(day) > lastestReview){
                    lastestReview = dateConversion(day)
                }
            }

            lastestReview = formatDateToString(lastestReview)

            // Prepare your data for the price calculation
            const data = {
                latitude: latitude,
                longitude: longitude,
                minimum_nights: 1,
                room_type: roomTypeValue,
                neighbourhood_group: cityValue,
                neighbourhood: cityValue,
                number_of_reviews: numberOfReviews,
                last_review: lastestReview,
                calculated_host_listings_count: listingCount,
                availability_365: 365,
                reviews_per_month: within30Days,
            };
    
            //console.log("com:", data)
            alert("Waiting to retrieve price!")
            const priceCalculatorResponse = await axios.post("https://airbnb-ml.onrender.com/predict", data);
            //console.log("Price Calculator:", priceCalculatorResponse.data);

            const estimatePrice = priceCalculatorResponse.data.prediction
            setNewPrice(Math.floor(estimatePrice))
            setOpen(true);
            // alert(`We predict the value of your home is ${priceCalculatorResponse.data}`);
    
        } catch (error) {
            console.error("Cannot reach server!", error);
        }
    };
    


    const PriceAdjustModal = () => {
    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box className={styles.modal}>
       <Typography>We predict the value of your home is ${newPrice}</Typography>
        <div className={styles.button}>
          <Button  sx={{ m: 2 }} 
            onClick={() => {
                setValue("pricePerNight",newPrice)
                setOpen(false)}}
                >
            Yes
          </Button>
          <Button  sx={{ m: 2 }} onClick={() => setOpen(false)}>
            No
          </Button>
        </div>
      </Box>
    </Modal>
    )
    }

    const previousValues = useRef({ addressValue, cityValue, stateValue, zipValue });

    useEffect(() => {
        const fetchLocation = async () => {
            if(zipValue.length === 5){
                
                let token = localStorage.getItem('token');
                //token is stored as a string so the "" show in the axios call, I have to remove it by removing ""
                token = token.replace(/"/g, '');

        
                try {               
                    //https://geocode.maps.co/                    
                    const fetchData = await axios.get(`https://geocode.maps.co/search?q=${addressValue},${cityValue},${stateValue}&api_key=${token}`);
                    const data = fetchData.data;
                    //console.log("data:", data)
                    if(data.length > 0){
                    //for each address, check if the addess matches the zipCode
                        for(let address of data){
                        const getZip = address.display_name.split(", ")
                        console.log("get Zip:", getZip)
                            if (getZip.includes(zipValue)) {
                                const location = address;
                                setLatitude(location.lat);
                                setLongitude(location.lon);
                                console.log("address,", location)
                            }
                            else {
                                alert("Zip Code may be wrong!");
                            }
                        
                        }
                    } else {
                        alert("Address is not in the Database!")
                    } 
                } catch (error) {
                    console.error("Error fetching data:", error.response ? error.response.data : error.message);
                }
            }
        };
    
        // Only fetch location if address, city, or state changes
        if (
            previousValues.current.addressValue !== addressValue ||
            previousValues.current.cityValue !== cityValue ||
            previousValues.current.stateValue !== stateValue ||
            previousValues.current.zipValue !== zipValue
        ) {
            fetchLocation();
            previousValues.current = { addressValue, cityValue, stateValue };
        }
    }, [zipValue]);
    
    
    return (

        <Box
            display="flex"
            justifyContent="center"
            //alignItems="center"
            height= "fit-content"
            width="100%"
            padding="16px"
            
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                height= "fit-content"
                maxWidth="600px"
                bgcolor="#f5f5f5"
                color="black"
                padding="20px"
                borderRadius="8px"
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                marginBottom="10px"
            >
                <Typography variant="h5" gutterBottom>
                    List a New Property
                </Typography>
                <Box sx={column} >
                    {/* Property Name Field */}
                    <Box className={styles.container}>
                        <Typography gutterBottom>
                            Property Name
                        </Typography>
                        <TextField 
                            {...register("propertyName", {
                                required: "Property Name is required",
                            })}
                            placeholder="Enter property name"
                            error={isSubmitted && !!errors.propertyName}
                            helperText={isSubmitted && errors.propertyName?.message}
                            fullWidth
                        />
                    </Box>
                    
                    {/* Address Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Address
                        </Typography>
                        <TextField 
                            {...register("address", {
                                required: "Address is required",
                            })}
                            placeholder="Enter property address"
                            error={isSubmitted && !!errors.address}
                            helperText={isSubmitted && errors.address?.message}
                            fullWidth
                        />
                    </Box>
                    
                    {/* City Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            City
                        </Typography>
                        <TextField 
                            {...register("city", {
                                required: "City is required",
                            })}
                            placeholder="Enter city"
                            error={isSubmitted && !!errors.city}
                            helperText={isSubmitted && errors.city?.message}
                            fullWidth
                        />
                    </Box>
                    
                    {/* State Field */}
                    <Box className={styles.container}>
                    <Typography variant="subtitle1" gutterBottom>
                        State
                    </Typography>
                    <Controller
                        name="state"
                        control={control}
                        required
                        render={({ field }) => (
                            <Autocomplete
                                className={styles.container}
                                {...field}
                                options={states.map((state) => state.name)} // State names directly as options
                                onChange={(_, selectedOption) => {
                                    field.onChange(selectedOption); // Pass the selected state name
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { height: "50px" }, // Remove the border
                                            },
                                        }}
                         
                                        error={isSubmitted && !!errors.state}
                                        helperText={isSubmitted && errors.state?.message}
                                    />
                                )}
                                fullWidth
                            />
                        )}
                    />
                </Box>

                    
                    {/* Zip Code Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Zip Code
                        </Typography>
                        <TextField 
                            {...register("zipCode", {
                                required: "Zip Code is required",
                            })}
                            placeholder="Enter zip code"
                            error={isSubmitted && !!errors.zipCode}
                            helperText={isSubmitted && errors.zipCode?.message}
                            fullWidth
                        />
                    </Box>

                    {/* Latitude Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Latitude
                        </Typography>
                        <TextField 
                            {...register("latitude")}
                            value={latitude}
                            disabled
                            fullWidth
                        />
                    </Box>
                    {/* Longitude Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Longitude
                        </Typography>
                        
                        <TextField 
                            {...register("longitude")}
                            value={longitude}
                            disabled
                            fullWidth
                            sx={{color:"black"}}
                        />
                    </Box>
                    {/* Room Type */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                        Type of Room
                        </Typography>
                        <FormControl className={styles.container} fullWidth>
                            <Select
                                {...register("roomType", { required: "Room type is required" })} // Register the select input
                                inputProps={{ name: 'roomType' }}
                                value={ roomTypeValue }
                                sx={{
                                    width: "300px",
                                    height: "43px",
                                    background: "white",
                                    border: ".2px black solid",
                                    color:"black"
                                  
                                }}
                            >
                                <MenuItem value="Entire home/apt">Entire home/apt</MenuItem>
                                <MenuItem value="Private room">Private room</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Box>

                    
                    {/* Price per Night Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Price per Night
                        </Typography>
                        <div className={styles.price}>
                            <TextField 
                                {...register("pricePerNight", {
                                    required: "Price per Night is required",
                                    pattern: {
                                        value: /^[\d]+(\.[\d]{1,2})?$/,
                                        message: "Invalid price format"
                                    }
                                })}
                                placeholder="Enter price per night"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                error={isSubmitted && !!errors.pricePerNight}
                                helperText={isSubmitted && errors.pricePerNight?.message}
                                fullWidth
                            />
                            <Button sx={{width:"100px"}} onClick={()=>priceCalculator()}>Price Estimator</Button>
                        </div>
                    </Box>
                    <PriceAdjustModal/>

                    {/* Contact Email Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Contact Email
                        </Typography>
                        <TextField 
                            {...register("contactEmail", {
                                required: "Contact Email is required",
                                pattern: {
                                    value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Enter contact email"
                            type="email"
                            error={isSubmitted && !!errors.contactEmail}
                            helperText={isSubmitted && errors.contactEmail?.message}
                            fullWidth
                        />
                    </Box>
                    
                    {/* Description Field */}
                    <Box width="100%" height="200px" marginBottom="16px" display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Description
                        </Typography>
                        <TextField 
                            {...register("description", {
                                required: "Description is required",
                            })}
                            placeholder="Enter property description"
                            multiline
                            rows={4}
                            error={isSubmitted && !!errors.description}
                            helperText={isSubmitted && errors.description?.message}
                            fullWidth
                        />
                    </Box>
                    
                    {/* Image Upload Field */}
                    <Box className={styles.container}>
                        <Typography variant="subtitle1" gutterBottom>
                            Property Images
                        </Typography>
                        <FormControl fullWidth>
                            <input
                                accept="image/*"
                                id="image-upload"
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<PhotoCamera />}
                                >
                                    Upload Images
                                </Button>
                            </label>
                            <Box mt={2}>
                                {selectedImages.length > 0 && (
                                    <Typography variant="body2">
                                        {selectedImages.length}/10 images uploaded
                                    </Typography>
                                )}
                                <Box mt={1} display="flex" flexWrap="wrap">
                                    {selectedImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Selected ${index + 1}`}
                                            style={{ maxWidth: '100px', height: 'auto', margin: '5px' }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </FormControl>
                    </Box>
                    
                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="primary">
                        Submit Property
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
