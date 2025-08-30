import { useEffect, useState } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../api/firebase-config';
import { useDispatch, useSelector } from 'react-redux';
import { setPendingApprovalMessage } from '../../features/users/users';
import { useNavigate } from 'react-router-dom';

export const ApprovedMessages = () => {
  // Ensure the component name is capitalized
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { pendingApprovalMessage } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //verifies if the user has a pending approval, if so, show message
  useEffect(() => {
    const fetchRequest = async () => {
      if (user && !pendingApprovalMessage) {
        try {
          const propertiesRef = collection(db, 'users', user.email, 'properties');
          const propertiesSnapshot = await getDocs(propertiesRef);
          const pendingArray = [];

          await Promise.all(
            propertiesSnapshot.docs.map(async (property) => {
              const pendingApprovalRef = collection(
                db,
                'users',
                user.email,
                'properties',
                property.id,
                'PendingApproval',
              );
              const pendingSnapshot = await getDocs(pendingApprovalRef);

              if (!pendingSnapshot.empty) {
                pendingSnapshot.docs.forEach((doc) => {
                  const pendingData = doc.data();
                  if (pendingData.status === 'unknown') {
                    pendingArray.push({
                      ...pendingData,
                      propertyName: property.data().propertyName,
                    });
                  }
                });
              }
            }),
          );

          setMessage(pendingArray);
          dispatch(setPendingApprovalMessage(true));

          await setDoc(
            doc(db, 'users', user.email),
            { pendingApprovalMessage: true },
            { merge: true },
          );
        } catch (error) {
          console.error('Error fetching properties and pending approvals:', error);
        }
      }
    };

    fetchRequest();
  }, [user, pendingApprovalMessage, dispatch, navigate]);

  useEffect(() => {
    if (!showAlert && message.length > 0) {
      setShowAlert(true);
      alert(message.map((item) => `${item.propertyName} is pending approval`).join('\n'));
      navigate('/dashboard/pendingapproval');
    }
  }, [message, showAlert, navigate]);

  return null; // No need to render anything here
};
