import React from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import Tag from 'components/Tags/Tag';
import Image from './Image';
import {grey50, blueGrey50, blueGrey300, lightBlue50, lightBlue300, blue50, blue300, grey700} from 'material-ui/styles/colors';
import {assignToEmpty} from 'utils/assign';

const ContactListItem = ({email, contactInfo, demographics, writingInformation, organizations, photos}) => (
  <div className='row' style={{
    padding: 3,
    borderBottom: `3px solid ${blueGrey300}`,
    borderLeft: `3px solid ${lightBlue300}`,
    backgroundColor: '#ffffff',
  }} >
    <div className='large-10 medium-9 small-8'>
      <div className='row' style={{paddingLeft: 10}} >
        <div className='large-12 medium-12 small-12 columns'>
          <Link to={{
            pathname: `/contacts/contact`,
            search: `?email=${email}`,
            // state: {cool: 'heyyyyy'} // goes to props.location.state
          }} style={{color: grey700, fontWeight: 'bold'}}>
          {contactInfo.fullName}
          </Link>
        {organizations &&
          <span style={{marginLeft: 15}} className='text'>{organizations[0].name}</span>}
        </div>
        <div className='large-12 medium-12 small-12 columns'>
        {organizations && organizations[0].name &&
          <span className='text' style={{color: grey700}} >{organizations[0].title}</span>}
        </div>
        <div className='large-12 medium-12 small-12 columns'>
          <span style={{color: grey700}} className='text'>{demographics.locationGeneral}</span>
        </div>
        <div style={{margin: '3px 0'}} className='large-12 medium-12 small-12 columns vertical-center'>
          <label style={{color: grey700}}>Beat(s)</label>
          {writingInformation.beats.map(beat =>
            <Tag key={beat} color={lightBlue50} borderColor={blue300} hideDelete text={beat} />)}
          {writingInformation.occasionalBeats.map(beat =>
            <Tag key={beat} color={blue50} borderColor={blue300} hideDelete text={beat} />)}
        </div>
      </div>
    </div>
    <div className='large-2 medium-3 small-4 vertical-center right'>
    {photos &&
      <Image style={{borderRadius: '4%', maxHeight: 90, maxWidth: 90}} src={photos[0].url} />}
    </div>
  </div>
  );

export default ContactListItem;
