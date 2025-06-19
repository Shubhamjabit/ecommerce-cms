import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
// import ActionButton from './components/ActionButton';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import axios from 'axios';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser';
import Router from 'next/router';
import moment from 'moment-timezone';

const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  deletecontentflag,
}) => {
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [content, setContentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const getContent = async (tablePagination, PageSize) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getContentTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );

        setContentInfo(data.data.data.contentData);
        setLoading(false);

        return {state: true, message: 'sucess'};
      } catch (error) {
        setLoading(false);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getContent(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    if (deletecontentflag) {
      getContent(tablePagination, PageSize);
    }
  }, [deletecontentflag]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const btnSelector = (status) => {
    if (status == 1) {
      return <PublishButton />;
    } else {
      return <HiddenButton />;
    }
  };
  const ContentInfoData = (content) => {
    return content.data.map((content, index) => {
      return {
        key: index + 1,
        page_title: content.page_title,
        page_url: content.page_url,
        status: btnSelector(content.status),
        page_content: ReactHtmlParser(content.page_content),
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            content={content}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'S No.',
      dataIndex: 'key',
      width: '100px',
      align: 'center',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Page Title',
      dataIndex: 'page_title',
      align: 'center',
      width: '200px',
    },
    {
      title: 'Page URL',
      dataIndex: 'page_url',
      align: 'center',
      width: '200px',
    },
    // {
    //   title: 'Page Content',
    //   dataIndex: 'page_content',

    // },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
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
        dataSource={content ? ContentInfoData(content) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: content ? content.total : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
