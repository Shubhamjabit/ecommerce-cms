import React, {useState, useEffect} from 'react';
// import MainBanner from './components/MainBanner';
// import SectionBanner from './components/SectionBanner';
import {Row, Col} from 'antd';
// import { useSelector } from 'react-redux';
// import { useQuery } from '@apollo/client';
// import { GET_HOME_BANNERS } from "../../../graphql/Queries/BannerQueries";
import {Tabs} from 'antd';
import styles from './styles.module.scss';
import BannerSecond from './components/BannerSecond/BannerSecond';
import BannerThird from './components/BannerThird/BannerThird';
import BannerMain from './components/BannerMain/BannerMain';
import Router from 'next/router';
//import CategoryPage from '../CategoryPage';
// const MAIN_BANNER = 1;
// const SECOND_BANNER = 2;
// const THIRD_BANNER = 3;
// const SECTION_ONE = 1;
// const SECTION_TWO = 2;
// const SECTION_THREE = 3;

const {TabPane} = Tabs;

const HomePage = () => {

  function callback(key) {
    console.log('callback' + key);
  }
  Router.query.tab;
  return (
    <>
      <Tabs
        className={styles.bannersTabs}
        type="card"
        defaultActiveKey={Router.query.tab}
        onChange={callback}
      >
        <TabPane className={styles.bannersTab} tab="Main Banner" key="1">
        <div
              className={styles.CardBody}
              style={{color: '#000', padding: '0px'}}
            >
            <BannerMain />
          </div>
        </TabPane>
       <TabPane className={styles.bannersTab} tab="Home Second Banner" key="2">
          <Row>
            <div
              className={styles.CardBody}
              style={{color: '#000', padding: '0px'}}
            >
              <BannerSecond />
            </div>
          </Row>
        </TabPane>
         <TabPane className={styles.bannersTab} tab="Home Third Banner" key="3">
          <Row>
            <div
              className={styles.CardBody}
              style={{color: '#000', padding: '0px'}}
            >
              <BannerThird />
            </div>
          </Row>
        </TabPane>
      </Tabs>
    </>
  );
};

export default HomePage;
