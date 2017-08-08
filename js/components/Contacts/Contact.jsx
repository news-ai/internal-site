import React, { Component } from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string';
import {grey50, blueGrey50, lightBlue50, blue50, blue300, grey700, grey900} from 'material-ui/styles/colors';
import Image from './Image';
import Tag from 'components/Tags/Tag';
import TweetFeed from 'components/Contacts/Tweets/TweetFeed';
import HeadlineFeed from 'components/Headlines/HeadlineFeed';
import isURL from 'validator/lib/isURL';
import FontIcon from 'material-ui/FontIcon';

const orgStyles = {
  container: {display: 'block', margin: '10px 5px'},
  name: {color: grey700, fontSize: '1.1em', fontWeight: 'bold'},
  title: {color: grey700, fontSize: '1em', marginLeft: 10},
  startDate: {color: grey700, fontSize: '0.9em', marginLeft: 5}
};

const Organization = ({name, startDate, title}) =>
  <div style={orgStyles.container} >
    <span style={orgStyles.name}>{name}</span>
    <span style={orgStyles.title}>{title}</span>
  {startDate &&
    <span style={orgStyles.startDate}>{`(started on ${startDate || 'unknown start date'})`}</span>}
  </div>;

class SocialProfiles extends Component {
  constructor(props) {
    super(props);
    this.state = {hoverTarget: null};
  }

  render() {
    const {socialProfiles} = this.props;
    const {hoverTarget} = this.state;
    return (
      <div style={{padding: 10, marginTop: 20, backgroundColor: grey50}} >
        <div style={{marginBottom: 5}} >
          <span className='text' >Social Profiles</span>
          <span className='text right' style={{color: grey700}} >hover to see bio (if it has one)</span>
        </div>
      {socialProfiles.map((profile, i) =>
        <div
        onMouseEnter={e => this.setState({hoverTarget: profile})}
        onMouseLeave={e => this.setState({hoverTarget: null})}
        style={{margin: '0 8px', display: 'inline-block'}}
        >
          <a className='text' href={profile.url} target='_blank' rel='noreferrer'>
            <FontIcon color={grey700} hoverColor={grey900} style={{fontSize: '0.9em', margin: '0 5px'}} className={`fa fa-${profile.type}`} />
            <span className='hoverGrey700to900' >{profile.typeName}</span>
          </a>
        </div>)}
      {hoverTarget !== null && hoverTarget.bio &&
        <p style={{margin: 10}} className='text'>{hoverTarget.bio.replace(/(<([^>]+)>)/ig, ' ')}</p>}
      </div>
      );
  }
}

const ContactView = ({contactInfo, demographics, photos, writingInformation, twitter, organizations, socialProfiles}) => (
  <div>
    <div style={{padding: '20px 0'}} >
      <div className='right'>
      {photos &&
        <Image style={{borderRadius: '50%', maxHeight: 100, maxWidth: 100}} src={photos[0].url} />}
      </div>
      <div style={{display: 'block'}} >
        <span style={{color: grey700, fontSize: '1.5em'}} >{contactInfo.fullName}</span>
      </div>
      <div style={{display: 'block', marginTop: 20}} >
        <label>Beat(s)</label>
        {writingInformation.beats.map(beat => <Tag key={beat} textStyle={{fontSize: '1em'}} color={lightBlue50} borderColor={blue300} hideDelete text={beat} />)}
        {writingInformation.occasionalBeats.map(beat => <Tag key={beat} textStyle={{fontSize: '1em'}} color={blue50} borderColor={blue300} hideDelete text={beat} />)}
      </div>
      <div className='right' style={{display: 'block'}} >
        <span style={{color: grey700, fontSize: '1.1em'}} >{demographics.locationGeneral}</span>
      </div>
    {twitter &&
      <div style={{display: 'block', margin: '15px 10px'}} >
        <label style={{color: grey700}} >Twitter Description</label>
        <span className='text' style={{color: grey700}} >
        {twitter.description && twitter.description.split(' ').map((block, i) =>
          isURL(block) ? <a key={`block-${i}`} href={block} rel='noreferrer' target='_blank'>{block} </a> : `${block} `)}
        </span>
      </div>}
    {organizations &&
      <div style={{padding: 10, marginTop: 20, backgroundColor: grey50}} >
      <label>Positions</label>
      {organizations
        .filter(org => org.name)
        .map((org, i) =>
        <Organization key={`org-${i}`} {...org} />)}
      </div>}
    {socialProfiles &&
      <SocialProfiles socialProfiles={socialProfiles} />}
    </div>
  {writingInformation.isFreelancer &&
    <span>Freelancing</span>}
  </div>
  );

class Contact extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchContactProfile();
  }

  render() {
    const {contact, query, email, isReceiving, twitter} = this.props;
    // console.log(contact);
    // console.log(query);
    // console.log(email);
    let renderNode = <div>Not Found</div>;
    if (isReceiving) renderNode = <div>LOADING...</div>;
    if (contact && !isReceiving) {
      renderNode = (
      <div style={{backgroundColor: blueGrey50}} className='row horizontal-center'>
        <div style={{backgroundColor: '#ffffff'}} className='large-8 medium-10 small-12 columns' >
          <ContactView {...contact} twitter={twitter} />
          <div style={{padding: '10px 0', backgroundColor: lightBlue50}} >
            <span style={{color: grey700, marginLeft: 10}} >Recent Headlines</span>
          </div>
          <HeadlineFeed height={350} email={email} />
          <div style={{padding: '10px 0', backgroundColor: lightBlue50}} >
            <span style={{color: grey700, marginLeft: 10}} >Tweets</span>
          </div>
          <TweetFeed height={450} email={email} />
        </div>
      </div>
      );
    }
    return renderNode;
  }
}

const mapStateToProps = (state, props) => {
  const query = queryString.parse(props.location.search);
  return {
    isReceiving: state.contactReducer.isReceiving,
    contact: state.contactReducer[query.email],
    twitter: state.twitterProfileReducer[query.email],
    email: query.email,
    query
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const query = queryString.parse(props.location.search);
  return {
    fetchContactProfile: _ => dispatch({type: 'FETCH_CONTACT_PROFILE', email: query.email}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
