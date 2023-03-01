import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
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
import { Visibility, VisibilityOff, LockTwoTone, AccountCircle, Google } from '@mui/icons-material';
import "./auth.css";

const LoginComponent = ({ URL, clientId }) => {
	//-------------------------------* USE-STATE METHODS *-------------------------------//

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState('');
	const [Worning, setWorning] = useState('');
	const history = useHistory();
	const contactForm = useRef();

	useEffect(() => {
		const start = () => {
			gapi.client.init({
				clientId: clientId,
				scope: ''
			})
		};

		gapi.load('client:auth2', start);
	})

	//-------------------------------* PASSWORD VISIBILITY *-------------------------------//
	const handleClickShowPassword = (e) => {
		setShowPassword(e.currentTarget);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
		setShowPassword('');
	};

	//-------------------------------* LOGIN PART *-------------------------------//
	const handleSubmit = async (e) => {
		e.preventDefault();
		let data = contactForm.current;

		try {
			setLoading(true);
			if (data.email.value && data.password.value) {
				let response = await axios.post(`${URL}/register/login`, {

					email: data.email.value,
					password: data.password.value
				});

				if (response.status === 200) {
					data = '';
					localStorage.setItem('token', response.data.userToken);
					history.push('/home');
					setLoading(false);
				}

				if (response.status === 400) {
					setWorning({ status: 'error', msg: response.data.msg })
					setLoading(false);
				}
			} else {
				setWorning({ status: 'error', msg: 'Please fill all the details..!!!' });
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
			setLoading(false);
			setTimeout(() => { setWorning('') }, 7000)
		}
	};

	const handleFailure = () => {
		setWorning({ status: 'error', msg: 'There are some network problem. Try after sometime' });
		setTimeout(() => { setWorning('') }, 7000)
	};

	const handleLogin = async (res) => {

		const g_password = res.tokenId;
		const userData = res.profileObj;

		try {
			let response = await axios.post(`${URL}/register/googleregisteruser`, {
				first_name: userData.givenName,
				last_name: userData.familyName,
				email: userData.email,
				g_password: g_password,
			});

			if (response.data.status === 'success') {
				localStorage.setItem('token', response.data.userToken);
				history.push('/home');
			}
		} catch (err) {

			if (!err.response) {
				setWorning({ status: 'error', msg: "Your Are offline" })
				setLoading(false)
				return;
			}
			console.log(err.response)

			setWorning({ status: 'warning', msg: "User not allowed to use this feature right now, website is in test mode. Please signup." });
			setLoading(false)
		}
		setLoading(false)
		setTimeout(() => {
			setWorning('');
		}, 7000);
	}

	return (
		<Box className="container">
			<Grid id="Logincard">
				<Grid id="content">
					<h2 style={{ textAlign: 'center' }} id="heading">
						<LockTwoTone id="loginIcon" />Login
					</h2>
					{Worning!== '' ? (
						<Stack sx={{ width: '100%' }} spacing={1}>
							<Alert severity={Worning.status}>
								{Worning.msg}
							</Alert>
						</Stack>
					) : null}
					<br />
					<form ref={contactForm} onSubmit={(e) => handleSubmit(e)}>
						<Grid>
							<FormControl sx={{ m: 1, pl: 2, pr: 2, width: '25ch' }}>
								<InputLabel sx={{ ml: 0.2 }} id="title" focused htmlFor="input-with-icon-textfield">
									Email
								</InputLabel>
								<Input
									id="input-with-icon-textfield"
									name="email"
									style={{ color: 'white' }}
									label="Email"
									aria-describedby="component-warning-text"
									endAdornment={
										<InputAdornment position="start">
											<AccountCircle id="icons" />
										</InputAdornment>
									}
                                    required
								/>
							</FormControl>
						</Grid>
						<br />
						<Grid>
							<FormControl
								className="standard"
								sx={{ ml: 1, pl: 2, pr: 2, mr: 1, width: '25ch' }}
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
									autoComplete='false'
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
						</Grid>
						<Grid sx={{ textAlign: 'center', margin: '20px 0' }}>
							<Button id="button" type="submit" variant="contained" disableElevation>
								Login
							</Button>
							<GoogleLogin
								className="button"
								clientId={clientId}
								buttonText="Google"
								onSuccess={handleLogin}
								onFailure={handleFailure}
								cookiePolicy={'single_host_origin'}
								render={renderProps => (
									<Button id="button" variant="contained" onClick={renderProps.onClick} disabled={renderProps.disabled}><Google id="googleIcon" /> Google</Button>
								  )}
							>
							</GoogleLogin>
							{loading && <CircularProgress size={24} id="CircularProgress" />}
						</Grid>
						<Grid sx={{ textAlign: 'end' }}>
							<span id="switchLogin" >
								<span
									id="forgot"
									onClick={() => {
										history.push('/forgotpassword');
									}}
									variant="body2"
								>
									Forgot Password ?
								</span>
							</span>
						</Grid>
						<Grid sx={{ textAlign: 'end', mr: '20px' }}>
							<span id="switchLogin">
								Don&apos;t have account ?{' '}
								<span
									id="switch"
									onClick={() => {
										history.push('/signup');
									}}
									variant="body2"
								>
									Sign-Up
								</span>
							</span>
						</Grid>
					</form>
				</Grid>
			</Grid>
		</Box>
	);
};

export default LoginComponent;
