import React, {useState, useEffect} from 'react';
import Header from './Header/Header';


import {Row} from 'antd';
import Loader from '../../Shared/Loader/Loader';
import HomePage from '../WebsiteContent/HomePage';

const WebsiteContent = () => {
 


  return (
    
          <Row>
            <div className="card-body">
              <Header />
              <HomePage />
            </div>
          </Row>
       
    
  );
};

export default WebsiteContent;
