import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';

const Weather = (props) => {

  // values and methods from App
  const stateVal = props.stateVal;

  //// STATES ////
  const [citySelected, setCitySelected] = useState(props.citySelected);
  const [timezoneVal, setTimezoneVal] = useState(0);
  const [weatherTimeVal, setWeatherTimeVal] = useState(0);
  const [weatherVal, setWeatherVal] = useState('');
  const [cityVal, setCityVal] = useState('');
  const [sunriseVal, setSunriseVal] = useState(0);
  const [sunsetVal, setSunsetVal] = useState(0);
  const [tempCurrVal, setTempCurrVal] = useState(0);
  const [humidityVal, setHumidtyVal] = useState(0);
  const [cloudsVal, setCloudsVal] = useState(0);

  //// COMPONENTS ////
  // displays current city weather
  const DisplayWeather = (props) => {

    //// METHODS ////
    const formatDay = (date) => {
      const time = new Date(date * 1000);
      let utcDay = time.getUTCDay();
      let day = '';

      switch(utcDay) {
        case 0:
          day = 'Sunday';
          break;
        case 1:
          day = 'Monday';
          break;
        case 2:
          day = 'Tuesday';
          break;
        case 3:
          day = 'Wednesday';
          break;
        case 4:
          day = 'Thursday';
          break;
        case 5:
          day = 'Friday';
          break;
        case 6:
          day = 'Saturday'
          break;
        default:
          day = 'Error Getting Day'
          break;
      }

      return `${day}`;
    };

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
        <div className={`row weatherinfo ${props.rowClass}`}>
          <div className={`col-6 ${props.colClass}`}>
            {props.val}{props.unit}
          </div>
        </div>
      );
    };

    const DisplayWeatherInfoCenter = (props) => {
      return (
        <div className='row weatherinfo weatherinfo-center'>
          <div className='col-6 d-flex justify-content-start'>
            <strong>{(props.desc).toUpperCase()}</strong>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            {props.val}{props.unit}
          </div>
        </div>
      );
    };

    const ShowWeather = (props) => {
      return (
        <div className='container'>
          <div className='weather-top'>
            <DisplayWeatherInfo 
              val={`${cityVal}, ${stateVal}`} desc={'city'} 
              rowClass={'weatherinfo-right'} 
              colClass={'justify-content-end info-city'} />
            <DisplayWeatherInfo 
              val={formatDay(weatherTimeVal + timezoneVal)} 
              desc={'timestamp'} rowClass={'weatherinfo-right'} 
              colClass={'justify-content-end'}/>
            <DisplayWeatherInfo 
              val={tempCurrVal} 
              unit='F' 
              desc='current temp' 
              className='info-temp' 
              rowClass={'weatherinfo-left'} 
              colClass={'justify-content-start info-temp'} />
            <DisplayWeatherInfo 
              val={weatherVal} 
              desc={'weather'} 
              rowClass={'weatherinfo-left'} 
              colClass={'justify-content-start'}/>
          </div>
          <div className='weather-bottom'>
            <DisplayWeatherInfoCenter val={humidityVal} unit='%' desc='humidity' />
            <DisplayWeatherInfoCenter val={cloudsVal} unit='%' desc='cloudiness' />
            <DisplayWeatherInfoCenter val={formatTime(sunriseVal + timezoneVal)} desc='sunrise' />
            <DisplayWeatherInfoCenter val={formatTime(sunsetVal + timezoneVal)} desc='sunset' />
          </div>
        </div>
      );
    };

    const HideWeather = (props) => {
      return (
        <div></div>
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
      const url = `http://localhost:3000/weather/${props.cityId}`;
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
          
          // set weather
          setWeatherVal(weather.weather[0].main);
  
          // set cloudiness
          setCloudsVal(weather.clouds.all);
  
          // set sunrise, sunset
          setSunriseVal(weather.sys.sunrise);
          setSunsetVal(weather.sys.sunset);
        })
        .catch((err) => {
          setCitySelected(false);
      });
    };
    getWeatherApi();
  }, [props.cityId]);

  return (
    <DisplayWeather />
  );
};

export default Weather;