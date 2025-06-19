import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Table, Input, Tag, Statistic, InputNumber} from 'antd';
// import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons';
import axios from 'axios';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  processingflag,
  approvedflag,
  rejectedflag,
  pendingflag,
}) => {
  // const [getCategoryBanner, {loading, data, error}] = useLazyQuery(
  //   GET_CATEGORIES,
  //   {
  //     fetchPolicy: 'network-only',
  //   }
  // );

  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [credituser, setCreditUser] = useState(null);
  console.log('credituser', credituser);
  const [loading, setLoading] = useState(false);
  const [creditusertotal, setCreditUserTotal] = useState(null);
  const [totalcount, setTotalCount] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const getUser = async (tablePagination, PageSize) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
      };
      try {
        const data = await axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.getCreditMembersList}`,
            variables,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            console.log('^^^^^^^^^^^^^^ response', response);
            if (response.status == 200) {
              setCreditUser(response.data.data.usertablecms.data);
              setCreditUserTotal(response.data.data.usertablecms.total);
              setLoading(false);
              return {state: true, message: 'sucess'};
            } else {
              throw new ERROR('Empty Data');
            }
          });
      } catch (error) {
        console.log('error getCreditMembersList:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getUser(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    if (processingflag || rejectedflag || approvedflag || processingflag) {
      getUser(tablePagination, PageSize);
    }
  }, [processingflag, rejectedflag, approvedflag, processingflag]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  // const statusNameFunction = (status)=>{
  //   if(status == 0){
  //     return <Tag color="#87d068">Pending</Tag>
  //   }else if(status == 1){
  //     return <Tag color="#87d068">{user.status_Name}</Tag>
  //   }else if(status == 2){
  //     return <Tag color="#87d068">{user.status_Name}</Tag>
  //   }else if(status == 3){
  //     return <Tag color="#87d068">{user.status_Name}</Tag>
  //   }
  // }

  const downloadFile = (filePath, fileName = 'Example-PDF-file.pdf') => {
    console.log('???????????????', process.env.CREDIT_FILES_CDN_URL + filePath);
    fetch(process.env.CREDIT_FILES_CDN_URL + filePath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        console.log('blob', blob);
        // for some reason this is creating a txt file, so commenting
        // const url = window.URL.createObjectURL(new Blob([blob]));
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        link.parentNode.removeChild(link);
      });
  };

  const userData = (item) => {
    return item.map((credituser, index) => {
      return {
        key: index + 1,
        name:
          credituser.first_name.toUpperCase() +
          ' ' +
          credituser.last_name.toUpperCase(),
        status: credituser.status,
        creditLimit: credituser.creditLimit,
        method: credituser.method,
        file_url: credituser.file_url
          ? credituser.file_url
          : credituser.eForm_pdf_url,
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            credituser={credituser}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Sno',
      dataIndex: 'key',
      align: 'center',
    },

    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      align: 'center',
      // render: (method) => <span>{method == 1 ? 'Manual Form' : 'E-Form'}</span>,
    },
    {
      title: 'Download Form',
      dataIndex: 'file_url',
      align: 'center',
      render: (file_url) => (
        <>
          {/* <Link
          passHref={true}
          scroll={true}
          href={process.env.CREDIT_FILES_CDN_URL + file_url}
        >
          <a target="_blank">Click to view</a>
        </Link> */}
          <Button
            startIcon={<FileDownloadIcon />}
            onClick={() => downloadFile(file_url, 'CREDIT_FORM')}
          ></Button>
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status, row) => (
        <>
          {(() => {
            if (status == '0') {
              return (
                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  pending
                </Tag>
              );
            } else if (status == '1') {
              return (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  processing
                </Tag>
              );
            } else if (status == '2') {
              return (
                <>
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    approved
                  </Tag>
                  {console.log(`^^^^${row.creditLimit}`)}
                  <InputNumber
                    disabled
                    addonBefore="Credit Limit"
                    prefix="$"
                    style={{
                      width: '40%',
                    }}
                    value={parseFloat(row.creditLimit).toFixed(2)}
                    // onChange={handleChangeCreditLimit}
                  />
                </>
              );
            } else if (status == '3') {
              return (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  rejected
                </Tag>
              );
            }
          })()}
        </>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      align: 'center',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={credituser ? userData(credituser) : []}
        //dataSource={user ? user : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: credituser ? creditusertotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
