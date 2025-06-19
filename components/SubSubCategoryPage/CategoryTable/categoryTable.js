import React, {useState, useEffect, useRef} from 'react';
import {Table, Input, Space, Row, Col, Button} from 'antd';
// import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
import {Image} from 'antd';
import ActionButton from './components/ActionButton';
import Router from 'next/router';
import axios from 'axios';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../utils/factory';
import {DeleteTwoTone, SearchOutlined} from '@ant-design/icons';
import DeleteButton from './components/DeleteButton';
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
  Editcategoryflag,
}) => {
  const [tablePagination, setPagination] = useState(1);
  const [PageSize, setPageSize] = useState(50);
  const [category, setCategory] = useState(null);
  const [categorytotal, setCategoryTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchkey, setSearchKey] = useState('');
  const [filterData, setFilterData] = useState([]);

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

  //const categoryfilterdata = category && category.filter((i) => i.level === 2);
  const getCategory = async (tablePagination, PageSize) => {
    setLoading(true);
    setCategory(null);
    {
      const variables = {
        page: tablePagination,
        pageSize: PageSize,
        key: searchkey,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getSubSubCategoryTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setCategory(data.data.data.subsubcategorytablecms.data);
        setCategoryTotal(data.data.data.subsubcategorytablecms.total);
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

  useEffect(() => {
    if (category) {
      const f = category.map((c, index) => {
        return {
          text: c.name.split('/')[0],
          value: c.name.split('/')[0],
        };
      });
      const uniqueIds = [];
      const unique = f.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.text);

        if (!isDuplicate) {
          uniqueIds.push(element.text);

          return true;
        }

        return false;
      });
      setFilterData(unique);
    }
  }, [category]);

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
  const categoryData = (item) => {
    return item.map((category, index) => {
      return {
        key: index + 1,
        name: category.name.split('/')[0],
        subcatename: category.name.split('/')[1],
        subsubcatename: category.name.split('/')[2],
        title: category.title,
        priority: category.priority,
        status: btnSelector(category.status),
        actions: (
          <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
            <Col className="gutter-row" span={12}>
              <ActionButton
                showModal1={showModal1}
                showModal2={showModal2}
                showModal3={showModal3}
                showModal4={showModal4}
                category={category}
              />
            </Col>
            <Col
              className="gutter-row"
              span={8}
              offset={4}
              style={{alignContent: 'center'}}
            >
              <DeleteButton
                category={category}
                Editcategoryflag={Editcategoryflag}
              />
            </Col>
          </Row>
        ),
      };
    });
  };
  console.log('!!!!!!!!!! category = ', category);
  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      // filters: [
      //   {
      //     text: 'Joe',
      //     value: 'Joe',
      //   },
      //   {
      //     text: 'Category 1',
      //     value: 'Category 1',
      //   },
      //   {
      //     text: 'Category 2',
      //     value: 'Category 2',
      //   },
      // ],
      filters: filterData,
      filterMode: 'tree',
      filterSearch: true,
      align: 'center',
      onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: 'Subcategory Name',
      dataIndex: 'subcatename',
      align: 'center',
      ...getColumnSearchProps('subcatename'),
    },
    // {
    //   title: 'Sub Subcategory Name',
    //   dataIndex: 'subsubcatename',
    // },
    {
      title: 'Position',
      dataIndex: 'priority',
      align: 'center',
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      align: 'center',
      ...getColumnSearchProps('title'),
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
      {/* <Space
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#fff',
          justifyContent: 'flex-end',
        }}
      >
        <Search
          placeholder="Search Records"
          onSearch={onhandelSearchKey}
          style={{
            width: 200,
          }}
        />
      </Space> */}

      <Table
        columns={columns}
        dataSource={category ? categoryData(category) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: PageSize,
          total: category ? categorytotal : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />

      {/* <Table
        columns={columns}
        dataSource={category ? categoryData(category) : []}
        loading={loading}
        className="dashboard-productTable"
        // scroll={{
        //   y: 240,
        // }}
      /> */}
    </>
  );
};

export default TableUi;
