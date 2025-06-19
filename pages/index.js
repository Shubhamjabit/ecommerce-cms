import {Route, Switch, Redirect} from 'react-router-dom';
import React from 'react';
import dynamic from 'next/dynamic';
// import 'antd/dist/antd.css';
const Home = dynamic(() => import('../Layout/Home'), { ssr: false });
const Head = dynamic(() => import('next/head'), { ssr: false });
const Login = dynamic(() => import('../Layout/Login'), { ssr: false });
const ResetPassword = dynamic(() => import('../Layout/ResetPassword'), { ssr: false });

import {LoginUI} from '../Layout/LoginUI';

function App_() {
  return (
    <>
      <Head>
        <title>Sparky Admin</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="node_modules/@coreui/coreui/dist/css/coreui.min.css"
        ></link>
        <link
          rel="stylesheet"
          type="text/css"
          href="//fonts.googleapis.com/css?family=Open+Sans"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="//fonts.googleapis.com/css?family=Muli"
        />
      </Head>
      <Switch>
        <Route path="/login/" component={Login} />
        <Route path="/reset-password/" component={ResetPassword} />
        <Route path="/manage/" component={Home} />
        <Redirect from="/" to="/manage/dashboard/" />
      </Switch>
    </>
  );
}

export default App_;
