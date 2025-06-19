import {Row} from 'antd';
import React, {Component} from 'react';
// import {getProducts} from '../../../DummyDatas/Products';
import SearchTextbox from '../../../../Shared/SearchBox/SearchTextbox';

import RelatedProduct from './RelatedProduct';
import RelatedProductsTable from './RelatedProductTable';

const AddRelatedProducts = () => {
  // const data = getProducts();

  return (
    <div className="add-relatedProducts-modal">
      <Row>
        <p className="add-relatedProducts-top-text">Add Products</p>
      </Row>
      <Row className="add-relatedProducts-searchBox">
        <SearchTextbox
          placeholder="search products"
          onSearch={(value) => console.log(value)}
          style={{width: 250}}
          className="userSearch"
        />
      </Row>
      <RelatedProductsTable data={null} />
    </div>
  );
};

export default AddRelatedProducts;
