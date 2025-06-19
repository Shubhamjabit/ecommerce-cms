import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
// import ActionButton from './components/ActionButton';
// import PublishButton from './components/PublishButton';
// import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import {GET_HEADER} from '../../../../graphql/Queries/HeaderInfoQueries';
import {imageURL} from '../../../../util/data';
import Router from 'next/router';
import moment from 'moment-timezone';

const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
}) => {
  const [getHeaderInfo, {loading, data, error}] = useLazyQuery(GET_HEADER);
  const [tablePagination, setPagination] = useState(1);
  const [tPageSize, setPageSize] = useState(10);
  const [header, setHeaderInfo] = useState(null);

  useEffect(() => {
    getHeaderInfo({
      variables: {
        page: tablePagination,
        pageSize: tPageSize,
      },
    });
  }, [tablePagination]);

  useEffect(() => {
    if (data) {
      setHeaderInfo(data.getHeaderInfoCms);
    }
  }, [data]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const HeaderInfoData = (getHeaderInfoCms) => {
    return getHeaderInfoCms.data.map((header) => {
      return {
        key: header.id,
        title: header.title,
        type: header.type,
        link: header.link,
        bg_code: (
          <span
            style={{
              padding: '4px',
              background: '#fff',
              border: '1px solid #bebebe',
              display: 'block',
              borderRadius: '3px',
              width: '90px',
            }}
          >
            <small
              style={{
                background: header.bg_code,
                display: 'block',
                width: '100%',
                height: '20px',
              }}
            ></small>
          </span>
        ),
        font_color_code: (
          <span
            style={{
              padding: '4px',
              background: '#fff',
              border: '1px solid #bebebe',
              display: 'block',
              borderRadius: '3px',
              width: '90px',
            }}
          >
            <small
              style={{
                background: header.font_color_code,
                display: 'block',
                width: '100%',
                height: '20px',
              }}
            ></small>
          </span>
        ),
        date: [
          moment(header.from_date)
            .utcOffset('+00:00')
            .format('YYYY-MM-DD HH:mm:ss') +
            '  - To -  ' +
            moment(header.to_date)
              .utcOffset('+00:00')
              .format('YYYY-MM-DD HH:mm:ss'),
        ],
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            header={header}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Schedule',
      dataIndex: 'date',
    },
    {
      title: 'Header Text',
      dataIndex: 'title',
    },
    {
      title: 'Redirect Link',
      dataIndex: 'link',
    },
    {
      title: 'background color',
      dataIndex: 'bg_code',
    },
    {
      title: 'Font color',
      dataIndex: 'font_color_code',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={header ? HeaderInfoData(header) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: tPageSize,
          total: header ? header.total : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
