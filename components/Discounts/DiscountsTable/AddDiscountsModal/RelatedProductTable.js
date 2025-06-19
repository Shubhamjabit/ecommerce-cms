import React, {useState} from 'react';
import {Table, Radio, Divider, Tag} from 'antd';

const RelatedProductsTable = ({data}) => {
  const [selectionType, setSelectionType] = useState('checkbox');

  const relatedProducts = data;
  const ProductsData = () => {
    return relatedProducts.map((product) => {
      return {
        key: product.id,
        legacyId: product.legacy_id,
        productName: product.name,
        price: 'AED' + String(product.price),
      };
    });
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('onChange');
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    console.log(tags);
    this.setState({tags});
  };

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'key',
      render: (text, record) => {
        return `${record.legacyId}`;
      },
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
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
  ];

  return (
    <>
      {/* <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
        className="related-product-tag"
      >
        Bruce 2 seater Electric Recliner
           </Tag>
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
        className="related-product-tag"
      >
        Bruce 2 seater Electric Recliner
           </Tag>
      <Radio.Group
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
      >

      </Radio.Group>

      <Divider /> */}
      <Table
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        columns={columns}
        dataSource={ProductsData()}
        onChange={onChange}
        pagination={{pageSize: 5, position: 1, total: data.length - 1}}
        className="add-related-product"
      />
    </>
  );
};

export default RelatedProductsTable;
