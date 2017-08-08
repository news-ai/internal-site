import React, { Component } from 'react';
import * as api from 'actions/api';
// import {connect} from 'react-redux';
// import withRouter from 'react-router/lib/withRouter';
import Select from 'react-select';
// import {searchConstant} from './constants';
import states from './states';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {grey300, grey500, grey600, grey700} from 'material-ui/styles/colors';
import debounce from 'es6-promise-debounce';
import styled from 'styled-components';

import 'react-select/dist/react-select.css';

const MainContainer = styled.div`
  width: 200px;
  margin-top: 8px;
`;

const SelectContainer = styled.div`
  display: 'block'
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const RemoveButton = styled.i.attrs({
  className: 'fa fa-times'
})`
  fontSize: 2em;
  color: ${grey500};
  margin: 3px;
  cursor: pointer;

  &:hover {
    color: ${grey700};
  }
`;

class Selector extends Component {
  constructor(props) {
    super(props);
    this.onCountryChange = obj => this.props.onLocationSelect({country: !!obj ? obj.value : undefined, state: this.props.state, city: this.props.city});
    this.onStateChange = obj => this.props.onLocationSelect({country: this.props.country, state: !!obj ? obj.value : undefined, city: this.props.city});
    this.onCityChange = obj => this.props.onLocationSelect({country: this.props.country, state: this.props.state, city: !!obj ? obj.value : undefined});
    this.loadCountries = debounce(this.loadCountries.bind(this), 750);
    this.loadStates = debounce(this.loadStates.bind(this), 750);
    this.loadCities = debounce(this.loadCities.bind(this), 750);
  }

  loadCountries(country, cb) {
    cb(null, {options: [{value: 'United States'}]});
    // if (country.length > 0) {
    //   return api.get(`/database-contacts/locations?country=${country}`)
    //   .then(response => {
    //     console.log(response);
    //     cb(null, {options: response.data.map(({countryName}) => ({value: countryName}))});
    //   });
    // }
  }

  loadStates(state, cb) {
    cb(null, {options: states});
    // if (state.length > 0) {
    //   return api.get(`/database-contacts/locations?country=${this.props.country}&state=${state}`)
    //   .then(response => {
    //     console.log(response);
    //     cb(null, {options: response.data.map(({stateName}) => ({value: stateName}))});
    //   });
    // }
  }

  loadCities(city, cb) {
    if (city.length > 0) {
      return api.get(`/database-contacts/locations?country=${this.props.country}&state=${this.props.state}&city=${city}`)
      .then(response => {
        // console.log(response);
        cb(null, {options: response.data.map(({cityName}) => ({value: cityName}))});
      });
    }
  }

  render() {
    const {index, country, state, city} = this.props;
    return (
      <MainContainer>
      {
        index > 0 &&
        <ButtonContainer>
          <RemoveButton onClick={this.props.onLocationDelete} />
        </ButtonContainer>}
        <SelectContainer>
          <Select.Async
          placeholder='Country'
          labelKey='value'
          onChange={this.onCountryChange}
          value={country}
          loadOptions={this.loadCountries}
          />
        </SelectContainer>
        <SelectContainer>
          <Select.Async
          placeholder='State'
          labelKey='value'
          onChange={this.onStateChange}
          value={state}
          loadOptions={this.loadStates}
          />
        </SelectContainer>
        <SelectContainer>
          <Select.Async
          placeholder='City'
          labelKey='value'
          onChange={this.onCityChange}
          value={city}
          loadOptions={this.loadCities}
          />
        </SelectContainer>
      </MainContainer>
      );
  }
}

class LocationSelector extends Component {
  render() {
    return (
      <div>
      {this.props.locations
        .map(({country, state, city}, i) =>
          <Selector
          key={`location-selector-set-${i}`}
          index={i}
          country={country}
          state={state}
          city={city}
          onLocationDelete={_ => this.props.onLocationDelete(i)}
          onLocationSelect={obj => this.props.onLocationSelect(i, obj)}
          />
        )}
        <div style={{textAlign: 'center', margin: '10px 0'}} >
          <FlatButton label='Add Location' icon={<FontIcon className='fa fa-plus' />} onClick={this.props.onLocationAdd} />
        </div>
      </div>
    );
  }
}

export default LocationSelector;
