import React, {useState, useEffect} from 'react';
import TableUI from './ProductsTable/productsTable';
import Header from './Header/Header';
import {Row} from 'antd';
import SelectionBar from './SelectionBar/SelectionBar';
import Loader from '../../Shared/Loader/Loader';
import {cmsendPoint, envUrl} from '../../utils/factory';
import DeletePopup from './ProductsTable/components/DeletePopup';
import axios from 'axios';
import DuplicatePopup from './ProductsTable/components/DuplicatePopup';
const ProductTableData = ({showAddProduct, showEditProduct}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [productlist, setProducts] = useState(null);
  const [searchkeyword, setSearckKeyword] = useState(null);
  const [deletebannerflag, setDeleteBannerflag] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  //console.log('#############products', products);
  const [filter, setFilter] = useState(2);
  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
  };
  const [duplicatebannerflag, setDuplicateBannerflag] = useState(false);
  const [duplicateVisible, setDuplicateVisible] = useState(false);

  const showAddModal = () => {
    setVisible(true);
  };
  const handleAddOk = (e) => {
    setVisible(false);
  };

  const handleAddCancel = (e) => {
    setVisible(false);
  };
  // useEffect(() => {
  //   getCategory();
  //   getProduct();
  // }, []);

  const handleOnChange = (e) => {
    //setVisible(false);
    //console.log('#############products', e);
    // const searchQuery = e.target.value.trim();
    setSearckKeyword(e.target.value.trim());
  };

  // const getCategory = async () => {
  //   {
  //     try {
  //       const data = await axios
  //         .get(`${envUrl.baseUrl}${cmsendPoint.getCategoryListcms}`, {
  //           headers: {
  //             'Access-Control-Allow-Origin': '*',
  //             'Content-Type': 'application/json',
  //           },
  //         })
  //         .then((data) => {
  //           // setData(data);
  //           setCategories(data.data.data.categorycms.data);
  //           return {state: true, message: 'sucess'};
  //         });
  //     } catch (error) {
  //       console.log('error signIn:', error.message);
  //       return {state: false, message: error.message};
  //     }
  //   }
  // };

  // const getProduct = async () => {
  //   {
  //     try {
  //       const data = await axios
  //         .get(`${envUrl.baseUrl}${cmsendPoint.getProductListcms}`, {
  //           headers: {
  //             'Access-Control-Allow-Origin': '*',
  //             'Content-Type': 'application/json',
  //           },
  //         })
  //         .then((data) => {
  //           // setData(data);
  //           setProducts(data.data.data.productlistcms.data);
  //           return {state: true, message: 'sucess'};
  //         });
  //     } catch (error) {
  //       console.log('error signIn:', error.message);
  //       return {state: false, message: error.message};
  //     }
  //   }
  // };
  const showDeleteModal = () => {
    setDeleteVisible(true);
  };
  const showDuplicateModal = () => {
    setDuplicateVisible(true);
  };
  const setPublishSort = () => {
    setFilter(1);
  };
  const setHiddenSort = () => {
    setFilter(0);
  };
  const clearAll = () => {
    setFilter(2);
  };

  const deleteHandleOk = (e) => {
    setDeleteVisible(false);
  };

  const deleteHandleCancel = (e) => {
    setDeleteVisible(false);
    setDeleteBannerflag(false);
  };

  const DeleteBannerflag = (e) => {
    setDeleteBannerflag(true);
  };
  const duplicateHandleOk = (e) => {
    setDuplicateVisible(false);
  };

  const duplicateHandleCancel = (e) => {
    setDuplicateVisible(false);
    setDuplicateBannerflag(false);
  };

  const DuplicateBannerflag = (e) => {
    setDuplicateBannerflag(true);
  };
  return (
    <>
      <Row id="ProductCardbody">
        <div className="card-body">
          <Header showAddProduct={showAddProduct} />
          <SelectionBar
            handleOnChange={handleOnChange}
            setPublishSort={setPublishSort}
            setHiddenSort={setHiddenSort}
            clearAll={clearAll}
          />
          <TableUI
            showDeleteModal={showDeleteModal}
            showDuplicateModal={showDuplicateModal}
            showDupli
            filter={filter}
            showAddModal={showAddModal}
            searchkeyword={searchkeyword}
            deletebannerflag={deletebannerflag}
            duplicatebannerflag={duplicatebannerflag}
            showEditProduct={showEditProduct}
          />
          <DeletePopup
            handleOk={deleteHandleOk}
            handleCancel={deleteHandleCancel}
            visible={deleteVisible}
            DeleteBannerflag={DeleteBannerflag}
          />
          <DuplicatePopup
            handleOk={duplicateHandleOk}
            handleCancel={duplicateHandleCancel}
            visible={duplicateVisible}
            DuplicateBannerflag={DuplicateBannerflag}
          />
        </div>
      </Row>
    </>
  );
};

export default ProductTableData;
