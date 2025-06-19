import React, {useState, useEffect} from 'react';
import {Table, Space} from 'antd';
import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import {cmsendPoint, envUrl} from '../../../../../../utils/factory'
import axios from 'axios';
import moment from 'moment-timezone';
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
  const [banner, setMainBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateBannerStatus = useSelector(
    (state) => state.bannersecondReducer.response
  );
  console.log('updateBannerStatus' + updateBannerStatus);

  useEffect(() => {
    if (updateBannerStatus) {
      Router.push('/manage/home-page?tab=2');
    }

      getBannerMain(tablePagination,
        tPageSize,
   );
  }, [tablePagination]);

  useEffect(() => {
    getBannerMain( tablePagination,
         tPageSize,
    );
  }, [updateBannerStatus]);


  // useEffect(() => {
  //   if (data) {
  //     setMainBanner(data.homebannersmain);
  //   }
  // }, [data]);


  const getBannerMain = async (
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
          `${envUrl.baseUrl}${cmsendPoint.getmainbanner}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
  console.log('Response DATA::::::::::::::::::' , data.data.data[0].homebannersmain);

        // setData(data);
        setMainBanner(data.data.data[0].homebannersmain);
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
  //let currentdate = moment().tz('Australia/Sydney').format('YYYY-MM-DD HH:mm:ss');
  //console.log('datetime ::::::::::::::::' + currentdate);
  const homebannersecondData = (homebannersecond) => {
    return homebannersecond.data.map((banner) => {
      return {
        key: banner.id,
        date_created: moment(banner.created_at).format('DD MMM YYYY - HH:mm a'),
        title: banner.title,
        buttonurl: banner.button_url,
        position: banner.position,
        image: banner.url,
        tabimage: banner.tab_url,
        mobileimage: banner.mobile_url,
        status: btnSelector(banner.status),
        date: [
          moment(banner.from_date)
            .utcOffset('+00:00')
            .format('YYYY-MM-DD HH:mm:ss') +
            '  - To -  ' +
            moment(banner.to_date)
              .utcOffset('+00:00')
              .format('YYYY-MM-DD HH:mm:ss'),
        ],
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
    },
    {
      title: 'Schedule Date',
      dataIndex: 'date',
    },
    {
      title: 'URL',
      dataIndex: 'buttonurl',
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Web Image',
      dataIndex: 'image',
      render: (theimage) => (
        <Image
          width={100}
          alt={process.env.BANNER_CDN_URL + theimage}
          src={process.env.BANNER_CDN_URL + theimage}
        />
      ),
    },
    // {
    //   title: 'Tab Image',
    //   dataIndex: 'tabimage',
    //   render: (theimage) => (
    //     <Image
    //       width={100}
    //       alt={process.env.BANNER_CDN_URL + theimage}
    //       src={process.env.BANNER_CDN_URL + theimage}
    //     />
    //   ),
    // },
    // {
    //   title: 'Mobile Image',
    //   dataIndex: 'mobileimage',
    //   render: (theimage) => (
    //     <Image
    //       width={100}
    //       alt={process.env.BANNER_CDN_URL + theimage}
    //       src={process.env.BANNER_CDN_URL + theimage}
    //     />
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
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
