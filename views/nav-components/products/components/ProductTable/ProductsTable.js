import React from 'react';
import {Table} from 'antd';
import ImageColumn from './components/ImageColumn';
import ActionButton from './components/ActionButton';

const TableUi = ({data}) => {
  const products = data && data.products;

  const ProductsData = () => {
    return products.map((product) => {
      return {
        key: product.product_id,
        image: <ImageColumn />,
        productId: product.product_id,
        productName: product.product_name,
        price: 'price',
        mainCategory: product.product_category_category_id,
        subCategory: product.product_sub_category_sub_category_id,
        actions: <ActionButton />,
      };
    });
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('onChange');
  };

  console.log('products arry', ProductsData());

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: 'Main Category',
      dataIndex: 'mainCategory',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: 'Sub Category',
      dataIndex: 'subCategory',
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
        dataSource={ProductsData()}
        onChange={onChange}
      />
      ;
    </>
  );
};

export default TableUi;
