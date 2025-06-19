import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import styles from './Buttons.module.scss';

export const CustomButton = (props) => {
  return (
    <button
      disabled={props.disabled}
      type={props.buttonType}
      className={`${props.type === 'largeBtnDark' ? styles.largeBtnDark : ''} 
             ${
               props.type === 'largeBtnDarkInactive'
                 ? styles.largeBtnDarkInactive
                 : ''
             }
             ${
               props.type === 'largeBtnTransparent'
                 ? styles.largeBtnTransparent
                 : ''
             }
             ${props.type === 'largeBtnWhite' ? styles.largeBtnWhite : ''}
             ${props.type === 'defaultBtnDark' ? styles.defaultBtnDark : ''}
             ${
               props.type === 'defaultBtnDarkInactive'
                 ? styles.defaultBtnDarkInactive
                 : ''
             }
             ${
               props.type === 'defaultBtnTransparent'
                 ? styles.defaultBtnTransparent
                 : ''
             }
             ${props.type === 'defaultBtnWhite' ? styles.defaultBtnWhite : ''}
             ${
               props.type === 'defaultBtnDarkProduct'
                 ? styles.defaultBtnDarkProduct
                 : ''
             }
             `}
      onClick={props.handleClick}>
      {props.icon && props.icon} {props.label}
    </button>
  );
};

CustomButton.defaultProps = {
  type: 'defaultBtnDark',
};
