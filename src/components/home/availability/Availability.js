import { Box, Button, Modal } from "@mui/material";
import styles from "./availability.module.scss";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export const Availability = ({ openRentModal, setOpenRentModal, propertyData }) => {
  const onClose = () => setOpenRentModal(false);

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
    console.log("Form submitted with data:", data);
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

        <Button type="submit" sx={{ mt: 2 }}>
          Submit
        </Button>

        <Button sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};
