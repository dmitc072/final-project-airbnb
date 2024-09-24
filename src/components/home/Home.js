import { SearchResults } from '../home/searchResults/SearchResults.js';
import { SearchBar } from '../home/searchBar/SearchBar.js';
import {useEffect, useState} from "react"
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../api/firebase-config.js';
import {setPendingApprovalMessage} from "../../features/users/users.js"
import { PendingApprovalMessages } from '../pendingApproval/PendingApprovalMessages.js';


export const Home = () => {
    const [searchResult, setSearchResult] = useState([]);
    const {pendingApprovalMessage} = useSelector(state => state.auth.user)
    const navigate = useNavigate();
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch();


    // useEffect(()=>{
    //     if (!pendingApprovalMessage) {
    //         // Navigate to pending approval page if there are pending requests
    //         navigate('/dashboard/pendingapproval');
    //     } 
    // },[pendingApprovalMessage])
    
    
    // useEffect(() => {
    //     const checkPendingApprovals = async () => {
    //         try {
    //             const queryUsers = await getDocs(collection(db, "users"));
    //             let hasPendingApproval = false;
    
    //             // Loop through users
    //             for (let userDoc of queryUsers.docs) {
    //                 const user = userDoc.id
    //                 const propertiesSnapshot = await getDocs(collection(db, "users", user, "properties"));
                    
    //                 // Loop through properties of each user
    //                 for (let propertyDoc of propertiesSnapshot.docs) {
    //                     const property = propertyDoc.id;
    //                     const pendingApprovalSnapshot = await getDocs(collection(db, "users", user, "properties", property, "PendingApproval"));
    //                     console.log("property",property ,"has pending:",hasPendingApproval)

    //                     // Check if any pending approval exists
    //                     if (!pendingApprovalSnapshot.empty) {
    //                         console.log("property Pending",property)
    //                         const pendingApprovalDocs = pendingApprovalSnapshot.docs;
    //                         const isApprovalPending = pendingApprovalDocs.some(doc => doc.data().requestingUser === userDoc.id);
    //                         console.log("is pending",isApprovalPending)

    //                         if (isApprovalPending) {
    //                             hasPendingApproval = true;
    //                             break;
    //                         }
    //                     }
    //                 }

    //                 // If there's already pending approval, navigate to the page
    //                 if (hasPendingApproval)break
    //             }

    //             // Update the user's pendingApprovalMessage field based on the result
    //             if (!hasPendingApproval) {
    //                 console.log("Removing pending message");
                    
    //                 // Wait for the Firebase operation to complete
    //                 await setDoc(doc(db, "users", user.email), { pendingApprovalMessage: false }, { merge: true });
    //                 dispatch(setPendingApprovalMessage(false));

    //                 // Add a slight delay to allow the Redux state to update
    //                 setTimeout(() => {
    //                     console.log("Redux state after dispatch:", pendingApprovalMessage);
                 
    //                 }, 1500);
    //             }
          
                
    //         } catch (error) {
    //             console.error("Error checking pending approvals: ", error);
    //         }
    //     };
    
    //     checkPendingApprovals();
    // }, [db, user.email]);
    
    return (
        <>
            <PendingApprovalMessages/> {/*send a message out for host if there is a pending request and redirects to pernding page*/}
            <SearchBar setSearchResult={setSearchResult} /> {/* Passing setSearchResult as a parameter */}
            <SearchResults searchResult={searchResult} />
            
        </>
    );
};
