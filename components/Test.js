import {Grid} from '@mui/material';
import {Input} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, {useState, useEffect} from 'react';
// import validator from 'validator';
import {endPoint, envUrl} from '../utils/factory';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function ContactUsForm({styles}) {
  const [fullName, setfullName] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState('');
  const [message, setmessage] = useState(null);
  const [fullNameError, setfullNameError] = useState('');
  const [emailError, setemailError] = useState('');
  const [phoneError, setphoneError] = useState('');
  const [messageError, setmessageError] = useState('');
  const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.com$/i.test(email);
  // Alert State
  const [messageState, setMessageState] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [open, setOpen] = useState(false);
  //Hnadle close Alert
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const clearstate = () => {
    setfullName('');
    setemail('');
    setmessage('');
    setphone('');
  };
  const handleSubmit = async () => {
    console.log('!!!!!');
    if (fullName === '') {
      setfullNameError('Please enter  full name');
      return false;
    }
    if (email === '') {
      setemailError('Please enter  email');
      return false;
    }
    if (isEmail(email) === false) {
      setemailError('Please enter valid email');
      return false;
    }
    if (!phone.match('[0-9]{10}') || phone.length > 10) {
      setphoneError('Please enter valid phone number');
      return false;
    }
    if (message === null || message.length < 1) {
      setmessageError('Please enter message');
      return false;
    }
    if (fullName !== '' && email !== '' && phone !== '' && message !== '') {
      const data = {fullName, email, phone, message};
      try {
        // const url = `${envUrl.baseUrl}${endPoint.saveContact}`;
        // await axios
        //   .post(url, data)
        //   .then((response) => {
        //     if (
        //       response &&
        //       response.data.status === 200 &&
        //       response.data.statusType === 1
        //     ) {
        //       setOpen(true);
        //       setMessageState('contact form submitted successfully');
        //       setMessageStatus('success');
        //       clearstate();
        //     }
        //   })
        //   .catch((error) => {
        //     setMessageState('Error in submitting contact form');
        //     setMessageStatus('error');
        //   });
        console.log('req sent!');
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <h3>SEND US A MESSAGE</h3>
      <div>
        <Grid container direction={'row'} spacing={2}>
          <Grid item sm={12}>
            <div>
              <label>Your Name</label>
              <Input
                size="large"
                onChange={(e) => {
                  setfullName(e.target.value);
                  setfullNameError('');
                }}
                value={fullName}
              />
              <div style={{color: 'red'}}>{fullNameError}</div>
            </div>
          </Grid>
          <Grid item sm={12}>
            <div>
              <label>Email Address</label>
              <Input
                size="large"
                onChange={(e) => {
                  setemail(e.target.value);
                  setemailError('');
                }}
                value={email}
              />
              <div style={{color: 'red'}}>{emailError}</div>
            </div>
          </Grid>
          <Grid item sm={12}>
            <div>
              <label>Phone Number</label>
              <Input
                size="large"
                onChange={(e) => {
                  setphone(e.target.value);
                  setphoneError('');
                }}
                value={phone}
              />
              <div style={{color: 'red'}}>{phoneError}</div>
            </div>
          </Grid>
          <Grid item sm={12}>
            <div>
              <label>Message</label>
              <TextArea
                rows={6}
                onChange={(e) => {
                  setmessage(e.target.value);
                  setmessageError('');
                }}
                value={message}
              />
              <div style={{color: 'red'}}>{messageError}</div>
            </div>
          </Grid>
          <Grid item sm={12}>
            <div>
              <button onClick={handleSubmit}>
                <img src="/images/send.png" />
              </button>
            </div>
          </Grid>
        </Grid>
      </div>
      {/* Alert Message */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={messageStatus}
          sx={{width: '100%'}}
        >
          {messageState && messageState}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default ContactUsForm;
