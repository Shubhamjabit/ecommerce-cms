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
import {cmsendPoint, envUrl} from '../../../utils/factory';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {setKeyword} from '../../../store/actions/searchAction';
import {Image} from 'antd';
import {setProductTotal} from '../../../store/actions/productActions';
const TableUI = ({
  showAddModal,
  searchkeyword,
  filter,
  showDeleteModal,
  showDuplicateModal,
  deletebannerflag,
  showEditProduct,
  duplicatebannerflag,
}) => {
  const [tablePagination, setPagination] = useState(1);
  const [sortingByOption, setSortingByOption] = useState(null);
  const [pageSize, setPageSize] = useState(25);
  const [productdata, setProductData] = useState(null);
  console.log('pppppppppppp', productdata);
  const [totalproduct, setTotalProduct] = useState(null);
  const [datasource, setDatasource] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [parentCategoryFilter, setParentCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [selectedSubCatFilterValue, setSelectedsubCatFilterValue] = useState(
    JSON.parse(localStorage.getItem('selectedSubCatFilterValue'))
  );
  console.log('selectedSubCatFilterValue = ', selectedSubCatFilterValue);
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
          `${envUrl.baseUrl}${cmsendPoint.getProductTable}`,
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
        dispatch(setProductTotal(data.data.data.productslistdatacms.total));
        setLoading(false);
        return {state: true, message: 'sucess'};
      } catch (error) {
        //console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };

  // useEffect(() => {
  //   dispatch(setKeyword(null));
  //   if (!searchkeyword && !keyword) {
  //     // console.log('###############searchkeyword 2 ', searchkeyword);
  //     getProductdata(tablePagination, pageSize, keyword, null, true, filter);
  //   }
  // }, [searchkeyword]);

  useEffect(() => {
    console.log('UE selectedSubCatFilterValue', selectedSubCatFilterValue);
    localStorage.setItem(
      'selectedSubCatFilterValue',
      JSON.stringify(selectedSubCatFilterValue)
    );
  }, [selectedSubCatFilterValue]);

  useEffect(() => {
    getProductdata(tablePagination, pageSize, keyword, null, true, filter);
  }, [keyword, filter, deletebannerflag, duplicatebannerflag]);

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
    if (filters.parentCategory) {
      setSelectedCategoryFilter(
        Array.isArray(filters.parentCategory) && filters.parentCategory.length
          ? filters.parentCategory.join(',') 
          : null
      );
    } else {
      setSelectedCategoryFilter(null);
    }
    setSelectedsubCatFilterValue(filters.categorybytag);
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
    if (text) {
      const textArray = text?.split('/');
      return <>{textArray[0]}</>;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (productdata) {
      const f = productdata.map((p, index) => {
        return {
          text: p?.parent_category,
          value: p?.parent_category,
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
          text: p?.parent_category?.split('/')[1],
          value: p?.parent_category?.split('/')[1],
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

  const selectedCategories = selectedCategoryFilter
  ? selectedCategoryFilter.split(',').map(cat => cat.trim())
  : null;
  const ProductsData = (productdata) => {
    return productdata.map((product) => {
      return {
        key: product.id,
        image: product.product_media_default,
        productId: product.id,
        productPosition: product.position,
        //productsku: product.sku,
        //productLegacyId: product.legacy_id,
        slug: product.slug,
        productName: `${product.name ? product.name : ''}`,
        sparky_id: product.sparky_id,
        parentCategory: product.parent_category ? product.parent_category : '',
        // categorybytag: product.title,
        categorybytag: product.parent_category ? product?.parent_category?.split('/')[1] : '',
        status: btnSelector(product.status),
        actions: (
          <ActionButton
            showEditProduct={showEditProduct}
            product={product}
            showAddModal={showAddModal}
            showDeleteModal={showDeleteModal}
            showDuplicateModal={showDuplicateModal}
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
        <Image
          width={100}
          alt={process.env.PRODUCT_CDN_URL + theimage}
          src={process.env.PRODUCT_CDN_URL + theimage}
        />
      ),
    },

    {
      title: 'Product Name',
      dataIndex: 'productName',
      align: 'center',
      render: (text, record) => (
        <a target="_blank" href={`${process.env.WEB_DOMAIN}${record.slug}`}>
          {/* <a
           target="_blank"
          href={window.location.hostname + ':3000' + '/' + `${record.slug}`}
         > */}
          {text}
        </a>
      ),
    },
    {
      title: 'Sparky Id',
      dataIndex: 'sparky_id',
      align: 'center',
    },
    {
      title: 'Product Position',
      dataIndex: 'productPosition',
      align: 'center',
      // render: (text, record) => ({text}),
    },
    {
      title: 'Category',
      key: 'parentCategory',
      dataIndex: 'parentCategory',
      align: 'center',
      width: '20%',
      render: (text) => (
        <>
          <Tag color={'orange'}>
            <SplitText text={text.split('/')[0]} />
          </Tag>
        </>
      ),
      // filters: parentCategoryFilter,
      filters: Array.from(
        new Set(parentCategoryFilter.map((item) => item?.text?.split('/')[0]))
      ).map((name) => ({text: name, value: name})),
      // filterMode: 'tree',
      filterSearch: (input, option) => {
        const val = option?.value?.toString().toLowerCase() || '';
        return val.startsWith(input.toLowerCase());
      },
      onFilter: (value, record) =>
        record?.parentCategory?.split?.('/')?.[0] === value,
    },
    {
      title: 'Sub Category',
      key: 'categorybytag',
      align: 'center',
      dataIndex: 'categorybytag',
      width: '25%',
      render: (text) => <Tag color={'green'}>{text}</Tag>,
      // filters: subCategoryFilter,
      filters: Array.from(
        new Set(
          parentCategoryFilter
            .map(item => item?.text?.split('/'))
            .filter(parts => 
              parts &&
              (selectedCategories === null || selectedCategories.includes(parts[0]))
            )
            .map(parts => parts[1])
        )
      ).filter(Boolean)
       .map(name => ({ text: name, value: name })),
      // filterMode: 'tree',
      filterSearch: (input, option) => {
        const val = option?.value?.toString().toLowerCase() || '';
        return val.startsWith(input.toLowerCase());
      },
      onFilter: (value, record) => {
        // let a = [];
        // a.push(value);
        // console.log('vvvvvvvvvvv', value);
        // console.log('rrrrrrrrr', record);
        // let a = selectedSubCatFilterValue.push(value);
        // localStorage.setItem('selectedSubCatFilterValue', value);
        return record.categorybytag.startsWith(value);
      },
      // onFilter: (value, record) => record.categorybytag.indexOf(value) === 0,
      // defaultFilteredValue: ['DNDTSubCat'],
      defaultFilteredValue: selectedSubCatFilterValue,

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
  // console.log('!!!!!!!!2222 parentCategoryFilter = ', parentCategoryFilter);
  // console.log('!!!!!!!!2222 subCategoryFilter = ', subCategoryFilter);
  return (
    <>
      <Table
        id="PRODUCTtBALE"
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
