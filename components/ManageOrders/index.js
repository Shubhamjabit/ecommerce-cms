import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Col, Row, Divider, Avatar, Button, List, Skeleton} from 'antd';
import {cmsendPoint, envUrl} from '../../utils/factory';
import axios from 'axios';
import {Collapse} from 'antd';
import OrderDetails from './components/OrderDetails/OrderDetails';
import Header from './Header/Header';
import TableUi from './ManageOrdersTable/manageordersTable';
import PrintIcon from '@mui/icons-material/Print';
import ReactToPrint from 'react-to-print';
const {Panel} = Collapse;

function ManageOrders() {
  // hooks
  const [initLoading, setInitLoading] = useState(true);

  const [ordersList, setOrdersList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [ordersListTotal, setOrdersListTotal] = useState(null);
  const [isOrdersList, setIsOrdersList] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [refreshOrdersList, setRefreshOrdersList] = useState(0);

  const getOrdersList = async () => {
    setLoading(true);
    try {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
      };
      await axios
        .post(
          `${envUrl.baseUrl}${cmsendPoint.getOrdersList}`,
          variables,
          {},
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(function (response) {
          if (response && response.status == 200) {
            setOrdersList(response.data.data.data);
            setOrdersListTotal(response.data.data.total);
            setOriginalList(response.data.data.data);
            setInitLoading(false);
            setLoading(false);
          } else if ((response.status = 204)) {
            console.log('EMPTY DATA!');
            setInitLoading(false);
            setLoading(false);
          }
        })
        .catch(function (error) {
          console.log(error.message);
          setInitLoading(false);
          setLoading(false);
          return {state: false, message: error.message};
        });
    } catch (error) {
      console.log('error signIn:', error.message);
      setInitLoading(false);
      setLoading(false);
      return {state: false, message: error.message};
    }
  };
  useEffect(() => {
    getOrdersList();
  }, []);

  useEffect(() => {
    getOrdersList();
  }, [refreshOrdersList]);

  const handleMoreClick = (orderId) => {
    setOrderId(orderId);
    setIsOrdersList(!isOrdersList);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  useEffect(() => {
    getOrdersList(tablePagination, PageSize);
  }, [tablePagination]);

  return (
    <>
      <Row>
        <div className="card-body">
          <Header
            ordersList={ordersList}
            setOrdersList={setOrdersList}
            originalList={originalList}
            isOrdersList={isOrdersList}
            setPagination={setPagination}
            setOrdersListTotal={setOrdersListTotal}
          />
          {isOrdersList ? (
            <TableUi
              loading={loading}
              ordersListTotal={ordersListTotal}
              tablePagination={tablePagination}
              PageSize={PageSize}
              ordersList={ordersList}
              onChange={onChange}
              handleMoreClick={handleMoreClick}
            />
          ) : (
            <div style={{background: '#fff'}}>
              <OrderDetails
                orderId={orderId}
                setOrderId={setOrderId}
                isOrdersList={isOrdersList}
                setIsOrdersList={setIsOrdersList}
                refreshOrdersList={refreshOrdersList}
                setRefreshOrdersList={setRefreshOrdersList}
              />
            </div>
          )}
        </div>
      </Row>
    </>
  );
}

export default ManageOrders;
