import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Grid,
    Paper,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SpaIcon from '@mui/icons-material/Spa';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PieChartIcon from '@mui/icons-material/PieChart';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import WineBarIcon from '@mui/icons-material/WineBar'; // app icon
import BottleForm from './BottleForm';
import CSVUpload from './CSVUpload';
import AnalyticsCharts from './AnalyticsCharts';
import BottleTable from './BottleTable'; // Optional to include in Add Bottle tab
import Logo from "../../assets/logo.png";
import HomeIcon from '@mui/icons-material/Home';
const drawerWidth = 240;

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('add-bottle');

    const menuItems = [
        { label: 'Home', icon: <HomeIcon />, key: 'home' },
        { label: 'Add Bottle', icon: <AddBoxIcon />, key: 'add-bottle' },
        { label: 'Add Wine Type', icon: <LocalBarIcon />, key: 'add-wine-type' },
        { label: 'Add Grape Type', icon: <SpaIcon />, key: 'add-grape-type' },
        { label: 'Upload Multiple Bottles', icon: <UploadFileIcon />, key: 'upload' },
        { label: 'Analytics', icon: <PieChartIcon />, key: 'analytics' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            {/* Top AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#97acc0', height: 100, display: 'flex', justifyContent: 'center', paddingLeft: 5 }}>
                <Toolbar>
                    <Box sx={{
                        position: "absolute",


                        '& img': {
                            transition: "transform 0.3s ease-in-out",
                        },
                        '& img:hover': {
                            transform: "scale(1.5)",
                        }
                    }}>
                        <img src={Logo} alt="CVine Logo" style={{ height: "70px" }} />
                    </Box>
                    <Typography noWrap component="div" sx={{ ml: 25, fontSize: 50, fontWeight: 'bold', color: '#1e2a35' }}>
                        CVine Admin Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box >
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#2c3e50',
                            color: '#fff',
                        },

                    }}
                >
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Wine Admin
                    </Typography>
                    <List sx={{ mt: 4, px: 2 }}>
                        {menuItems.map((item) => {
                            const isActive = activeTab === item.key;
                            return (
                                <ListItem
                                    button
                                    key={item.key}
                                    onClick={() => setActiveTab(item.key)}
                                    sx={{
                                        my: 1,
                                        borderRadius: '8px',
                                        border: '1px solid #3d566e',
                                        backgroundColor: isActive ? '#97acc0' : '#162029',
                                        color: isActive ? '#162029' : '#ffffff',
                                        '& .MuiListItemIcon-root': {
                                            color: isActive ? '#162029' : '#ffffff',
                                        },
                                        '&:hover': {
                                            backgroundColor: isActive ? '#97acc0' : '#1e2a35',
                                        },
                                        height: 80,
                                        px: 2,
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Drawer>

            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 13 }}>
                <Typography variant="h4" gutterBottom>
                    {menuItems.find((item) => item.key === activeTab)?.label}
                </Typography>

                <Grid container spacing={3}>
                    {activeTab === 'home' && (
                        <>

                            <Paper sx={{ mt: 5, ml: 5 }}>
                                <AnalyticsCharts />
                            </Paper>


                        </>
                    )}
                    {activeTab === 'add-bottle' && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, mt: 5 }}>
                                    <BottleForm />
                                </Paper>
                            </Grid>

                        </>
                    )}

                    {activeTab === 'add-wine-type' && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography>Form to add Wine Type (TODO)</Typography>
                            </Paper>
                        </Grid>
                    )}

                    {activeTab === 'add-grape-type' && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography>Form to add Grape Type (TODO)</Typography>
                            </Paper>
                        </Grid>
                    )}

                    {activeTab === 'upload' && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <CSVUpload />
                            </Paper>
                        </Grid>
                    )}

                    {activeTab === 'analytics' && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <AnalyticsCharts />
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;