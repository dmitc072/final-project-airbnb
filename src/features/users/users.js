// src/redux/userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../../api/firebase-config';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

// Define an async thunk for user sign-in
export const signinUser = createAsyncThunk(
  'auth/signinUser',
  async (userData, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Fetch additional user information from Firestore
      const userDocRef = doc(db, 'users', user.email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error('User document does not exist in Firestore.');
      }

      const userInfo = userDoc.data();
      const serializedUser = {
        uid: user.uid,
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        phoneNumber: userInfo.phoneNumber || '',
        email: user.email,
        displayName: user.displayName,
        photoURL: userInfo.photoURL || '',
        emailVerified: user.emailVerified,
        token,
        isHostChecked: userInfo.isHostChecked || false,
        isRenterChecked: userInfo.isRenterChecked || true,
        isProfileComplete: userInfo.isProfileComplete || false,
        isFirstLogin: userInfo.isFirstLogin,
        hostIsVerified:userInfo.hostIsVerified || false,
        pendingApprovalMessage:userInfo.pendingApprovalMessage || false //true didn't work, so I used false
      };

      return { data: serializedUser, status: 200 };
    } catch (error) {
      return rejectWithValue({ message: error.message, code: error.code });
    }
  }
);

// Define an async thunk for user sign-out
export const signOut = createAsyncThunk('auth/signOut', async (_, { getState }) => {
  const state = getState();
  const user = state.auth.user; // Access the current user from the state

  if (user) {
    const userDocRef = doc(db, "users", user.email); 

    // Update pendingApprovalMessage in Firestore
    await setDoc(userDocRef, { pendingApprovalMessage: false }, { merge: true });

    await firebaseSignOut(auth); 
  }

  return null;
});


// Define the slice
const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    loading: false,
  },
  reducers: {
    setHostChecked: (state, action) => {
      if (state.user) state.user.isHostChecked = action.payload;
    },
    setRenterChecked: (state, action) => {
      if (state.user) state.user.isRenterChecked = action.payload;
    },
    setIsProfileComplete: (state, action) => {
      if (state.user) state.user.isProfileComplete = action.payload;
    },
    setIsFirstLogin: (state, action) => {
      if (state.user) state.user.isFirstLogin = action.payload;
    },
    setPhotoURL: (state, action) => {
      if (state.user) state.user.photoURL = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setHostIsVerified: (state, action) => {
      if (state.user) state.user.hostIsVerified = action.payload;
    },
    setPendingApprovalMessage: (state, action) => {
      if (state.user) state.user.pendingApprovalMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        // if(state.user){
        //   state.user.pendingApprovalMessage = false
        // }
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Action to initialize authentication state
export const initializeAuth = () => async (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const userDocRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userDocRef);

        //when you add when already logged on, the information gets updated here
        if (userDoc.exists()) {
          const userInfo = userDoc.data();
          const serializedUser = {
            uid: user.uid,
            firstName: userInfo.firstName || '',
            lastName: userInfo.lastName || '',
            phoneNumber: userInfo.phoneNumber || '',
            email: user.email,
            displayName: user.displayName,
            photoURL: userInfo.photoURL || '',
            emailVerified: user.emailVerified,
            token,
            isHostChecked: userInfo.isHostChecked || false,
            isRenterChecked: userInfo.isRenterChecked || true,
            isProfileComplete: userInfo.isProfileComplete || false,
            isFirstLogin: userInfo.isFirstLogin ,
            hostIsVerified:userInfo.hostIsVerified || false,
            pendingApprovalMessage:userInfo.pendingApprovalMessage || false

          };

          dispatch(setUser(serializedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      }
    } else {
      dispatch(setUser(null));
    }
  });
};

export const {
  setHostChecked,
  setRenterChecked,
  setIsProfileComplete,
  setIsFirstLogin,
  setPhotoURL,
  setUser,
  setHostIsVerified,
  setPendingApprovalMessage

} = userSlice.actions;

export default userSlice.reducer;
