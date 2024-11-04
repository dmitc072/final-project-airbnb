import React, { useContext, useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    FormControl,
    Select,
    Autocomplete,
    MenuItem
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { db } from '../../api/firebase-config'; // Adjust the import based on your actual file structure
import { doc, setDoc } from "firebase/firestore";
import { AppContext } from '../../context';
import { PhotoCamera } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for unique file naming
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../api/firebase-config'; // Adjust the import based on your actual file structure
import styles from './advertiseProperty.module.scss'
import axios from 'axios';

export const AdvertiseProperty = () => {
    const navigate = useNavigate();
    const { column,states } = useContext(AppContext);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null)
    const [imageUploaded, setImageUploaded] = useState(true)
    const {
        register,
        handleSubmit,
        watch,
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
            roomType:"",
            latitude: latitude,
            longitude: longitude
        }
    });

    const addressValue = watch('address')
    const cityValue = watch('city')
    const stateValue = watch('state')
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
        const data = {
            latitude: latitude,
            longitude: longitude,
            minimum_nights: 1,
            room_type: roomTypeValue, // Adding roomType here
            price:129,
            neighbourhood_group:cityValue,
            neighbourhood:cityValue,
            number_of_reviews:1,
            last_review:"10/11/2022",
            calculated_host_listings_count:2,
            availability_365:365,
            reviews_per_month:1
            
        };

        console.log(data)
        const priceCalculator = await axios.post("http://ec2-54-224-46-135.compute-1.amazonaws.com:5000/predict",data)
        console.log("price Calculator:", priceCalculator.data)
        } catch (error) {
            console.error("Can not reach server!")
        }
    }

    useEffect(() => {
        const location = async () => {
            const token = "AIzaSyAqOK9SIpnzoE5Sf_qwcQQwejGybGyilUo";
            try {
                const fetchData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressValue},${cityValue},${stateValue}&key=${token}`);
                console.log("data", fetchData.data);
                const data = fetchData.data
                const location = data.results[0].geometry.location 
                setLatitude(location.lat);
                setLongitude(location.lng)
                console.log("log",location)

            } catch (error) {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
            }
        };
        location();
    }, [addressValue, cityValue, stateValue]);
    
    
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
                    <Box width="100%" marginBottom="16px">
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
                    <Box width="100%" marginBottom="16px">
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
                    <Box width="100%" marginBottom="16px">
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
                    <Box width="100%" marginBottom="16px">
                    <Typography variant="subtitle1" gutterBottom>
                        State
                    </Typography>
                    <Controller
                        name="state"
                        control={control}
                        required
                        render={({ field }) => (
                            <Autocomplete
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
                    <Box width="100%" marginBottom="16px">
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
                    <Box width="100%" marginBottom="16px">
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
                    <Box width="100%" marginBottom="16px">
                        <Typography variant="subtitle1" gutterBottom>
                            Longitude
                        </Typography>
                        
                        <TextField 
                            {...register("longitude")}
                            value={longitude}
                            disabled
                            fullWidth
                        />
                    </Box>
                    {/* Room Type */}
                    <Box width="100%" marginBottom="16px">
                        <Typography variant="subtitle1" gutterBottom>
                        Type of Room
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                {...register("roomType", { required: "Room type is required" })} // Register the select input
                                inputProps={{ name: 'roomType' }}
                                sx={{
                                    width: "300px",
                                    height: "43px",
                                    background: "white",
                                    marginLeft: "10px",
                                    border: ".2px black solid"
                                }}
                            >
                                <MenuItem value="Entire home/apt">Entire home/apt</MenuItem>
                                <MenuItem value="Private room">Private room</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    
                    {/* Price per Night Field */}
                    <Box width="100%" marginBottom="16px">
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
                    
                    {/* Contact Email Field */}
                    <Box width="100%" marginBottom="16px">
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
                    <Box width="100%" height="200px" marginBottom="16px">
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
                    <Box width="100%" marginBottom="16px">
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
