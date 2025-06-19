import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Row} from 'antd';
import Header from './components/Header/Header';
import TableUi from './components/FilterTable';
import EditFilterModal from './components/EditFilterModal/EditFilterModal';
import AddFilterModal from './components/AddFilterModal/AddFilterModal';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';

function ManageFiltersPage() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [filter, setFilter] = useState(null);
  const [editcategoryflag, setEditcategoryflag] = useState(false);
  const [addcategoryflag, setAddcategoryflag] = useState(false);
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(100);
  const [refreshState, setRefreshState] = useState(0);

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

  useEffect(async () => {
    // console.log(`${envUrl.baseUrl}${cmsendPoint.getCategoryRelatedData}`);
    try {
      await axios
        .post(
          `${envUrl.baseUrl}${cmsendPoint.getCategoryRelatedData}`,
          {},
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          // console.log('RESPONSE ===========>', response.data);
          setCategories(response.data.data.categorycms);
          setFilter(response.data.data.categoryfiltercms.data);
          return {state: true, message: 'sucess'};
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      return {state: false, message: error.message};
    }
  }, []);

  // console.log('REFRESH STATE*********************', refreshState);

  // console.log('!!!!!!!!!!!!!!!!!!CCCCCCCC', categories);
  // console.log('@@@@@@@@@@@@@@@@@FFFFFFFFF', filter);

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
            refreshState={refreshState}
          />
          <EditFilterModal
            handleOk={editHandleOk}
            handleCancel={editHandleCancel}
            visible={editVisible}
            Editcategoryflag={Editcategoryflag}
            categories={categories}
            refreshState={refreshState}
            setRefreshState={setRefreshState}
          />
          <AddFilterModal
            handleOk={handleOk}
            handleCancel={handleCancel}
            visible={visible}
            categories={categories}
            filter={filter}
            Addcategoryflag={Addcategoryflag}
            refreshState={refreshState}
            setRefreshState={setRefreshState}
          />
        </div>
      </Row>
    </>
  );
}

export default ManageFiltersPage;
