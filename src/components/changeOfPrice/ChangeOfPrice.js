import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import {  useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { db } from "../../api/firebase-config";
import { setPriceChange } from "../../features/users/users";

export const ChangeOfPrice = () => {
    const { user } = useSelector(state => state.auth);
    const {priceChange} = user
    const [showAlert,setShowAlert] = useState(false)
    const [alertMessage,setAlertMessage] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const priceChangeFunction = async () => {
            let priceChangeArray = [];
    
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection); // Get all user docs
    
                // Loop over users
                for (let userDoc of usersSnapshot.docs) {
                    const userPropertiesRef = collection(db, "users", userDoc.id, "properties");
                    const propertiesSnapshot = await getDocs(userPropertiesRef); // Get properties for each user
    
                    // Loop over properties
                    for (let propertyDoc of propertiesSnapshot.docs) {
                        const propertyData = propertyDoc.data(); // Get property data
    
                        const approvalRef = collection(db, "users", userDoc.id, "properties", propertyDoc.id, "Approval");
                        const approvalSnapshot = await getDocs(approvalRef); // Get Approval collection
    
                        const pendingRef = collection(db, "users", userDoc.id, "properties", propertyDoc.id, "PendingApproval");
                        const pendingSnapshot = await getDocs(pendingRef); // Get PendingApproval collection
    
                        const originalPrice = parseFloat(propertyData?.originalPrice);
                        const newPrice = parseFloat(propertyData?.pricePerNight);
    
                        // Skip if original or new price is invalid
                        if (!isNaN(originalPrice) && !isNaN(newPrice)) {
                            // Check for approvals
                            if (!approvalSnapshot.empty) {
                                approvalSnapshot.forEach((approvalDoc) => {
                                    const approvalData = approvalDoc.data();
    
                                    if (approvalData.requestingUser === user.email) {
                                        // Check if prices have changed
                                        if (originalPrice !== newPrice) {
                                            const propertyName = propertyDoc.id;
    
                                            // Check if the property already exists in priceChangeArray to avoid duplicates
                                            if (!priceChangeArray.some(item => item.propertyName === propertyName)) {
                                                // Store price change info
                                                priceChangeArray.push({
                                                    propertyName,
                                                    originalPrice,
                                                    newPrice
                                                });
                                            }
                                        }
                                    }
                                });
                            }
    
                            // Check for pending approvals
                            if (!pendingSnapshot.empty) {
                                pendingSnapshot.forEach((pendingDoc) => {
                                    const pendingData = pendingDoc.data();
    
                                    if (pendingData.requestingUser === user.email) {
                                        // Check if prices have changed
                                        if (originalPrice !== newPrice) {
                                            const propertyName = propertyDoc.id;
    
                                            // Check if the property already exists in priceChangeArray to avoid duplicates
                                            if (!priceChangeArray.some(item => item.propertyName === propertyName)) {
                                                // Store price change info
                                                priceChangeArray.push({
                                                    propertyName,
                                                    originalPrice,
                                                    newPrice
                                                });
                                            }
                                        }
                                    }
                                });
                            }

                            if(priceChangeArray.length > 0){
                                const querySnapshot = doc(db,"users",user.email)
                                await setDoc( querySnapshot,{
                                    priceChange:true
                                },{merge:true}
                                )
                            }
                        } else {
                            console.log(`Skipping property ${propertyDoc.id} due to invalid price data.`);
                        }
                    }
                }
    
                // Generate alert message without duplication
                if (priceChangeArray.length > 0) {
                    const alertMessage = priceChangeArray
                        .map(({ propertyName, originalPrice, newPrice }) => 
                            `You have a price change for: ${propertyName} from ${originalPrice} to ${newPrice}`
                        ).join("\n"); // Join messages with a new line between each one
    
                        setAlertMessage(alertMessage); // Show a single alert after processing all price changes
                        setShowAlert(true)
                }
                dispatch(setPriceChange(true))
                
            } catch (error) {
                console.error("Cannot retrieve price: ", error);
            }
        };

        if(!priceChange) {
            priceChangeFunction();
        }
    }, [ user.email, dispatch, priceChange]); // Dependencies
    

    useEffect(()=>{
        if(showAlert) alert(alertMessage)
    },[showAlert, alertMessage])

    return null
}    