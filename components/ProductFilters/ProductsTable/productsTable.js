import React, {useState, useEffect, useReducer} from 'react';
import {Table, Tag} from 'antd';
import ImageColumn from './components/ImageColumn';
import ActionButton from './components/ActionButton';
import PublishButton from './components/PublishButton';
import HiddenButton from './components/HiddenButton';
//import {GET_PRODUCT_PAGINTION} from '../../../graphql/product';
import {imageURL} from '../../../util/data';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import styles from './ProductTable.module.scss';
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
  console.log('DDDDDD productdata', productdata);
  const [totalproduct, setTotalProduct] = useState(null);
  const [datasource, setDatasource] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [parentCategoryFilter, setParentCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
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
        crudMethod: 'read',
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.crudProductFilters}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('DDDDDDDDDDDDDDDDDDD', data);
        setProductData(data.data.data);
        setTotalProduct(data.data.length);
        setDatasource(ProductsData(data.data.data));

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
          // text: p.parent_category.split('/')[0],
          // value: p.parent_category.split('/')[0],
          text: p.category,
          value: p.category,
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
      setParentCategoryFilter(unique);

      const f2 = productdata.map((p, index) => {
        return {
          // text: p.title,
          // value: p.title,
          text: p.sub_category,
          value: p.sub_category,
        };
      });
      const uniqueIds2 = [];
      const unique2 = f2.filter((element) => {
        const isDuplicate2 = uniqueIds2.includes(element.text);

        if (!isDuplicate2) {
          uniqueIds2.push(element.text);

          return true;
        }

        return false;
      });
      setSubCategoryFilter(unique2);
    }
  }, [productdata]);

  const ProductsData = (productdata) => {
    return productdata.map((product) => {
      return {
        key: product.subcatId,
        subcatId: product.subcatId,
        productName: `${product.name ? product.name : ''}`,
        parentCategory: product.category,
        categorybytag: product.sub_category,
        product_filter_json: product.product_filter_json,
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
    // {
    //   title: 'Image',
    //   dataIndex: 'image',
    //   render: (theimage) => (
    //     <Image
    //       width={100}
    //       alt={process.env.PRODUCT_CDN_URL + theimage}
    //       src={process.env.PRODUCT_CDN_URL + theimage}
    //     />
    //   ),
    // },

    // {
    //   title: 'Product Name',
    //   dataIndex: 'productName',
    //   render: (text, record) => (
    //     <a target="_blank" href={`${process.env.WEB_DOMAIN}${record.slug}`}>
    //       {/* <a
    //        target="_blank"
    //       href={window.location.hostname + ':3000' + '/' + `${record.slug}`}
    //      > */}
    //       {text}
    //     </a>
    //   ),
    // },
    {
      title: 'Category',
      key: 'parentCategory',
      dataIndex: 'parentCategory',
      width: '30%',
      render: (text) => (
        <>
          <Tag color={'orange'}>
            <SplitText text={text} />
          </Tag>
        </>
      ),
      filters: parentCategoryFilter,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.parentCategory.startsWith(value),
    },
    {
      title: 'Sub Category',
      key: 'categorybytag',
      dataIndex: 'categorybytag',
      width: '30%',
      render: (text) => <Tag color={'green'}>{text}</Tag>,
      filters: subCategoryFilter,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.categorybytag.startsWith(value),
      // onFilter: (value, record) =>
      //   record.parent_category.split('/')[1].startsWith(value),
      // render: (categorybytag) => (
      //   <>
      //     {categorybytag.map((tag) => {
      //       let color = 'green';
      //       if (tag === 'loser') {
      //         color = 'volcano';
      //       }
      //       return (
      //         <Tag color={green}>
      //           {categorybytag}
      //         </Tag>
      //       );
      //     })}
      //   </>
      // ),
    },
    {
      title: 'Filters Associated',
      dataIndex: 'product_filter_json',
      key: 'product_filter_json',
      align: 'center',
      className: 'product-Associatedfilter-table',
      render: (_, {product_filter_json}) => (
        <>
          {product_filter_json?.map((name) => {
            return (
              // <Tag color={'blue'}>
              //   ({name.custmFilterNumber}) {name.filterName.toUpperCase()}
              // </Tag>

              <div className={styles.capsule}>
                <div className={styles.left}>{name.custmFilterNumber}</div>
                <div className={styles.right}>
                  {name.filterName.toUpperCase()}
                </div>
              </div>
            );
          })}
        </>
      ),
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   align: 'left',
    // },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   align: 'left',
    // },
  ];

  console.log('!!!!! productdata = ', productdata);
  console.log('!!!!!!!!2222 parentCategoryFilter = ', parentCategoryFilter);
  console.log('!!!!!!!!2222 subCategoryFilter = ', subCategoryFilter);
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
