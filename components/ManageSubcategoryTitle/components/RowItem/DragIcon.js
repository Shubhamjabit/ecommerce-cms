import React from 'react';
import { DashOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import styles from '../../styles.module.scss';

const DragIcon = () => {
    return (
        <>
            <Row>
                <DashOutlined />
            </Row>
            <Row>
                <DashOutlined className ={styles.DashedOutlined}/>
            </Row>
        </>
    );
}

export default DragIcon;