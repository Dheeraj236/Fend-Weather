import { AccountCircle, HomeRounded, LogoutRounded, AccountCircleRounded, NavigateBefore } from '@mui/icons-material';
import { IconButton, MenuItem, Menu, Typography, Toolbar } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import "./navbar.css";

const Navbar = ({ Page, Key, W_URL, DateNow }) => {


    //-------------------------------* USE-STATE METHODS *-------------------------------//
    const [anchorEl, setAnchorEl] = useState(null);
    const [locator, setLocator] = useState('');
    const localToken = localStorage.getItem('token');
    const decodedToken = jwt.decode(localToken);
    const history = useHistory();
    const LocatorRef = useRef();

    //-------------------------------* LOCATOR FUNCTIONS *-------------------------------//
    useEffect(() => {
        LocatorRef.current();
    }, [])

    const Locator = (async () => {
        if (Page !== 'Home') {
            return;
        }
        const response = await axios.get(`${W_URL}?key=${Key}&q=auto:ip`)
        setLocator(response.data);
    })

    LocatorRef.current = Locator;

    //-------------------------------* DATE BUILDER FUNCTIONS *-------------------------------//
    const DateBuilder = (() => {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[DateNow.getDay()];
        let date = DateNow.getDate();
        let month = months[DateNow.getMonth()];
        let year = DateNow.getFullYear();

        return `${date} ${month} ${year}, ${day}`
    })

    //-------------------------------* MANU FUNCTIONS *-------------------------------//
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //-------------------------------* NAVIGAT FUNCTIONS *-------------------------------//

    const Home = () => {
        history.push('/home');
    };

    const Profile = () => {
        history.push('/profile');
    };

    const Logout = () => {
        localStorage.removeItem('token');
        history.push('/');
        alert('You have been logged out');
    };

    return (
        <>
            <Toolbar variant="dense" sx={{ m: 2, display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                {
                    Page === 'Home'
                        ?
                        null
                        :
                        <IconButton onClick={() => { history.goBack() }} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, position: 'left' }}>
                            <NavigateBefore />
                        </IconButton>
                }
                {
                    Page === 'Home'
                        ?
                        (
                            <div>
                                <h6 className="selectedFont d-flex justify-content-center" style={{ color: 'rgb(182, 184, 185)', fontSize: '20px', paddingLeft: '10px', borderLeft: 'ridge' }} >
                                    {locator ? (`${locator.location.name}, `) : null}&nbsp;
                                    <span className="selectedFont d-flex justify-content-center" style={{ color: 'rgb(182, 184, 185)', fontSize: '14px', marginTop: '7px' }} >
                                        {DateBuilder()}
                                    </span>
                                </h6>
                            </div>
                        )
                        :
                        null
                }
                {
                    Page === 'Error' || Page === 'Signup'
                        ?
                        null
                        :
                        <>
                            {(
                                <div>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        sx={{ opacity: 0.95 }}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClick={handleClose}
                                    >
                                        <MenuItem id="menuItemsOut">
                                            <Typography id="menuItemsUser"> Hi {decodedToken ? decodedToken.user.first_name : 'User'} !&nbsp;<img className='wave' src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif" alt='' /></Typography>
                                        </MenuItem>
                                        {
                                            Page === 'Home'
                                                ?
                                                null
                                                :
                                                <MenuItem id="menuItemsOut" onClick={Home}>
                                                    <HomeRounded id="menuItemsIcon" /> &nbsp; &nbsp;
                                                    <Typography id="menuItems" >Home</Typography>
                                                </MenuItem>
                                        }
                                        {
                                            Page === 'Profile'
                                                ?
                                                null
                                                :
                                                <MenuItem id="menuItemsOut" onClick={Profile} >
                                                    <AccountCircleRounded id="menuItemsIcon" /> &nbsp; &nbsp;
                                                    <Typography id="menuItems" >Profile</Typography>
                                                </MenuItem>
                                        }
                                        <MenuItem id="menuItemsOut" onClick={Logout}>
                                            <LogoutRounded id="menuItemsIcon" /> &nbsp; &nbsp;
                                            <Typography id="menuItems" >Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </>
                }
            </Toolbar>
        </>
    );
}

export default Navbar;