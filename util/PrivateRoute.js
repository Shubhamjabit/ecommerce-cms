import React, {useState} from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({path, component: Component, render, ...rest}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return Component ? <Component {...props} /> : render(props);
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {from: props.location},
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
