import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context.js";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../../api/firebase-config.js";
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

export const SearchBar = ({ setSearchResult }) => {
  const { row, column, states } = useContext(AppContext);
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
            locationsArray.push({...locationDoc.data(),user:userDoc.id}); // Push data into the temporary array and retrieve the user
          });
          console.log("location array ",locationsArray)
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
    let normalizedSearch = search.trim().toLowerCase(); // Trim and lowercase search term

    // Find and convert full state name to abbreviation if it exists
    const stateMatch = states.find(state => state.abbreviation.toLowerCase() === normalizedSearch);
    if (stateMatch) {
      normalizedSearch = stateMatch.name.toLowerCase();
    }
    
    // Filter based on the updated normalized search term
    const results = location.filter(result => 
      result.state?.toLowerCase() === normalizedSearch || 
      result.city?.toLowerCase() === normalizedSearch || 
      result.zipCode?.toLowerCase() === normalizedSearch
    );
    
    setSearchResult(results);
    console.log('Search Results:', results, location, search);
  }    
  
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
