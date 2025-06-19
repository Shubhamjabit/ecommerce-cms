import {
  Upload,
  Form,
  Result,
  message,
  Input,
  Card,
  Button,
  Radio,
  Switch,
  Modal,
  Statistic,
  Row,
  Col,
  Select,
  InputNumber,
  Popconfirm,
} from 'antd';
import React from 'react';
import FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import {PlusOutlined, DownloadOutlined} from '@ant-design/icons';
function Excelexport({fileName, excelData, stlyes}) {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const fileExtension = 'xlsx';

  const exporToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = {Sheets: {data: ws}, SheetNames: ['data']};
    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const confirm = (e) => {
    console.log(e);
    exporToExcel(fileName);
    message.success('This file has been downloaded successfully');
  };

  return (
    <div style={{marginRight: '10px'}}>
      <Popconfirm
        title="Are you sure download the product excel file?"
        // description="Are you sure to delete this task?"
        description=""
        onConfirm={confirm}
        okText="Yes"
        cancelText="No"
      >
        <Button className="dashboard-addNewProduct" icon={<DownloadOutlined />}>
          Export To Excel
        </Button>
      </Popconfirm>
    </div>
  );
}

export default Excelexport;
