import React, {useState, useEffect} from 'react';
import {Table} from 'antd';
import ActionButton from './components/ActionButton';
import moment from 'moment';

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const TableUi = ({
  pageSize,
  ordersList,
  handleMoreClick,
  loading,
  PageSize,
  tablePagination,
  ordersListTotal,
  onChange,
}) => {
  console.log(' OOOOOOOOOOOOOOOOOOOOO ordersList =', ordersList);
  const [selectionType, setSelectionType] = useState('checkbox');

  const orderData = (item) => {
    return item.map((ordersList, index) => {
      return {
        key: index + 1,
        quoteId: ordersList.quoteId,
        // status: ordersList.status,
        // amount: ordersList.totalAmount,
        // date: ordersList.createdDate,
        date: ordersList.created_at,
        actions: (
          <ActionButton
            quoteId={ordersList.quoteId}
            handleMoreClick={handleMoreClick}
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
      title: 'Quote ID',
      dataIndex: 'quoteId',
      align: 'center',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    // },
    // {
    //   title: 'Amount',
    //   dataIndex: 'amount',
    //   sorter: (a, b) => a.amount - b.amount,
    // },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      align: 'center',
      // sorter: (a, b) => a.date - b.date,
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (text) => (
        // <>{moment(text.split('T')[0]).format('Do MMM YYYY, h:mm:ss')}</>
        // <>{moment(text.split('T')[0]).format('Do MMM YYYY')}</>
        <> {moment(text).format('Do MMM YYYY HH:mm:ss ')}</>
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
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        columns={columns}
        dataSource={ordersList ? orderData(ordersList) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: ordersList ? ordersListTotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
