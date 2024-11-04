import { Box, Button, Modal, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Star } from "@mui/icons-material"; // You can import an icon for the stars
import styles from "./approvedProperties.module.scss";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../api/firebase-config";

export const RatingModal = ({ openRatingModal, setOpenRatingModal, data }) => {
    const onClose = () => setOpenRatingModal(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            rating: null, // Default value for rating
            reviewMessage: "",   // Default value for review
        },
    });

    const onSubmit = async (formData) => {
        const { approvedProperty,propertyId } = data;
    
        if (!approvedProperty || !approvedProperty.propertyId || !approvedProperty.userId) {
            console.error("Invalid property data:", data);
            return;
        }
        
        const {userId } = approvedProperty;
        const host = userId;
        const propertyName = approvedProperty.propertyId
    
        console.log("Submitted Data:", formData, "data:", data);
    
        try {
            const propertyDocRef = doc(db, "users", host, "properties", propertyName, "Approval",propertyId);
            await setDoc(propertyDocRef, {
                ...formData,
                reviewSent: true,
            }, { merge: true });
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error updating information:", error);
        }
    
        reset();
        onClose();
    };
    
    
    const renderStars = (field) => {
        return [...Array(5)].map((_, index) => {
            const starIndex = index + 1;
            return (
                <Star
                    key={starIndex}
                    onClick={() => field.onChange(starIndex)} // Set the selected rating to go into field on name="rating"
                    style={{
                        cursor: "pointer",
                        color: starIndex <= field.value ? "gold" : "gray",
                    }}
                />
            );
        });
    };

    return (
        <Modal
            open={openRatingModal}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                className={styles.modal}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ padding: 2, width: 300, margin: 'auto', backgroundColor: 'white', borderRadius: 1 }}
            >
                <Typography variant="h6" id="modal-modal-title" sx={{ mb: 2 }}>
                    Leave a Review
                </Typography>

                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <div style={{ display: "flex", marginBottom: 16 }}>
                            {renderStars(field)}
                        </div>
                    )}
                />
                {errors.rating && <span style={{ color: 'red' }}>Rating is required</span>}

                <Controller
                    name="reviewMessage"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            placeholder="Write your review here..."
                            style={{ width: "100%", height: "100px", marginBottom: 16, borderRadius:"10px"}}
                        />
                    )}
                />
                {errors.review && <span style={{ color: 'red' }}>Review is required</span>}

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
