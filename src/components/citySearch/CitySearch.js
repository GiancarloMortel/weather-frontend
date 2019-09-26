import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

const CitySearch = (props) => {

    // values and methods from App
    const liftCityId = props.liftCityId;
    const liftCitySelected = props.liftCitySelected;
    const liftStateVal = props.liftStateVal;

    //// STATES ////
    // input used to search cities
    const [cityInput, setCityInput] = useState('');
    const [cityPlaceholder, setCityPlaceholder] = useState('las vegas');

    // used to show or hide city list
    const [citySelected, setCitySelected] = useState(true);

    // holds list of cities
    const [cityObject, setCityObject] = useState([]);

    // if city was found
    const [cityFound, setCityFound] = useState(true);

    // shows loading screen
    const [loadingCities, setLoadingCities] = useState(false);

    //// METHODS ////
    // handles city input
    const handleCityChange = (event) => setCityInput(event.target.value);

    // called when user searches for city
    const getCity = (event) => {
        event.preventDefault();

        // if city was previously not found, gets rid of the 
        // city not found result
        setCityFound(true);

        // enable loading screen
        setLoadingCities(true);
        
        // hides weather info
        setCitySelected(false);
        liftCitySelected(false);

        // clear any cities
        setCityObject([]);
        setCityPlaceholder(cityInput);

        // get list of cities
        const getCityApi = () => {

            // check for empty string
            if (cityInput === '') {
                setCityFound(false);
            }
            else {
                // get list of cities
                const url = `https://localhost:3000/city/${cityInput}`;
                const promise = axios.get(url);
                promise
                    .then((res) => {

                        // check if city not found
                        if (res.data.length === 0) {
                            setCityFound(false);
                            return;
                        }

                        // city found
                        setCityFound(true);
                
                        // create list to display
                        let cityObjList = [];
                
                        for (let i in res.data) {
                            let newObj = {
                            value: res.data[i].id,
                            state: res.data[i].state,
                            label: `${res.data[i].name}, ${res.data[i].state}`
                            };
                            cityObjList.push(newObj);
                        }
                        setCityObject(cityObjList);
                        setLoadingCities(false);
                    })
                    .catch((err) => {
                        setCityFound(false);
                    });
            }
        };
        getCityApi();
    };

    //// COMPONENTS ////
    // displays list of cities
    const DisplayCities = (props) => {

        //// COMPONENTS ////
        const DisplayCityInfo = (props) => {
            const submitCity = (event) => {
                event.preventDefault();
                setCitySelected(true);

                // send info back up to App
                liftCityId(props.cityId);
                liftCitySelected(true);
                liftStateVal(props.state);
            };

            return (
                <div className='row flex-column'>
                    <div className='col-12'>
                        <button 
                            type='button'
                            className='btn btn-primary cityButton'
                            onClick={submitCity}>
                            {props.cityName}
                        </button>
                    </div>
                </div>
            );
        };

        const CityNotFound = () => {
            return (
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='cityNotFound'>
                                City Not Found
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const ShowCities = () => {
            return (
                <div className='container'>
                    {cityObject.map((city) => 
                        <DisplayCityInfo 
                            key={city.value} 
                            cityId={city.value}
                            cityName={city.label}
                            state={city.state}
                        />
                    )}
                </div>
            );
        };

        const HideCities = () => {
            return (
                <div></div>
            );
        };

        const LoadingCities = () => {
            return (
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='citySearching'>
                                Loading Cities
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        if (!cityFound) {
            return <CityNotFound />;
        }
        else if (citySelected) {
            return <HideCities />;
        }
        else if (loadingCities) {
            return <LoadingCities />;
        }
        else {
            return <ShowCities />;
        }
    };

    return (
        <div>
            <div className='container'>
                <div className='row '>
                    <div className='col-12'>
                        <form key={'display-form'} className='d-flex justify-content-center'>
                            <input className='input-box' key={'display-input'} value={cityInput} placeholder={cityPlaceholder} onChange={handleCityChange}/>
                            <button className='btn btn-primary input-button' onClick={getCity}>submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <DisplayCities />
        </div>
    );
};

export default CitySearch;