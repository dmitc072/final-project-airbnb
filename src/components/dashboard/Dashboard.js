import * as React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../features/users/users';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../Theme'; //have to call theme again eventhough it is wrapped around the who page
import MessageIcon from '@mui/icons-material/Message';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PendingIcon from '@mui/icons-material/Pending';
import { Box, Button } from "@mui/material";
import { Home } from '../home/Home.js';
import { ThemeProvider } from '@mui/material/styles'
import { useEffect } from 'react';
import { useState } from 'react';
import { Profile } from '../profile/Profile.js';


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
    segment: 'dashboard/message',
    title: 'Message',
    icon: <MessageIcon />,
  },
  {
    segment: 'dashboard/pendingapproval',
    title: 'Pending Approval',
    icon: <PendingIcon />,
  },
  {
    segment: 'dashboard/approvedproperties',
    title: 'Approved',
    icon: <ThumbUpAltIcon />,
  },
];


export const Dashboard = () => {
  const dispatch = useDispatch(); //used to signin and signout
  const navigate = useNavigate(); //used to route to another page
  const location = useLocation(); //used to find location
  const { isHostChecked } = useSelector((state) => state.auth.user)



  const [colorScheme, setColorScheme] = useState('light');

  //this useEffect changes the DOM
  useEffect(() => {
    // Function to update color scheme
    const updateColorScheme = () => {
      const scheme = document.documentElement.getAttribute('data-toolpad-color-scheme');
      setColorScheme(scheme);
    };

    // Initial update
    updateColorScheme();

    // Set up a MutationObserver to listen for changes
    const observer = new MutationObserver(() => {
      updateColorScheme();
    });

    // Observe changes to the attributes of the documentElement
    observer.observe(document.documentElement, {
      attributes: true, // Watch for attribute changes
    });

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, []);


  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
  };

  const renderComponent = () => {
    switch (location.pathname) {
      case '/dashboard':
        return <Home />;
      case '/dashboard/profile':
        return <Profile />;
      // Add additional cases here for other paths
      default:
        return <Home />;
    }
  };
  return (
<AppProvider
  branding={{
    logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
    title: 'MUI',
  }}
  navigation={isHostChecked
    ? NAVIGATION.map((navItem) => ({
        ...navItem,
      }))
    : NAVIGATION.filter((_, index) => index !== 3 && index !== 4).map((navItem) => ({
        ...navItem,
      }))
  }
>
  <ThemeProvider theme={theme(colorScheme)}>
  <DashboardLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          position: 'static',
        }}
      >
        <Button variant="contained" onClick={handleSignOut}>
          Sign out
        </Button>
      </Box>
      {renderComponent()} {/* Renders component based on pathname */}

    </DashboardLayout>
  </ThemeProvider>
</AppProvider>

  );
};

Dashboard.propTypes = {
  window: PropTypes.func,
};
