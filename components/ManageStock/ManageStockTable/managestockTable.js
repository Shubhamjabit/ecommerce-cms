import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  editcategoryflag,
  addcategoryflag,
}) => {
  // const [getCategoryBanner, {loading, data, error}] = useLazyQuery(
  //   GET_CATEGORIES,
  //   {
  //     fetchPolicy: 'network-only',
  //   }
  // );

  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [stocklist, setStockList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchkey, setSearchKey] = useState('');
  const [categorytotal, setCategoryTotal] = useState(null);
  const [totalcount, setTotalCount] = useState(null);

  const getProductStock = async (tablePagination, PageSize) => {
    setLoading(true);

    const variables = {
      page: tablePagination,
      pageSize: PageSize,
      key: searchkey,
    };
    try {
      const data = await axios.post(
        `${envUrl.baseUrl}${cmsendPoint.getstocktable}`,
        variables,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      // setData(data);
      setStockList(data.data.data.productStock.data);

      setLoading(false);

      return {state: true, message: 'sucess'};
    } catch (error) {
      console.log('error signIn:', error.message);
      return {state: false, message: error.message};
    }
  };

  useEffect(() => {
    getProductStock(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    if (editcategoryflag || addcategoryflag) {
      getProductStock(tablePagination, PageSize);
    }
  }, [editcategoryflag, addcategoryflag]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const stockData = (item) => {
    return item.map((stocklist, index) => {
      return {
        key: index + 1,
        date: moment(stocklist.date).format('YYYY-DD-MM HH:mm:ss'),
        total_item: stocklist.total_item,
        total_insert: stocklist.total_insert,
        total_update: stocklist.total_update,
      };
    });
  };

  const columns = [
    {
      title: 'S.No.',
      dataIndex: 'key',
      align: 'center',
    },

    {
      title: 'Date & Time',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: 'Total Item',
      dataIndex: 'total_item',
      align: 'center',
    },
    {
      title: 'Total Insert',
      dataIndex: 'total_insert',
      align: 'center',
    },
    {
      title: 'Total Update',
      dataIndex: 'total_update',
      align: 'center',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={stocklist ? stockData(stocklist) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: stocklist ? stocklist.length : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
