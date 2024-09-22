import { Box, Button, Modal, Typography } from "@mui/material";
import styles from "./availabilityModal.module.scss";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { db } from "../../../api/firebase-config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

export const AvailabilityModal = ({ openRentModal, setOpenRentModal, propertyData }) => {
  const onClose = () => setOpenRentModal(false);
  const { user } = useSelector((state) => state.auth);


  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    watch, // Allows you to monitor form values
  } = useForm({
    defaultValues: {
      fromDate: dayjs(),
      toDate: dayjs().add(1, 'day')
    },
  });

  // Watch for changes in fromDate and toDate because you can'y call them directly
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const onSubmit = (data) => {
        //https://day.js.org/docs/en/query/is-same
        if (fromDate && toDate && fromDate.isSame(toDate, 'day')) {
            alert("Cannot be the same day!");
            return 
          }
      
        if (fromDate.isAfter(toDate, "day")){
            alert("From date has to be before To Date!")
            return
        }

        const formatFromDate = fromDate.format('DD/MM/YYYY')
        const formattedToDate = toDate.format('DD/MM/YYYY');


    //sends from, to, and user to the location doc
    const pendingRequest = async () => {
      try{
 
        const locationCollectionRef = collection(db,"users",propertyData.user,"properties",propertyData.propertyName,"PendingApproval") //propertyData.user was added to the data to get in SearchBar.js.
        const locationSnapshot = await addDoc(locationCollectionRef, { //Since odd path and not even, I have to use collect
          fromDate: formatFromDate,
          toDate: formattedToDate,
          requestingUser:user.email,
          status:"unknown"
          
        })
      } catch (error){
        console.error("Error Sending Message:",error)
      }
    }
    pendingRequest()
    console.log("Form submitted with data:", {
      fromDate: formatFromDate,
      toDate: formattedToDate
    }, "Property Data: ",propertyData.user);
    alert("Request is sent!")
    onClose()

  };



  return (
    <Modal
      open={openRentModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className={styles.modal}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4">Select days you want to stay!</Typography>
        <br/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="From Date"
            value={fromDate || dayjs()} // Use the watched fromDate
            onChange={(newValue) => setValue("fromDate", newValue)} // Manually set value in react-hook-form
          />

          <MobileDatePicker
            label="To Date"
            value={toDate || dayjs()} // Use the watched toDate
            onChange={(newValue) => setValue("toDate", newValue)} // Manually set value in react-hook-form
          />
        </LocalizationProvider>
        <div className="buttons">
          <Button type="submit" sx={{ mt: 2 }}>
            Submit
          </Button>

          <Button sx={{ mt: 2 }} onClick={onClose}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
