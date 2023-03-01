import { Grid, Box } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {
    LocationSearching,
    MailOutline,
    DeleteOutline,
    PhoneAndroid,
    FaceRounded,
    EditTwoTone
} from '@mui/icons-material';
import './user.css';

const ProfileComponent = ({ URL, Key, W_URL }) => {

    //-------------------------------* USE-STATE METHODS *-------------------------------//

    const [userData, setUser] = useState([]);
    const [locator, setLocator] = useState('');
    const localToken = localStorage.getItem('token');
    const decodedToken = jwt.decode(localToken);
    const LocatorRef = useRef();
    const FatchData = useRef();
    const history = useHistory();

    //-------------------------------* USE-EFFECT METHODS *-------------------------------//
    useEffect(() => {

        if (decodedToken === null) {
            history.push('/');
            return;
        }
        if (decodedToken.exp * 1000 <= Date.now()) {
            localStorage.removeItem('token');
            alert("Session Timeout Please Login Again...");
            history.push('/');
            return;
        }

    }, [decodedToken, history])

    //-------------------------------* LOCATOR FUNCTIONS *-------------------------------//
    useEffect(() => {
        LocatorRef.current();
    }, [])

    const Locator = (async () => {
        const response = await axios.get(`${W_URL}?key=${Key}&q=auto:ip`)
        setLocator(response.data);
    })

    LocatorRef.current = Locator;

    useEffect(() => { FatchData.current() }, [])

    const Fatch = (async () => {
        var response = await axios.get(`${URL}/users/getuser/${decodedToken.user._id}`,
            {
                headers: { token: localToken }
            })

        setUser(response.data);
    })

    FatchData.current = Fatch;

    //-------------------------------* DELETE MY ACCOUNT FUNCTIONS *-------------------------------//
    const DeleteAccount = (async (id) => {

        if (window.confirm('Are you sure to delete this account?')) {
            await axios.delete(`${URL}/users/deleteuser/${id}`)
            localStorage.removeItem('token');
            history.push('/');
            alert('Your Account has been deleted Successfully');
        }
    });

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Navbar Page={'Profile'} />
            <h1 className="ProfileTitle">My Profile</h1>
            <Grid sx={{ display: 'grid', placeItems: 'center', height: '500px' }}>
                <Box>
                    <div className="userShow">
                        <div className="userShowTop">
                            <FaceRounded
                                className="userShowImg" sx={{ fontSize: '2.5rem' }}
                            />
                            <div className="userShowTopTitle">
                                <span className="userShowUsername">{userData.first_name} {userData.last_name}</span>
                                <span className="userShowUserTitle">{userData.email}</span>
                            </div>
                        </div>
                        <div className="userShowBottom">
                            <span className="userShowTitle">Account Details</span>
                            {
                                userData.number 
                                    ?
                                    (
                                        <div className="userShowInfo">
                                            <PhoneAndroid className="userShowIcon" />
                                            <span className="userShowInfoTitle">{userData.number}</span>
                                        </div>
                                    )
                                    :
                                    null
                            }
                            <div className="userShowInfo">
                                <MailOutline className="userShowIcon" />
                                <span className="userShowInfoTitle">{userData.email}</span>
                            </div>
                            <div className="userShowInfo">
                                <LocationSearching className="userShowIcon" />
                                <span className="userShowInfoTitle">{locator ? locator.location.name : null}</span>
                            </div>
                        </div>
                        <div className='actionButtons'>
                            <Link to={"/profile/" + userData._id}>
                                <button className="userAddButton">Edit<EditTwoTone /></button>
                            </Link>
                            <button className="userDeleteButton" onClick={() => DeleteAccount(userData._id)} >Delete <DeleteOutline className="userListDelete" /> </button>
                        </div>
                    </div>
                </Box>
            </Grid>
        </Box>
    );
}

export default ProfileComponent;