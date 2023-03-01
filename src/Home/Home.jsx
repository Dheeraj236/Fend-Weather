import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { Box } from '@mui/material';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Navbar from '../Navbar/Navbar';
import "./home.css";

const Home = ({ W_URL, Key, DateNow }) => {

    //-------------------------------* USE-STATE METHODS *-------------------------------//

    const [searchelement, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState(`It's a beautiful Day...`);
    const [weather, setWeather] = useState('');
    const localToken = localStorage.getItem('token');
    const decodedToken = jwt.decode(localToken);
    const [AmPm, setAmPm] = useState('');
    const history = useHistory();

    //-------------------------------* USE-EFFECT METHODS *-------------------------------//

    useEffect(() => {
        if (decodedToken === null) {
            history.push('/');
            alert("Session Timeout Please Login Again...");
        } else {
            if (decodedToken.exp * 1000 <= Date.now()) {
                history.push('/');
            }
        }
        if (searchelement === '') {
            setSearchResult(`It's a beautiful Day...`)
        }
    }, [history, decodedToken, searchelement])

    //-------------------------------* SEARCH FUNCTION *-------------------------------//

    const Search = (async (event) => {
        if (event.key === 'Enter') {
            try {
                const response = await axios.get(`${W_URL}?key=${Key}&q=${searchelement}`);
                setWeather(response.data);

                DateNow.getHours() > 12 ? setAmPm("PM") : setAmPm("AM");
            } catch (err) {
                setSearchResult('Please Enter Valide Data...')
            }
        }
    })

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Navbar Page={'Home'} W_URL={W_URL} Key={Key} DateNow={DateNow} />
            <div className="cont">
                <h1 className="Title">Weather Forecast</h1>
                <div className="weather_search">
                    <div id="searchIconBar">
                        <div id="searchIconOut">
                            <SearchTwoToneIcon id="searchIcon" />
                        </div>
                        <input
                            type="search"
                            id="searchField"
                            onChange={(e) => {
                                setSearch(e.currentTarget.value.toLowerCase());
                                setWeather('');
                            }}
                            value={searchelement}
                            placeholder={"Search…"}
                            onKeyPress={Search}
                        />
                    </div>
                </div>
                <div className="cardContaint">
                    {
                        searchelement === '' || weather === ''
                            ?
                            <div className="card wrong" id="wrong">
                                <div className="card-body">
                                    <h5 className="card-title font defaultTitle">
                                        Welcome to Weather Foracasting.
                                    </h5>
                                    <hr />
                                    <span>
                                        <h5 className="selectedFont">
                                            {searchResult}
                                        </h5>
                                        <span className="d-flex justify-content-center">
                                            <img className="weatherImgError" src="https://i.ibb.co/gzkRZK1/Weather.png" alt="" />
                                        </span>
                                    </span>
                                </div>
                            </div>
                            :
                            <div className="card" id="card">
                                <div className="card-body">
                                    <h4 className="card-title place font">{weather.location.name}<span className="country font">, {weather.location.country}.</span></h4>
                                    <hr />
                                    <div className="row tempData">
                                        <span className="col-7 degree mt-2 d-flex justify-content-center">
                                            <span className="mt-2 font">{weather.current.temp_c}°C </span>
                                        </span>
                                        <span className="col-5">
                                            <span>
                                                <span className="img"><img className="shadows" src={weather.current.condition.icon} alt='' /></span>
                                                <span><h5 className="dis p-1 font" style={{ marginTop: '-15px' }}>{weather.current.condition.text}</h5></span>
                                            </span>
                                        </span>
                                    </div>
                                    <hr />
                                    <div id="time">
                                        <h6 className="selectedFont d-flex justify-content-center">
                                            Updated Time :&nbsp;{weather.current.last_updated} {AmPm} {weather.current.is_day === 1 ? 'Day' : 'Night'}.
                                        </h6>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </Box>
    )
};

export default Home;
// last_updated_epoch