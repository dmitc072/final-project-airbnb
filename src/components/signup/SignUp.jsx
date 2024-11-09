
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
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../../api/firebase-config'; // Import auth and db
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation



import {  useForm } from "react-hook-form";


export const Signup = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) =>event.preventDefault();



    const {
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
              // Create user with Firebase Authentication
              await createUserWithEmailAndPassword(auth, data.email, data.password);
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

     

            // Dispatch the action to set isRenterChecked to true
            //dispatch(setRenterChecked(true));   //removed because the initial loginSLice on user.js overwrites it   
             alert('User registered successfully');
            // retrieve token
            const fetchData = doc(db, "token", "F8wZv3cF4cdxxnUmCVkm")
            try {
                // Fetch the document
                const tokenSnapshot = await getDoc(fetchData);
                
                // Check if the document exists and store data in localStorage
                if (tokenSnapshot.exists()) {
                    const tokenData = tokenSnapshot.data();
                    localStorage.setItem('token', JSON.stringify(tokenData.geocode));
                    console.log(tokenData.geocode, tokenData)
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching token data:", error);
            }
            navigate('/dashboard/profile');
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
                        minLength: {
                            value: 6,
                            message: "Password must be exactly 6 characters."
                        },
                    })}
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