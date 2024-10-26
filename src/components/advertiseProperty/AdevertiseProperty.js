import React, { useContext, useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    FormControl
} from "@mui/material";
import { useForm } from "react-hook-form";
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

export const AdvertiseProperty = () => {
    const navigate = useNavigate();
    const { column } = useContext(AppContext);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const { user } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
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
            available:true //sets the house to avilable
        }
    });

    const onSubmit = async (data) => {
        try {
            const userDocRef = doc(db, "users", user.email);
            const propertyDocRef = doc(userDocRef, "properties", data.propertyName);
            
            // Save image URLs along with property data
            await setDoc(propertyDocRef, { ...data, imageUrls });
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving property:", error.message);
            alert("Error saving property. Please try again.");
        }
    };

    const handleImageUpload = async (event) => {
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
    };

    useEffect(() => {
        // Cleanup object URLs on component unmount
        return () => {
            selectedImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [selectedImages]);

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
                        <TextField 
                            {...register("state", {
                                required: "State is required",
                            })}
                            placeholder="Enter state"
                            error={isSubmitted && !!errors.state}
                            helperText={isSubmitted && errors.state?.message}
                            fullWidth
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
                    
                    {/* Price per Night Field */}
                    <Box width="100%" marginBottom="16px">
                        <Typography variant="subtitle1" gutterBottom>
                            Price per Night
                        </Typography>
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
