import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';

const Weather = (props) => {

  // values and methods from App
  const citySelected = props.citySelected;
  const stateVal = props.stateVal;

  //// STATES ////
  const [timezoneVal, setTimezoneVal] = useState(0);
  const [weatherTimeVal, setWeatherTimeVal] = useState(0);
  const [weatherVal, setWeatherVal] = useState('');
  const [cityVal, setCityVal] = useState('');
  const [sunriseVal, setSunriseVal] = useState(0);
  const [sunsetVal, setSunsetVal] = useState(0);
  const [tempCurrVal, setTempCurrVal] = useState(0);
  const [humidityVal, setHumidtyVal] = useState(0);
  const [windVal, setWindVal] = useState(0);
  const [cloudsVal, setCloudsVal] = useState(0);

  //// COMPONENTS ////
  // displays current city weather
  const DisplayWeather = (props) => {

    //// METHODS ////
    // handles timezone and time format
    const formatTime = (date) => {
      const time = new Date(date * 1000);
      let hours = time.getUTCHours();
      let mins = time.getUTCMinutes();
      let period = 'am';
      if (hours > 12) {
        hours = hours % 12;
        period = 'pm';
      }
      if (mins < 10) {
        mins = `0${mins}`;
      }
      return `${hours}:${mins} ${period}`;
    };

    //// COMPONENTS ////
    const DisplayWeatherInfo = (props) => {
      return (
        <div className='row weatherinfo box'>
          <div className='col-md-6 box'>
            {props.val}{props.unit}
          </div>
          <div className='col-md-6 box'>
            {props.desc}
          </div>
        </div>
      );
    };

    const ShowWeather = (props) => {
      return (
        <div className='container box'>
          <DisplayWeatherInfo val={`${cityVal}, ${stateVal}`} desc={'city'} />
          <DisplayWeatherInfo val={formatTime(weatherTimeVal + timezoneVal)} desc={'timestamp'} />
          <DisplayWeatherInfo val={weatherVal} desc={'weather'} />
          <DisplayWeatherInfo val={tempCurrVal} unit='F' desc='current temp' />
          <DisplayWeatherInfo val={humidityVal} unit='%' desc='humidity' />
          <DisplayWeatherInfo val={windVal} unit='mph' desc='wind' />
          <DisplayWeatherInfo val={cloudsVal} unit='%' desc='cloudiness' />
          <DisplayWeatherInfo val={formatTime(sunriseVal + timezoneVal)} desc='sunrise' />
          <DisplayWeatherInfo val={formatTime(sunsetVal + timezoneVal)} desc='sunset' />
        </div>
      );
    };

    const HideWeather = (props) => {
      return (
        <div className='container box'>
          <div className='row box'>
            <div className='col-md-12 box'>
            </div>
          </div>
        </div>
      );
    };

    if (citySelected) {
      return <ShowWeather />;
    }
    else {
      return <HideWeather />;
    }
  };

  //// EFFECTS ////
  // when cityid changed get weather
  useEffect(() => {
    const getWeatherApi = () => {
      const url = `http://localhost:9000/weather/${props.cityId}`;
      const promise = axios.get(url);
  
      promise
        .then((res) => {
  
          // get data
          const weather = res.data;
  
          // get timezone
          setTimezoneVal(weather.timezone);
  
          // get time of weather
          setWeatherTimeVal(weather.dt);
  
          // set city
          setCityVal(weather.name);
  
          // set temperature
          setTempCurrVal(weather.main.temp.toFixed(0));
  
          // set humidity
          setHumidtyVal(weather.main.humidity);
  
          // set wind
          setWindVal(weather.wind.speed);
          
          // set weather
          setWeatherVal(weather.weather[0].main);
  
          // set cloudiness
          setCloudsVal(weather.clouds.all);
  
          // set sunrise, sunset
          setSunriseVal(weather.sys.sunrise);
          setSunsetVal(weather.sys.sunset);
        })
        .catch((err) => {
          console.log(err);
      });
    };
    getWeatherApi();
  }, [props.cityId]);

  return (
    <div>
      <DisplayWeather />
    </div>
  );
};

export default Weather;