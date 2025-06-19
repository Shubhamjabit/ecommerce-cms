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
// import * as XLSX from 'xlsx';
import {read, utils, writeFile} from 'xlsx';
// import ExcelJS from 'exceljs';
import {Workbook, ValueType} from 'exceljs';

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
          type: 'terminals',
        };
        axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.uploadCustPreAssembleData}`,
            jsonToPost,
            {}
          )
          .then(function (response) {
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

  const handleClickUploadNew = (event) => {
    console.log('event', event);
    const file = event.target.files[0];
    // const file = event.target.file;
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        console.log('File has been read successfully.', e.target);
        const data = e.target.result;
        // console.log('ffffffffffff', file);
        const workbook = read(data, {type: 'binary'});
        // const workbook = XLSX.readFile(data, {type: 'binary'});
        // const workbook = XLSX.read(file, {type: 'binary'});
        console.log('Workbook:', workbook);

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = utils.sheet_to_json(worksheet, {raw: true});
          console.log('Sheet Data:', sheetData);

          // Process the sheetData to extract images or perform other actions
        });
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleClickUploadNewNew = async (event) => {
    console.log('event', event.target);
    const file = event.target.files[0];

    if (file) {
      // const workbook = new ExcelJS.Workbook();
      console.log('File has been read successfully.', file);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      // reader.onload = async (e) => {
      // const buffer = reader.result;
      // const data = e.target.result;
      const workbook = new Workbook();

      // await workbook.xlsx.readFile(file);
      // await workbook.xlsx.read(file);
      // await workbook.xlsx.readFile(file);
      // await workbook.xlsx.readFile(data);
      await workbook.xlsx.readFile(file);

      workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row) => {
          row.eachCell(async (cell) => {
            // if (cell.type === ExcelJS.ValueType.String) {
            if (cell.type === ValueType.String) {
              if (cell.value && cell.value.includes('base64,')) {
                const imageData = cell.value.split('base64,')[1];

                // Process imageData as needed (e.g., display or save the image)
                console.log('iiiiiiiiiiii', imageData);
              }
            }
            console.log('ccccccccc', cell);
          });
        });
      });

      // workbook.xlsx.load(buffer).then(() => {
      //   const worksheet = workbook.getWorksheet(1);
      //   // const rowCount = worksheet.getColumn(1).values;
      //   // const columnCount = worksheet.getRow(1);
      //   // //  validate table data
      //   // console.log(rowCount);
      //   // console.log(columnCount);
      //   // // resolve('Excel file is valid.');
      //   worksheet.eachRow((row) => {
      //     row.eachCell(async (cell) => {
      //       // if (cell.type === ExcelJS.ValueType.String) {
      //       if (cell.type === ValueType.String) {
      //         if (cell.value && cell.value.includes('base64,')) {
      //           const imageData = cell.value.split('base64,')[1];

      //           // Process imageData as needed (e.g., display or save the image)
      //           console.log('iiiiiiiiiiii', imageData);
      //         }
      //       }
      //       console.log('ccccccccc', cell);
      //     });
      //   });
      // });
      // };
    }
  };

  return (
    <>
      <Row className={styles.mainRow}>
        <Col>
          <p className={styles.topLittle}>Customizable Terminals</p>
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
            {/* <input type="file" accept=".xlsx" onChange={handleClickUploadNew} /> */}
            {/* <input
              type="file"
              accept=".xlsx"
              onChange={handleClickUploadNewNew}
            /> */}
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              // onClick={handleClickUpload}
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
