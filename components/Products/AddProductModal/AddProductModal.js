import React, {useState, useEffect, useRef, useMemo} from 'react';
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
import {
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styles from './AddProductModal.module.scss';
import {v4 as uuidv4} from 'uuid';
import {useSelector, useDispatch} from 'react-redux';
import AddProductHeader from '../Header/AddProductHeader';
import {cmsendPoint, envUrl} from '../../../utils/factory';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Router from 'next/router';
import ImagePicker from '../ProductsTable/components/ImagePicker';
import CertificationTableRows from '../ProductsTable/components/CertificationTableRows';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import DocumentTableRows from '../ProductsTable/components/DocumentTableRows';
import CKEditor from 'ckeditor4-react';
import PriceTableRows from '../ProductsTable/components/PriceTableRows';
const {Option} = Select;
const {TextArea} = Input;
const AddProductModal = ({handleAddProduct}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const defaultImageValue = Form.useWatch('defaultImage', form);
  const nameValue = Form.useWatch('slug', form);
  const [categories, setCategories] = useState(null);
  const [alternativeproductlist, setAlternativeProductList] = useState(null);
  const [similarproductlist, setSimilarProductList] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueParentCategoryid, setValueParentCategotyid] = useState(null);
  const [valueParentCategoryName, setValueParentCategotyName] = useState('');
  const [valuecategoryid, setValueCategotyid] = useState(null);
  console.log('vvvvvvvvv', valuecategoryid);
  const [valueIndustryid, setValueIndustryid] = useState(null);
  const [valueSectionId, setValueSectionId] = useState(null);
  const [valueBrandid, setValueBrandid] = useState(null);
  const [relatedproduct, setValueRelatedProduct] = useState({});
  const [relatedproductid, setValueRelatedProductid] = useState(null);
  const [alternativeproduct, setValueAlternativeProduct] = useState({});
  const [alternativeproductid, setValueAlternativeProductid] = useState(null);
  const [uploadimageloader, setUploadImageLoader] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterNameList, setFilterNameList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [sectionNumberList, setSectionNumberList] = useState([]);
  console.log('sectionNumberList', sectionNumberList);
  const [parentCategories, setParentCategories] = useState(null);
  const [productSlug, setProductSlug] = useState(null);
  const [defaultImageError, setDefaultImageError] = useState(false);
  const [rs, setRs] = useState(0);
  const [volume, setVolume] = useState(0);
  const [quantityType, setQuantityType] = useState(null);
  const [valuecableprice, setvaluecableprice] = useState(null);
  const [valueterminal1price, setvalueterminal1price] = useState(null);
  const [valueterminal2price, setvalueterminal2price] = useState(null);
  const [cableprice, setcableprice] = useState([]);
  const [terminal1price, setterminal1price] = useState([]);
  const [terminal2price, setterminal2price] = useState([]);
  const [showPreAssembledFields, setShowPreAssembledFields] = useState(false);

  console.log('rs', terminal1price);
  console.log('rs', terminal2price);
  // const [defaultImageValue, setDefaultImageValue] = useState(null);
  // console.log('defaultImageValue', defaultImageValue);
  const productMedia = useSelector(
    (status) => status.productReducer.productMedia
  );
  const visible = useSelector(
    (status) => status.productReducer.editProductModal
  );
  // console.log('##########productMedia', productMedia, '---------', visible);
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
            setParentCategories(data.data.data.parentCategory.data);
            setCategories(data.data.data.category.data);
            setAlternativeProductList(data.data.data.alternativeproduct.data);
            setSimilarProductList(data.data.data.similarproduct.data);
            setIndustries(data.data.data.industries.data);
            setBrands(data.data.data.brands.data);
            setFilterNameList(data.data.data.filterNameList.data);
            setSectionList(data.data.data.sectionList.data);
            setcableprice(data.data.data.custCableList.data);
            setterminal1price(data.data.data.custTerminalList.data);
            setterminal2price(data.data.data.custTerminalList.data);
            // setSectionList([{id: 1, section_name: 'Popular Products'}]);

            return {state: true, message: 'sucess'};
          });
      } catch (error) {
        //console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  // console.log('ccccccccccccc', terminal2price);
  const handleChangeParentCategory = (value) => {
    setValueParentCategotyid(value);
    // console.log('vvvvvvvvvvv', value);
    for (let i = 0; i < parentCategories.length; i++) {
      if (parentCategories[i].id == value) {
        setValueParentCategotyName(parentCategories[i].name);

        if (parentCategories[i].name === 'Pre Assembled Leads') {
          setShowPreAssembledFields(true);
        } else {
          setShowPreAssembledFields(false);
        }

        break;
      }
    }
    form.setFieldsValue({
      category: [],
    });
    // setValueParentCategotyName(value.split('/')[0]);
  };
  // console.log('ccccc2222222', valueParentCategoryName);
  const handleChangeCategoty = (value) => {
    console.log('vvvvvvvv2222222222', value);
    setValueCategotyid(value);
  };
  const handleChangeIndustries = (value) => {
    setValueIndustryid(value);
  };

  const handleChangeCable = (value) => {
    setvaluecableprice(value);
    form.setFieldsValue({
      cable: [],
    });
  };

  // Handle change for terminal1
  const handleChangeTerminal1 = (value) => {
    setvalueterminal1price(value);
    form.setFieldsValue({
      terminal1: [],
    });
  };

  // Handle change for terminal2
  const handleChangeTerminal2 = (value) => {
    setvalueterminal2price(value);
    form.setFieldsValue({
      terminal2: [],
    });
  };

  console.log({valuecableprice});
  console.log({valueterminal1price});
  console.log({valueterminal2price});

  const handleChangeSection = (value) => {
    // const sectionName  = sectionList && sectionList.filter((i) => i.id === value);
    // setValueCategoty({...categoryname.name});
    console.log('handleChangeSection value', value);

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

  const handleChangeQtyType = (value) => {
    console.log('selected>>>>>', value);
    setQuantityType(value);
  };

  const slugInput = (e) => {
    const {value} = e.target;
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    // await form.validateFields();
    console.log('################### values =', values);
    if (defaultImageValue == undefined) {
      // values.defaultImage = undefined;
      console.log('defaultImageValue is undefined');
      setDefaultImageError(true);
      setSubmitLoading(false);
      return;
    }
    // form.validateFields(['defaultImage']);
    let final_section_save = [];
    if (values.sections) {
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
    }
    console.log('################### final_section_save =', final_section_save);
    try {
      const variables = {
        ...values,
        id: values.id,
        title: values.name,
        // description: values.description,
        description: productDesc,
        price: values.price,
        // slug: values.slug.replace(/ /g, '-').toLowerCase(),
        slug: productSlug,
        status: values.status === undefined ? true : values.status,
        industry_select:
          values.industry_select === undefined ? true : values.industry_select,
        brand_select:
          values.brand_select === undefined ? true : values.brand_select,
        metaDescription: values.metaDescription,
        metaKeyword: values.metaKeyword,
        product_key_features: content,
        parent_category_id: valueParentCategoryid,
        category_id: valuecategoryid,
        industry_id: valueIndustryid,
        brand_id: valueBrandid,
        relatedproduct_id: relatedproductid,
        alternativeproduct_id: alternativeproductid,
        defaultImage: values.defaultImage,
        media: productMedia,
        certificate: CertificationData,
        document: DocumentData,
        pricejson: pricerowsData,
        cable_pricing_permeter: parseFloat(valuecableprice),
        terminal_1_id: valueterminal1price,
        terminal_2_id: valueterminal2price,
        sparky_id: values.sparky_id,
        manufacturer_id: values.manufacturer_id ? values.manufacturer_id : null,
        product_stock: values.product_stock ? values.product_stock : null,
        product_pallets: values.product_pallets,
        product_weight: Number(values.product_weight),
        product_length: parseFloat(values.product_length),
        product_breadth: parseFloat(values.product_breadth),
        product_height: parseFloat(values.product_height),
        product_cbm: parseFloat(volume),
        qty_per_pack: quantityType == 'unit' ? null : values.qty_per_pack,
        qty_type: quantityType,
        final_section_save: final_section_save,
      };
      // to resolve the bug, where features is forming a function and not making the axios request
      // resolve the error => TypeError: Converting circular structure to JSON since features is coming from ..values
      delete variables.features;
      console.log(
        'send variablesssssssssssssssssss -----zzzzzzzzzzzz',
        variables
      );
      // setSubmitLoading(false);
      // return;
      const data = await axios.post(
        `${envUrl.baseUrl}${cmsendPoint.addProduct}`,
        variables,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('dataaaaaaaaaaaaaaaaa----------', data);
      if (data);
      setSubmitLoading(false);
      handleAddProduct();
      //Router.push('/manage/products');
    } catch (error) {
      //console.log('error', error);
      setSubmitLoading(false);
    }
  };

  const handleRelatedProduct = (value) => {
    //setValueRelatedProduct({...productname.name});
    setValueRelatedProductid(value);
  };

  const handleAlternativeProduct = (value) => {
    // setValueAlternativeProduct({...productname.name});
    setValueAlternativeProductid(value);
  };

  const getimageno = () => {
    console.log('SAVE REQUEST CALLED :');
  };

  const uploadImage = (e) => {
    setUploadImageLoader(e);
  };

  const [CertificationData, setCertificationRowsData] = useState([]);

  const addTableRows = () => {
    const rowsInput = {
      CertificateName: '',
      CertificateImage: '',
      UploadStatus: null,
    };
    setCertificationRowsData([...CertificationData, rowsInput]);
  };

  const deleteCertificationRows = (index) => {
    const certificateFile = CertificationData[index].CertificateImage;
    removeFileToBlob(certificateFile, index, 'certificateFile');
    const rows = [...CertificationData];
    rows.splice(index, 1);
    setCertificationRowsData(rows);
  };

  // new for node
  const removeFileToBlob = async (file, index, fileType) => {
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'productimages');
    console.log('@@@@@ delete', file);
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
          // if (fileType == 'certificateFile') {
          //   const rowsInput = [...CertificationData];
          //   rowsInput[index].CertificateImage = '';
          //   rowsInput[index].UploadStatus = null;
          //   setCertificationRowsData(rowsInput);
          //   setImageURL(null);
          //   setLoading(false);
          // } else if (fileType == 'documentFile') {
          //   const rowsInput = [...DocumentData];
          //   rowsInput[index].DocumentImage = '';
          //   rowsInput[index].UploadStatus = null;
          //   setDocumentRowsData(rowsInput);
          //   setImageError(true);
          // }
        } else {
          throw new ERROR('Error in Deleting File');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Deleting File', error);
      });
  };

  const handleCertificationChange = (index, evnt) => {
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

  // const containerName = `productimages`;
  // const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  // const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  //console.log('calling uploadFileToBlob -------', storageAccountName);

  /* old
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

  const [DocumentData, setDocumentRowsData] = useState([]);
  //console.log('########DocumentData########', DocumentData);
  const addDocumentTableRows = () => {
    const rowsInput = {
      DocumentName: '',
      DocumentImage: '',
      UploadStatus: null,
    };
    setDocumentRowsData([...DocumentData, rowsInput]);
  };
  const deleteDocumentRows = (index) => {
    const documentFile = DocumentData[index].DocumentImage;
    removeFileToBlob(documentFile, index, 'documentFile');
    const rows = [...DocumentData];
    rows.splice(index, 1);
    setDocumentRowsData(rows);
  };

  const handleDocumentChange = (index, evnt) => {
    const {name, value} = evnt.target;
    const rowsInput = [...DocumentData];
    rowsInput[index][name] = value;
    setDocumentRowsData(rowsInput);
  };

  const saveDocumentImage = ({file, onSuccess, index}) => {
    const rowsInput = [...DocumentData];
    rowsInput[index].UploadStatus = 1;
    setDocumentRowsData(rowsInput);
    uploadFileToBlob(file, index, 'documentFile');
  };

  /* old
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
  */

  // new for node
  const uploadDocumenFileToBlob = async (file, index) => {
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
          const rowsInput = [...DocumentData];
          rowsInput[index].DocumentImage = '/' + response.data.data;
          rowsInput[index].UploadStatus = null;
          setDocumentRowsData(rowsInput);
          setImageError(false);
        } else {
          throw new ERROR('Error in Document File Upload');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Uploading Document File', error);
        const rowsInput = [...DocumentData];
        rowsInput[index].UploadStatus = null;
      });
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

  const addPriceTableRows = () => {
    const rowsInput = {
      quantity: '',
      price: '',
    };
    setPriceRowsData([...pricerowsData, rowsInput]);
  };
  const deletePriceTableRows = (index) => {
    const rows = [...pricerowsData];
    rows.splice(index, 1);
    setPriceRowsData(rows);
  };

  const handlePriceChange = (index, evnt) => {
    const {name, value} = evnt.target;
    const rowsInput = [...pricerowsData];
    rowsInput[index][name] = value;
    setPriceRowsData(rowsInput);
  };

  const onChangeProductName = (e) => {
    let productName = e.target.value;
    // let productSlugName = productName.replaceAll(' ', '-').toLowerCase();
    // let productSlugName = productName
    //   .replaceAll(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/] \s /gi, '-')
    //   .toLowerCase();

    // REGEX TO CONVERT STRING TO VALID URL - ISHAAN
    // let productSlugName = productName
    //   .trim()
    //   .toLowerCase()
    //   .replace(/[\W_]+/g, '-')
    //   .replace(/^-+|-+$/g, '');
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

  // console.log('pppppp2222222222', productSlug);

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
    // console.log('onChange', values);
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

  /* Code for duplicate sparky id check */
  const [duplicateSparkyIdError, setDuplicateSparkyIdError] = useState({
    enable: false,
    helpText: '',
  });
  const duplicateSparkyIdErrorRef = useRef(duplicateSparkyIdError);
  const checkDuplicateSparkyId = () => {
    console.log('form.sparky_id', form.getFieldValue('sparky_id'));
    axios
      .get(`${envUrl.baseUrl}${cmsendPoint.check}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        params: {
          sparky_id: form.getFieldValue('sparky_id'),
        },
      })
      .then(function (response) {
        console.log('!!! response', response);
        if (response.data) {
          setDuplicateSparkyIdError({
            enable: response.data.sparky_id,
            helpText: response.data.sparky_id_details,
          });
        }
      })
      .catch((error) => {
        console.log('API error in check :::::', error);
        // setLoader(false);
      })
      .finally(() => {});
  };
  console.log({checkDuplicateSparkyId});

  useEffect(() => {
    console.log(
      'duplicateSparkyIdError UE -> updated duplicateSparkyIdError',
      duplicateSparkyIdError
    );
    duplicateSparkyIdErrorRef.current = duplicateSparkyIdError;
    // if (duplicateSparkyIdError.enable) {
    form.validateFields([['sparky_id']]);
    // }
  }, [duplicateSparkyIdError]);

  return (
    <>
      {categories && alternativeproductlist && similarproductlist ? (
        <Row>
          <div className="card-body">
            <AddProductHeader handleAddProduct={handleAddProduct} />
            <div className={styles.ProductPage}>
              <Col span={24}>
                <Form
                  form={form}
                  autoComplete="false"
                  labelCol={{span: 3}}
                  wrapperCol={{span: 21}}
                  onFinish={(values) => onFinish(values)}
                  onValuesChange={changeValues}
                >
                  <Form.Item
                    name="parentCategory"
                    label="Select Category"
                    rules={[
                      {
                        required: true,
                        message: 'Please select Category',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      placeholder="Category"
                      onChange={handleChangeParentCategory}
                      allowClear
                      name="status"
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
                    name="category"
                    label="Select Sub Category"
                    rules={[
                      {
                        required: true,
                        message: 'Please select Sub Category',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      // mode="multiple"
                      placeholder="Sub Category"
                      onChange={handleChangeCategoty}
                      allowClear
                      name="status"
                      showSearch
                      optionFilterProp="children"
                    >
                      {/* {categories && 
                        categories.map((item, i) => {
                          return (
                            <Option value={item.id}>
                              {item.name.split('/').pop()}
                            </Option>
                          );
                        })} */}
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
                        >
                          <Input
                            placeholder={'Enter ' + item.filterName}
                            // onChange={onChangeProductName}
                          />
                        </Form.Item>
                      );
                    })}
                  {/* <Form.Item
                    name="industry"
                    label="Select Industry"
                    rules={[
                      {
                        required: false,
                        message: 'Please Select Industry',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      mode="multiple"
                      placeholder="Industry"
                      onChange={handleChangeIndustries}
                      allowClear
                      name="industry_select"
                      showSearch
                      optionFilterProp="children"
                    >
                      {industries &&
                        industries.map((item, i) => {
                          return <Option value={item.id}>{item.name}</Option>;
                        })}
                    </Select>
                  </Form.Item> */}
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
                      required
                      mode="multiple"
                      placeholder="sections"
                      onChange={handleChangeSection}
                      allowClear
                      name="sections"
                      showSearch
                      optionFilterProp="children"
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
                      >
                        <InputNumber
                          placeholder={
                            'Enter ' + item.sectionName + ' Position'
                          }
                          onChange={(value) =>
                            handleChangeSectionPosition(value, item.sectionId)
                          }
                        />
                      </Form.Item>
                    );
                  })}
                  <Form.Item
                    name="brand"
                    label="Select Brand"
                    rules={[
                      {
                        required: false,
                        message: 'Please select Brand',
                      },
                    ]}
                  >
                    <Select
                      // disabled
                      // mode="multiple"
                      placeholder="Brand"
                      onChange={handleChangeBrands}
                      allowClear
                      name="brand_select"
                      showSearch
                      optionFilterProp="children"
                    >
                      {brands &&
                        brands.map((item, i) => {
                          return <Option value={item.id}>{item.name}</Option>;
                        })}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[
                      {required: true, message: 'Please enter product name'},
                    ]}
                  >
                    <Input
                      placeholder="Enter Product Name"
                      onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="position"
                    label="Position"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter product position',
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter Product Position"
                      onChange={onChangeProductPosition}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Product URL"
                    name="slug"
                    rules={[
                      {required: true, message: 'Please enter product url'},
                    ]}
                    value={productSlug}
                  >
                    <Input
                      onChange={slugInput}
                      addonBefore={process.env.WEB_DOMAIN}
                      placeholder="Enter Product URL"
                      value={productSlug}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    name="sparky_id"
                    label="Sparky ID"
                    rules={[
                      {required: true, message: 'Please enter Sparky ID'},
                      () => ({
                        validator() {
                          console.log(
                            'Inside sparky id validator! -> sparky id',
                            duplicateSparkyIdError
                          );

                          if (duplicateSparkyIdError.enable) {
                            return Promise.reject(
                              duplicateSparkyIdError.helpText
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    validateTrigger="onBlur"
                  >
                    <Input
                      placeholder="Enter Sparky ID"
                      onBlur={checkDuplicateSparkyId}
                    />
                  </Form.Item>

                  {showPreAssembledFields && (
                    <>
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
                          name="cable"
                          value={form.getFieldValue('cable')}
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

                      <Form.Item name="terminal1" label="Select Terminal 1">
                        <Select
                          placeholder="Terminal 1"
                          onChange={(value) => {
                            handleChangeTerminal1(value);
                            form.setFieldsValue({terminal1: value});
                          }}
                          allowClear
                          name="terminal1"
                          value={form.getFieldValue('terminal1')}
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

                      <Form.Item name="terminal2" label="Select Terminal 2">
                        <Select
                          placeholder="Terminal 2"
                          onChange={(value) => {
                            handleChangeTerminal2(value);
                            form.setFieldsValue({terminal2: value});
                          }}
                          allowClear
                          name="terminal2"
                          value={form.getFieldValue('terminal2')}
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
                    <Input placeholder="Enter Manufacturer ID" />
                  </Form.Item>

                  <Form.Item
                    name="qty_type"
                    label="Quantity Type"
                    rules={[
                      {
                        required: true,
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
                    >
                      <Option value={'unit'}>Unit</Option>
                      <Option value={'bag'}>Bag</Option>
                      <Option value={'roll'}>Roll</Option>
                      <Option value={'reel'}>Reel</Option>
                      <Option value={'meter'}>Meter</Option>
                      <Option value={'box'}>Box</Option>
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
                      // value={product.stock}
                      // value={product.manufacturer_id}
                      // defaultValue={200}
                    />
                  </Form.Item>

                  <Form.Item
                    name="product_stock"
                    label="Product Stock"
                    rules={[
                      {required: true, message: 'Please enter product stock'},
                    ]}
                  >
                    <InputNumber
                      style={{width: '50%'}}
                      type="number"
                      min={1}
                      placeholder="Enter Product Stock"

                      // value={product.stock}
                      // value={product.manufacturer_id}
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
                  >
                    {/* <InputNumber
                      style={{width: '100%'}}
                      placeholder="Enter Product Price"
                    /> */}
                    <table className="table tableRow">
                      <thead>
                        <tr>
                          <th>Product Quantity</th>
                          {showPreAssembledFields ? (
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

                    <div className="col-sm-4"></div>
                  </Form.Item>

                  {/* <Form.Item name="dprice" label="Discount Price">
                  <InputNumber
                    style={{width: '100%'}}
                    min={1}
                    max={100}
                    placeholder="Enter Product Discount Price"
                  />
                </Form.Item> */}

                  <Form.Item label="Status" name="status">
                    <Radio.Group defaultValue={true}>
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
                    />
                  </Form.Item>

                  <Form.Item name="metaDescription" label="Meta Description">
                    <TextArea
                      rows={4}
                      maxLength={500}
                      placeholder="Enter Meta Description"
                    />
                  </Form.Item>

                  {/* ibkm */}
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
                    <ImagePicker
                      getimageno={getimageno}
                      uploadImage={uploadImage}
                      defaultImageValue={defaultImageValue}
                      // setDefaultImageValue={setDefaultImageValue}
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
                      // defaultValue={defaultImageValue}
                      onChange={onChangeDefaultImage}
                      // value={defaultImageValue}
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
                      onChange={handelchnage}
                      ref={editor}
                      config={config}
                    />
                    {/* <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                      onChange={(newContent) => {}}
                    /> */}
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
                    >
                      {similarproductlist &&
                        similarproductlist.map((item) => {
                          return (
                            <Option value={item.id}>
                              {item.name.split('/').pop()}
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
                      placeholder="Select related product"
                      onChange={handleAlternativeProduct}
                      showSearch
                      optionFilterProp="children"
                    >
                      {alternativeproductlist &&
                        alternativeproductlist.map((item) => {
                          return (
                            <Option value={item.id}>
                              {item.name.split('/').pop()}
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
                          CertificationData={CertificationData}
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
                          DocumentData={DocumentData}
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
                      Save
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
        <Row>
          <div className="card-body">
            <Spin tip="Please Wait...." size="large" className={styles.Spin}>
              <div className="content" />
            </Spin>
          </div>
        </Row>
      )}
    </>
  );
};

export default AddProductModal;
