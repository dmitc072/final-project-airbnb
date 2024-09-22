import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    FormHelperText,
    Modal,
    FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from '../../api/firebase-config';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { AppContext } from '../../context';
import styles from "./profile.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { setHostChecked, setRenterChecked, setIsFirstLogin,setPhotoURL,setUser,setHostIsVerified } from './../../features/users/users.js'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const Profile = () => {
    const navigate = useNavigate();
    const { row, column } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [firstLoginOpen, setFirstLoginOpen] = useState(false);
    const [changeRequest, setChangeRequest] = useState(false);
    const [imageURL, setImageURL] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);  // Closes the first modal
        setFirstLoginOpen(false);  // Closes the first login modal
        console.log("closing")
    };

    const dispatch = useDispatch();
    const { isHostChecked, isRenterChecked, isProfileComplete, isFirstLogin, photoURL,hostIsVerified } = useSelector((state) => state.auth.user)
    const {user} = useSelector((state) => state.auth)

    const {
        control,
        register,
        setValue,
        formState: { errors, isSubmitted },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            email: user?.email || "",
            userName: "",
            isHostChecked: isHostChecked, //gets data from Redux
            isRenterChecked: user?.isRenterChecked || true,
            isProfileComplete: isProfileComplete,
            isFirstLogin: isFirstLogin,
            photoURL:user?.photoURL || "",
            hostIsVerified:hostIsVerified
        }
    });
console.log("isRenterChecked", isRenterChecked, " isProfileComplete", isProfileComplete)
    
    const firstLoginModal = () => {
        if (isFirstLogin) {
            console.log("isFirstLogin:", isFirstLogin)
            setFirstLoginOpen(true);
          //  dispatch(setIsFirstLogin(false))
            console.log("newnisFirstLogin: ", isFirstLogin)
        }
    };

    



    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phoneNumber: user.phoneNumber || "",
                email: user.email || "",
                isHostChecked: isHostChecked,
                isRenterChecked: isRenterChecked,
                isProfileComplete: isProfileComplete,
                photoURL: user.photoURL,
               // isFirstLogin: user.isFirstLogin
            });
            setLoading(false);
        }
    }, [user, isHostChecked, isRenterChecked, isProfileComplete, reset]);

    useEffect(() => {
        if (isFirstLogin !== undefined) {
            firstLoginModal();
          }
    }, [user]); // This will run only once, when the component first mounts
    
    

    const onSubmit = async (data) => {
        console.log("Form Submitted Data:", data);
    
        if (data.phoneNumber.length < 10) {
            console.log("Phone number too short");
            return;
        }
    
        try {
            const userDocRef = doc(db, "users", data.email);
            if( data.firstName && data.lastName && data.phoneNumber && data.email){
                data.isProfileComplete=true;
            } else { data.isProfileComplete=false};
    
            await setDoc(userDocRef, {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                isHostChecked: data.isHostChecked,
                isRenterChecked: data.isRenterChecked,
                isProfileComplete: data.isProfileComplete,
                isFirstLogin: false,
                photoURL: data.photoURL,
                hostIsVerified: data?.hostIsVerified || hostIsVerified
            }, { merge: true });
    
            // Update Redux state to fix the reseting of values
            dispatch(setUser({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                isHostChecked: data.isHostChecked,
                isRenterChecked: data.isRenterChecked,
                isProfileComplete: data.isProfileComplete,
                isFirstLogin: false,
                photoURL: data.photoURL ,
                hostIsVerified: data?.hostIsVerified || hostIsVerified
            }));
    
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating user:", error.message);
            alert("Error updating user. Please try again.");
        }
    };
    


    // if (loading) {
    //     return <Typography>Loading...</Typography>;
    // }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = `${Date.now()}_${file.name}`;
            const fileRef = ref(storage, `profile_pictures/${fileName}`);
        
            try {
                await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(fileRef);
                await updateUserProfile(downloadURL);
                dispatch(setPhotoURL(downloadURL)); // Update the state with the new image URL
                console.log("Image uploaded and profile updated:", downloadURL);
            } catch (error) {
                console.error("Error uploading image:", error.message);
            }
        }
    };

    const updateUserProfile = async (imageURL) => {
        try {
            const userDocRef = doc(db, "users", user.email);
            await setDoc(userDocRef, {
                photoURL: imageURL
            }, { merge: true });
        } catch (error) {
            console.error("Error updating user profile:", error.message);
            alert("Error updating user profile. Please try again.");
        }
    };

    const handleHostModal = () => { //if slected ues on Modal
        setChangeRequest(true);
        handleClose();
        handleSubmit(onSubmit)();
    };

    const checkHost = (data) => { //checks on submit
        console.log("Check Host Data:", data);
        if (data.isHostChecked && !hostIsVerified) {
            handleOpen(); //handles Modal
            dispatch(setHostIsVerified(true))
        } else {
            handleSubmit(onSubmit)(data);
        }
    };



    const updateHostModal = () => {
        dispatch(setIsFirstLogin(false)) //changes firstLoggin to true
        dispatch(setHostChecked(true))
        handleClose()
    }

console.log("photo is", photoURL)
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                        Are you sure you want to be a host!
                    </Typography>
                    <Box sx={row}>
                        <Button variant="outlined" sx={{ m: 2 }} onClick={handleClose}>
                            NO
                        </Button>
                        <Button variant="outlined" sx={{ m: 2 }} onClick={handleHostModal}>
                            YES
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Handles is they want to be a Host */}
            <Modal
                open={firstLoginOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                        Do you want to be a Host?
                    </Typography>
                    <Box sx={row}>
                        <Button variant="outlined" sx={{ m: 2 }} onClick={handleClose}>
                            NO
                        </Button>
                        <Button variant="outlined" sx={{ m: 2 }} onClick={updateHostModal}>
                            YES
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {!isProfileComplete && 
                <div className={styles.center}>
                    <Typography className={styles.title} variant="h4">Welcome, please update your Profile, or Complete later</Typography>
                </div>}
            <div className={styles.container}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(checkHost)}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width="100%"
                    maxWidth="600px"
                    bgcolor="#f5f5f5"
                    padding="20px"
                    borderRadius="8px"
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                >
                    {photoURL ? (
                        <img
                            src={photoURL}
                            alt="Profile"
                            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                            onLoad={() => console.log('Image loaded successfully')}
                            onError={(e) => console.error('Error loading image:', e)}
                        />
                    ) : (
                        <Typography>No Profile Picture</Typography>
                    )}
                    <Typography variant="h5" gutterBottom>
                        Update Profile
                    </Typography>

                    <Box sx={{ ...column, width: '100%', mb: 2 }}>
                        <Box mb={2}>
                            <Typography>First Name</Typography>
                            <TextField
                                {...register("firstName", {
                                    required: "First Name is required",
                                })}
                                placeholder="First Name"
                                error={isSubmitted && !!errors.firstName}
                                helperText={isSubmitted && errors.firstName?.message}
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <Typography>Last Name</Typography>
                            <TextField
                                {...register("lastName", {
                                    required: "Last Name is required",
                                })}
                                placeholder="Last Name"
                                error={isSubmitted && !!errors.lastName}
                                helperText={isSubmitted && errors.lastName?.message}
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <Typography>Phone Number</Typography>
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

                        <Box mb={2}>
                            <Typography>Email</Typography>
                            <TextField
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                placeholder="Email"
                                error={isSubmitted && !!errors.email}
                                helperText={isSubmitted && errors.email?.message}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Box>
                        <Box mb={2}>
                            <Typography>Profile Picture</Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Box>
                        <Box mb={2}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isHostChecked}
                                            onChange={(e) => dispatch(setHostChecked(e.target.checked))}
                                            name="isHostChecked"
                                            color="black"
                                            //disabled={isHostChecked} // Conditionally disable if isHostChecked is true
                                        />
                                    }
                                    label="Host"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isRenterChecked}
                                            onChange={(e) => dispatch(setRenterChecked(e.target.checked))}
                                            name="isRenterChecked"
                                            color="black"
                                            disabled
                                        />
                                    }
                                    label="Renter"
                                />
                            </FormGroup>
                        </Box>
                    </Box>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Submit
                    </Button>
                </Box>
            </div>
        </>
    );
};