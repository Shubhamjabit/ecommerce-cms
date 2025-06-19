import React from 'react';
import { Row, Button } from 'antd';
import styles from './styles.module.scss';

const HiddenButton = () => {
    return (
        <Button
            className={styles.hiddenButton}
        >
            Hidden
        </Button>

    );
}

export default HiddenButton;