import React, { Component } from "react";

const RelatedProduct = () => {
  return (
    < div className="related-product-item">
      <div className="row col-12 related-product-item-top-name">Product 1</div>
      <div className="row col-12 ">
        <div class="col-2 related-product-item-image">
          <img src={"product/koala-prod-1.jpg"} width={63} />
        </div>
        <div className="col-6">
          <div className="related-product-item-name">
            Bruce 2 seater Electric Recliner
          </div>
          <div className="related-product-item-price">$3,598.00</div>
        </div>
        <div className="col-4 related-product-item-button">
          <div>Remove</div>
        </div>
      </div>
    </ div>
  );
};

export default RelatedProduct;
