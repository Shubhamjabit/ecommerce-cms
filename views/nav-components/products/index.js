import React, { useState } from "react";
import { CRow } from "@coreui/react";
import TableUi from "./components/ProductTable/ProductsTable";
import EditProductModal from "./components/EditProductModal/EditProductModal";
import Header from "./components/Header/Header";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../../graphql/Queries/Product";
const Products = () => {
  const [visible, setVisible] = useState(false);
  const [productData, setProductData] = useState(null);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  useEffect(() => {
    if (data) {
      setProductData(data);
    }
  }, [data]);

  return (
    <>
      <div className="card">
        <Header showModal={showModal} />
        <div className="card-body">
          {productData && !error ? <TableUi data={productData} /> : <></>}
        </div>
        <EditProductModal
          handleOk={handleOk}
          handleCancel={handleCancel}
          visible={visible}
        />
      </div>
    </>
  );
};

export default Products;
