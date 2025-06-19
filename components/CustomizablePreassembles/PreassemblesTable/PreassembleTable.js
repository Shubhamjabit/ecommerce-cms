import React, {useState, useEffect, useReducer} from 'react';
import {Space, Table, Tag} from 'antd';
import ImageColumn from './components/ImageColumn';
import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
//import {GET_PRODUCT_PAGINTION} from '../../../graphql/product';
import {imageURL} from '../../../util/data';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {setKeyword} from '../../../store/actions/searchAction';
import {Image} from 'antd';
const TableUI = ({
  showAddModal,
  searchkeyword,
  filter,
  showDeleteModal,
  deletebannerflag,
  showEditProduct,
}) => {
  const [tablePagination, setPagination] = useState(1);
  const [sortingByOption, setSortingByOption] = useState(null);
  const [pageSize, setPageSize] = useState(25);
  const [productdata, setProductData] = useState(null);
  const [totalproduct, setTotalProduct] = useState(null);
  const [datasource, setDatasource] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [mainFilterColumnFilter, setMainFilterColumnFilter] = useState([]);
  const [allFiltersColumnFilter, setAllFiltersColumnFilter] = useState([]);
  const dispatch = useDispatch();
  const keyword = useSelector((state) => state.searchReducer.keyword);

  const getProductdata = async (
    tablePagination,
    pageSize,
    keyword,
    sortingByOption,
    isPublish
  ) => {
    setLoading(true);
    {
      const variables = {
        page: tablePagination,
        pageSize: pageSize,
        keyword: keyword,
        orderBy: sortingByOption,
        unpublished: isPublish,
        filter: filter,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getCustPreassembleTable}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        // setData(data);
        setProductData(data.data.data.productslistdatacms.data);
        setTotalProduct(data.data.data.productslistdatacms.total);
        setDatasource(ProductsData(data.data.data.productslistdatacms.data));

        setLoading(false);
        return {state: true, message: 'sucess'};
      } catch (error) {
        //console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  // useEffect(() => {
  //   getProductdata(tablePagination, pageSize, keyword, null, true);
  // }, []);

  // useEffect(() => {
  //   dispatch(setKeyword(null));
  //   if (!searchkeyword && !keyword) {
  //     // console.log('###############searchkeyword 2 ', searchkeyword);
  //     getProductdata(tablePagination, pageSize, keyword, null, true, filter);
  //   }
  // }, [searchkeyword]);

  useEffect(() => {
    getProductdata(tablePagination, pageSize, keyword, null, true, filter);
  }, [keyword, filter, deletebannerflag]);

  const findSortingMethod = ({column, order}) => {
    let orderBy = '';

    const columnToOrderBy = (column + (order ? order : '')).toLowerCase();

    // console.log('column "|" + order: ', columnToOrderBy);

    switch (columnToOrderBy) {
      case 'status':
        orderBy = 'STATUS_ASC';
        break;
      case 'statusascend':
        orderBy = 'STATUS_ASC';
        break;
      case 'statusdescend':
        orderBy = 'STATUS_DESC';
        break;
      case 'price':
        orderBy = 'LOWPRICE';
        break;
      case 'priceascend':
        orderBy = 'LOWPRICE';
        break;
      case 'pricedescend':
        orderBy = 'HIGHPRICE';
        break;
      case 'productlegacyid':
        orderBy = 'LEGACY_ID_ASC';
        break;
      case 'productlegacyidascend':
        orderBy = 'LEGACY_ID_ASC';
        break;
      case 'productlegacyiddescend':
        orderBy = 'LEGACY_ID_DESC';
        break;
      case 'productname':
        orderBy = 'NAME_ASC';
        break;
      case 'productnameascend':
        orderBy = 'NAME_ASC';
        break;
      case 'productnamedescend':
        orderBy = 'NAME_DESC';
        break;
      default:
        orderBy = 'LOWPRICE';
    }

    return orderBy;
  };

  const onChange = async (pagination, filters, sorter, extra) => {
    // console.log('sorter', sorter);
    let orderBy = await findSortingMethod({
      column: sorter.field,
      order: sorter.order,
    });
    // console.log('orderBy', orderBy);
    await setSortingByOption(orderBy);
    //console.log('pagination');
    await setPageSize(pagination.pageSize);
    await setPagination(pagination.current);

    // await getProduct({
    //   variables: {
    //     page: pagination.current,
    //     pageSize: pagination.pageSize,
    //     keyword: keyword,
    //     orderBy: orderBy,
    //     unpublished: true,
    //   },
    // });

    await getProductdata(
      pagination.current,
      pagination.pageSize,
      keyword,
      orderBy,
      true
    );
  };

  const btnSelector = (status) => {
    if (status === 1) {
      return <PublishButton />;
    } else {
      return <HiddenButton />;
    }
  };

  const SplitText = ({text}) => {
    const textArray = text.split('/');
    return <>{textArray[0]}</>;
  };

  useEffect(() => {
    if (productdata) {
      const f = productdata.map((p, index) => {
        return {
          text: p.main_filter,
          value: p.main_filter,
        };
      });
      console.log('fffffffffffffffffff = ', f);
      const uniqueIds = [];
      const unique = f.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.text);

        if (!isDuplicate) {
          uniqueIds.push(element.text);

          return true;
        }

        return false;
      });
      setMainFilterColumnFilter(unique);

      /* create unique filter array for all filters column */
      // const f2 = productdata.map((p, index) => {
      //   return {
      //     text: p.all_filters,
      //     value: p.all_filters,
      //   };
      // });
      let f2 = [];
      for (let i = 0; i < productdata.length; i++) {
        let x = productdata[i].all_filters;
        for (let j = 0; j < x.length; j++) {
          f2.push({text: x[j], value: x[j]});
        }
      }
      const uniqueIds2 = [];
      const unique2 = f2.filter((element) => {
        const isDuplicate2 = uniqueIds2.includes(element.text);

        if (!isDuplicate2) {
          uniqueIds2.push(element.text);

          return true;
        }

        return false;
      });
      setAllFiltersColumnFilter(unique2);
    }
  }, [productdata]);

  const ProductsData = (productdata) => {
    return productdata.map((product) => {
      return {
        key: product.id,
        imageT1: product.img_url_t1,
        imageT2: product.img_url_t2,
        sparkyId: product.sparky_id,
        mainFilter: product.main_filter,
        filters: product.all_filters,
        price: product.price,
        assemblyCharges: product.assembly_charges,
        status: btnSelector(product.status),
        actions: (
          <ActionButton
            showEditProduct={showEditProduct}
            preassemble={product}
            showAddModal={showAddModal}
            showDeleteModal={showDeleteModal}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Image T1',
      dataIndex: 'imageT1',
      align: 'center',
      render: (theimage) => (
        <>
          {theimage ? (
            <Image
              width={100}
              src={process.env.PRODUCT_CDN_URL + theimage}
              alt="error in fetching image"
            />
          ) : (
            <Image
              width={100}
              // src="/images/No-Image-Placeholder.png"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png"
              alt="No image uploaded"
            />
          )}
        </>
      ),
    },
    // {
    //   title: 'Image T2',
    //   dataIndex: 'imageT2',
    //   render: (theimage) => (
    //     <>
    //       {theimage ? (
    //         <Image
    //           width={100}
    //           src={process.env.PRODUCT_CDN_URL + theimage}
    //           alt="error in fetching image"
    //         />
    //       ) : (
    //         <Image
    //           width={100}
    //           src="/images/No-Image-Placeholder.png"
    //           alt="No image uploaded"
    //         />
    //       )}
    //     </>
    //   ),
    // },

    {
      title: 'Sparky Id',
      // key: 'sparkyId',f
      dataIndex: 'sparkyId',
      align: 'center',
      render: (text) => (
        <>
          <Tag color={'magenta'}>{text}</Tag>
        </>
      ),
    },
    {
      title: 'Main Filter',
      key: 'mainFilter',
      align: 'center',
      dataIndex: 'mainFilter',
      width: '25%',
      render: (text) => (
        <>
          <Tag color={'blue'}>{text}</Tag>
        </>
      ),
      filters: mainFilterColumnFilter,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.mainFilter.startsWith(value),
    },
    {
      title: 'Filters',
      key: 'filters',
      align: 'center',
      dataIndex: 'filters',
      width: '25%',
      render: (_, {filters}) => (
        <>
          {filters.map((f) => {
            return (
              <>
                <Space>
                  <Tag color="green" key={f}>
                    {f}
                  </Tag>
                </Space>
              </>
            );
          })}
        </>
      ),
      filters: allFiltersColumnFilter,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.filters.includes(value),
    },
    {
      title: 'Price',
      // key: 'price',
      dataIndex: 'price',
      align: 'center',
      sorter: (a, b) => a.price - b.price,
      // sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
      // ellipsis: true,
      render: (text) => (
        <>
          {' '}
          <Tag color={'geekblue'}>${text}</Tag>
        </>
      ),
    },
    {
      title: 'Assembly Charges',
      align: 'center',
      // key: 'assemblyCharges',
      dataIndex: 'assemblyCharges',
      sorter: (a, b) => a.assemblyCharges - b.assemblyCharges,
      render: (text) => (
        <>
          {' '}
          <Tag color={'purple'}>${text}</Tag>
        </>
      ),
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

  // console.log('!!!!! productdata = ', productdata);
  // console.log('!!!!!!!!2222 mainFilterColumnFilter = ', mainFilterColumnFilter);
  // console.log('!!!!!!!!2222 allFiltersColumnFilter = ', allFiltersColumnFilter);
  return (
    <>
      <Table
        columns={columns}
        dataSource={productdata ? ProductsData(productdata) : []}
        onChange={onChange}
        loading={loading}
        pagination={{
          pageSize: pageSize,
          total: productdata ? totalproduct : 10,
          position: tablePagination,
        }}
        className="dashboard-productTable"
      />
    </>
  );
};

export default TableUI;
