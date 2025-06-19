import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import ProductTableData from './ProductTableData';
import AddProductModal from './AddProductModal/AddProductModal';
import EditProductModal from './EditProductModal/EditProductModal';
const ProductFilters = () => {
  const [visibleaddproduct, setVisibleAddProduct] = useState(false);
  const [visibleeditproduct, setVisibleEditProduct] = useState(false);
  const [visibleproduct, setVisibleProduct] = useState(true);
  const showAddProduct = () => {
    setVisibleAddProduct(true);
    setVisibleProduct(false);
  };
  const handleAddProduct = (e) => {
    setVisibleAddProduct(false);
    setVisibleProduct(true);
  };
  const showEditProduct = () => {
    setVisibleProduct(false);
    setVisibleEditProduct(true);
  };
  const handleEditProduct = (e) => {
    setVisibleEditProduct(false);
    setVisibleProduct(true);
  };
  const showProduct = () => {
    setVisibleProduct(false);
  };
  const handleProduct = (e) => {
    setVisibleProduct(false);
  };
  return (
    <>
      {visibleproduct && (
        <ProductTableData
          showAddProduct={showAddProduct}
          showEditProduct={showEditProduct}
        />
      )}

      {visibleaddproduct && (
        <AddProductModal handleAddProduct={handleAddProduct} />
      )}

      {visibleeditproduct && (
        <EditProductModal handleEditProduct={handleEditProduct} />
      )}
    </>
  );
};

export default ProductFilters;
