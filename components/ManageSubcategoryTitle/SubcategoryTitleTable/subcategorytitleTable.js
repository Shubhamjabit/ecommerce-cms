import React, {useState, useEffect, useRef} from 'react';
import {Table, Input, Space, Button} from 'antd';
// import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import Router from 'next/router';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import {DeleteTwoTone, SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const {Search} = Input;

const TableUi = ({
  pageSize,
  showModal1,
  showModal2,
  showModal3,
  showModal4,
  editcategoryflag,
  addcategoryflag,
}) => {
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(50);
  const [subcategorytitledata, setSubCategoryTitleData] = useState(null);
  const [subcategorytitletotal, setSubCategoryTitleTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchkey, setSearchKey] = useState('');

  //console.log('############category#############', subcategorytitledata);

  //const categoryfilterdata = category && category.filter((i) => i.level === 2);
  const getCategory = async (tablePagination, PageSize) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
        key: searchkey,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getSubCategoryTitleTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setSubCategoryTitleData(data.data.data.subsubcategorytablecms.data);
        setSubCategoryTitleTotal(data.data.data.subsubcategorytablecms.total);
        setLoading(false);

        return {state: true, message: 'sucess'};
      } catch (error) {
        setLoading(false);
        // console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  const onhandelSearchKey = (value) => {
    setSearchKey(value);
  };

  useEffect(() => {
    if (searchkey) {
      getCategory(tablePagination, PageSize);
    }
  }, [searchkey]);

  useEffect(() => {
    getCategory(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    setLoading(true);
    if (editcategoryflag || addcategoryflag) {
      setTimeout(() => {
        getCategory(tablePagination, PageSize);
      }, 5000);
    }
  }, [editcategoryflag, addcategoryflag]);

  const onChange = (pagination, filters, sorter, extra) => {
    //console.log(filters,pagination);
    setPageSize(pagination.pageSize);
    setPagination(pagination.current);
  };
  const btnSelector = (status) => {
    if (status === 1) {
      return <PublishButton />;
    } else {
      return <HiddenButton />;
    }
  };
  const subcategorytitleData = (item) => {
    return item.map((subcategorytitledata, index) => {
      return {
        key: index + 1,
        subcategorytitle: subcategorytitledata.subcategory_title,
        categoryname: subcategorytitledata.name,
      };
    });
  };

  // custom filter by ishaan
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  //

  const columns = [
    {
      title: 'Sno',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryname',
      align: 'center',
      ...getColumnSearchProps('categoryname'),
    },
    {
      title: 'Subcategory Title',
      dataIndex: 'subcategorytitle',
      align: 'center',
      ...getColumnSearchProps('subcategorytitle'),
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={
          subcategorytitledata ? subcategorytitleData(subcategorytitledata) : []
        }
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: subcategorytitledata ? subcategorytitletotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
