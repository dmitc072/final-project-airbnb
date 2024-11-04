import styles from "./signup.module.scss";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import axios from 'axios';
import { auth, db } from '../../api/firebase-config'; // Import auth and db
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation



import { Controller, useForm } from "react-hook-form";


export const Signup = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) =>event.preventDefault();



    const {
        control, //Used for controlled inputs, typically with components like Controller.
        register, //Registers an input or select element and applies the appropriate validation rules.
        formState: { errors,isSubmitted }, //Contains form state such as validation errors.
        handleSubmit, //Handles form submission and validation.
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
            phoneNumber: "",
            email: "",
            isRenterChecked:true,
            isHostChecked:false,
            isProfileComplete:false,
            isFirstLogin:true,
            photoURL:null
        }
    })

      
      const onSubmit = async (data) => {
        try {
            // Function to check if the server is available
            const checkServer = async (url) => {
                try {
                    await axios.get(url);
                    return true; // Server is available
                } catch (error) {
                     // Handle the error gracefully
                    console.warn(`Failed to reach server at ${url}:`, error.message);
                    return false; // Server is not available
                }
            };
    
            const serverUrl = 'http://localhost:3001/serverRunning';
            const isServerAvailable = await checkServer(serverUrl);
    
            // Create user with Firebase Authentication only if the server is available
            if (isServerAvailable) {
                await axios.post('http://localhost:3001/deleteUsers');
                await axios.post('http://localhost:3001/signup',
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                        email: data.email,
                        isRenterChecked:data.isRenterChecked,
                        isHostChecked:data.isHostChecked,
                        isProfileComplete:data.isProfileComplete,
                        isFirstLogin:data.isFirstLogin,
                        photoURL:data.photoURL
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
             //   console.log("User registered:", response.data);
            } else {
                // If server is not available, save user data to Firestore
                const userDocRef = doc(db, "users", data.email); // Use email or another unique identifier
                await setDoc(userDocRef, {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    isRenterChecked:data.isRenterChecked,
                    isHostChecked:data.isHostChecked,
                    isProfileComplete:data.isProfileComplete,
                    isFirstLogin:data.isFirstLogin,
                    photoURL:data.photoURL

                });
                console.log("User data saved to Firestore.");
            }
    
            // Create user with Firebase Authentication
            await createUserWithEmailAndPassword(auth, data.email, data.password);

            // Dispatch the action to set isRenterChecked to true
            //dispatch(setRenterChecked(true));   //removed because the initial loginSLice on user.js overwrites it   
             alert('User registered successfully');
            navigate("/signin")
    
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("Email is already in use. Please use a different email.");
            } else {
                console.error("Error creating user:", error.message);
                alert("Error creating user. Please try again.");
            }
        }
    };
    
    
    return(
    <>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100%"
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                
                <Typography className="first_name">First Name</Typography>
                <TextField 
                    {...register("firstName", {
                        required: "First Name is required",
                    })}
                    placeholder={"First Name"}
                    error={isSubmitted && !!errors.firstName}
                    helperText={isSubmitted && errors.firstName?.message}
                
                />
                <Typography className="last_name">Last Name</Typography>
                <TextField 
                    {...register("lastName", {
                        required: "Last Name is required",
                    })}
                    placeholder={"Last Name"}
                    error={isSubmitted && !!errors.lastName}
                    helperText={isSubmitted && errors.lastName?.message}
                />
                <Typography className="phone_number">Phone Number</Typography>
                <Box mb={2}>
                            <Controller
                                control={control}
                                name="phoneNumber"
                                rules={{
                                    pattern: {
                                        value: /^[0-9]{10,}$/, // Ensures phone number contains only digits and is 10 or more digits long
                                        message: "Phone number must contain only digits and be at least 10 digits long",
                                    }
                                }}
                                render={({ field }) => (
                                    <>
                                        <PhoneInput
                                            {...field}
                                            country="us"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            placeholder="Phone Number"
                                            inputProps={{
                                                className: styles.formcontrol,
                                            }}
                                            containerStyle={{ width: '100%' }}
                                            inputStyle={{ height: '45px' }}
                                        />
                                       
                                    </>
                                )}
                            />
                        </Box>
                <Typography className="email">Email Address</Typography>
                <TextField 
                    {...register("email", {
                        required: "Email Address is required",
                        pattern: { //validate for the email field. This ensures the email format is correct.
                            value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address"
                        }
                    })}
                    placeholder={"Email Address"}
                    error={isSubmitted && !!errors.email}
                    helperText={isSubmitted && errors.email ? errors.email.message : "" }/>
     
                <Typography className="password">Password</Typography>
                <TextField
                    sx={{ height: errors.password?.type === 'pattern' ? 100 : null }} 
                    {...register("password", { 
                        required: "Password is required", 
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                            message: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
                        }})}
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={isSubmitted && !!errors.password}
                    helperText={isSubmitted && errors.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography className="password_2">Re-enter Password</Typography>
                <TextField
                    {...register("password2", { required: "Re-enter Password is required" })}
                    placeholder="Re-enter Password"
                    type={showPassword ? 'text' : 'password'}
                    error={isSubmitted && !!errors.password2}
                    helperText={isSubmitted && errors.password2?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit">Register</Button>
               
            </Box>
    </Box>
    </>
    )
}