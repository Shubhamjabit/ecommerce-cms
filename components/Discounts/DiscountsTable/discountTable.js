import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
import ActionButton from './components/ActionButton';
import {GET_DISCOUNTS} from '../../../graphql/Queries/DiscountQueries/index';

const TableUi = () => {
  const [getDiscounts, {loading, data, error}] = useLazyQuery(GET_DISCOUNTS);

  const [tablePagination, setPagination] = useState(1);
  const [tPageSize, setPageSize] = useState(10);
  const [discounts, setDiscounts] = useState(null);

  useEffect(() => {
    getDiscounts({
      variables: {
        page: tablePagination,
        pageSize: tPageSize,
      },
    });
  }, [tablePagination]);

  useEffect(() => {
    if (data) {
      setDiscounts(data.discounts);
    }
  }, [data]);

  const DiscountsData = (discounts) => {
    return discounts.map((discount) => {
      return {
        key: discount.id,
        discountId: discount.id,
        addedDate: '2020-01-01',
        discountName: discount.name,
        precentage: discount.percentage,
        productCount: 10,
        expireDate: discount.expireDate,
        actions: <ActionButton />,
      };
    });
  };
  const onChange = (pagination, filters, sorter, extra) => {
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const columns = [
    {
      title: 'Discount ID',
      dataIndex: 'discountId',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Discount Name',
      dataIndex: 'discountName',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: 'Precentage',
      dataIndex: 'precentage',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: 'Product Count',
      dataIndex: 'productCount',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
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
        dataSource={discounts ? DiscountsData(discounts) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: tPageSize,
          total: discounts ? 10 : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
