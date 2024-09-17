import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context.js";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../../api/firebase-config.js";
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

export const SearchBar = ({ setSearchResult }) => {
  const { row, column } = useContext(AppContext);
  const [location, setLocation] = useState([]);
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 
  const { isHostChecked } = useSelector((state) => state.auth.user)


  // Fetches all locations
  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, "users")); // Get all users
      const locationsArray = []; // Temporary array to store locations
  
      querySnapshot.forEach(async (userDoc) => { 
        const userData = userDoc.data(); // Access the user data
        
        // Check if the user is a host
        if (userData.isHostChecked) {
          // Proceed with getting their properties
          const locationCollectionRef = collection(db, "users", userDoc.id, "properties");
          const locationSnapshot = await getDocs(locationCollectionRef);
          
          locationSnapshot.forEach(locationDoc => {
            locationsArray.push(locationDoc.data()); // Push data into the temporary array
          });
          //console.log(locationsArray)
        }
      });
  
      setLocation(locationsArray); // Update state with the locations array
    };
  
    fetchLocations();
  }, [search]);
  

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    const results = location.filter(result => 
      result.state === search || 
      result.city === search || 
      result.zipCode === search
    );

    setSearchResult(results);
    console.log('Search Results:', results);
  };

  return (
    <>
      <Box sx={column}>
        <Typography variant="h5" sx={{textAlign:"center"}}>Find your next dream vacation</Typography>
        <Box
          sx={{
            ...row, //spread out row from useContext to change flexDirection
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <TextField
            type="search"
            placeholder="Search a Destination"
            value={search} //using value and onChange allows to the data to "search" and use the Button to search
            onChange={handleInputChange} 
          />
          <Button onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </Box>
    </>
  );
};
