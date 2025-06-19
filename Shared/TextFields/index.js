import React from 'react';
import PropTypes from 'prop-types';
import {Form} from 'react-bootstrap';
import styles from './TextFields.module.scss';

export const CustomTextField = (props) => {
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
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.handleOnChange}
        name={props.name}
        isInvalid={props.isInvalid}
        value={props.value}
        onBlur={props.onBlur}
      />
      <div>
        <a>
          <p
            className={`${
              props.actionTag === 'defaultActionText'
                ? styles.defaultActionText
                : ''
            } ${
              props.actionTag === 'largeActionText'
                ? styles.largeActionText
                : ''
            } ${
              props.actionTag === 'largeActionTextDark'
                ? styles.largeActionTextDark
                : ''
            }`}
            onClick={props.handleClick}>
            {props.actionName}
          </p>
        </a>
      </div>
      <Form.Control.Feedback type="invalid">
        {props.errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

CustomTextField.defaultProps = {
  classLable: 'defaultLabel',
};
CustomTextField.defaultProps = {
  classType: 'defaultTextBox',
};

CustomTextField.defaultProps = {
  actionTag: 'defaultActionText',
};
