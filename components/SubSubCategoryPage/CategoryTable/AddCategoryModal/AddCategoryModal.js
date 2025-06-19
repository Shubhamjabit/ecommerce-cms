import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
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
import {cmsendPoint, envUrl} from '../../../../utils/factory';

const {TextArea} = Input;

const SELECT_ALL_OPTION = {label: 'Select All', value: '_SELECT_ALL_OPTION'};

function useSelectAllOption(options) {
  console.log('options', options);
  const optionsWithAllOption = useMemo(() => {
    return [SELECT_ALL_OPTION, ...options];
  }, [options]);

  /** pass this to Form.Item's getValueFromEvent prop */
  const getValueFromEvent = useCallback(
    (value, selections) => {
      if (!selections?.length) return selections;
      if (!selections?.some((s) => s.value === SELECT_ALL_OPTION.value)) {
        return selections;
      }
      const labelInValue = typeof value[0]?.label === 'string';
      // if "Select All" option selected, set value to all options
      // also keep labelInValue in consideration
      return labelInValue ? options : options.map((o) => o.value);
    },
    [options]
  );

  return [getValueFromEvent, optionsWithAllOption];
}

const options = [
  {label: 'one', value: 'one'},
  {label: 'two', value: 'two'},
  {label: 'three', value: 'three'},
];

const AddCategoryModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  filter,
  Addcategoryflag,
}) => {
  const filterSelectRef = useRef(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueed, setValueED] = React.useState(true);
  const [valuecategory, setValueCategoty] = React.useState(null);
  const [valuecategoryid, setValueCategotyid] = React.useState(null);
  const [valuesubcategory, setValueSubCategoty] = React.useState(null);
  const [valuesubcategoryid, setValueSubCategotyid] = React.useState(null);
  const [valuefilterid, setValueFilterid] = React.useState(null);
  console.log('valuefilterid', valuefilterid);
  const [subcategorylist, setSubCategoryList] = React.useState(null);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [filterbycategory, setFilterByCategory] = useState(null);
  const [subcategorytitle, setSubcategoryTitle] = useState(null);
  const [subcategorytitleName, setSubcategoryTitleName] = useState(null);
  const [subcategorytitleerror, setSubcategoryTitleError] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  console.log(
    'filterOptions in AddCategoryModal in Manage Sub CAT',
    filterOptions
  );
  //console.log('///////removeimage////' + JSON.stringify(filterbycategory));
  // console.log('selected ::::::::::::::::', subcategorytitleName);
  // useEffect(() => {
  //   if (valuecategoryid) {
  //     const subcategory =
  //       categories &&
  //       categories.data.filter((i) => i.parent_id === valuecategoryid);
  //     setSubCategoryList(subcategory);
  //   }
  // }, [valuecategoryid]);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  useEffect(() => {
    setFilterByCategory(null);
    setSubcategoryTitle(null);
    setSubcategoryTitleName(null);
  }, [visible]);

  //console.log('categories-name' + valueed + valuepublish);
  //console.log('categories-name' + JSON.stringify(categories[1].name));
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    // need to remove '-' and trim to resolve the bug where products dont come under subcat
    values.name = values.name.replaceAll('-', ' ');
    values.name.trim();
    if (subcategorytitleName === null) {
      setSubcategoryTitleError(true);
      return;
      // remove image mandatory
    } else if (imageUrl === null) {
      setImageError(true);
      return;
    } else {
      setImageError(false);

      try {
        const variables = {
          id: values.id,
          status: valueed,
          level: 2,
          // name:
          //   valuesubcategory === null
          //     ? values.name
          //     : valuesubcategory + '/' + values.name,
          name:
            valuecategory === null
              ? values.name
              : valuecategory + '/' + values.name,
          title: subcategorytitleName,
          priority: values.position,
          parent_id: valuecategoryid,
          //parent_id: valuesubcategoryid === null ? 0 : valuesubcategoryid,
          meta_description: values.metadescription,
          meta_title: values.metatitle,
          meta_keywords: values.metakeywords,
          image_url: imageUrl
            ? imageUrl
            : removeimage === true
            ? imageUrl
            : null,
          filter: valuefilterid,
        };

        console.log(
          'variables in Edit Sub Category EditCategoryModal',
          variables
        );
        // return;
        setSubmitLoading(true);
        const data = await axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.addSubSubCategory}`,
            variables,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (result) {
            // console.log('@@@@@@@@@@@@@@@result', result);
            if (result) {
              if (result.data.saveSubSubCategory === 'success') {
                setSubmitLoading(false);
                setImageURL(null);
                handleCancel();
                onReset();
                Addcategoryflag(true);
                setFilterByCategory(null);
                setSubcategoryTitle(null);
                setSubcategoryTitleName(null);
              } else {
                //not deleted
              }
            } else {
              //error
            }
          })
          .catch(function (error) {
            //  console.log('@@@@@@@@@@@@@@@result-1', error);
          });
      } catch (error) {
        console.log('error signIn:', error.message);
        handleCancel();
        setSubmitLoading(false);
      }
    }
  };

  function onChangeED(e) {
    console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  const handleChangeCategoty = (value) => {
    console.log(`selected ${value}`);
    setSubcategoryTitleName(null);
    handleFilterSelectClear();
    const categoryname =
      categories && categories.data.filter((i) => i.id === value);
    // console.log(
    //   '@@@@@@@@@@@@@@@rcategoryname :::::::::::::',
    //   categoryname[0].category_filter
    // );
    setValueCategoty(categoryname[0]?.name);
    setValueCategotyid(value);
    setFilterByCategory(categoryname[0]?.category_filter);
    setSubcategoryTitle(categoryname[0]?.subcategory_title);
  };

  const handleSubcategoryTitle = (value) => {
    //console.log(`selected :::::::::::::::: ${value}`);
    setSubcategoryTitleName(`${value}`);
    setSubcategoryTitleError(false);
  };

  // const handleChangeSubCategoty = (value) => {
  //   console.log(`selected ${value}`);
  //   const categoryname =
  //     categories && categories.data.filter((i) => i.id === value);
  //   setValueSubCategoty(categoryname[0].name);
  //   setValueSubCategotyid(value);
  // };

  const handleChangeFilter = (value) => {
    // RESOLVE THE BUG WHERE SELECT ALL DOESNT ADD ALL IDS TO STATE
    if (value == '_SELECT_ALL_OPTION') {
      setValueFilterid(
        filterOptions.map((o) => {
          return o.value;
        })
      );
    } else {
      setValueFilterid(value);
    }
    console.log('vvvvvv', valuefilterid);
  };

  const saveImage = ({file, onSuccess}) => {
    setImageError(false);
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
    // setImageError(false);
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

  /* old
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

  // set category options array for search options
  if (categories && categories.data) {
    var catArrray = categories.data
      .filter((i) => i.level === 1)
      .map((item) => {
        // return item.name.split('/').pop();
        return {value: item.id, label: item.name.split('/').pop()};
      });
  }
  // console.log('^^^^^^^^^^^^^^^^^ catArrray', catArrray);

  const handleKeyDownSubCatName = (e) => {
    // if (!/[0-9a-zA-Z]/.test(e.key)) {
    if (/[/,-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    // console.log('^^^^^^^^^^^^^^^^^^^^1111', filterbycategory);
    if (filterbycategory) {
      let f = filterbycategory.map((item) => {
        return {value: item.id, label: item.filter_name};
      });
      // console.log('^^^^^^^^^^^^^^^^^^^^^f', f);
      setFilterOptions(f);
    }
  }, [filterbycategory]);

  const [getValueFromEvent, optionsWithAllOption] =
    useSelectAllOption(filterOptions);

  const handleFilterSelectClear = () => {
    form.setFieldsValue({
      selectWithAllOption: [],
    });
    /*
    if (typeof window !== undefined) {
      var span = document.getElementsByClassName(
        'anticon anticon-close-circle'
      );
      console.log('dddddddd', span[1]);
      var click = new Event('click');
      span[1]?.dispatchEvent(click);
      span[1].innerHTML = '';
      // span[1]?.addEventListener('click');
      const d = document.getElementsByClassName('anticon anticon-close-circle');
      console.log('dddddddd22222', d);
      console.log('dddddddd333', d[1]);
      d[1]?.click();

      console.log('ffffffffffffff', filterSelectRef.current);
      // filterSelectRef.current.querySelector('.anticon-close-circle').click();
      // filterSelectRef.current.click();
      // filterSelectRef.current.click();
      
    }
    */
  };
  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <Modal
        title="Add Sub Category"
        visible={visible}
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
            name="category"
            label="Select Category"
            rules={[{required: true, message: 'Please select category'}]}
          >
            <Select
              showSearch
              placeholder="Select a category"
              onChange={handleChangeCategoty}
              allowClear
              name="status"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={catArrray}
            >
              {/* {categories &&
                categories.data &&
                categories.data
                  .filter((i) => i.level === 1)
                  .map((item) => {
                    return (
                      <Option value={item.id}>
                        {item.name.split('/').pop()}
                      </Option>
                    );
                  })} */}
            </Select>
          </Form.Item>

          <Form.Item
            //name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: 'Please select subcategory title',
              },
            ]}
            required
          >
            <Select
              showSearch
              // to search if options in inside select, if options outside select, not needed
              // filterOption={(input, option) =>
              //   (option?.label ?? '')
              //     .toLowerCase()
              //     .includes(input.toLowerCase())
              // }
              optionFilterProp="children"
              placeholder="Select a subcategory title"
              onChange={handleSubcategoryTitle}
              value={subcategorytitleName}
              // options={
              //   subcategorytitle &&
              //   subcategorytitle.map((item) => {
              //     // return (
              //     // <Option value={item.subcategory_title}>
              //     return {
              //       value: item.subcategory_title,
              //       label: item.subcategory_title,
              //     };
              //     // </Option>
              //     // );
              //   })
              // }
            >
              {subcategorytitle &&
                subcategorytitle.map((item) => {
                  return (
                    <Option value={item.subcategory_title}>
                      {item.subcategory_title}
                    </Option>
                  );
                })}
            </Select>
            {subcategorytitleerror && (
              <div className="ant-form-item-explain ant-form-item-explain-error">
                <div role="alert">Please select subcategory title</div>
              </div>
            )}
          </Form.Item>
          {/* <Form.Item
            name="subcategory"
            label="Select Subcategory"
            rules={[{required: true, message: 'Please select subcategory'}]}
          >
            <Select
              placeholder="Select a subcategory"
              onChange={handleChangeSubCategoty}
              allowClear
              name="status"
            >
              {subcategorylist &&
                subcategorylist
                  .filter((i) => i.level === 2)
                  .map((item) => {
                    return (
                      <Option value={item.id}>
                        {item.name.split('/').pop()}
                      </Option>
                    );
                  })}
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="filter"
            label="Select Filter"
            rules={[{required: true, message: 'Please select Filter'}]}
          >
            <Select
              placeholder="Select a Filter"
              onChange={handleChangeFilter}
              allowClear
              mode="multiple"
              optionFilterProp="children"
              // options={optionsWithAllOption}
            >
              {filterbycategory &&
                filterbycategory.map((item) => {
                  return <Option value={item.id}>{item.filter_name}</Option>;
                })}
            </Select>
          </Form.Item> */}
          {/* ishaan select ALL */}
          <Form.Item
            getValueFromEvent={getValueFromEvent} //ishaan select
            name="selectWithAllOption" //ishaan select
            label="Select Filter"
            rules={[{required: true, message: 'Please select Filter'}]}
          >
            <Select
              showSearch
              filterOption={filterOption}
              ref={filterSelectRef}
              value={valuefilterid}
              placeholder="Select a Filter"
              onChange={handleChangeFilter}
              allowClear
              mode="multiple"
              // optionFilterProp="children"
              options={optionsWithAllOption}
              // onClear={handleFilterSelectClear}
            >
              {filterbycategory &&
                filterbycategory.map((item) => {
                  return <Option value={item.id}>{item.filter_name}</Option>;
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter subcategory name'}]}
          >
            <Input
              placeholder="Enter Subcategory name"
              onKeyDown={handleKeyDownSubCatName}
            />
          </Form.Item>

          {/* <Form.Item
            label="Title"
            name="title"
            rules={[{required: true, message: 'Please enter category title'}]}
          >
            <Input placeholder="Enter category title" />
          </Form.Item> */}
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

          <Form.Item
            label="Meta Title"
            name="metatitle"
            // rules={[{required: true, message: 'Please enter category name'}]}
          >
            <Input placeholder="Enter meta title" />
          </Form.Item>
          <Form.Item label="Meta Description" name="metadescription">
            <TextArea placeholder="Enter meta description" rows={5} />
          </Form.Item>
          <Form.Item label="Meta Keywords" name="metakeywords">
            <Input placeholder="Enter meta keywords" />
          </Form.Item>

          <Form.Item label="Image" name="image" className={styles.label}>
            <>
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
              {/* remove image mandatory field */}
              {imageerror && (
                <div
                  className="invalid-feedback"
                  style={{
                    display: 'block',
                    marginTop: '-5px',
                    height: '100px',
                  }}
                >
                  Please upload image
                </div>
              )}
            </>
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
