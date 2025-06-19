import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import moment from 'moment';
import {cmsendPoint, envUrl} from '../../../../../../utils/factory'
import axios from 'axios';
import {useSelector} from 'react-redux';
import Router from 'next/router';

const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
}) => {
  
  const [tablePagination, setPagination] = useState(1);
  const [tPageSize, setPageSize] = useState(pageSize);
  const [banner, setBannerThird] = useState(null);
  const [loading, setLoading] = useState(false);


  const updateBannerStatus = useSelector(
    (state) => state.bannersecondReducer.response
  );
  console.log('updateBannerStatus' + updateBannerStatus);

  useEffect(() => {
    if (updateBannerStatus) {
      Router.push('/manage/home-page?tab=3');
    }
    getBannerThird(tablePagination,
       tPageSize,
     );
  }, [tablePagination]);

  useEffect(() => {
    getBannerThird( tablePagination,
          tPageSize,
    );
  }, [updateBannerStatus]);

  // useEffect(() => {
  //   if (data) {
  //     setProduct(null);
  //     setProduct(data.products.data);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (data) {
  //     getBannerThird(data.homebannerthird);
  //   }
  // }, [data]);



  const getBannerThird = async (
    tablePagination,
    pageSize,
  ) => {
    setLoading(true);
      const  variables = {
        page: tablePagination,
        pageSize: pageSize,
      };

      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getThirdBanner}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );

        // setData(data);
        setBannerThird(data.data.data[0].homebannerthird);
        setLoading(false);
        return {state: true, message: 'sucess'};
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
  };
 

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const btnSelector = (status) => {
    if (status === 'Publish') {
      return <PublishButton />;
    } else {
      return <HiddenButton />;
    }
  };

  const homebannersecondData = (homebannersecond) => {
    return homebannersecond.data.map((banner) => {
      return {
        key: banner.id,
        date: moment(banner.created_at).format('MM/DD/YYYY'),
        title: banner.title,
        buttonname: banner.button_name,
        buttonurl: banner.button_url,
        image: banner.url,
        status: btnSelector(banner.status),
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            banner={banner}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Banner Title',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Button Name',
      dataIndex: 'buttonname',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'URL',
      dataIndex: 'buttonurl',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Image',
      dataIndex: 'image',
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
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
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
        dataSource={banner ? homebannersecondData(banner) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: tPageSize,
          total: banner ? banner.total : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
