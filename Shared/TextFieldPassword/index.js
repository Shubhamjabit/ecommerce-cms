import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'react-bootstrap';
import styles from './TextFieldPassword.module.scss';

export const CustomTextFieldPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Group className={styles.formText} controlId={props.controlId}>
      <Form.Label
        className={`${
          props.classLable === 'defaultLabel' ? styles.defaultLabel : ''
        } ${props.classLable === 'smallLable' ? styles.smallLable : ''} ${
          props.classLable === 'secoundaryLabel' ? styles.secoundaryLabel : ''
        } `}>
        {props.label}
      </Form.Label>
      <Form.Control
        className={`${
          props.classType === 'defaultTextBox' ? styles.defaultTextBox : ''
        } `}
        type={showPassword ? 'text' : 'password'}
        placeholder={props.placeholder}
        onChange={props.handleOnChange}
        name={props.name}
        isInvalid={props.isInvalid}
        placeholder={props.placeholder}
        onBlur={props.onBlur}
      />

      {!showPassword && (
        <span className={styles.eyeIcon}>
          <i
            className="fa fa-eye-slash"
            onClick={() => setShowPassword(!showPassword)}></i>
        </span>
      )}

      {showPassword && (
        <span className={styles.eyeIcon}>
          <i
            className="fa fa-eye"
            onClick={() => setShowPassword(!showPassword)}></i>
        </span>
      )}

      <Form.Control.Feedback type="invalid">
        {props.errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

CustomTextFieldPassword.defaultProps = {
  classLable: 'defaultLabel',
};
CustomTextFieldPassword.defaultProps = {
  classType: 'defaultTextBox',
};

CustomTextFieldPassword.defaultProps = {
  actionTag: 'defaultActionText',
};
