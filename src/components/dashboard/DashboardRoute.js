import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Home } from '../home/Home.js';
import { Profile } from '../profile/Profile';
import { Properties } from '../properties/Properties.js';
import { Typography } from '@mui/material';
import { AdvertiseProperty } from '../advertiseProperty/AdevertiseProperty.js';
import { Message } from '../message/Message.js';
import { PendingApproval } from '../pendingApproval/PendingApproval.js';
import { ApprovedProperties } from '../approvedProperties/ApprovedProperties.js';


export const DashboardRoute = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return (
        
        <Routes>
            <Route path="/" element={<Dashboard />}>
                <Route path="profile" element={<Profile />} />
                <Route path="home" element={<Home />} />
                <Route path="properties" element={<Properties />} />
                <Route path="advertiseproperty" element={<AdvertiseProperty />} />
                <Route path="message" element={<Message />} />
                <Route path="pendingapproval" element={<PendingApproval />} />
                <Route path="approvedproperties" element={<ApprovedProperties />} />
                <Route path="*" element={<Typography>Page not found</Typography>} />
            </Route>
        </Routes>
    );
};
