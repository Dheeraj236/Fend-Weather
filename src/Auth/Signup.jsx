import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { Alert, Stack, IconButton, Button, Grid, FormControl, Card, Input, InputLabel, CircularProgress, InputAdornment, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Navbar from '../Navbar/Navbar';
import "./auth.css";

const LoginComponent = ({ URL }) => {

    //-------------------------------* USE-STATE METHODS *-------------------------------//

    const [loading, setLoading] = useState(false);
    const [Worning, setWorning] = useState('');
    const [showPassword, setShowPassword] = useState('');
    const contactForm = useRef();
    const history = useHistory();


    //-------------------------------* PASSWORD VISIBILITY FUNCTIONS *-------------------------------//
    const handleClickShowPassword = (e) => {
        setShowPassword(e.currentTarget);
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
        setShowPassword('');
    };

    useEffect(() => { setTimeout(() => { setWorning('') }, 3000) }, [])

    //-------------------------------* SIGN-UP ACCOUNT FUNCTION *-------------------------------//
    const handleSubmit = async (e) => {

        e.preventDefault();
        let data = contactForm.current;

        try {
            setLoading(true)
            if (data.first_name.value && data.last_name.value && data.email.value && data.number.value && data.password.value) {

                let response = await axios.post(`${URL}/register/registeruser`, {
                    first_name: data.first_name.value,
                    last_name: data.last_name.value,
                    email: data.email.value,
                    number: data.number.value,
                    password: data.password.value
                })

                if (response.status === 201) {
                    history.push('/');
                    alert(response.data.msg);
                }

                if (response.status === 400) {
                    setWorning({ status: 'error', msg: "Your Are offline" })
                    setLoading(false);
                }

            } else {
                setWorning({ status: 'error', msg: 'Please fill all the details..!!!' })
                setLoading(false);
            }
        } catch (err) {

            if (!err.response) {
                setWorning({ status: 'error', msg: "Your Are offline" })
                setLoading(false)
                return;
            }

            setWorning({ status: 'error', msg: err.response.data.msg });
            setLoading(false)
        }

        return () => {
            data = '';
            setLoading(false);
            setTimeout(() => { setWorning('') }, 7000)
        }
    }

    return (
        <Box>
            <Navbar Page={'Signup'} />
            <Box className="containerSign">
                <Card id="signInCard">
                    <Grid id="signInContent" >
                        {
                            Worning.status === 'error'
                                ?
                                <>
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Alert variant="outlined" severity="error">{Worning.msg}</Alert>
                                    </Stack>
                                    <br />
                                </>
                                :
                                null
                        }
                        <form ref={contactForm} style={{ textAlign: 'center' }} onSubmit={(e) => handleSubmit(e)}>
                            <Box sx={{ '& .MuiTextField-root': { width: 293, mt: 2 } }}>
                                <FormControl sx={{ width: 140, mr: 1 }}>
                                    <InputLabel sx={{ ml: -1.6 }} id="title" focused htmlFor="input-with-icon-textfield1">
                                        First Name
                                    </InputLabel>
                                    <Input
                                        id="input-with-icon-textfield1"
                                        name='first_name'
                                        aria-required="true"
                                        style={{ color: 'white' }}
                                        label="First Name"
                                        aria-describedby="component-warning-text"
                                        required
                                    />
                                </FormControl>
                                <FormControl sx={{ width: 140, ml: 1 }}>
                                    <InputLabel sx={{ ml: -1.6 }} id="title" focused htmlFor="input-with-icon-textfield2">
                                        Last Name
                                    </InputLabel>
                                    <Input
                                        id="input-with-icon-textfield2"
                                        name='last_name'
                                        aria-required="true"
                                        style={{ color: 'white' }}
                                        label="Last Name"
                                        aria-describedby="component-warning-text"
                                        required
                                    />
                                </FormControl>
                            </Box>
                            <FormControl sx={{ width: 293, mt: 2 }}>
                                <InputLabel sx={{ ml: -1.6 }} id="title" focused htmlFor="input-with-icon-textfield3">
                                    Email
                                </InputLabel>
                                <Input
                                    id="input-with-icon-textfield3"
                                    name='email'
                                    style={{ color: 'white' }}
                                    label="Email"
                                    aria-describedby="component-warning-text"
                                    required
                                />
                            </FormControl>
                            <FormControl sx={{ width: 293, mt: 2 }}>
                                <InputLabel sx={{ ml: -1.6 }} id="title" focused htmlFor="input-with-icon-textfield4">
                                    Number
                                </InputLabel>
                                <Input
                                    id="input-with-icon-textfield4"
                                    name='number'
                                    style={{ color: 'white' }}
                                    label="Number"
                                    aria-describedby="component-warning-text"
                                    required
                                />
                            </FormControl>
                            <FormControl sx={{ '& .MuiTextField-root': { m: 0 }, mt: 2 }}>
                                <InputLabel htmlFor="standard-adornment-password" id="title" focused sx={{ ml: -1.7 }}>Password</InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    size="small"
                                    style={{ color: 'white' }}
                                    label="Password"
                                    sx={{ width: 293 }}
                                    autoComplete='false'
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <VisibilityOff id="iconsVisibilityOff" /> : <Visibility id="icons" />}
                                            </IconButton>
                                        </InputAdornment>                                        
                                    }
                                    required
                                />
                            </FormControl>
                            <Grid sx={{ textAlign: 'center' }}>
                                <Button id="button" sx={{ mt: 3 }} type="submit" variant="contained" disableElevation >
                                    Create Account
                                </Button>
                                {loading && (<CircularProgress size={50} id='CircularProgress' />)}
                            </Grid>
                            <Grid sx={{ textAlign: 'center', mt: 2 }}>
                                <span id="switchLogin">Already have account ? <span id="switch" onClick={() => { history.push('/') }} variant="body2">Login</span></span>
                            </Grid>
                        </form>
                    </Grid>
                </Card>
            </Box>
        </Box>
    )
}

export default LoginComponent;
