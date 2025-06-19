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
import EditImagePicker from '../PreassemblesTable/components/EditImagePicker';
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
import CertificationTableRows from '../PreassemblesTable/components/CertificationTableRows';
import DocumentTableRows from '../PreassemblesTable/components/DocumentTableRows';
import PriceTableRows from '../PreassemblesTable/components/PriceTableRows';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
const {Option} = Select;
const {TextArea} = Input;

const EditProductModal = ({productlist, handleEditProduct}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
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
  const [alternativeproductstatus, setValueAlternativeProductstatus] =
    useState(false);
  const [uploadimagestatus, setUploadImagestatus] = useState(false);
  const [imageUrlT1, setImageURLT1] = useState(null);
  const [imageerrorT1, setImageErrorT1] = useState(false);
  const [imageUrlT2, setImageURLT2] = useState(null);
  const [imageerrorT2, setImageErrorT2] = useState(false);
  const preassembleData = localStorage.getItem('preassemble');
  // console.log('+++++++++++++++++ preassembleData', preassembleData);
  const preassembleDataFromReducer = useSelector(
    (state) => state.preassemblesReducer.preassembleTerminals
  );
  console.log(
    '+++++++++++++++++ preassembleDataFromReducer',
    preassembleDataFromReducer
  );
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

  const [content, setContent] = useState('');
  // useEffect(() => {
  //   setImageURLT1(preassembleData && preassembleData.img_url_t1);
  //   setImageURLT2(preassembleData && preassembleData.img_url_t2);
  // }, [preassembleDataFromReducer]);

  // useEffect(() => {}, []);

  // useEffect(() => {
  //   setProductMediaData(productMedia);
  //   setContent(product && product.product_key_features);
  //   setCertificationRowsData(
  //     product && product.product_certificate
  //       ? product && product.product_certificate
  //       : []
  //   );
  //   setDocumentRowsData(
  //     product && product.product_document
  //       ? product && product.product_document
  //       : []
  //   );
  //   setPriceRowsData(
  //     product && product.product_price ? product && product.product_price : []
  //   );
  // }, [product]);
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

  useEffect(() => {
    // form.setFieldsValue({
    //   id: product ? product.id : null,
    //   status: product ? (product.status == 1 ? true : false) : false,
    //   title: product ? product.name : null,
    //   price: product ? product.price : null,
    //   slug: product ? product.slug : null,
    //   description: product ? product.description : null,
    //   metaDescription: product ? product.meta_description : null,
    //   metaKeyword: product ? product.meta_keyword : null,
    //   product_key_features: product ? product.product_key_features : null,
    //   sparky_id: product ? product.sparky_id : null,
    //   manufacturer_id: product ? product.manufacturer_id : null,
    //   product_stock: product ? product.stock : null,
    // });
    setImageURLT1(preassembleDataFromReducer.img_url_t1);
  }, [preassembleDataFromReducer]);

  const onFinish = async (values) => {
    // setSubmitLoading(true);
    try {
      const variables = {
        sparky_id: preassembleDataFromReducer.sparky_id,
        manf_id: values.manufacturer_id,
        main_filter: values.main_filter,
        price: values.price,
        assembly_charges: values.assembly_charges,
        status: values.status === undefined ? true : values.status,
        img_url_t1: imageUrlT1,
        img_url_t2: imageUrlT2,
        type: 'preassembleTerminals',
      };

      console.log('In Save Fuction:::::::::::::::::::', variables);
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
      setImageURLT1(null);
      setSubmitLoading(false);
      handleEditProduct();
      //Router.push('/manage/products');
    } catch (error) {
      console.log('error onFinish', error);
      setSubmitLoading(false);
    }
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

  // React.useEffect(() => {}, [data]);

  // useEffect(() => {
  //   setValueCategotyid(categoryID);
  //   setValueRelatedProductid(relatedProductID);
  //   setValueAlternativeProductid(alternativeProductID);
  // }, [product]);

  const handleChangeCategoty = (value) => {
    const categoryname = categories && categories.filter((i) => i.id === value);
    setValueCategoty({...categoryname.name});
    setValueCategotyid(value);
    setCategoryStatus(true);
  };

  const [loading, setLoading] = useState(false);
  const [loadingT2, setLoadingT2] = useState(false);

  const saveImage = (options, type) => {
    const {onSuccess, onError, file, onProgress} = options;
    console.log('inside save Image', file);
    console.log('inside save Image2222', onSuccess);
    console.log('inside save Image3333', type);
    setLoading(true);
    console.log('e.target.value :', file);
    uploadFileToBlob(file, onSuccess, type);
  };

  function beforeUpload(file, type) {
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
    if (type == 't1') {
      setImageErrorT1(false);
    } else if (type == 't2') {
      setImageErrorT2(false);
    }

    return isJpgOrPng && isLt2M;
  }

  // new for node
  const uploadFileToBlob = async (file, onSuccess, type) => {
    console.log('ttttttttttt type = ', type);
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'productimages');
    console.log('@@@@@', file);
    console.log('!!!!!!!', formData);
    // return;
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.uploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('########### response = ', response);
        if (response.status == 200) {
          if (type == 't1') {
            console.log('inside t1');
            setImageURLT1('/' + response.data.data);
          } else if (type == 't2') {
            console.log('inside t2');
            setImageURLT2('/' + response.data.data);
          }
          setLoading(false);
        } else {
          throw new ERROR('Error in File Upload');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Uploading File', error);
      });
  };

  // new for node
  const removeFileToBlob = async (file, type) => {
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'productimages');
    console.log('@@@@@', file);
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
          if (type == 't1') {
            setImageURLT1(null);
            setLoading(false);
          } else if (type == 't2') {
            setImageURLT2(null);
            setLoading(false);
          }
        } else {
          throw new ERROR('Error in Deleting File');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Deleting File', error);
      });
  };

  const {confirm} = Modal;
  function removeFile(type) {
    confirm({
      title: 'Do you Want to delete these image?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (type == 't1') {
          removeFileToBlob(imageUrlT1, type);
        } else if (type == 't2') {
          removeFileToBlob(imageUrlT2, type);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  console.log('@@@@@@@1111', imageUrlT1);
  console.log('@@@@@@@2222', imageUrlT2);
  return (
    <>
      {preassembleDataFromReducer ? (
        <Row>
          <div className="card-body">
            <EditProductHeader handleEditProduct={handleEditProduct} />
            <div className={styles.ProductPage}>
              <Col span={24}>
                <Form
                  key={preassembleDataFromReducer.sparky_id}
                  form={form}
                  labelCol={{span: 3}}
                  wrapperCol={{span: 21}}
                  autoComplete={'false'}
                  initialValues={{
                    id: preassembleDataFromReducer.sparky_id,
                    main_filter: preassembleDataFromReducer.main_filter,
                    price: preassembleDataFromReducer.price,
                    assembly_charges:
                      preassembleDataFromReducer.assembly_charges,
                    status:
                      preassembleDataFromReducer.status == 1 ? true : false,
                    price: preassembleDataFromReducer.price,
                    status:
                      preassembleDataFromReducer.status == 1 ? true : false,
                    sparky_id: preassembleDataFromReducer.sparky_id,
                    manufacturer_id: preassembleDataFromReducer.manf_id,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="sparky_id"
                    label="Sparky ID"
                    rules={[
                      {required: true, message: 'Please enter Sparky ID'},
                    ]}
                  >
                    <Input
                      placeholder="Enter Sparky ID"
                      value={preassembleDataFromReducer.sparky_id}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    name="manufacturer_id"
                    label="Manufacturer ID"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter  Manufacturer ID',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Manufacturer ID"
                      value={preassembleDataFromReducer.manufacturer_id}
                    />
                  </Form.Item>
                  <Form.Item
                    name="main_filter"
                    label="Main Filter"
                    rules={[
                      {required: true, message: 'Please enter Main Filter'},
                    ]}
                  >
                    <Input
                      placeholder="Enter Main Filter"
                      value={preassembleDataFromReducer.main_filter}
                    />
                  </Form.Item>

                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{required: true, message: 'Please enter Price'}]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Price"
                      value={preassembleDataFromReducer.price}
                    />
                  </Form.Item>

                  <Form.Item
                    name="assembly_charges"
                    label="Assembly Charges"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter Assembly Charges',
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Assembly Charges"
                      value={preassembleDataFromReducer.assembly_charges}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Image T1"
                    name="img_url_t1"
                    // className={styles.label}
                  >
                    <div className={styles.ImageSection}>
                      <Upload
                        listType="picture-card"
                        customRequest={(options) => saveImage(options, 't1')}
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={(file) => beforeUpload(file, 't1')}
                        // beforeUpload={beforeUpload}
                        // onRemove={removeImg}
                        // onPreview={handlePreview}
                      >
                        <div>
                          {loading ? <LoadingOutlined /> : <UploadOutlined />}
                          <div style={{marginTop: 8}}>Upload Image</div>
                        </div>
                      </Upload>

                      {imageUrlT1 && (
                        <div className={styles.UploadFileForPreassemble}>
                          <div className={styles.FileView}>
                            <span className={styles.Image}>
                              <img
                                src={process.env.PRODUCT_CDN_URL + imageUrlT1}
                                alt="avatar"
                              />
                            </span>
                            <span className={styles.deleteIcon}>
                              <DeleteOutlined
                                onClick={() => removeFile('t1')}
                              />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {imageerrorT1 && (
                      <div
                        class="invalid-feedback"
                        style={{
                          display: 'inline',
                          marginTop: '-5px',
                          height: '100px',
                        }}
                      >
                        Please upload image T1
                      </div>
                    )}
                  </Form.Item>

                  {/* <Form.Item
                    label="Image T2"
                    name="img_url_t2"
                    // className={styles.label}
                  >
                    <div className={styles.ImageSection}>
                      <Upload
                        listType="picture-card"
                        customRequest={() => saveImage(file, onSuccess, 't2')}
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={() => beforeUpload(file, 't2')}
                        // onRemove={removeImg}
                        // onPreview={handlePreview}
                      >
                        <div>
                          {loading ? <LoadingOutlined /> : <UploadOutlined />}
                          <div style={{marginTop: 8}}>Upload Image</div>
                        </div>
                      </Upload>

                      {imageUrlT2 && (
                        <div className={styles.UploadFileForPreassemble}>
                          <div className={styles.FileView}>
                            <span className={styles.Image}>
                              <img
                                src={process.env.PRODUCT_CDN_URL + imageUrlT2}
                                alt="avatar"
                              />
                            </span>
                            <span className={styles.deleteIcon}>
                              <DeleteOutlined
                                onClick={() => removeFile('t2')}
                              />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {imageerrorT2 && (
                      <div
                        class="invalid-feedback"
                        style={{
                          display: 'inline',
                          marginTop: '-5px',
                          height: '100px',
                        }}
                      >
                        Please upload image T2
                      </div>
                    )}
                  </Form.Item> */}

                  <Form.Item label="Status" name="status">
                    <Radio.Group>
                      <Radio.Button value={true}>Publish</Radio.Button>
                      <Radio.Button value={false}>Unpublish</Radio.Button>
                    </Radio.Group>
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
        <Spin tip="Please Wait...." size="large" className={styles.Spin}>
          <div className="content" />
        </Spin>
      )}
    </>
  );
};

export default EditProductModal;
