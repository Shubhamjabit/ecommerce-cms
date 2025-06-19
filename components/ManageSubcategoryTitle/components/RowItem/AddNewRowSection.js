import React from 'react';
import { Row, Col, Card } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons';
import styles from '../../styles.module.scss';
const AddNewRowModal = () => {
  return (
    <>
      <Card className ={styles.CardBody}>
        <Row>
          <Col>
            <div>
              <PlusSquareFilled className={styles.AddNewItemIcon} />
            </div>
          </Col>
          <Col>
            <div>
              <p className ={styles.Text}>Add another Image</p>
            </div>
          </Col>

        </Row>
      </Card>
    </>
  );
}

export default AddNewRowModal;