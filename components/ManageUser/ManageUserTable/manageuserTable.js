import React, {useState, useEffect} from 'react';
import {Table, Input, Tag} from 'antd';
// import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons';
import axios from 'axios';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showCreateVoucher,
  activeflag,
  inactiveflag,
  showVLModal,
  showCreateDiscount,
  showDLModal,
  rs,
  setRs,
}) => {
  // const [getCategoryBanner, {loading, data, error}] = useLazyQuery(
  //   GET_CATEGORIES,
  //   {
  //     fetchPolicy: 'network-only',
  //   }
  // );

  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchkey, setSearchKey] = useState('');
  const [usertotal, setUserTotal] = useState(null);
  const [totalcount, setTotalCount] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const getUser = async (tablePagination, PageSize) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
        key: searchkey,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getUserTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setUser(data.data.data.usertablecms.data);
        setUserTotal(data.data.data.usertablecms.total);
        setLoading(false);

        return {state: true, message: 'sucess'};
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  useEffect(() => {
    getUser(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    if (inactiveflag || activeflag) {
      getUser(tablePagination, PageSize);
    }
  }, [inactiveflag, activeflag, rs]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const userData = (item) => {
    return item.map((user, index) => {
      return {
        key: index + 1,
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        password: (
          <Input.Password
            style={{width: 'auto'}}
            value={user.password}
            defaultValue={user.password}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        ),
        status:
          user.status == 1 ? (
            <Tag color="#87d068">Active</Tag>
          ) : (
            <Tag color="#f50">Inactive</Tag>
          ),
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            user={user}
            showCreateVoucher={showCreateVoucher}
            showVLModal={showVLModal}
            showCreateDiscount={showCreateDiscount}
            showDLModal={showDLModal}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Sno',
      dataIndex: 'key',
      align: 'center',
    },

    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
    },
    // {
    //   title: 'Password',
    //   dataIndex: 'password',
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      align: 'center',
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={user ? userData(user) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: user ? usertotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
