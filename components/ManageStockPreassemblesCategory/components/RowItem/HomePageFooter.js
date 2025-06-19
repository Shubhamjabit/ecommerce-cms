import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons';
import styles from '../../styles.module.scss';

const HomePageFooter = () => {
    return (
        <Card className={styles.CardBody}>
            <Row>
                <Col span={2} offset={21}>
                    <div >
                        <Button
                            className={styles.submitButton}
                        >
                            Submit Images
                        </Button>
                    </div>
                </Col>
            </Row>
        </Card>);
}

export default HomePageFooter;