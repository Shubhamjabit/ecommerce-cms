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
  const [filter, setFilter] = useState(null);
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(100);
  const [isModalCloseable, setIsModalCloseable] = useState(true);

  const getCategory = async () => {
    {
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getCategoryRelatedData}`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setCategories(data.data.data.categorycms);
        setFilter(data.data.data.categoryfiltercms);

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
    if (isModalCloseable) {
      setEditVisible(false);
    }
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
            Editcategoryflag={Editcategoryflag}
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
            filter={filter}
            Editcategoryflag={Editcategoryflag}
            categories={categories}
            setIsModalCloseable={setIsModalCloseable}
          />
          <AddCategoryModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            categories={categories}
            filter={filter}
            Addcategoryflag={Addcategoryflag}
          />
        </div>
      </Row>
    </>
  );
};

export default CategoryPage;
