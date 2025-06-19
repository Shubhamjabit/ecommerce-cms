import React, {useState, useEffect} from 'react';
import {Table, Tag, Space} from 'antd';
import PublishButton from './PublishButton';
import HiddenButton from './HiddenButton';
import {Image} from 'antd';
import ActionButton from './ActionButton';
import axios from 'axios';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  editcategoryflag,
  addcategoryflag,
  refreshState,
}) => {
  // const [getCategoryBanner, {loading, data, error}] = useLazyQuery(
  //   GET_CATEGORIES,
  //   {
  //     fetchPolicy: 'network-only',
  //   }
  // );

  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchkey, setSearchKey] = useState('');
  const [categorytotal, setCategoryTotal] = useState(null);
  const [totalcount, setTotalCount] = useState(null);
  const [responseData, setResponseData] = useState(null);
  // console.log('&&&&&&&&&&&&&&&&&&& filtertable resresponseData', responseData);

  async function getFilters(tablePagination, PageSize) {
    setLoading(true);
    const variables = {
      page: tablePagination,
      pageSize: PageSize,
      key: searchkey,
    };
    try {
      const response = await axios.post(
        `${envUrl.baseUrl}${cmsendPoint.getFiltersAccordingToCategory}`,
        variables,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('!! getFilters', response);
      setResponseData(response.data.data);
      setCategoryTotal(response.data.total);
      return {state: true, message: 'sucess'};
    } catch (error) {
      console.log('error signIn:', error.message);
      return {state: false, message: error.message};
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getFilters(tablePagination, pageSize);
  }, [refreshState, tablePagination]);

  const onChange = (pagination, filters, sorter, extra) => {
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };
  const btnSelector = (status) => {
    if (status === 1) {
      return <PublishButton />;
    } else {
      return <HiddenButton />;
    }
  };
  const tableDataSource = () => {
    let x = responseData.map((data, index) => {
      return {
        key: index + 1,
        categoryName: data.categoryName,
        filterName: data.filterName,
        status: btnSelector(data.status),
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            data={data}
          />
        ),
      };
    });
    return x;
  };
  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      align: 'center',
    },

    {
      title: 'Filters Associated',
      dataIndex: 'filterName',
      key: 'filterName',
      align: 'center',
      render: (_, {filterName}) => (
        <>
          {filterName?.map((name) => {
            return <Tag color={'blue'}>{name.toUpperCase()}</Tag>;
          })}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={responseData ? tableDataSource() : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: responseData ? categorytotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
