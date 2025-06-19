import React, {useState, useEffect, useRef} from 'react';
import {Table} from 'antd';
// import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import Router from 'next/router';
import axios from 'axios';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
import Highlighter from 'react-highlight-words';
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
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchkey, setSearchKey] = useState('');
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
          `${envUrl.baseUrl}${cmsendPoint.getSubCategoryTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setCategory(data.data.data.subcategorytablecms.data);
        setLoading(false);

        return {state: true, message: 'sucess'};
      } catch (error) {
        console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  useEffect(() => {
    getCategory(tablePagination, PageSize);
  }, [tablePagination]);

  useEffect(() => {
    if (editcategoryflag || addcategoryflag) {
      getCategory(tablePagination, PageSize);
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
  const categoryData = (category) => {
    return category.map((cateitem, index) => {
      return {
        key: index + 1,
        name: cateitem.name.split('/')[0],
        subcatename: cateitem.name.split('/').pop(),
        priority: cateitem.priority,
        status: btnSelector(cateitem.status),
        actions: (
          <ActionButton
            showModal1={showModal1}
            showModal2={showModal2}
            showModal3={showModal3}
            showModal4={showModal4}
            category={cateitem}
          />
        ),
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
      title: 'Category Names',
      dataIndex: 'name',
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Subcategory Name',
      dataIndex: 'subcatename',
      align: 'center',
      ...getColumnSearchProps('subcatename'),
    },
    {
      title: 'Subcategory Position',
      dataIndex: 'priority',
      align: 'center',
    },
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
        dataSource={category ? categoryData(category) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: category ? category.total : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUi;
