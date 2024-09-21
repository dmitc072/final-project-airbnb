import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../features/users/users';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../Theme'; //have to call theme again eventhough it is wrapped around the who page
import MessageIcon from '@mui/icons-material/Message';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import {AppContext} from "../../context.js"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import { db } from "../../api/firebase-config.js";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Home } from '../home/Home.js';

const NAVIGATION = [
  {
    
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard/profile', //include dashboard in the segment (this is the path) to go get to the site. if not it won't route to dashboard child on DashboardRoute.js
    title: 'Profile',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dashboard/home', //segment routes you to the page from DashboardRoute
    title: 'Search',
    icon: <SearchIcon />,
  },
  {
    segment: 'dashboard/advertiseproperty',
    title: 'Advertise Property',
    icon: <LoyaltyIcon />,
  },
  {
    segment: 'dashboard/properties',
    title: 'Listing Properties',
    icon: <FormatListBulletedIcon />,
  },
  {
    segment: 'dashboard/properties',
    title: 'Message',
    icon: <MessageIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});




export const Dashboard = () => {
  const dispatch = useDispatch(); //used to signin and signout
  const navigate = useNavigate(); //used to route to another page
  const location = useLocation(); //used to find location
  const { isHostChecked } = useSelector((state) => state.auth.user)





  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
  };

  return (
    <AppProvider
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'MUI',
      }}
      navigation={isHostChecked ? 
        NAVIGATION.map((navItem) => ({
          ...navItem,
        }))
      :  
      NAVIGATION.filter((hostInfo,index)=> index != 3 && index != 4).map((navItem) => ({ //filter out properties(index 3) and map everything else
        ...navItem,
      }))
      }
      theme={theme}
    >
      <DashboardLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            position:"static",
          }}
        >
          <Button variant="contained" onClick={handleSignOut}>
            Sign out
          </Button>
        </Box>
        <Outlet /> {/* This is where the child routes will be rendered */}
        {location.pathname === '/dashboard' && <Home />} {/*If location equal /dashboard, show Home.js*/}

      </DashboardLayout>
    </AppProvider>
  );
};

Dashboard.propTypes = {
  window: PropTypes.func,
};
