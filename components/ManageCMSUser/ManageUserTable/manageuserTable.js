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
import {useDispatch} from 'react-redux';
import {setCmsUsers} from '../../../store/actions/userActions';
const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  activeflag,
  inactiveflag,
  rs,
  setRs,
  showDeleteModal,
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

  const dispatch = useDispatch();

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
          `${envUrl.baseUrl}${cmsendPoint.getCmsUserTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        dispatch(setCmsUsers(data.data.data.usertablecms.data));
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
  }, [tablePagination, rs]);

  useEffect(() => {
    if (inactiveflag || activeflag) {
      getUser(tablePagination, PageSize);
    }
  }, [inactiveflag, activeflag]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };

  const userData = (item) => {
    return item.map((user, index) => {
      return {
        key: index + 1,
        userId: user.admin_emailid,
        password: (
          <Input.Password
            style={{width: 'auto'}}
            value={user.admin_password}
            defaultValue={user.admin_password}
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
            showDeleteModal={showDeleteModal}
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
      title: 'User id',
      dataIndex: 'userId',
      align: 'center',
    },
    // {
    //   title: 'Password',
    //   dataIndex: 'password',
    //   align: 'center',
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
