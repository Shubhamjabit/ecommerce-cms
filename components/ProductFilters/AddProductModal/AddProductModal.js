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
  const [
    valueCategoryWithSubCategoryName,
    setValueCategoryWithSubCategoryName,
  ] = useState('');
  console.log('vvvvv777', valueCategoryWithSubCategoryName);
  setValueCategoryWithSubCategoryName;
  const [valuecategoryid, setValueCategotyid] = useState(null);
  const [valueIndustryid, setValueIndustryid] = useState(null);
  const [valueBrandid, setValueBrandid] = useState(null);
  const [relatedproduct, setValueRelatedProduct] = useState({});
  const [relatedproductid, setValueRelatedProductid] = useState(null);
  const [alternativeproduct, setValueAlternativeProduct] = useState({});
  const [alternativeproductid, setValueAlternativeProductid] = useState(null);
  const [uploadimageloader, setUploadImageLoader] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterNameList, setFilterNameList] = useState([]);
  const [parentCategories, setParentCategories] = useState(null);
  const [productSlug, setProductSlug] = useState(null);
  const [defaultImageError, setDefaultImageError] = useState(false);
  const [rs, setRs] = useState(0);
  const [volume, setVolume] = useState(0);
  const [filterObject, setFilterObject] = useState([]);

  // console.log('rs', rs);
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
            // setData(data);
            setParentCategories(data.data.data.parentCategory.data);
            setCategories(data.data.data.category.data);
            setAlternativeProductList(data.data.data.alternativeproduct.data);
            setSimilarProductList(data.data.data.similarproduct.data);
            setIndustries(data.data.data.industries.data);
            setBrands(data.data.data.brands.data);
            setFilterNameList(data.data.data.filterNameList.data);
            return {state: true, message: 'sucess'};
          });
      } catch (error) {
        //console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  // console.log('ccccccccccccc', categories);
  const handleChangeParentCategory = (value) => {
    setValueParentCategotyid(value);
    // console.log('vvvvvvvvvvv', value);
    for (let i = 0; i < parentCategories.length; i++) {
      if (parentCategories[i].id == value) {
        setValueParentCategotyName(parentCategories[i].name);
        break;
      }
    }
    form.setFieldsValue({
      subCategory: [],
    });
    // setValueParentCategotyName(value.split('/')[0]);
  };
  // console.log('ccccc2222222', valueParentCategoryName);
  const handleChangeCategoty = (value) => {
    console.log('vvvvvvvv2222222222', value);
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id == value) {
        setValueCategoryWithSubCategoryName(categories[i].name);
        break;
      }
    }
    setValueCategotyid(value);
  };
  const handleChangeIndustries = (value) => {
    setValueIndustryid(value);
  };
  const handleChangeBrands = (value) => {
    setValueBrandid(value);
  };

  const slugInput = (e) => {
    const {value} = e.target;
  };

  const onFinish = async (values) => {
    setSubmitLoading(true);
    // await form.validateFields();
    // delete undefined values
    Object.keys(values).forEach((key) =>
      values[key] === undefined || values[key] === '' ? delete values[key] : {}
    );
    console.log('################### values =', values);
    const countFilters = Object.keys(values).length - 2; // subtracting 2 since 2 fields are not filter numbers
    try {
      const variables = {
        ...values,
        countFilters: countFilters,
        valueCategoryWithSubCategoryName: valueCategoryWithSubCategoryName,
        crudMethod: 'create',
      };
      console.log('send variables -----', variables);
      setSubmitLoading(false);
      // return;
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

      if (data.status == 200);
      setSubmitLoading(false);
      // handleAddProduct();
      alert('success');
      //Router.push('/manage/products');
    } catch (error) {
      //console.log('error', error);
      setSubmitLoading(false);
      alert('fail');
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
                    name="subCategory"
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

                  <Form.Item
                    name="1"
                    label="Filter 1"
                    rules={[{required: true, message: 'Please enter Filter 1'}]}
                  >
                    <Input
                      placeholder="Enter Filter 1"
                      // onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="2"
                    label="Filter 2"
                    // rules={[{required: true, message: 'Please enter Filter 2'}]}
                  >
                    <Input
                      placeholder="Enter Filter 2"
                      // onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="3"
                    label="Filter 3"
                    // rules={[{required: true, message: 'Please enter Filter 3'}]}
                  >
                    <Input
                      placeholder="Enter Filter 3"
                      // onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="4"
                    label="Filter 4"
                    // rules={[{required: true, message: 'Please enter Filter 4'}]}
                  >
                    <Input
                      placeholder="Enter Filter 4"
                      // onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="5"
                    label="Filter 5"
                    // rules={[{required: true, message: 'Please enter Filter 5'}]}
                  >
                    <Input
                      placeholder="Enter Filter 5"
                      // onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="6"
                    label="Filter 6"
                    // rules={[{required: true, message: 'Please enter Filter 6'}]}
                  >
                    <Input
                      placeholder="Enter Filter 6"
                      // onChange={onChangeProductName}
                    />
                  </Form.Item>
                  <Form.Item
                    name="7"
                    label="Filter 7"
                    // rules={[{required: true, message: 'Please enter Filter 7'}]}
                  >
                    <Input
                      placeholder="Enter Filter 7"
                      // onChange={onChangeProductName}
                    />
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
