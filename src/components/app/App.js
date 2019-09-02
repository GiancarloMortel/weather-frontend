import React, { useState } from 'react';
import './style.css';
import CitySearch from '../citySearch/CitySearch.js';
import Weather from '../weather/Weather.js';

function App() {

  //// STATES ////
  // used by weather component to fetch weather
  const [cityId, setCityId] = useState(5506956);

  // used to tell weather component to show weather
  const [citySelected, setCitySelected] = useState(true);

  // state value will be saved to mongodb if value is missing for city
  const [stateVal, setStateVal] = useState('NV');

  //// METHODS ////
  const liftCityId = (id) => setCityId(id);
  const liftCitySelected = (selected) => setCitySelected(selected);
  const liftStateVal = (state) => setStateVal(state);

  if (citySelected) {
    return (
      <div>
        <CitySearch 
          liftCityId={liftCityId} 
          liftCitySelected={liftCitySelected}
          liftStateVal={liftStateVal}
        />
        <Weather 
          cityId={cityId}
          citySelected={citySelected}
          stateVal={stateVal}
        />
    </div>
    );
  }
  else {
    return (
      <div>
        <CitySearch 
          liftCityId={liftCityId} 
          liftCitySelected={liftCitySelected}
          liftStateVal={liftStateVal}
        />
      </div>
    );
  }
}

export default App;
