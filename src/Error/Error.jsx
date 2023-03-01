import { Grid } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import React from 'react';
import './error.css';

const Error = () => {
    return (
        <>
            <Navbar Page={'Error'} />
            <Grid container id='ErrorCont'>
                <img src="https://i.ibb.co/SJdXspD/pngegg-2.png" alt="" />
            </Grid>
        </>
    );
}

export default Error;