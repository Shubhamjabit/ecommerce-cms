import React from 'react';
import { Row, Button } from 'antd';
import styles from './styles.module.scss';

const PendingButton = () => {
    return (
        <Button
            className={styles.pendingButton}
        >
            Pending
        </Button>

    );
}

export default PendingButton;