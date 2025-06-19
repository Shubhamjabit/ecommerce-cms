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
  const [jacketColoursColumnFilter, setJacketColoursColumnFilter] = useState(
    []
  );
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
        type: 'cables',
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
          text: p.filter_1,
          value: p.filter_1,
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

      let f3 = [];
      for (let i = 0; i < productdata.length; i++) {
        let x = productdata[i].jacket_colour;
        for (let j = 0; j < x.length; j++) {
          f3.push({text: x[j], value: x[j]});
        }
      }
      const uniqueIds3 = [];
      const unique3 = f3.filter((element) => {
        const isDuplicate3 = uniqueIds3.includes(element.text);

        if (!isDuplicate3) {
          uniqueIds3.push(element.text);

          return true;
        }

        return false;
      });
      setJacketColoursColumnFilter(unique3);
    }
  }, [productdata]);

  const ProductsData = (productdata) => {
    return productdata.map((product) => {
      return {
        key: product.id,
        image: product.img_url,
        sparkyId: product.sparky_id,
        mainFilter: product.filter_1,
        filters: product.all_filters,
        jacketColour: product.jacket_colour,
        pricing_per_meter: product.pricing_per_meter,
        status: btnSelector(product.status),
        actions: (
          <ActionButton
            showEditProduct={showEditProduct}
            product={product}
            showAddModal={showAddModal}
            showDeleteModal={showDeleteModal}
          />
        ),
      };
    });
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
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
    {
      title: 'Sparky Id',
      // key: 'sparkyId',
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
      dataIndex: 'filters',
      align: 'center',
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
      align: 'center',
      // key: 'price',
      dataIndex: 'pricing_per_meter',
      sorter: (a, b) => a.pricing_per_meter - b.pricing_per_meter,
      render: (text) => (
        <>
          {' '}
          <Tag color={'geekblue'}>${text}</Tag>
        </>
      ),
    },
    {
      title: 'Jacket Colours',
      key: 'jacketColour',
      dataIndex: 'jacketColour',
      align: 'center',
      width: '25%',
      render: (_, {jacketColour}) => (
        <>
          {jacketColour.map((j) => {
            {
              /* let color =
              j == 'White'
                ? 'blue'
                : j == 'Clue'
                ? 'blue'
                : j == 'Earth'
                ? 'blue'
                : j.toLowerCase(); */
            }
            {
              /* let color = j.toLowerCase(); */
            }
            let textColor = 'black';
            if (j == 'Black') {
              textColor = 'white';
            }
            let color = 'purple';
            return (
              <>
                <Space>
                  <Tag
                    color={color}
                    key={j}
                    // style={{backgroundColor: `${j.toLowerCase()}`}}
                    // style={{
                    //   backgroundColor: `${color}`,
                    //   color: `${textColor}`,
                    // }}
                  >
                    {j}
                  </Tag>
                </Space>
              </>
            );
          })}
        </>
      ),
      filters: jacketColoursColumnFilter,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.jacketColour.includes(value),
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
