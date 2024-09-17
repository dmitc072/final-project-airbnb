import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";import React from 'react';
import styles from "./signin.module.scss"
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom'; 
import {signinUser} from "../../features/users/users";
import { useDispatch, useSelector } from 'react-redux';
//import useSignIn from 'react-auth-kit/hooks/useSignIn';
import axios from 'axios'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../api/firebase-config'; // Import auth and db



export const SignIn = () =>{
    //const signIn = useSignIn();

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) =>event.preventDefault();

    const dispatch = useDispatch();
    const {isProfileComplete} = useSelector((state) => {
        console.log(state.auth); // Check the full state structure
        return state.auth;
      });



    const {
        control, //Used for controlled inputs, typically with components like Controller.
        setValue, //Sets the value of a specific form field.
        register, //Registers an input or select element and applies the appropriate validation rules.
        formState: { errors,isSubmitted }, //Contains form state such as validation errors.
        handleSubmit, //Handles form submission and validation.
        reset, // Resets the form to its default values.
    } = useForm({
        defaultValues: {
            password: "",
            email: ""

        }
    })
    

    const onSubmit = async (data) => {
        try {
            console.log(data);
            const response = await dispatch(signinUser(data)).unwrap();
    
            // Check if response is defined and contains the necessary properties
            if (response) {
                if (response.status === 200) {
                    // Authentication was successful
                   if(!isProfileComplete) {
                    navigate('/dashboard/profile')
                   }else {navigate('/dashboard')}; // Redirect or take appropriate action
                } else if (response.status === 201) {
                    alert(response.message); // Show alert for successful signup or "user already exist"
                }
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            if (error.status === 401) {
                alert(error.message); // Show alert for wrong password
            } else if (error.status === 404) {
                alert(error.message); // Show alert for user not found
            } else {
                //console.error("Failed to log in: ", error.message);
                alert("Email/User Name or Password Incorrect!")
                // Optionally handle other unexpected status codes
            }
        }
    };
    
    
    
    
    return (
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
                width="300px"
                sx={{
                    "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px white inset",
                        WebkitTextFillColor: "#000000",
                        padding:"0 14px",
                    }
                
                }}
            >
                    <Typography sx={{
                                     fontSize: "16px",
                                     marginBottom: "8px",
                                     fontWeight: 700
                                 }}
                    > Email </Typography>
                    <TextField
                      //  className={styles.entryField}
                        sx={{
                            "& .MuiInputBase-root":{
                            height: "40px", 
                            width: "300px" ,
                            border: "1px solid #3B3C86",
                            borderRadius: "4px",
                            fontSize: "16px",
                            fontWeight: 700,
                            marginBottom: isSubmitted && !!errors.email ? null: "20px",
                            padding:"0 0px",
                            "& ::autofill":{
                                backgroundColor:"white"
                            }
                        }
                        }}
                        {...register("email", {
                            required: "Email Address is required",
                            
                        })}
                        placeholder={"Email Address"}
                        error={isSubmitted && !!errors.email}
                        helperText={isSubmitted && errors.email?.message}
                    />
                    <Typography sx={{
                                     fontSize: "16px",
                                     marginBottom: "8px",
                                     fontWeight: 700
                                 }}
                    > Password</Typography> 
                    <TextField
                        sx={{ height: errors.password?.type === 'pattern' ? 100 : null,
                              "& .MuiInputBase-root":{
                                height: "40px", 
                                width: "300px" ,
                                border: "1px solid #3B3C86",
                                borderRadius: "4px",
                                fontSize: "16px",
                                fontWeight: 700,
                                padding:"2 0",

                              }
                         }} 
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
                    <Button sx={{width:"120px"}} type="submit">Sign In</Button>
                    <Button sx={{width:"120px"}} type="button" onClick = {()=> navigate("/signup")}>Sign Up</Button>

            </Box>
        </Box>
    </>
    )
} 