import React, {Component} from 'react';
import Link from 'react-router/lib/Link';


const AddContainer = (props) => {
  return (
    <div>
      <Link to='/add/contact' activeStyle={{color: 'red'}} >Contact</Link>
    </div>
    );
};

export default AddContainer;
