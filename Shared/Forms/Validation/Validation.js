import * as yup from 'yup';

const phoneRegExp = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/;
const postCodeRegExp = /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/;
const passwordLogin = yup
  .string()
  .min(8, 'Minimum length is 8')
  .matches(
    passwordRegExp,
    'least one uppercase letter, one lowercase letter, one number and one special character:',
  )
  .required('Required');
const firstName = yup.string().required('Required');
const lastName = yup.string().required('Required');
const email = yup.string().email('Invalid email').required('Required');
const streetAddress = yup.string().required('Required');
const city = yup.string().required('Required');
const state = yup.string().required('Required');
const country = yup.string().required('Required');
const postCode = yup
  .string()
  .required('Required')
  .matches(postCodeRegExp, 'Invalid Post Code');
const phone = yup
  .string()
  .required('Required')
  .matches(phoneRegExp, 'Invalid phone number');
const orderNote = yup.string().required('Required');

// TradeProgramFormValidation
const businessName = yup.string().required('Requiered');
const businessType = yup.string().required('Requiered');
const abnNumber = yup.string().required('Required');
const suburd = yup.string().required('Required');
const companyWebsite = yup.string().required('Required');
const facebookPage = yup.string().required('Required');
const instagramPage = yup.string().required('Required');

export const LoginFormValidation = yup.object({
  email: email,
  password: yup.string().required('Required'),
});
export const createAccountFormValidation = yup.object({
  email: email,
  emailConfirmation: yup
    .string()
    .oneOf([yup.ref('email'), null], 'Emails must match')
    .required('Required'),
  password: passwordLogin,
  passwordConfirmation: yup
    .string()
    .min(8, 'Minimum length is 8')
    .matches(
      passwordRegExp,
      'least one uppercase letter, one lowercase letter, one number and one special character:',
    )
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
  firstName: firstName,
  lastName: lastName,
  phone: phone,
  terms: yup.bool().oneOf([true], 'Must Accept Terms and Conditions'),
  subscribe: yup.bool(),
});
export const ShippigDetailsValidation = yup.object({
  streetAddress: streetAddress,
  city: city,
  state: state,
  postCode: postCode,
  country: country,
  email: email,
  firstName: firstName,
  lastName: lastName,
  phone: phone,
});
export const TradeProgramFormValidation = yup.object({
  businessType: businessType,
  businessName: businessName,
  businessMobileNo: phone,
  abnNumber: abnNumber,
  firstName: firstName,
  surName: lastName,
  email: email,
  registeredAddress: streetAddress,
  suburd: suburd,
  state: state,
  postCode: postCode,
  companyWebsite: companyWebsite,
  facebookPage: facebookPage,
  instagramPage: instagramPage,
});
export const ResetPasswordValidation = yup.object({
  password: passwordLogin,
  passwordConfirmation: yup
    .string()
    .min(8, 'Minimum length is 8')
    .matches(
      passwordRegExp,
      'least one uppercase letter, one lowercase letter, one number and one special character:',
    )
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});
