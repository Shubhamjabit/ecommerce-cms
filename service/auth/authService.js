import {LeftSquareFilled} from '@ant-design/icons';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../utils/factory';
const AWS = require('aws-sdk');
const cognitoidentity = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.APP_AWS_REGION,
});

export const signUp = async (User) => {
  try {
    const responce = await Auth.signUp({
      username: User.email,
      password: User.password,
      attributes: {
        phone_number: User.phone_number,
        'custom:firstname': User.first_name,
        'custom:lastname': User.last_name,
      },
    });
    return {state: true, message: 'sucess'};
  } catch (error) {
    return {state: false, message: error.message};
  }
};

// export const signIn = async (User) => {
//   {
//     try {
//       const data = await Auth.signIn(User.email, User.password);
//       const token = data.signInUserSession.accessToken.jwtToken;
//       const userDetails = data.attributes;
//       localStorage.setItem('tokenKey', token);
//       localStorage.setItem('user', JSON.stringify(userDetails));
//       console.log('signIn ok', JSON.stringify(data.attributes));

//       return {state: true, message: 'sucess'};
//     } catch (error) {
//       console.log('error signIn:', error.message);
//       return {state: false, message: error.message};
//     }
//   }
// };

export const signIn = async (user) => {
  {
    try {
      const data = await axios.post(
        `${envUrl.baseUrl}${cmsendPoint.login}`,
        user,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );

      const token = data.data.data.tokens.access.token;
      const userDetails = data.data.data.user;
      localStorage.setItem('tokenKey', token);
      localStorage.setItem('user', JSON.stringify(userDetails));

      return {state: true, message: 'sucess'};
    } catch (error) {
      console.log('error signIn:', error.message);
      return {state: false, message: error.message};
    }
  }
};

export const resetPassword = async (User) => {
  try {
    let authUser = await Auth.signIn(User.email, User.tempPassword);
    await Auth.completeNewPassword(authUser, User.password);

    return {state: true, message: 'sucess'};
  } catch (error) {
    console.log('error', error);
    return {state: false, message: error.message};
  }
};

export const signOut = () => {
  localStorage.clear();
  // localStorage.removeItem('tokenKey');
  // localStorage.removeItem('user');
};

export const forgotPassword = async (email) => {
  try {
    const data = await Auth.forgotPassword(email);
    const reset = {email: email, code: ''};
    localStorage.setItem('reset', JSON.stringify(reset));
    console.log('forgotPassword', data);
    return {state: true, message: 'sucess'};
  } catch (error) {
    console.log('error forgotPassword:', error);
    return {state: false, message: error.message};
  }
};

export const getVerifyMail = () => {
  const reset = JSON.parse(localStorage.getItem('reset'));
  return reset.email.slice(reset.email.length / 2);
};

export const setVerifyCode = (code) => {
  let reset = JSON.parse(localStorage.getItem('reset'));
  reset.code = code;
  localStorage.setItem('reset', JSON.stringify(reset));
};

export const forgotPasswordSubmit = async (password) => {
  let reset = JSON.parse(localStorage.getItem('reset'));
  console.log('reset', reset);
  console.log('password', password);

  try {
    const data = await Auth.forgotPasswordSubmit(
      reset.email,
      reset.code.toString(),
      password
    );
    console.log('forgotPasswordSubmit sucess', data);
    return {state: true, message: 'sucess'};
  } catch (error) {
    console.log('error forgotPasswordSubmit:', error);
    return {state: false, message: error.message};
  }
};

export default {
  signUp,
  signIn,
  forgotPassword,
  forgotPasswordSubmit,
  getVerifyMail,
  setVerifyCode,
  signOut,
};
