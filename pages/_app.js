import '../scss/_custom.scss';
import '../scss/_customCoreUi.scss';
import '../scss/_styles.scss';
import '../scss/AddFilterModal.scss';
import '../scss/Pick_List_Template.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import productReducer from '../store/reducers/productReducer';
import reviewReducer from '../store/reducers/reviewReducer';
import searchReducer from '../store/reducers/searchReducer';
import bannerReducer from '../store/reducers/bannerReducer';
import categoryReducer from '../store/reducers/categoryReducer';
import contentReducer from '../store/reducers/contentReducer';
import userReducer from '../store/reducers/userReducer';
import locationUpdateReducer from '../store/reducers/locationUpdateReducer';
import preassemblesReducer from '../store/reducers/preassemblesReducer';
import App_ from '../pages/index';
import {BrowserRouter} from 'react-router-dom';
import orderReducer from '../store/reducers/orderReducer';
import manageFilterReducer from '../store/reducers/manageFilterReducer';
import Head from 'next/head';
// global.ASYNC_VALIDATOR_NO_WARNING = 1;
const isServer = typeof window === 'undefined';

const rootReducer = combineReducers({
  productReducer: productReducer,
  reviewReducer: reviewReducer,
  searchReducer: searchReducer,
  bannerReducer: bannerReducer,
  categoryReducer: categoryReducer,
  locationUpdateReducer: locationUpdateReducer,
  contentReducer: contentReducer,
  userReducer: userReducer,
  orderReducer: orderReducer,
  manageFilterReducer: manageFilterReducer,
  preassemblesReducer: preassemblesReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const MyApp = ({Component, pageProps}) => {
  if (isServer) {
    const {StaticRouter} = require('react-router');
    const context = {};
    return (
      <StaticRouter context={context}>
        <Provider store={store}>
          <App_ {...pageProps} />
        </Provider>
      </StaticRouter>
    );
  }
  return (
    <>
      <Head>
        <title>Sparky Admin</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <BrowserRouter>
        <Provider store={store}>
          <App_ {...pageProps} />
        </Provider>
      </BrowserRouter>
    </>
  );
};

export default MyApp;
