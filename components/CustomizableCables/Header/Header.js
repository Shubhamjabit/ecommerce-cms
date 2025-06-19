import React, {useState, useEffect, useReducer} from 'react';
import axios from 'axios';
import {Card, Col, Row, Upload, message, Spin} from 'antd';
import {
  CloudUploadOutlined,
  UploadOutlined,
  LoadingOutlined,
  FileOutlined,
} from '@ant-design/icons';
import {Button, Select} from 'antd';
import styles from './Header.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import Excelexport from '../PreassemblesTable/components/Excelexport';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import readXlsxFile from 'read-excel-file';

const Header = ({showModal}) => {
  const [file, setFile] = useState([]);
  const [uploadResponse, setUploadResponse] = useState([]);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filename, setFileName] = useState(null);
  const [uploaddata, setUploadData] = useState(false);

  let mainData = [];

  const saveImage = ({file}) => {
    setLoading(true);
    handleUploadFile(file);
  };

  function beforeUpload(file) {
    const isJpgOrPng =
      file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isJpgOrPng) {
      message.error('You can only upload XLS file!');
    }
    const isLt2M = file.size / 10000 / 10000 < 20;
    if (isJpgOrPng && !isLt2M) {
      message.error('Image must smaller than 20MB!');
    }
    //setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  const handleUploadFile = async (e) => {
    setFile(e);
    setFileName(e.name);
    setLoading(false);
  };

  const handleClickUpload = () => {
    setUploadData(true);
    console.log({file});
    readXlsxFile(file).then((rows) => {
      console.log('***************** rows = ', rows);
      uploadExcelData(rows);
    });
  };

  const uploadExcelData = async (rows) => {
    if (rows !== null) {
      setUploadLoader(true);
      try {
        rows.forEach((element, i) => {
          mainData.push(rows[i]);
        });
        // setLoader(true);
        const jsonToPost = {
          mainData: mainData,
          type: 'cables',
        };
        axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.uploadCustPreAssembleData}`,
            jsonToPost,
            {}
          )
          .then(function (response) {
            console.log('rrrrrrrrrrr', response);
            if (response.data.data.message === 'Data Uploaded Successfully!') {
              setUploadResponse(response.data.data);
              setFileName(null);
              setUploadData(false);
              showModal(response.data.data);
            } else if (
              response.data.data.message ===
              'Invalid Excel Format! Please check the column header names again'
            ) {
              setUploadData(false);
              setFileName(null);
              showModal(response.data.data);
            } else {
              setUploadData(false);
              setFileName(null);
              //console.log("error FROM RESPONSE AddFilterModal::::: ");
            }
          })
          .catch((error) => {
            setFileName(null);
            setUploadData(false);
            console.log('API error in sending file :::::', error);
            // setLoader(false);
          });
      } catch (error) {
        setUploadData(false);
        setFileName(null);
        console.log('error', error);
      } finally {
        setFile([]);
        mainData = [];
      }
    }
  };

  return (
    <>
      <Row className={styles.mainRow}>
        <Col>
          <p className={styles.topLittle}>Customizable Cables</p>
        </Col>
        {/* <Col className={styles.addProductButton} style={{display: 'flex'}}>
        <Button
          className="dashboard-addNewProduct"
          onClick={() => {
            showAddProduct();
          }}
          icon={<PlusOutlined />}
        >
          Add New Product
        </Button>
      </Col> */}
        <Col className={styles.addProductButton}>
          <div
            style={{display: 'flex', justifyContent: 'flex-end'}}
            id="upload-div"
          >
            <Upload
              listType="picture-card"
              customRequest={saveImage}
              showUploadList={false}
              beforeUpload={beforeUpload}
              className={styles.Upload}
            >
              <div className={styles.UploadInput}>
                {loading ? <LoadingOutlined /> : <UploadOutlined />}
                <div>Select File</div>
              </div>
            </Upload>

            {/* <Input
          type="file"
          onChange={handleUploadFile}
          style={{width: 200, padding: 3, marginRight: 15, height: 34}}
        /> */}
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleClickUpload}
              loading={loading}
              disabled={filename ? false : true}
            >
              Upload
            </Button>
          </div>
          {filename && (
            <div className={styles.SelectFile}>
              <span className={styles.Icon}>
                <FileOutlined />
              </span>

              <span className={styles.FileName}>{filename}</span>
            </div>
          )}
        </Col>
      </Row>
      {uploaddata && (
        <Spin tip="Please Wait...." size="large" className={styles.Spin}>
          <div className="content" />
        </Spin>
      )}
    </>
  );
};

export default Header;
