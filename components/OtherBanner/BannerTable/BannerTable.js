import React, {useState, useEffect} from 'react';
import {Table, Input, Space} from 'antd';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import Router from 'next/router';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import moment from 'moment-timezone';
const {Search} = Input;
const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  editbannerflag,
  addbannerflag,
}) => {
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [bannerdata, setBannerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBanner = async (tablePagination, PageSize) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getBannerTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );

        setBannerData(data.data.data.bannerData.data);
        setLoading(false);

        return {state: true, message: 'sucess'};
      } catch (error) {
        setLoading(false);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getBanner(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    if (editbannerflag || addbannerflag) {
      getBanner(tablePagination, PageSize);
    }
  }, [editbannerflag, addbannerflag]);

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
  const bannerData = (bannerdata) => {
    return bannerdata.map((item, index) => {
      return {
        key: index + 1,
        title: item.title,
        priority: item.position,
        status: btnSelector(item.status),
        image: item.image,
        date: [
          moment(item.from_date)
            .utcOffset('+00:00')
            .format('DD-MM-YYYY HH:mm:ss') +
            '  - To -  ' +
            moment(item.to_date)
              .utcOffset('+00:00')
              .format('DD-MM-YYYY HH:mm:ss'),
        ],
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            banner={item}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      align: 'center',
    },

    {
      title: 'Image',
      dataIndex: 'image',
      align: 'center',
      render: (theimage) => (
        <Image
          width={100}
          alt={process.env.BANNER_CDN_URL + theimage}
          src={process.env.BANNER_CDN_URL + theimage}
        />
      ),
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'status',
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
        dataSource={bannerdata ? bannerData(bannerdata) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          ttotal: bannerdata ? bannerdata.total : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
