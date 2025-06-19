import React, {useState, useEffect, useRef, useMemo} from 'react';
import jpv from 'jpv';
import {
  Image,
  Descriptions,
  Upload,
  Form,
  Input,
  Radio,
  Modal,
  Select,
  Tag,
  message,
  Row,
  Col,
  Button,
  Typography,
  InputNumber,
  Spin,
} from 'antd';
import EditImagePicker from '../ProductsTable/components/EditImagePicker';
import AddRelatedProducts from './AddRelatedProducts';
import styles from './EditProductModal.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import {initProduct} from '../../../store/actions/productActions';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import Router from 'next/router';
import EditProductHeader from '../Header/EditProductHeader';
import CKEditor from 'ckeditor4-react';
import dynamic from 'next/dynamic';
import CertificationTableRows from '../ProductsTable/components/CertificationTableRows';
import DocumentTableRows from '../ProductsTable/components/DocumentTableRows';
import PriceTableRows from '../ProductsTable/components/PriceTableRows';
const {Option} = Select;
const {TextArea} = Input;

const EditProductModal = ({productlist, handleEditProduct}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const defaultImageValue = Form.useWatch('defaultImage', form);
  const [errorInJSONValidation, setErrorInJSONValidation] = useState(true);
  //const [UpdateProduct, {data}] = useMutation(UPDATE_PRODUCT);
  const {Text, Link} = Typography;
  const visible = useSelector(
    (status) => status.productReducer.editProductModal
  );
  const productData = useSelector((status) => status.productReducer.product);
  //console.log('###############product', product);
  const productMedia = useSelector(
    (status) => status.productReducer.productMedia
  );
  //console.log('###############productMedia', productMedia);
  //console.log('###############categories', categories);

  const [data, setData] = useState();
  const [productmediadata, setProductMediaData] = useState();
  const [valuecategory, setValueCategoty] = useState({});
  const [valuecategoryid, setValueCategotyid] = useState(null);
  const [categorystatus, setCategoryStatus] = useState(false);
  const [relatedproductid, setValueRelatedProductid] = useState(null);
  const [relatedproductstatus, setRelatedProductStatus] = useState(false);
  const [similarproductlist, setSimilarProductList] = useState(null);
  const [alternativeproductlist, setAlternativeProductList] = useState(null);
  const [alternativeproductid, setValueAlternativeProductid] = useState(null);
  const [categories, setCategories] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadimageloader, setUploadImageLoader] = useState(false);
  const [product, setProduct] = useState(null);
  console.log('<<<<<<<<<<<111111111 product', product);
  const [alternativeproductstatus, setValueAlternativeProductstatus] =
    useState(false);
  const [uploadimagestatus, setUploadImagestatus] = useState(false);
  const [parentCategories, setParentCategories] = useState(null);
  const [valueParentCategoryName, setValueParentCategotyName] = useState('');
  const [productSlug, setProductSlug] = useState(null);
  const [defaultImageError, setDefaultImageError] = useState(false);
  const [filterNameList, setFilterNameList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [sectionNumberList, setSectionNumberList] = useState([]);
  const [quantityType, setQuantityType] = useState(null);
  const [defaultSections, setDefaultSections] = useState(null);
  const [valuecableprice, setvaluecableprice] = useState(null);
  const [valueterminal1price, setvalueterminal1price] = useState(null);
  const [valueterminal2price, setvalueterminal2price] = useState(null);
  const [cableprice, setcableprice] = useState([]);
  const [terminal1price, setterminal1price] = useState([]);
  const [terminal2price, setterminal2price] = useState([]);
  console.log('defaultSections', defaultSections);
  // console.log('valueParentCategoryName', valueParentCategoryName);

  console.log('<<<<<<<<<<<222222 filterNameList', filterNameList);
  const [rs, setRs] = useState(0);
  console.log('rs', rs);
  // const [defaultImageValue, setDefaultImageValue] = useState(null);
  console.log('defaultImageValue', defaultImageValue);
  console.log('##########productMedia', productMedia, '---------', visible);

  const importJodit = () => import('jodit-react');

  const JoditEditor = dynamic(importJodit, {
    ssr: false,
  });
  const config = {
    readonly: false,
    width: '100%',
    height: 500,
  };
  const editor = useRef(null);
  const prodDescEditor = useRef(null);
  const [content, setContent] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [volume, setVolume] = useState(0);
  useEffect(() => {
    getProductData();
  }, []);
  useEffect(() => {
    form.validateFields(['defaultImage']);
    if (rs != 0) {
      form.validateFields(['productImages']);
    }
    if (productMedia) {
      form.setFieldsValue({
        defaultImage: productMedia[0]?.uid,
      });
    } else if (!productMedia || productMedia.length == 0) {
      setDefaultImageError(false);
    }
  }, [defaultImageError, productMedia, form, rs]);
  const getProductData = async () => {
    {
      try {
        const data = await axios
          .get(`${envUrl.baseUrl}${cmsendPoint.getProductRelatedData}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then((data) => {
            // setData(data);
            setParentCategories(data.data.data.parentCategory.data);
            setCategories(data.data.data.category.data);
            setAlternativeProductList(data.data.data.alternativeproduct.data);
            setSimilarProductList(data.data.data.similarproduct.data);
            setFilterNameList(data.data.data.filterNameList.data);
            setSectionList(data.data.data.sectionList.data);
            setcableprice(data.data.data.custCableList.data);
            setterminal1price(data.data.data.custTerminalList.data);
            setterminal2price(data.data.data.custTerminalList.data);
            return {state: true, message: 'sucess'};
          });
      } catch (error) {
        // console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  console.log('c2222222222222222', categories);
  // console.log("valuecableprice" ,valuecableprice);
  useEffect(() => {
    if (productData) {
      getProductDetail(productData.id);
    }
  }, [productData]);

  const getProductDetail = async (productID) => {
    {
      const variables = {
        product_id: productID,
      };
      try {
        const data = await axios.post(
          `${envUrl.baseUrl}${cmsendPoint.getProductDetailByID}`,
          variables,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('!!getProductDetailbyId', data.data);
        let product_tags = data.data.data.productDetail.data[0].product_tags;
        if (product_tags && product_tags.length > 0) {
          for (let i = 0; i < product_tags.length; i++) {
            data.data.data.productDetail.data[0][
              `section_id_${product_tags[i].tag_id}_value`
            ] = product_tags[i].order_no;
          }
        }
        setProduct(data.data.data.productDetail.data[0]);
        return {state: true, message: 'sucess'};
      } catch (error) {
        //console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  // console.log({product})

  var mediadata =
    productmediadata &&
    productmediadata.map(function (item) {
      return item.uid;
    });

  useEffect(() => {
    dispatch(initProduct());
  }, []);

  useEffect(() => {
    setProductMediaData(productMedia);
    setContent(product && product.product_key_features);
    setProductDesc(product && product.description);
    setCertificationRowsData(
      product && product.product_certificate
        ? product && product.product_certificate
        : []
    );
    setDocumentRowsData(
      product && product.product_document
        ? product && product.product_document
        : []
    );
    setPriceRowsData(
      product && product.product_price ? product && product.product_price : []
    );
    // setSectionList([{id: 1, section_name: 'Popular Products'}]);
    let default_sections = [];
    let sectionNumerListCopy = [];
    if (product && product.product_tags) {
      for (let i = 0; i < product.product_tags.length; i++) {
        default_sections.push(product.product_tags[i].tag_id);
        sectionNumerListCopy.push({
          sectionName: product.product_tags[i].tag_name,
          sectionId: product.product_tags[i].tag_id,
        });
      }
      console.log('default_sections', default_sections);
      console.log('sectionNumerListCopy', sectionNumerListCopy);
      setDefaultSections(default_sections);
      setSectionNumberList(sectionNumerListCopy);
    }
    // let sectionNumerListCopy = [
    //   {
    //     sectionName: 'Popular Products',
    //     sectionId: 1,
    //   },
    // ];
    // setSectionNumberList(sectionNumerListCopy);
  }, [product]);
  //console.log('image-path' + imageUrl);
  // console.log('image-path' + imageUrlThree);
  // console.log('image-path' + imageUrlFour);

  const isJSON = (jsonInput) => {
    try {
      JSON.parse(jsonInput);
    } catch (e) {
      return false;
    }
    return true;
  };

  const categoryID =
    product &&
    product.categorybytag &&
    product.categorybytag.map((item) => item.id);

  const relatedProductID =
    product &&
    product.relatedproducttag &&
    product.relatedproducttag.map((item) => item.id);

  const alternativeProductID =
    product &&
    product.alternativeproducttag &&
    product.alternativeproducttag.map((item) => item.id);
  console.log('ddddddddddddddddddd>>>>>>>>>>>>>', product);

  useEffect(() => {
    form.setFieldsValue({
      id: product ? product.id : null,
      status: product ? (product.status == 1 ? true : false) : false,
      parentCategory: product
        ? product?.categorybytag[0]?.name?.split('/')[0]
        : null,
      title: product ? product.name : null,
      position: product ? product.position : null,
      price: product ? product.price : null,
      slug: product ? product.slug : null,
      description: product ? product.description : null,
      cable_pricing_permeter: product ? product : null,
      terminal_1_id: product ? product.terminal_1_id : null,
      terminal_2_id: product ? product.terminal_2_id : null,
      metaDescription: product
        ? product.meta_description == 'undefined'
          ? ''
          : product.meta_description
        : null,
      metaKeyword: product
        ? product.meta_keyword == 'undefined'
          ? ''
          : product.meta_keyword
        : null,
      product_key_features: product ? product.product_key_features : null,
      sparky_id: product ? product.sparky_id : null,
      manufacturer_id: product
        ? product.manufacturer_id == 'null'
          ? ''
          : product.manufacturer_id
        : null,
      product_stock: product ? product.stock : null,
      product_pallets: product ? product.pallets : null,
      product_weight: product ? product.weight : null,
      product_length: product ? product.length : 0.01,
      product_breadth: product ? product.breadth : 0.01,
      product_height: product ? product.height : 0.01,
      product_cbm: product ? product.cbm : 0.01,
      sections: defaultSections ? defaultSections : null,
    });
    // to resolve bug - upload image sets product slug to null
    setProductSlug(product && product.slug);
    setVolume(product ? product.cbm : 0.0);
    setQuantityType(product ? product.qty_type : null);
  }, [product]);

  // form.setFieldsValue({
  //   sections: defaultSections ? defaultSections : null,
  // });
  const getimageno = () => {
    console.log('SAVE REQUEST CALLED :');
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    if (defaultImageValue == undefined) {
      setDefaultImageError(true);
      setSubmitLoading(false);
      return;
    }
    let final_section_save = [];

    if (values.sections && values.sections.length > 0) {
      for (let i = 0; i < values.sections.length; i++) {
        console.log('map values.sections[i]', values.sections[i]);
        console.log(
          'map values[`section_id_${values.sections[i]}_value`]',
          values[`section_id_${values.sections[i]}_value`]
        );
        final_section_save.push({
          section_id: values.sections[i],
          section_number_id: values[`section_id_${values.sections[i]}_value`],
        });
      }
    } else {
      console.error('values.sections is either null or undefined');
    }
    console.log('################### final_section_save =', final_section_save);
    try {
      // to resolve the bug, where features is forming a function and not making the axios request
      delete values['features'];
      const variables = {
        ...values,
        id: product.id,
        title: values.title,
        // description: values.description,
        description: productDesc,
        price: values.price,
        // slug: values.slug.replace(/ /g, '-').toLowerCase(),
        slug: productSlug,
        status: values.status === undefined ? true : values.status,
        metaDescription: values.metaDescription,
        metaKeyword: values.metaKeyword,
        product_key_features: content,
        category_id: valuecategoryid,
        relatedproduct_id: relatedproductid,
        alternativeproduct_id: alternativeproductid,
        defaultImage: values.defaultImage,
        media: productMedia,
        categorystatus: categorystatus,
        relatedproductstatus: relatedproductstatus,
        alternativeproductstatus: alternativeproductstatus,
        uploadimagestatus: uploadimagestatus,
        certificate: CertificationData,
        certificatestatus: CertificationStatus,
        document: DocumentData,
        documentstatus: DocumentStatus,
        pricejson: pricerowsData,
        cable_pricing_permeter:
          valuecableprice !== null
            ? parseFloat(valuecableprice)
            : product.cable_pricing_permeter,
        terminal_1_id:
          valueterminal1price !== null
            ? valueterminal1price
            : product.terminal_1_id,
        terminal_2_id:
          valueterminal2price !== null
            ? valueterminal2price
            : product.terminal_2_id,
        pricestatus: PriceStatus,
        sparky_id: values.sparky_id,
        manufacturer_id: values.manufacturer_id,
        product_stock: values.product_stock,
        product_pallets: values.product_pallets,
        product_weight: values.product_weight,
        product_length: parseFloat(values.product_length),
        product_breadth: parseFloat(values.product_breadth),
        product_height: parseFloat(values.product_height),
        product_cbm: parseFloat(volume),
        qty_per_pack: quantityType == 'unit' ? null : values.qty_per_pack,
        qty_type: quantityType,
        final_section_save: final_section_save,
      };
      // resolve the error => TypeError: Converting circular structure to JSON since features is coming from ..values
      delete variables.features;

      console.log('In Update Function:::::::::::::::::::', variables);
      // setSubmitLoading(false);
      // return;
      const data = await axios.post(
        `${envUrl.baseUrl}${cmsendPoint.updateProduct}`,
        variables,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (data);
      setValueCategotyid(null);
      setCategoryStatus(false);
      setValueRelatedProductid(null);
      setRelatedProductStatus(false);
      setSubmitLoading(false);
      setValueAlternativeProductstatus(false);
      handleEditProduct();
      //Router.push('/manage/products');
    } catch (error) {
      console.log('error', error);
      setSubmitLoading(false);
    }
  };

  const handleChangeQtyType = (value) => {
    console.log('selected>>>>>', value);
    setQuantityType(value);
  };

  const slugInput = (e) => {
    const {value} = e.target;
  };

  const isValidJSON = ({value}) => {
    const pattern = {
      fields: [
        {
          name: '(string)',
          value: '(string)',
        },
      ],
    };
    let validJSON = isJSON(value);
    let inputJSON = {fields: validJSON ? JSON.parse(value) : value};
    const options = {mode: 'strict'};
    let valid = jpv.validate(inputJSON, pattern, options);

    //console.log('value, ', value);
    if ((validJSON && valid) || !value) {
      setErrorInJSONValidation(true);
      return true;
    } else {
      setErrorInJSONValidation(false);
      return false;
    }
  };

  React.useEffect(() => {}, [data]);

  const {confirm} = Modal;

  useEffect(() => {
    setValueCategotyid(categoryID);
    setValueRelatedProductid(relatedProductID);
    setValueAlternativeProductid(alternativeProductID);
    if (product) {
      setValueParentCategotyName(product.categorybytag[0]?.name?.split('/')[0]);
    }
  }, [product]);

  const handleChangeCategoty = (value) => {
    const categoryname = categories && categories.filter((i) => i.id === value);
    setValueCategoty({...categoryname.name});
    setValueCategotyid(value);
    setCategoryStatus(true);
  };

  // const handleRelatedProduct = (value) => {
  //   const productname =
  //     productlist && productlist.filter((i) => i.id === value);
  //   setValueRelatedProduct({...productname.name});
  //   setValueRelatedProductid(value);
  //   setRelatedProductStatus(true);
  // };

  const handleChangeCable = (value) => {
    setvaluecableprice(value);
    // form.setFieldsValue({ cable: value });
  };

  const handleChangeTerminal1 = (value) => {
    setvalueterminal1price(value);
    // form.setFieldsValue({ terminal1: value });
  };

  const handleChangeTerminal2 = (value) => {
    setvalueterminal2price(value);
    // form.setFieldsValue({ terminal2: value });
  };

  const handleChangeSection = (value) => {
    // const sectionName  = sectionList && sectionList.filter((i) => i.id === value);
    // setValueCategoty({...categoryname.name});
    console.log('handleChangeSection value', value);
    // setDefaultSections([]);
    // form.setFieldsValue({
    //   sections: [],
    // });
    // setValueSectionId(value);
    if (value.length > 0) {
      let sectionNumerListCopy = sectionNumberList;
      let selected_section = sectionList.filter(
        (item) => item.id == value[value.length - 1]
      );
      console.log('handleChangeSection selected_section', selected_section[0]);
      sectionNumerListCopy.push({
        sectionName: selected_section[0].section_name,
        sectionId: selected_section[0].id,
      });
      console.log(
        'handleChangeSection sectionNumerListCopy',
        sectionNumerListCopy
      );
      setSectionNumberList(sectionNumerListCopy);
      setRs((prev) => prev + 1);
    } else {
      setSectionNumberList([]);
    }
  };
  const handleChangeBrands = (value) => {
    setValueBrandid(value);
  };

  const handleChangeSectionPosition = (value, section_id) => {
    console.log(
      'handleChangeSectionPosition value,section_id',
      value,
      section_id
    );
  };

  const handleRelatedProduct = (value) => {
    //setValueRelatedProduct({...productname.name});
    setValueRelatedProductid(value);
    setRelatedProductStatus(true);
  };

  const handleAlternativeProduct = (value) => {
    // setValueAlternativeProduct({...productname.name});
    setValueAlternativeProductid(value);
    setValueAlternativeProductstatus(true);
  };

  const uploadImage = (e) => {
    setUploadImageLoader(e);
    setUploadImagestatus(true);
  };

  const [CertificationData, setCertificationRowsData] = useState([]);
  const [CertificationStatus, setCertificationRowsStatus] = useState(false);

  const addTableRows = () => {
    setCertificationRowsStatus(true);
    const rowsInput = {
      CertificateName: '',
      CertificateImage: '',
      UploadStatus: null,
    };
    setCertificationRowsData([...CertificationData, rowsInput]);
  };
  const deleteCertificationRows = (index) => {
    console.log('deleteCertificationRows index = ', index);
    console.log(
      'deleteCertificationRows CertificationData = ',
      CertificationData
    );
    setCertificationRowsStatus(true);
    const rows = [...CertificationData];
    rows.splice(index, 1);
    setCertificationRowsData(rows);
    if (CertificationData[index].CertificateImage != '') {
      removeFileToBlob(index, 'certificateimages');
    }
  };

  const handleCertificationChange = (index, evnt) => {
    setCertificationRowsStatus(true);
    const {name, value} = evnt.target;
    const rowsInput = [...CertificationData];
    rowsInput[index][name] = value;
    setCertificationRowsData(rowsInput);
  };

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);

  const saveImage = ({file, onSuccess, index}) => {
    setCertificationRowsStatus(true);
    //console.log('e.target.value :', index);
    const rowsInput = [...CertificationData];
    rowsInput[index].UploadStatus = 1;
    setLoading(true);
    uploadFileToBlob(file, index, 'certificateFile');
  };

  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'application/pdf';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/WEBP/PDF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (isJpgOrPng && !isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  const containerName = `productimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  //console.log('calling uploadFileToBlob -------', storageAccountName);

  /*
  //old
  const uploadFileToBlob = async (file, index) => {
    try {
      if (!file) return [];
      //console.log('calling uploadFileToBlob -------');
      // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
      const blobService = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
      );
      // get Container - full public read access
      const containerClient = blobService.getContainerClient(containerName);
      await containerClient.createIfNotExists({
        access: 'container',
      });
      //console.log('calling uploadFileToBlob -------11111', containerClient);
      // upload file

      const imageID = uuidv4();
      let key = imageID + '.' + file.type.split('/').pop();
      const blobClient = containerClient.getBlockBlobClient(key);

      // console.log('calling uploadFileToBlob -------2222', blobClient);
      const options = {blobHTTPHeaders: {blobContentType: file.type}};
      //console.log('calling uploadFileToBlob -------3333', options);
      await blobClient.uploadBrowserData(file, options);
      setImageURL('/' + key);
      const rowsInput = [...CertificationData];
      rowsInput[index].CertificateImage = '/' + key;
      rowsInput[index].UploadStatus = null;
      setCertificationRowsData(rowsInput);
      setLoading(false);
      setImageError(false);
    } catch (error) {
      const rowsInput = [...CertificationData];
      rowsInput[index].UploadStatus = null;
      console.log('error>>>>>>>>:', error);
      setLoading(false);
    }
    //await createBlobInContainer(containerClient, file);
    // get list of blobs in container
    //return getBlobsInContainer(containerClient);
  };
  */

  // new for node
  const uploadFileToBlob = async (file, index, fileType) => {
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'productimages');
    console.log('@@@@@', file);
    console.log('!!!!!!!', formData);
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.uploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status == 200) {
          if (fileType == 'certificateFile') {
            setImageURL('/' + response.data.data);
            const rowsInput = [...CertificationData];
            rowsInput[index].CertificateImage = '/' + response.data.data;
            rowsInput[index].UploadStatus = null;
            setCertificationRowsData(rowsInput);
            setLoading(false);
            setImageError(false);
          } else if (fileType == 'documentFile') {
            const rowsInput = [...DocumentData];
            rowsInput[index].DocumentImage = '/' + response.data.data;
            rowsInput[index].UploadStatus = null;
            setDocumentRowsData(rowsInput);
            setImageError(false);
          }
        } else {
          if (fileType == 'certificateFile') {
            throw new ERROR('Error in Certificate File Upload');
          } else if (fileType == 'documentFile') {
            throw new ERROR('Error in Document File Upload');
          }
        }
      })
      .catch((error) => {
        // inform the user
        if (fileType == 'certificateFile') {
          console.log('error in Uploading Certificate File', error);
          const rowsInput = [...CertificationData];
          rowsInput[index].UploadStatus = null;
          setLoading(false);
        } else if (fileType == 'documentFile') {
          console.log('error in Uploading Document File', error);
          const rowsInput = [...DocumentData];
          rowsInput[index].UploadStatus = null;
        }
      });
  };

  // new for node
  const removeFileToBlob = async (index, subType) => {
    // console.log('@@@@@@@@@@@@@@@@@ file', file);
    const formData = new FormData();
    if (subType == 'certificateimages') {
      formData.append('new_file', CertificationData[index].CertificateImage);
    } else {
      formData.append('new_file', DocumentData[index].DocumentImage);
    }

    formData.append('type', 'productimages');
    formData.append('subType', subType);
    // console.log('@@@@@ delete', file);
    console.log('!!!!!!!', formData);
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.deleteUploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('!!!!!!!!!!!!4444444 response.data', response.data);
        if (response.status == 200) {
          // const newFileList = fileList.filter((f) => f.uid !== file.uid);
          // beforeUploadCounter--;
          // if (beforeUploadCounter == 0) {
          //   newFileList.sort((a, b) => {
          //     return a.priority - b.priority;
          //   });
          //   //console.log('at line 109 in if WITH SORT :', fileList);
          //   setFileList(newFileList);
          //   dispatch(setProductMediaList(newFileList));
          //   dispatch(editProductModal(true));
          //   dispatch(editProductModal(false));
          //   // uploadImage(false);
          // }
          console.log(`${subType} ${index} deleted successfully!`);
        } else {
          throw new ERROR('Error in Deleting File');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Deleting File', error);
      });
  };

  const [DocumentData, setDocumentRowsData] = useState([]);
  const [DocumentStatus, setDocumentRowsStatus] = useState(false);

  const addDocumentTableRows = () => {
    setDocumentRowsStatus(true);
    const rowsInput = {
      DocumentName: '',
      DocumentImage: '',
      UploadStatus: null,
    };
    setDocumentRowsData([...DocumentData, rowsInput]);
  };
  const deleteDocumentRows = (index) => {
    console.log('deleteDocumentRows', index, DocumentData);
    setDocumentRowsStatus(true);
    const rows = [...DocumentData];
    rows.splice(index, 1);
    setDocumentRowsData(rows);
    if (DocumentData[index].DocumentImage != '') {
      removeFileToBlob(index, 'documentimages');
    }
  };

  const handleDocumentChange = (index, evnt) => {
    setDocumentRowsStatus(true);
    const {name, value} = evnt.target;
    const rowsInput = [...DocumentData];
    rowsInput[index][name] = value;
    setDocumentRowsData(rowsInput);
  };

  const saveDocumentImage = ({file, onSuccess, index}) => {
    setDocumentRowsStatus(true);
    const rowsInput = [...DocumentData];
    rowsInput[index].UploadStatus = 1;
    setDocumentRowsData(rowsInput);
    uploadFileToBlob(file, index, 'documentFile');
  };

  const uploadDocumenFileToBlob = async (file, index) => {
    try {
      if (!file) return [];
      //console.log('calling uploadFileToBlob -------');
      // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
      const blobService = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
      );
      // get Container - full public read access
      const containerClient = blobService.getContainerClient(containerName);
      await containerClient.createIfNotExists({
        access: 'container',
      });
      //console.log('calling uploadFileToBlob -------11111', containerClient);
      // upload file

      const imageID = uuidv4();
      let key = imageID + '.' + file.type.split('/').pop();
      const blobClient = containerClient.getBlockBlobClient(key);

      // console.log('calling uploadFileToBlob -------2222', blobClient);
      const options = {blobHTTPHeaders: {blobContentType: file.type}};
      //console.log('calling uploadFileToBlob -------3333', options);
      await blobClient.uploadBrowserData(file, options);
      //setImageURL('/' + key);
      const rowsInput = [...DocumentData];
      rowsInput[index].DocumentImage = '/' + key;
      rowsInput[index].UploadStatus = null;
      setDocumentRowsData(rowsInput);
      setImageError(false);
    } catch (error) {
      const rowsInput = [...DocumentData];
      rowsInput[index].UploadStatus = null;
      console.log('error>>>>>>>>:', error);
    }
    //await createBlobInContainer(containerClient, file);
    // get list of blobs in container
    //return getBlobsInContainer(containerClient);
  };

  const handelchnage = (evt) => {
    var newContent = evt.editor.getData();
    setContent(newContent);
  };
  const handelchnageProductDesc = (evt) => {
    var newContent = evt.editor.getData();
    setProductDesc(newContent);
  };

  const [pricerowsData, setPriceRowsData] = useState([]);
  const [PriceStatus, setPriceRowsStatus] = useState(true);
  const addPriceTableRows = () => {
    setPriceRowsStatus(true);
    const rowsInput = {
      quantity: '',
      price: '',
    };
    setPriceRowsData([...pricerowsData, rowsInput]);
  };
  const deletePriceTableRows = (index) => {
    setPriceRowsStatus(true);
    const rows = [...pricerowsData];
    rows.splice(index, 1);
    setPriceRowsData(rows);
  };

  const handlePriceChange = (index, evnt) => {
    setPriceRowsStatus(true);
    const {name, value} = evnt.target;
    const rowsInput = [...pricerowsData];
    rowsInput[index][name] = value;
    setPriceRowsData(rowsInput);
  };

  const handleChangeParentCategory = (value) => {
    for (let i = 0; i < parentCategories.length; i++) {
      if (parentCategories[i].id == value) {
        setValueParentCategotyName(parentCategories[i].name);
        break;
      }
    }
    form.setFieldsValue({
      subCategory: [],
    });
  };

  const onChangeProductName = (e) => {
    let productName = e.target.value;
    // let productSlugName = productName.replaceAll(' ', '-').toLowerCase();

    // REGEX TO CONVERT STRING TO VALID URL - ISHAAN
    let productSlugName = productName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\W_]+/g, '-')
      .toLowerCase()
      .replace(/^-+|-+$/g, '');
    // console.log('pppppppppp', productSlugName);
    setProductSlug(productSlugName);
  };

  const onChangeProductPosition = (e) => {};

  useEffect(() => {
    form.setFieldValue('slug', productSlug);
  }, [productSlug]);

  const onChangeDefaultImage = (e) => {
    // setDefaultImageValue(e.target.value);
    setDefaultImageError(false);
  };

  function calvolume(l, b, h) {
    let r = (parseFloat(l) * parseFloat(b) * parseFloat(h)).toFixed(4);
    if (!isNaN(r)) {
      setVolume(r);
    } else {
      setVolume('Volume is not a Number.');
    }
  }
  function changeValues(values) {
    console.log('onChange', values);
    if (
      values.hasOwnProperty('product_length') ||
      values.hasOwnProperty('product_breadth') ||
      values.hasOwnProperty('product_height')
    ) {
      let length = form.getFieldValue('product_length');
      let breadth = form.getFieldValue('product_breadth');
      let height = form.getFieldValue('product_height');
      calvolume(length, breadth, height);
    }
  }

  // for CKEditorNextjs
  // const editorRef = useRef();
  // const [editorLoaded, setEditorLoaded] = useState(false);
  // const {CKEditor, ClassicEditor} = editorRef.current || {};

  // useEffect(() => {
  //   editorRef.current = {
  //     CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
  //     ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
  //   };
  //   setEditorLoaded(true);
  // }, []);

  return (
    <>
      {product && categories && alternativeproductlist && similarproductlist ? (
        <Row>
          <div className="card-body">
            <EditProductHeader handleEditProduct={handleEditProduct} />
            <div className={styles.ProductPage}>
              <Col span={24}>
                <Form
                  key={product.id}
                  form={form}
                  labelCol={{span: 3}}
                  wrapperCol={{span: 21}}
                  autoComplete={'false'}
                  onValuesChange={changeValues}
                  initialValues={{
                    id: String(product.id),
                    parentCategory: product.categorybytag[0]?.name?.split('/')[0],
                    title: product.name,
                    position: product.position,
                    slug: product.slug,
                    price: product.price,
                    status: product.status == 1 ? true : false,
                    // description: product.description,
                    defaultImage: product.selected_default_image,
                    metaDescription: product.meta_description,
                    metaKeyword: product.meta_keyword,
                    sparky_id: product.sparky_id,
                    manufacturer_id: product.manufacturer_id,
                    cable: product?.cable_pricing_permeter || null,
                    terminal1: product?.terminal_1_id || null,
                    terminal2: product?.terminal_2_id || null,
                    product_key_features: product
                      ? product.product_key_features
                      : null,
                    product_stock: product ? product.stock : null,
                    product_pallets: product ? product.pallets : null,
                    product_weight: product ? product.weight : null,
                    product_length: product ? product.length : 0.01,
                    product_breadth: product ? product.breadth : 0.01,
                    product_height: product ? product.height : 0.01,
                    product_cbm: product ? parseFloat(product.cbm) : null,
                    qty_per_pack: product ? product.qty_per_pack : 0,
                    quantity_type: product ? product.qty_type : null,
                    sections: defaultSections ? defaultSections : null,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="parentCategory"
                    label="Category"
                    rules={[
                      {
                        required: true,
                        message: 'Please select Category',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      // mode="multiple"
                      placeholder="Category"
                      onChange={handleChangeParentCategory}
                      allowClear
                      name="status"
                      // defaultValue={
                      //   product && product.categorybytag
                      //     ? product.categorybytag.map((item) => item.id)
                      //     : []
                      // }
                      showSearch
                      optionFilterProp="children"
                    >
                      {parentCategories &&
                        parentCategories.map((item, i) => {
                          return <Option value={item.id}>{item.name}</Option>;
                        })}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="subCategory"
                    label="Sub Category"
                    rules={[
                      {
                        required:
                          valuecategoryid && valuecategoryid.length != 0
                            ? false
                            : true,
                        message: 'Please select Sub Category',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      mode="multiple"
                      placeholder="Sub Category"
                      onChange={handleChangeCategoty}
                      allowClear
                      name="status"
                      defaultValue={
                        product && product.categorybytag
                          ? product.categorybytag.map((item) => item.id)
                          : []
                      }
                      showSearch
                      optionFilterProp="children"
                    >
                      {categories &&
                        categories
                          .filter(
                            (c) =>
                              c.name.split('/')[0] === valueParentCategoryName
                          )
                          .map((item, i) => {
                            return (
                              <Option value={item.id}>
                                {item.name.split('/').pop()}
                              </Option>
                            );
                          })}
                    </Select>
                  </Form.Item>
                  {filterNameList
                    .filter((ele) => {
                      return ele.subCatId == valuecategoryid;
                    })
                    .map((item, i) => {
                      return (
                        <Form.Item
                          name={'custmFilterNumber' + item.custmFilterNumber}
                          label={item.filterName}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter ' + item.filterName,
                            },
                          ]}
                          initialValue={
                            product[
                              'custmFilterNumber' + item.custmFilterNumber
                            ]
                          }
                        >
                          {console.log(
                            '<<<<<<<<<<<<<333333',
                            product[
                              'custmFilterNumber' + item.custmFilterNumber
                            ]
                          )}
                          <Input
                            placeholder={'Enter ' + item.filterName}
                            // onChange={onChangeProductName}
                          />
                        </Form.Item>
                      );
                    })}

                  <Form.Item
                    name="sections"
                    label="Select Sections"
                    rules={[
                      {
                        required: false,
                        message: 'Please select a Section',
                        type: 'array',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      // required
                      mode="multiple"
                      placeholder="sections"
                      onChange={handleChangeSection}
                      allowClear
                      name="sections"
                      showSearch
                      optionFilterProp="children"
                      defaultValue={defaultSections}
                    >
                      {sectionList &&
                        sectionList.map((item, i) => {
                          return (
                            <Option value={item.id}>{item.section_name}</Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  {sectionNumberList.map((item, i) => {
                    return (
                      <Form.Item
                        name={'section_id_' + item.sectionId + '_value'}
                        label={item.sectionName + ' Position'}
                        rules={[
                          {
                            required: true,
                            message:
                              'Please enter ' + item.sectionName + ' Position',
                          },
                        ]}
                        // initialValue={
                        //   product &&
                        //   product.product_tags &&
                        //   product.product_tags.filter(
                        //     (item) => item.tag_id == item.sectionId
                        //   )[0]?.order_no
                        // }
                        initialValue={
                          product['section_id_' + item.sectionId + '_value']
                        }
                      >
                        <>
                          <InputNumber
                            placeholder={
                              'Enter ' + item.sectionName + ' Position'
                            }
                            onChange={(value) =>
                              handleChangeSectionPosition(value, item.sectionId)
                            }
                          />
                        </>
                      </Form.Item>
                    );
                  })}

                  <Form.Item
                    name="title"
                    label="Product Name"
                    rules={[
                      {required: true, message: 'Please enter product name'},
                    ]}
                  >
                    <Input
                      placeholder="Enter Product Name"
                      value={product.name}
                      onChange={onChangeProductName}
                    />
                  </Form.Item>

                  <Form.Item
                    name="position"
                    label="Product Position"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter product position',
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter Product Position"
                      value={product.position}
                      onChange={onChangeProductPosition}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Product URL"
                    name="slug"
                    rules={[
                      {required: true, message: 'Please enter product url'},
                    ]}
                  >
                    <Input
                      onChange={slugInput}
                      addonBefore={process.env.WEB_DOMAIN}
                      placeholder="Enter Product URL"
                      value={product.slug}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    name="sparky_id"
                    label="Sparky ID"
                    // rules={[
                    //   {required: true, message: 'Please enter product name'},
                    // ]}
                  >
                    <Input
                      placeholder="Enter Sparky ID"
                      value={product.sparky_id}
                    />
                  </Form.Item>

                  {valueParentCategoryName === 'Pre Assembled Leads' && (
                    <>
                      {/* Cable Pricing per meter Field */}
                      <Form.Item name="cable" label="Pricing per meter">
                        <Select
                          placeholder="Cable"
                          onChange={(value) => {
                            const selectedCable = cableprice.find(
                              (item) => item.id === value
                            );
                            handleChangeCable(selectedCable.pricing_per_meter);
                            form.setFieldsValue({cable: value});
                          }}
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) => {
                            const childrenText = option.children
                              .map((child) =>
                                typeof child === 'string'
                                  ? child
                                  : child.props.children
                              )
                              .join(' ');

                            return childrenText
                              .toLowerCase()
                              .includes(input.toLowerCase());
                          }}
                        >
                          {cableprice &&
                            cableprice.map((item, i) => (
                              <Option key={i} value={item.id}>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    marginRight: '10px',
                                  }}
                                >
                                  Sparky Id: {item.sparky_id}
                                </span>
                                <span style={{color: '#1890ff'}}>
                                  Price per meter: ${item.pricing_per_meter}
                                </span>
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      {/* Terminal 1 Field */}
                      <Form.Item name="terminal1" label="Select Terminal 1">
                        <Select
                          placeholder="Terminal 1"
                          onChange={(value) => {
                            handleChangeTerminal1(value);
                            form.setFieldsValue({terminal1: value});
                          }}
                          allowClear
                          showSearch
                          optionFilterProp="children" // Use 'children' as the option filter property
                          filterOption={(input, option) => {
                            // Flatten children to search within the text
                            const childrenText = option.children
                              .map((child) =>
                                typeof child === 'string'
                                  ? child
                                  : child.props.children
                              )
                              .join(' ');

                            return childrenText
                              .toLowerCase()
                              .includes(input.toLowerCase());
                          }}
                        >
                          {terminal1price &&
                            terminal1price.map((item, i) => (
                              <Option key={i} value={item.id}>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    marginRight: '10px',
                                  }}
                                >
                                  Sparky Id: {item.sparky_id}
                                </span>
                                <span
                                  style={{
                                    color: '#1890ff',
                                    marginRight: '10px',
                                  }}
                                >
                                  Item Charges: ${item.price}
                                </span>
                                <span style={{color: '#52c41a'}}>
                                  Assembly Charges: ${item.assembly_charges}
                                </span>
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      {/* Terminal 2 Field */}
                      <Form.Item name="terminal2" label="Select Terminal 2">
                        <Select
                          placeholder="Terminal 2"
                          onChange={(value) => {
                            handleChangeTerminal2(value);
                            form.setFieldsValue({terminal2: value});
                          }}
                          allowClear
                          showSearch
                          optionFilterProp="children" // Use 'children' as the option filter property
                          filterOption={(input, option) => {
                            // Flatten children to search within the text
                            const childrenText = option.children
                              .map((child) =>
                                typeof child === 'string'
                                  ? child
                                  : child.props.children
                              )
                              .join(' ');

                            return childrenText
                              .toLowerCase()
                              .includes(input.toLowerCase());
                          }}
                        >
                          {terminal2price &&
                            terminal2price.map((item, i) => (
                              <Option key={i} value={item.id}>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    marginRight: '10px',
                                  }}
                                >
                                  Sparky Id: {item.sparky_id}
                                </span>
                                <span
                                  style={{
                                    color: '#1890ff',
                                    marginRight: '10px',
                                  }}
                                >
                                  Item Charges: ${item.price}
                                </span>
                                <span style={{color: '#52c41a'}}>
                                  Assembly Charges: ${item.assembly_charges}
                                </span>
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </>
                  )}

                  <Form.Item
                    name="manufacturer_id"
                    label="Manufacturer ID"
                    // rules={[
                    //   {required: true, message: 'Please enter product name'},
                    // ]}
                  >
                    <Input
                      placeholder="Enter Manufacturer ID"
                      value={
                        product.manufacturer_id == 'null'
                          ? ''
                          : product.manufacturer_id
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="qty_type"
                    label="Quantity Type"
                    rules={[
                      {
                        required: product.qty_type ? false : true,
                        message: 'Please select Quantity Type',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      // mode="multiple"
                      placeholder="Quantity Type"
                      onChange={handleChangeQtyType}
                      allowClear
                      name="qty_type"
                      showSearch
                      optionFilterProp="children"
                      defaultValue={product && product.qty_type}
                    >
                      <Option value={'unit'}>Unit</Option>
                      <Option value={'bag'}>Bag</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="qty_per_pack"
                    label="Quantity per pack"
                    rules={[
                      {
                        required: quantityType == 'unit' ? false : true,
                        message: 'Please enter quantity per pack',
                      },
                    ]}
                    // initialValue={200}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      type="number"
                      min={1}
                      placeholder="Enter Quantity per pack"
                      disabled={quantityType == 'unit' ? true : false}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_stock"
                    label="Product Stock"
                    // rules={[
                    //   {required: true, message: 'Please enter product name'},
                    // ]}
                  >
                    <InputNumber
                      type="number"
                      min={1}
                      placeholder="Enter Product Stock"
                      value={product.stock}
                      // value={product.manufacturer_id}
                      rules={[
                        {required: true, message: 'Please enter product stock'},
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_pallets"
                    label="Product Pallets"
                    rules={[
                      {required: true, message: 'Please enter product pallets'},
                    ]}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      type="number"
                      min={0}
                      placeholder="Enter Product Pallets"
                      // stringMode
                      // value={product.stock}
                      // value={product.manufacturer_id}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_weight"
                    label="Product Weight"
                    rules={[
                      {required: true, message: 'Please enter product weight'},
                    ]}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      type="number"
                      min={0}
                      placeholder="Enter Product Weight"
                      stringMode
                      // formatter={(value) => `${value}Kg`}
                      // parser={(value) => value.replace('Kg', '')}
                      addonAfter="Kg"
                      // value={product.stock}
                      // value={product.manufacturer_id}
                    />
                  </Form.Item>
                  <Form.Item
                    name="product_length"
                    label="Product Length"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter product length',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      type="number"
                      step=".01" // onChange={(value)=>setLength(value)}
                      min={0.0001}
                      // defaultValue={0}
                      placeholder="Enter Product Length"
                      stringMode
                      addonAfter="m"
                      // onChange={(value)=>setLength(value)}
                      // value={product.stock}
                      // value={product.manufacturer_id}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_breadth"
                    label="Product Breadth"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter product breadth',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      step=".01"
                      type="number"
                      min={0.0001}
                      // defaultValue={0}
                      placeholder="Enter Product Breadth"
                      stringMode
                      addonAfter="m"
                      // onChange={(value)=>setBreadth(value)}
                      // value={product.stock}
                      // value={product.manufacturer_id}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_height"
                    label="Product Height"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter product height',
                      },
                    ]}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      type="number"
                      step=".01"
                      min={0.0001}
                      // defaultValue={0}
                      placeholder="Enter Product Height"
                      stringMode
                      addonAfter="m"
                      // onChange={(value)=>setHeight(value)}
                      // value={product.stock}
                      // value={product.manufacturer_id}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_cbm"
                    label="Product Cubic"
                    // rules={[
                    //   {required: true, message: 'Please enter product cubic'},
                    // ]}
                  >
                    {/* <InputNumber
                      disabled
                      style={{width: '50%'}}
                      value={volume}
                      // type="number"
                      // min={0}
                      placeholder="Enter Product Cubic"
                      stringMode
                    /> */}
                    <Typography>
                      {volume} m<sup>3</sup>
                    </Typography>
                  </Form.Item>

                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                      {
                        required: pricerowsData.length > 0 ? false : true,
                        message: 'Please enter product price',
                      },
                    ]}

                    // rules={[
                    //   {required: true, message: 'Please enter product name'},
                    // ]}
                  >
                    {/* <InputNumber
                      style={{width: '100%'}}
                      placeholder="Enter Product Price"
                    /> */}
                    <table className="table tableRow">
                      <thead>
                        <tr>
                          <th>Product Quantity</th>
                          {valueParentCategoryName === 'Pre Assembled Leads' ? (
                            <th>
                              Component & Assembly Charges (Including terminals)
                            </th>
                          ) : (
                            <th>Product Price</th>
                          )}

                          <th>
                            <p
                              className="btn btn-outline-success"
                              onClick={addPriceTableRows}
                              style={{marginBottom: 0}}
                            >
                              +
                            </p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <PriceTableRows
                          pricerowsData={pricerowsData}
                          deletePriceTableRows={deletePriceTableRows}
                          handlePriceChange={handlePriceChange}
                        />
                      </tbody>
                    </table>

                    {/* <div className="col-sm-4"></div>
                    <Input
                      placeholder="Enter Sparky ID"
                      value={product.sparky_id}
                    /> */}
                  </Form.Item>

                  <Form.Item
                    label="Status"
                    name="status"
                    value={product.status}
                  >
                    <Radio.Group>
                      <Radio.Button value={true}>Publish</Radio.Button>
                      <Radio.Button value={false}>Unpublish</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {required: true, message: 'Please enter description'},
                    ]}
                  >
                    {/* <Input.TextArea
                      rows={4}
                      placeholder="Enter Product Descriptions"
                      value={product.description}
                    /> */}
                    <CKEditor
                      data={productDesc}
                      onChange={handelchnageProductDesc}
                      ref={prodDescEditor}
                      config={config}
                    />
                  </Form.Item>

                  <Form.Item name="metaKeyword" label="Meta Keyword">
                    <TextArea
                      rows={4}
                      maxLength={500}
                      placeholder="Enter Meta keyword"
                      value={product.meta_keyword ? '' : product.meta_keyword}
                    />
                  </Form.Item>

                  <Form.Item name="metaDescription" label="Meta Description">
                    <TextArea
                      rows={4}
                      maxLength={500}
                      placeholder="Enter Meta Description"
                      value={
                        product.meta_description == 'undefined'
                          ? ''
                          : product.meta_description
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="productImages"
                    label="Images"
                    rules={[
                      {
                        required:
                          productMedia && productMedia.length > 0
                            ? false
                            : true,
                        // required: true,
                        message: 'Please upload product images',
                      },
                    ]}
                  >
                    <EditImagePicker
                      images={product.product_media}
                      uploadImage={uploadImage}
                      legacyId={product.id}
                      getimageno={getimageno}
                      productId={productData.id}
                      defaultImageError={defaultImageError}
                      form={form}
                      setRs={setRs}
                    />
                  </Form.Item>
                  <Form.Item
                    name="defaultImage"
                    label="Default Image"
                    rules={[
                      {
                        required: defaultImageError,
                        message: 'Please select the default image',
                      },
                    ]}
                  >
                    <Radio.Group
                      name="radiogroup"
                      onChange={onChangeDefaultImage}
                      defaultValue={`${product.selected_default_image}`}
                    >
                      {productMedia &&
                        productMedia.map((media) => (
                          <Radio
                            size="small"
                            value={media.uid}
                            optionType="button"
                          >
                            <Image preview={false} width={50} src={media.url} />
                          </Radio>
                        ))}
                    </Radio.Group>
                    {/* {defaultImageError && (
                      <div
                        class="invalid-feedback"
                        style={{
                          display: 'block',
                          // marginTop: '-5px',
                          // height: '100px',
                        }}
                      >
                        Please select the default image
                      </div>
                    )} */}
                  </Form.Item>
                  <Form.Item label="Specifications" name="features">
                    <CKEditor
                      data={content}
                      onChange={handelchnage}
                      ref={editor}
                      config={config}
                    />

                    {/* <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      // tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                      onChange={(newContent) => {}}
                    /> */}
                    {/* {editorLoaded ? (
                      <CKEditor
                        // className="mt-3 wrap-ckeditor"
                        name="CKEditor"
                        editor={ClassicEditor}
                        // config={config}
                        data={content}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log('%%%%%', {event, editor, data});
                          setContent(data);
                        }}
                        onBlur={(event, editor) => {
                          console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log('Focus.', editor);
                        }}
                      />
                    ) : (
                      'loading...'
                    )} */}
                  </Form.Item>

                  <Form.Item
                    //name="relatedproduct"
                    label="Add similar product"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select related product"
                      onChange={handleRelatedProduct}
                      showSearch
                      optionFilterProp="children"
                      defaultValue={
                        product && product.relatedproducttag
                          ? product.relatedproducttag.map((item) => item.id)
                          : []
                      }
                    >
                      {similarproductlist &&
                        similarproductlist.map((item) => {
                          return (
                            <Option value={item.id}>
                              {/* {item.name.split('/').pop()} */}
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    //name="relatedproduct"
                    label="Add alternative product"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select alternative product"
                      onChange={handleAlternativeProduct}
                      showSearch
                      optionFilterProp="children"
                      defaultValue={
                        product && product.alternativeproducttag
                          ? product.alternativeproducttag.map((item) => item.id)
                          : []
                      }
                    >
                      {alternativeproductlist &&
                        alternativeproductlist.map((item) => {
                          return (
                            <Option value={item.id}>
                              {/* {item.name.split('/').pop()} */}
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    //name="relatedproduct"
                    label="Upload Certificate"
                  >
                    <table className="table tableRow">
                      <thead>
                        <tr>
                          <th>Certificate Name</th>
                          <th>Certificate File</th>
                          <th></th>

                          <th>
                            <p
                              className="btn btn-outline-success"
                              onClick={addTableRows}
                              style={{marginBottom: 0}}
                            >
                              +
                            </p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <CertificationTableRows
                          CertificationData={
                            CertificationData && CertificationData
                          }
                          deleteCertificationRows={deleteCertificationRows}
                          handleCertificationChange={handleCertificationChange}
                          saveImage={saveImage}
                          beforeUpload={beforeUpload}
                          loading={loading}
                          styles={styles}
                        />
                      </tbody>
                    </table>

                    <div className="col-sm-4"></div>
                  </Form.Item>
                  <Form.Item
                    //name="relatedproduct"
                    label="Upload Document"
                  >
                    <table className="table tableRow">
                      <thead>
                        <tr>
                          <th>Document Name</th>
                          <th>Document File</th>
                          <th></th>

                          <th>
                            <p
                              className="btn btn-outline-success"
                              onClick={addDocumentTableRows}
                              style={{marginBottom: 0}}
                            >
                              +
                            </p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <DocumentTableRows
                          DocumentData={DocumentData && DocumentData}
                          deleteDocumentRows={deleteDocumentRows}
                          handleDocumentChange={handleDocumentChange}
                          saveDocumentImage={saveDocumentImage}
                          beforeUpload={beforeUpload}
                          styles={styles}
                        />
                      </tbody>
                    </table>

                    <div className="col-sm-4"></div>
                  </Form.Item>
                  <Form.Item
                    style={{textAlign: 'right', justifyContent: 'flex-end'}}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{marginTop: '10px'}}
                      loading={submitLoading}
                    >
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </div>
          </div>
          {uploadimageloader && (
            <Spin tip="Please Wait...." size="large" className={styles.Spin}>
              <div className="content" />
            </Spin>
          )}
        </Row>
      ) : (
        <Spin tip="Please Wait...." size="large" className={styles.Spin}>
          <div className="content" />
        </Spin>
      )}
    </>
  );
};

export default EditProductModal;
