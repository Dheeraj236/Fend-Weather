import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import {
    Alert,
    Stack,
    IconButton,
    Button,
    Grid,
    FormControl,
    InputLabel,
    CircularProgress,
    Input,
    InputAdornment,
    Box
} from '@mui/material';
import { Visibility, VisibilityOff, Password } from '@mui/icons-material';
import Navbar from '../Navbar/Navbar';
import jwt from 'jsonwebtoken';
import './auth.css';

const Reset = ({ URL }) => {
    //-------------------------------* USE-STATE METHODS *-------------------------------//

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState('');
    const [Worning, setWorning] = useState('');
    const history = useHistory();
    const { token } = useParams();
    const Expire = jwt.decode(token);
    const userId = Expire.user.id;
    const contactForm = useRef();

    //-------------------------------* PASSWORD VISIBILITY *-------------------------------//
    const handleClickShowPassword = (e) => {
        setShowPassword(e.currentTarget);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
        setShowPassword('');
    };

    const handleClickShowConfirmPassword = (e) => {
        setShowConfirmPassword(e.currentTarget);
    };

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
        setShowConfirmPassword('');
    };


    if( Expire.exp*1000<=Date.now()){
        alert("The Link is expired");
        history.push('/');
    }

    //-------------------------------* LOGIN PART *-------------------------------//
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = contactForm.current;

        try {
            setLoading(true);


            if (data.confirm_password.value && data.password.value) {

                if (data.confirm_password.value !== data.password.value) {
                    setWorning({ status: 'error', msg: "Password dose not match" });
                    setLoading(false)
                    setTimeout(() => {
                        setWorning('');
                    }, 7000);
                    return;
                }

                let response = await axios.patch(`${URL}/users/updatepassword/${userId}`, {
                    password: data.password.value
                });


                setWorning(response.data);

                if (response.status === 200) {
                    history.push('/');
                }
            } else {
                setWorning({ status: 'error', msg: 'Please fill all the details..!!!' });
            }
        } catch (err) {

            if (!err.response) {
                setWorning({ status: 'error', msg: "Your Are offline" })
                setLoading(false)
                setTimeout(() => {
                    setWorning('');
                }, 7000);
                return;
            }

            setWorning({ status: 'error', msg: err.response.data.msg });
            setLoading(false)
        }
        setLoading(false)
        setTimeout(() => {
            setWorning('');
        }, 7000);
    };

    return (
        <>
            <Navbar Page={'Signup'} />
            <Box className="container">
                <Grid id="Logincard">
                    <Grid id="content">
                        <h5 style={{ textAlign: 'center' }} id="heading">
                            <Password id="resetIcon" /> Reset Password
                        </h5>
                        {Worning.status === 'error' ? (
                            <Stack sx={{ width: '100%' }} spacing={1}>
                                <Alert variant="outlined" severity="error">
                                    {Worning.msg}
                                </Alert>
                            </Stack>
                        ) : null}
                        <br />
                        <form ref={contactForm} onSubmit={(e) => handleSubmit(e)} >
                            <Grid >
                                <FormControl
                                    className="standard"
                                    sx={{ m: 1, pl: 2, pr: 2, width: '25ch' }}
                                    variant="standard"
                                >
                                    <InputLabel
                                        id="title"
                                        style={{ marginLeft: '15px' }}
                                        focused
                                        htmlFor="standard-adornment-password"
                                    >
                                        Password
                                    </InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        style={{ color: 'white' }}
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff id="iconsVisibilityOff" />
                                                    ) : (
                                                        <Visibility id="icons" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        required
                                    />
                                </FormControl>
                                <FormControl
                                    className="standard"
                                    sx={{ m: 1, pl: 2, pr: 2, width: '25ch' }}
                                    variant="standard"
                                >
                                    <InputLabel
                                        id="title"
                                        style={{ marginLeft: '15px' }}
                                        focused
                                        htmlFor="standard-adornment-password"
                                    >
                                        Confirm Password
                                    </InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        style={{ color: 'white' }}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name='confirm_password'
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownConfirmPassword}
                                                >
                                                    {showConfirmPassword ? (
                                                        <VisibilityOff id="iconsVisibilityOff" />
                                                    ) : (
                                                        <Visibility id="icons" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        required
                                    />
                                </FormControl>
                            </Grid>
                            <Grid sx={{ textAlign: 'center', marginTop: '20px' }}>
                                <Button id="button" type="submit" variant="contained" disableElevation>
                                    Reset
                                </Button>
                                {loading && <CircularProgress size={24} id="CircularProgress" />}
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Reset;
