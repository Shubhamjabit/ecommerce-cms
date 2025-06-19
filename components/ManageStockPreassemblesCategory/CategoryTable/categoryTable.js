import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
// import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import axios from 'axios';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
const TableUi = ({
  pageSize,
  showEditModal,
  editcategoryflag,
  addcategoryflag,
  showDeleteModal,
  deletebannerflag,
  rs,
  setRs,
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
  const getCategory = async (tablePagination, PageSize) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
        key: searchkey,
        type: 'stockPreassemblesCategory',
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getCategoryTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setCategory(
          data.data.data.categorytablecms.data.filter((i) => i.level === 1)
        );
        setCategoryTotal(data.data.data.categorytablecms.total);
        setLoading(false);

        return {state: true, message: 'sucess'};
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getCategory(tablePagination, PageSize);
  }, [tablePagination, rs]);

  useEffect(() => {
    if (editcategoryflag || addcategoryflag) {
      getCategory(tablePagination, PageSize);
    }
  }, [editcategoryflag, addcategoryflag]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
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
  const categoryData = (item) => {
    return item.map((category, index) => {
      return {
        key: index + 1,
        name: category.name.split('/').pop(),
        priority: category.priority,
        status: btnSelector(category.status),
        actions: (
          <ActionButton
            showEditModal={showEditModal}
            category={category}
            showDeleteModal={showDeleteModal}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      align: 'center',
    },

    {
      title: 'Category Position',
      dataIndex: 'priority',
      align: 'center',
    },
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
  // console.log('!!!!!!!!!!category', category);
  return (
    <>
      <Table
        columns={columns}
        dataSource={category ? categoryData(category) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: category ? categorytotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
