import { SearchResults } from '../home/searchResults/SearchResults.js';
import { SearchBar } from '../home/searchBar/SearchBar.js';
import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../api/firebase-config";
import { useDispatch, useSelector } from 'react-redux';
import {AppContext} from '../../context.js';
import {setPendingApprovalMessage} from "../../features/users/users.js"

export const Home = () => {
    const [searchResult, setSearchResult] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [message, setMessage] = useState([]);
    const [showAlert, setShowAlert] = useState(false); // Flag to control alert display for not displaying twice
    const {pendingApprovalMessage} = useSelector(state => state.auth.user)
    const dispatch = useDispatch();

    // Fetching properties and pending approvals
    useEffect(() => {
        if(user && !pendingApprovalMessage){
            const fetchRequest = async () => {
                try {
                    // Collection reference for user's properties
                    const newRequest = collection(db, "users", user.email, "properties");
                    const newRequestRef = await getDocs(newRequest);

                    const pendingArray = [];

                    // Loop through properties to check for PendingApproval
                    await Promise.all(
                        newRequestRef.docs.map(async (property) => {
                            const propertiesRef = collection(db, "users", user.email, "properties", property.id, "PendingApproval");
                            const propertiesSnapshot = await getDocs(propertiesRef);

                            // If there are pending approvals, push them into the array
                            if (!propertiesSnapshot.empty) {
                                propertiesSnapshot.docs.forEach(doc => {
                                    const pendingData = doc.data(); // Store doc.data() in a variable to verify status

                                    if (pendingData.status === "unknown") { // Check the status
                                        pendingArray.push({
                                            ...pendingData,
                                            propertyName: property.data().propertyName // Add property name from the parent document
                                        });
                                    }
                                });
                            }
                        })
                    );

                    setMessage(pendingArray);
                    dispatch(setPendingApprovalMessage(true));

                    const updatePending = async () =>{
                        try {
                            const querySnapshot = await doc(db,"users",user.email)
                            const update = setDoc(querySnapshot,
                                {pendingApprovalMessage:true,},
                                {merge:true}
                            )
                        }catch(error){
                            console.error("Could not update Pending Message:", error)
                        }
                    }

                    updatePending()
               
                } catch (error) {
                    console.error("Error fetching properties and pending approvals:", error);
                }
            };

            fetchRequest(); // Fetch data on component mount
        }
    }, [user.id]);


    useEffect(()=>{ //creating the alert in this useEffect instead of the one above makes it display once
        if (!showAlert && message.length > 0) {
            setShowAlert(true); // Set showAlert to true after alert is shown
            alert(message.map((pendingItem) => `${pendingItem.propertyName} is pending approval`).join("\n"));
        }
    },[message])
    //console.log("pending," ,message )

    return (
        <>
            <SearchBar setSearchResult={setSearchResult} /> {/* Passing setSearchResult as a parameter */}
            <SearchResults searchResult={searchResult} />
            
        </>
    );
};
