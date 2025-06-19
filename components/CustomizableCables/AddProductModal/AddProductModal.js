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
import ImagePicker from '../PreassemblesTable/components/ImagePicker';
import CertificationTableRows from '../PreassemblesTable/components/CertificationTableRows';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import DocumentTableRows from '../PreassemblesTable/components/DocumentTableRows';
import CKEditor from 'ckeditor4-react';
import PriceTableRows from '../PreassemblesTable/components/PriceTableRows';
const {Option} = Select;
const {TextArea} = Input;
const AddProductModal = ({handleAddProduct}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState(null);
  const [alternativeproductlist, setAlternativeProductList] = useState(null);
  const [similarproductlist, setSimilarProductList] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
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
  const productMedia = useSelector(
    (status) => status.productReducer.productMedia
  );
  const visible = useSelector(
    (status) => status.productReducer.editProductModal
  );
  //console.log('##########productMedia', productMedia, '---------', visible);
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
  useEffect(() => {
    getProductData();
  }, []);
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
            setCategories(data.data.data.category.data);
            setAlternativeProductList(data.data.data.alternativeproduct.data);
            setSimilarProductList(data.data.data.similarproduct.data);
            setIndustries(data.data.data.industries.data);
            setBrands(data.data.data.brands.data);
            return {state: true, message: 'sucess'};
          });
      } catch (error) {
        //console.log('error signIn:', error.message);
        return {state: false, message: error.message};
      }
    }
  };
  const handleChangeCategoty = (value) => {
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
    console.log('################### values =', values);
    try {
      const variables = {
        id: values.id,
        title: values.name,
        description: values.description,
        price: values.price,
        slug: values.slug.replace(/ /g, '-').toLowerCase(),
        status: values.status === undefined ? true : values.status,
        industry_select:
          values.industry_select === undefined ? true : values.industry_select,
        brand_select:
          values.brand_select === undefined ? true : values.brand_select,
        metaDescription: values.metaDescription,
        metaKeyword: values.metaKeyword,
        product_key_features: content,
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
        sparky_id: values.sparky_id,
        manufacturer_id: values.manufacturer_id ? values.manufacturer_id : null,
        product_stock: values.product_stock ? values.product_stock : null,
      };
      console.log('send variables -----', variables);
      return;
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

      if (data);
      setSubmitLoading(false);
      handleAddProduct();
      //Router.push('/manage/products');
    } catch (error) {
      //console.log('error', error);
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
                >
                  <Form.Item
                    name="category"
                    label="Select Sub Category"
                    rules={[
                      {
                        required: true,
                        message: 'Please select Category',
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
                      showSearch
                      optionFilterProp="children"
                    >
                      {categories &&
                        categories.map((item, i) => {
                          return (
                            <Option value={item.id}>
                              {item.name.split('/').pop()}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
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
                  </Form.Item>
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
                    <Input placeholder="Enter Product Name" />
                  </Form.Item>
                  <Form.Item
                    name="sparky_id"
                    label="Sparky ID"
                    rules={[
                      {required: true, message: 'Please enter Sparky ID'},
                    ]}
                  >
                    <Input placeholder="Enter Sparky ID" />
                  </Form.Item>
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
                      // value={product.stock}
                      // value={product.manufacturer_id}
                    />
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
                          <th>Product Price</th>

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

                  <Form.Item
                    label="Product URL"
                    name="slug"
                    rules={[
                      {required: true, message: 'Please enter product url'},
                    ]}
                  >
                    <Input
                      onChange={slugInput}
                      addonBefore="https://localhost:3001/"
                      placeholder="Enter Product URL"
                    />
                  </Form.Item>
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
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter Product Descriptions"
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
                  <Form.Item name="productImages" label="Images">
                    <ImagePicker
                      getimageno={getimageno}
                      uploadImage={uploadImage}
                    />
                  </Form.Item>

                  <Form.Item
                    name="defaultImage"
                    label="Default Image"
                    rules={[
                      {
                        // required: true,
                        message: 'Please select the default image',
                      },
                    ]}
                  >
                    <Radio.Group>
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
                  </Form.Item>

                  <Form.Item label="Features" name="features">
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
