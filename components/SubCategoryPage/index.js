import React, {useState, useEffect} from 'react';
import {Row} from 'antd';
import Header from './Header/Header';
import TableUi from './CategoryTable/categoryTable';
import EditCategoryModal from './CategoryTable/EditCategoryModal/EditCategoryModal';
import AddCategoryModal from './CategoryTable/AddCategoryModal/AddCategoryModal';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
const CategoryPage = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(100);

  const getCategory = async (tablePagination, pageSize) => {
    {
      const variables = {
        page: tablePagination,
        pageSize: pageSize,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getCategorycms}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setCategories(data.data.data.categorycms);

        return {state: true, message: 'sucess'};
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getCategory(tablePagination, PageSize);
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     setCategories(data.getCategoryMenuHierachyCMS);
  //   }
  // }, [data]);
  const showModal = () => {
    setVisible(true);
    setAddcategoryflag(false);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
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
          <TableUi
            pageSize={10}
            showModal4={showEditModal}
            editcategoryflag={editcategoryflag}
            addcategoryflag={addcategoryflag}
          />
          {/* <AddBannerModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
          /> */}
          <EditCategoryModal
            handleOk={editHandleOk}
            handleCancel={editHandleCancel}
            visible={editVisible}
            Editcategoryflag={Editcategoryflag}
            categories={categories}
          />
          <AddCategoryModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            categories={categories}
            Addcategoryflag={Addcategoryflag}
          />
        </div>
      </Row>
    </>
  );
};

export default CategoryPage;
