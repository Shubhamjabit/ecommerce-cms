import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TableUI from './PreassemblesTable/PreassembleTable';
import Header from './Header/Header';
import {Row} from 'antd';
import SelectionBar from './SelectionBar/SelectionBar';
import Loader from '../../Shared/Loader/Loader';
import {cmsendPoint, envUrl} from '../../utils/factory';
import DeletePopup from './PreassemblesTable/components/DeletePopup';
import DataModal from './PreassemblesTable/DataModal/DataModal';

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
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [preassembleData, setPreassembleData] = useState(null);

  const onChange = (pagination, filters, sorter, extra) => {
    setCurrentPage(pagination.current);
  };

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

  const showModal = (data) => {
    setVisible(true);
    setPreassembleData(data);
    setAddcategoryflag(false);
  };

  const handleOk = (e) => {
    setPreassembleData(null);
    setVisible(false);
  };

  const handleCancel = (e) => {
    setPreassembleData(null);
    setVisible(false);
  };
  const showEditModal = () => {
    setEditVisible(true);
    setEditcategoryflag(false);
  };
  const editHandleOk = (e) => {
    setEditVisible(false);
  };

  const editHandleCancel = (e) => {
    setEditVisible(false);
  };

  const Editcategoryflag = (e) => {
    setEditcategoryflag(true);
  };
  const Addcategoryflag = (e) => {
    setAddcategoryflag(true);
  };

  return (
    <>
      <Row>
        <div className="card-body">
          <Header showModal={showModal} />
          <SelectionBar
            handleOnChange={handleOnChange}
            setPublishSort={setPublishSort}
            setHiddenSort={setHiddenSort}
            clearAll={clearAll}
          />
          <TableUI
            showDeleteModal={showDeleteModal}
            filter={filter}
            showAddModal={showAddModal}
            searchkeyword={searchkeyword}
            deletebannerflag={deletebannerflag}
            showEditProduct={showEditProduct}
          />
          <DeletePopup
            handleOk={deleteHandleOk}
            handleCancel={deleteHandleCancel}
            visible={deleteVisible}
            DeleteBannerflag={DeleteBannerflag}
          />
          <DataModal
            preassembleData={preassembleData}
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            Addcategoryflag={Addcategoryflag}
          />
        </div>
      </Row>
    </>
  );
};

export default ProductTableData;
