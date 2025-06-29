import {Row} from 'antd';
import React, {Component} from 'react';
import RelatedProductsTable from '../../Discounts/DiscountsTable/AddDiscountsModal/RelatedProductTable';

import SearchTextbox from '../../../Shared/SearchBox/SearchTextbox';
import RelatedProduct from './RelatedProduct';

const AddRelatedProducts = ({data}) => {
  return (
    <div className="add-relatedProducts-modal">
      {/* <Row>
        <p className="add-relatedProducts-top-text">Add Related Products</p>
      </Row>
      <Row className="add-relatedProducts-searchBox">
        <SearchTextbox
          placeholder="search products"
          onSearch={(value) => console.log(value)}
          style={{width: 250}}
          className="userSearch"
        />
      </Row> */}
      <RelatedProductsTable data={data} />
    </div>
  );
};

export default AddRelatedProducts;
