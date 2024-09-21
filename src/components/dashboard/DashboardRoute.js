import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Home } from '../home/Home.js'
import { Profile } from '../profile/Profile';
import { Properties } from '../properties/Properties.js';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch } from "react-redux";
import { AdvertiseProperty } from '../advertiseProperty/AdevertiseProperty.js';
import { Message} from "../message/Message.js"

export const DashboardRoute = () => {
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate();
console.log (user)
    if (!user) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                width="100%"
            >
                <Typography>You must be signed in to view this page.</Typography>
                <Button onClick={() => navigate("/signin")}>Sign In</Button>
            </Box>
        );
    }

    return (
        //routes are nested in dashboard. On Dashboard.js they are begining called by segment: 'dashboard/{pathname}',

        <Routes>
            <Route path="/" element={<Dashboard />}>
                <Route path="profile" element={<Profile />} />
                <Route path="home" element={<Home />} />
                <Route path="properties" element={<Properties />} />
                <Route path="advertiseproperty" element={<AdvertiseProperty />} />
                <Route path="message" element={<Message />} />

            </Route>
        </Routes>
    );
};
