import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { db } from '../../api/firebase-config';
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../api/firebase-config';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './properties.module.scss';
import axios from 'axios';

export const Properties = () => {
    const [imageUrls, setImageUrls] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [userProperty, setUserProperty] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [error, setError] = useState('');

    //fetch users locations
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.email) {
                try {
                    const properties = await getDocs(collection(db, "users", user.email, "properties"));
                    const fetchedProperties = properties.docs.map(doc => (doc.data()));
                    setUserProperty(fetchedProperties);
                } catch (error) {
                    console.error("Error fetching properties:", error);
                }
            }
        };
        fetchData();
    }, [user]);

    useEffect(() => {
       // console.log ( "calling information: ")

        const retrieveData = async () => {
            try{
                const fetch = axios.post( "http://ec2-54-164-148-130.compute-1.amazonaws.com:5000/predict")
               console.log ( "calling information: ", fetch.data)
            } catch (error){
                console.error("Could not connect")
            }
        }

        retrieveData()
    },[])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitted },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const userDocRef = doc(db, "users", user.email);

            if (editMode && selectedProperty) { 
                const propertyDocRef = doc(userDocRef, "properties", selectedProperty.propertyName);
                const originalDocSnapshot = await getDoc(propertyDocRef)
                const originalData = originalDocSnapshot.data()
                const originalPrice = originalData.pricePerNight
                console.log("original price per night:", originalPrice)
                await setDoc(propertyDocRef, { ...data,
                    originalPrice:originalPrice,
                    imageUrls 
                }, { merge: true });


            } else {
                const propertyDocRef = doc(userDocRef, "properties", data.propertyName);
                await setDoc(propertyDocRef, { ...data, imageUrls });
            }

            setEditMode(false);
           // navigate("/dashboard");
        } catch (error) {
            console.error("Error saving property:", error.message);
            alert("Error saving property. Please try again.");
        }
    };

    const handleEdit = (property) => {
        setEditMode(true);
        setSelectedProperty(property);
        //console.log(selectedProperty)
        reset({ //restore the values from database to update
            propertyName: property.propertyName,
            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            pricePerNight: property.pricePerNight,
            description: property.description,
            contactEmail: property.contactEmail,
        });
        setImageUrls(property.imageUrls || []);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setSelectedProperty(null);
        reset();
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length + imageUrls.length > 10) {
            setError("You can only upload up to 10 images.");
            return;
        }

        const urls = [...imageUrls];
        for (const file of files) {
            try {
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

        setImageUrls(urls);
        setError('');
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...imageUrls];
        updatedImages.splice(index, 1);
        setImageUrls(updatedImages);
    };


    return (
        <div className={styles.container}>
            {userProperty.map((property, index) => (
                <div className={styles.location} key={index}>
                    <div className={styles.column}>
                        <div className={styles.pictureContainer}>
                            {property.imageUrls?.length > 0 ? (
                                property.imageUrls.map((image, idx) => (
                                    <Box key={idx} position="relative" display="inline-block" margin="5px">
                                        <img
                                            src={image}
                                            alt={`Property Image ${idx + 1}`}
                                            style={{ maxWidth: '100px', height: 'auto' }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(idx)}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                color: 'red',
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No images uploaded</Typography>
                            )}
                        </div>
                        {editMode && selectedProperty?.propertyName === property.propertyName ? (
                            <Box
                                component="form"
                                onSubmit={handleSubmit(onSubmit)}
                                display="flex"
                                flexDirection="column"
                                gap="16px"
                            >
                                <TextField
                                    label="Property Name"
                                    {...register("propertyName", { required: "Property Name is required" })}
                                    defaultValue={property.propertyName}
                                    error={isSubmitted && !!errors.propertyName}
                                    helperText={isSubmitted && errors.propertyName?.message}
                                    fullWidth
                                />
                                <TextField
                                    label="Address"
                                    {...register("address", { required: "Address is required" })}
                                    defaultValue={property.address}
                                    error={isSubmitted && !!errors.address}
                                    helperText={isSubmitted && errors.address?.message}
                                    fullWidth
                                />
                                <TextField
                                    label="City"
                                    {...register("city", { required: "City is required" })}
                                    defaultValue={property.city}
                                    error={isSubmitted && !!errors.city}
                                    helperText={isSubmitted && errors.city?.message}
                                    fullWidth
                                />
                                <TextField
                                    label="State"
                                    {...register("state", { required: "State is required" })}
                                    defaultValue={property.state}
                                    error={isSubmitted && !!errors.state}
                                    helperText={isSubmitted && errors.state?.message}
                                    fullWidth
                                />
                                <TextField
                                    label="Zip Code"
                                    {...register("zipCode", { required: "Zip Code is required" })}
                                    defaultValue={property.zipCode}
                                    error={isSubmitted && !!errors.zipCode}
                                    helperText={isSubmitted && errors.zipCode?.message}
                                    fullWidth
                                />
                                <TextField
                                    label="Price per Night"
                                    {...register("pricePerNight", { required: "Price per Night is required" })}
                                    defaultValue={property.pricePerNight}
                                    error={isSubmitted && !!errors.pricePerNight}
                                    helperText={isSubmitted && errors.pricePerNight?.message}
                                    fullWidth
                                />
                                <TextField
                                    label="Description"
                                    {...register("description", { required: "Description is required" })}
                                    defaultValue={property.description}
                                    error={isSubmitted && !!errors.description}
                                    helperText={isSubmitted && errors.description?.message}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                <TextField className={styles.email}
                                    sx={{marginTop:"90px"}}
                                    label="Contact Email"
                                    {...register("contactEmail", { required: "Contact Email is required" })}
                                    defaultValue={property.contactEmail}
                                    error={isSubmitted && !!errors.contactEmail}
                                    helperText={isSubmitted && errors.contactEmail?.message}
                                    fullWidth
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    style={{ margin: "16px 0" }}
                                    disabled={imageUrls.length >= 10}
                                />
                                {error && <Typography color="error">{error}</Typography>}
                                <Typography>{`Images uploaded: ${imageUrls.length}/10`}</Typography>
                                <Box display="flex" gap="16px">
                                    <Button type="submit" variant="contained" color="primary">Save</Button>
                                    <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="h6">{property.propertyName}</Typography>
                                <Typography>{property.address}, {property.city}, {property.state}, {property.zipCode}</Typography>
                                <Typography>Price per night: ${property.pricePerNight}</Typography>
                                <Typography>Description: {property.description}</Typography>
                                <Typography>Contact Email: {property.contactEmail}</Typography>
                                <Button onClick={() => handleEdit(property)}>Edit</Button> {/*passes all property info to edit*/}
                            </Box>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
