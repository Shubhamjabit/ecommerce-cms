import React, {useState, useEffect} from 'react';
import {
  Upload,
  Form,
  message,
  Input,
  Button,
  Radio,
  Switch,
  Modal,
  Row,
  Col,
  Select,
  InputNumber,
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import {
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './styles.module.scss';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';
const {TextArea} = Input;
const AddCategoryModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  Addcategoryflag,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueed, setValueED] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log('!!!!!!!!!!!888888888888 imageUrl', imageUrl);
    if (imageUrl === null) {
      setImageError(true);
    } else {
      setImageError(false);
      setSubmitLoading(true);
      try {
        const variables = {
          id: values.id,
          status: valueed,
          level: 1,
          name: values.name,
          parent_id: 0,
          priority: values.position,
          imageUrl: imageUrl,
          type: 'stockPreassemblesCategory',
        };

        const data = await axios
          .post(`${envUrl.baseUrl}${cmsendPoint.addCategory}`, variables, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
          .then(function (result) {
            if (result) {
              if (result.data.saveCategory === 'success') {
                setSubmitLoading(false);
                handleCancel();
                Addcategoryflag(true);
                onReset();
                setImageURL(null);
              } else {
                //not deleted
              }
            } else {
              //error
            }
          })
          .catch(function (error) {});
      } catch (error) {
        handleCancel();
      }
    }
  };

  function onChangeED(e) {
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  // const handlePositionInputChange = (e) => {
  //   if ((e.target.value = /\D/g)) {
  //     setPositionValue('');
  //     return;
  //   }
  //   if (ref.current) {
  //     // var digitPeriodRegExp = new RegExp('\\d|\\.');
  //     var digitPeriodRegExp = new RegExp('^[0-9]*$');
  //     ref.current.addEventListener(
  //       'input',
  //       function (event) {
  //         var splitValue = ref.current.value.split('');
  //         var charactersToFilter = 0;
  //         var filteredSplitValue = splitValue.map(function (character) {
  //           if (!digitPeriodRegExp.test(character)) {
  //             charactersToFilter++;
  //             return '';
  //           }

  //           return character;
  //         });

  //         if (!charactersToFilter) {
  //           return;
  //         }

  //         ref.current.value = filteredSplitValue.join('');

  //         /*
  //          * We need to keep track of the caret position, which is the `selectionStart`
  //          * property, otherwise if our caret is in the middle of the value, pressing an
  //          * invalid character would send our caret to the end of the value.
  //          */
  //         var charactersBeforeSelectionStart = filteredSplitValue.slice(
  //           0,
  //           ref.current.selectionStart
  //         );
  //         var filteredCharactersBeforeSelectionStart =
  //           charactersBeforeSelectionStart.filter(function (character) {
  //             return !character;
  //           });
  //         var totalFilteredCharactersBeforeSelectionStart =
  //           filteredCharactersBeforeSelectionStart.length;
  //         var newSelectionStart =
  //           ref.current.selectionStart -
  //           totalFilteredCharactersBeforeSelectionStart;

  //         ref.current.selectionStart = newSelectionStart;
  //         ref.current.selectionEnd = ref.current.selectionStart;
  //       },
  //       false
  //     );
  //   }
  // };

  const saveImage = ({file, onSuccess}) => {
    setLoading(true);
    console.log('e.target.value :', file);
    uploadFileToBlob(file, onSuccess);
  };

  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/GIF/Webp file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (isJpgOrPng && !isLt2M) {
      message.error('Image must smaller than 1MB!');
    }
    setImageError(false);
    return isJpgOrPng && isLt2M;
  }

  // const containerName = `categoryimages`;
  // const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  // const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  //console.log('calling uploadFileToBlob -------', storageAccountName);

  /* old 
  const uploadFileToBlob = async (file) => {
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
      setLoading(false);
    } catch (error) {
      console.log('error>>>>>>>>:', error);
      setLoading(false);
    }
    //await createBlobInContainer(containerClient, file);
    // get list of blobs in container
    //return getBlobsInContainer(containerClient);
  };
  */

  // new for node
  const uploadFileToBlob = async (file) => {
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'categoryimages');
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
          setImageURL('/' + response.data.data);
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

  /*old
  const removeFileToBlob = async (file) => {
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobService.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: 'container',
    });
    const options = {
      deleteSnapshots: 'include', // or 'only'
    };
    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(
      file.split('/').pop()
    );
    await blockBlobClient.delete(options);
    setImageURL(null);
    setLoading(false);
    setRemoveImage(false);
  };
  */

  // new for node
  const removeFileToBlob = async (file) => {
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'categoryimages');
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
          setImageURL(null);
          setLoading(false);
        } else {
          throw new ERROR('Error in Deleting File');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Deleting File', error);
      });
  };

  // const uploadFileToBlob = async (file) => {
  //   if (!file) return [];
  //   console.log('calling uploadFileToBlob -------');

  //   // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  //   const blobService = new BlobServiceClient(
  //     `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  //   );

  //   // get Container - full public read access
  //   const containerClient = blobService.getContainerClient(containerName);
  //   await containerClient.createIfNotExists({
  //     access: 'container',
  //   });

  //   // upload file
  //   console.log('calling uploadFileToBlob -------6666', containerClient);
  //   await createBlobInContainer(containerClient, file);

  //   // get list of blobs in container
  //   return getBlobsInContainer(containerClient);
  // };

  // const createBlobInContainer = async (containerClient, file) => {
  //   console.log('calling uploadFileToBlob -------11111', file);
  //   // create blobClient for container
  //   const blobClient = containerClient.getBlockBlobClient(file.name);
  //   console.log('calling uploadFileToBlob -------2222');
  //   // set mimetype as determined from browser with file upload control
  //   const options = {blobHTTPHeaders: {blobContentType: file.type}};
  //   console.log('calling uploadFileToBlob -------3333', options);
  //   // upload file
  //   await blobClient.uploadData(file, options);
  //   console.log('calling uploadFileToBlob -------4444');
  // };

  // const getBlobsInContainer = async (containerClient) => {
  //   console.log('calling uploadFileToBlob -------5555');
  //   const returnedBlobUrls = [];

  //   // get list of blobs in container
  //   // eslint-disable-next-line
  //   for await (const blob of containerClient.listBlobsFlat()) {
  //     // if image is public, just construct URL
  //     returnedBlobUrls.push(
  //       `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
  //     );
  //   }

  //   return returnedBlobUrls;
  // };

  const {confirm} = Modal;
  function removeFile() {
    confirm({
      title: 'Do you Want to delete these image?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeFileToBlob(imageUrl);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <>
      <Modal
        title="Add Category"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
      >
        <Form
          form={form}
          onFinish={(values) => onFinish(values)}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
        >
          <Form.Item
            label="Enable Category"
            name="a"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
          >
            <Radio.Group
              onChange={onChangeED}
              value={valueed}
              optionType="button"
              buttonStyle="solid"
              defaultValue={true}
            >
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter category name'}]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[
              {required: true, message: 'Please enter category position'},
            ]}
          >
            <InputNumber
              type="number"
              style={{width: '100%'}}
              min={1}
              max={100}
              placeholder="Enter category position"
            />
          </Form.Item>

          <Form.Item label="Image" name="image" className={styles.label}>
            <div className={styles.ImageSection}>
              <Upload
                listType="picture-card"
                customRequest={saveImage}
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                // onRemove={removeImg}
                // onPreview={handlePreview}
              >
                <div>
                  {loading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{marginTop: 8}}>Upload Image</div>
                </div>
              </Upload>

              {imageUrl && (
                <div className={styles.UploadFile}>
                  <div className={styles.FileView}>
                    <span className={styles.Image}>
                      <img
                        src={process.env.CATEGORY_CDN_URL + imageUrl}
                        alt="avatar"
                      />
                    </span>
                    <span className={styles.deleteIcon}>
                      <DeleteOutlined onClick={removeFile} />
                    </span>
                  </div>
                </div>
              )}
            </div>
            {imageerror && (
              <div
                class="invalid-feedback"
                style={{
                  display: 'block',
                  marginTop: '-5px',
                  height: '100px',
                }}
              >
                Please upload image
              </div>
            )}
          </Form.Item>

          <Form.Item style={{textAlign: 'right'}}>
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
      </Modal>
    </>
  );
};

export default AddCategoryModal;
