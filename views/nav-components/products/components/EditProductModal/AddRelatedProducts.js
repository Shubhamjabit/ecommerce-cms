import { CRow } from "@coreui/react";
import React, { Component } from "react";
import SearchTextbox from "../../../../../Components/SearchTextbox/SearchTextbox";
import RelatedProduct from "./RelatedProduct";

const AddRelatedProducts = () => {
  return (
    <div className="add-relatedProducts-modal">
      <CRow>
        <p className="add-relatedProducts-top-text">Add Related Products</p>
      </CRow>
      <CRow className="add-relatedProducts-searchBox">
        <SearchTextbox
          placeholder="search products"
          onSearch={(value) => console.log(value)}
          style={{ width: 250 }}
          className="userSearch"
        />
      </CRow>
      <RelatedProduct />
      <RelatedProduct />
      <RelatedProduct />
    </div>
  );
};

export default AddRelatedProducts;
