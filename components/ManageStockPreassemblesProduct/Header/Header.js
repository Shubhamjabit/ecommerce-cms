import React, {useState, useEffect, useReducer} from 'react';
import {Card, Col, Row} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Select} from 'antd';
import stlyes from './Header.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import Excelexport from '../ProductsTable/components/Excelexport';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import axios from 'axios';
const Header = ({showAddModal, showAddProduct}) => {
  const [expotData, setExportData] = useState(null);
  const getExportProductData = async () => {
    {
      try {
        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.getexpotProductList}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then((data) => {
            // setData(data);
            setExportData(data.data.data.productsexpotlistdata.data);
            return {state: true, message: 'sucess'};
          });
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getExportProductData();
  }, []);

  return (
    <Row className={stlyes.mainRow}>
      <Col>
        <p className={stlyes.topLittle}>{`Products`}</p>
      </Col>
      <Col className={stlyes.addProductButton} style={{display: 'flex'}}>
        <Excelexport
          excelData={expotData}
          fileName={'ProductsSheet'}
          stlyes={stlyes}
        />

        <Button
          className="dashboard-addNewProduct"
          onClick={() => {
            showAddProduct();
          }}
          icon={<PlusOutlined />}
        >
          Add New Product
        </Button>
        {/* <a href="/manage/add-product">
          <Button className="dashboard-addNewProduct" icon={<PlusOutlined />}>
            Add New Product
          </Button>
        </a> */}
      </Col>
    </Row>
  );
};

export default Header;
