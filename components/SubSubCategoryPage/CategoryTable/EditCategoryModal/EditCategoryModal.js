import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Upload,
  Form,
  message,
  Input,
  Button,
  Radio,
  Modal,
  Row,
  Col,
  Image,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import {v4 as uuidv4} from 'uuid';
import Router from 'next/router';
import moment from 'moment';
import {
  QuestionCircleOutlined,
  CloseSquareOutlined,
  UploadOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './styles.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
const {TextArea} = Input;

const SELECT_ALL_OPTION = {label: 'Select All', value: '_SELECT_ALL_OPTION'};

function useSelectAllOption(options) {
  const optionsWithAllOption = useMemo(
    () => [SELECT_ALL_OPTION, ...options],
    [options]
  );

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

const EditCategoryModal = ({
  visible,
  handleOk,
  handleCancel,
  Editcategoryflag,
  categories,
  filter,
  setIsModalCloseable,
}) => {
  const [form] = Form.useForm();
  const categorydata = useSelector((status) => status.categoryReducer.category);

  const [valueed, setValueED] = React.useState(null);
  const [valueshowmenu, setValueShowMenu] = React.useState(null);
  const [valuecategory, setValueCategoty] = React.useState(null);
  const [valuecategoryid, setValueCategotyid] = React.useState(null);
  const [valuecategorystatus, setValueCategotyStatus] = React.useState(false);
  const [subcate, setSubCate] = React.useState();
  const [catefilter, setCatefilter] = React.useState();
  const [subcatefilter, setSubcatefilter] = React.useState();
  const [addsubcate, setAddSubCate] = useState();
  const [cateposition, setCatePosition] = useState(null);
  const [valuesubcategory, setValueSubCategoty] = React.useState(null);
  const [valuesubcategoryid, setValueSubCategotyid] = React.useState(null);
  const [subcategorylist, setSubCategoryList] = React.useState(null);
  const [subcategoryfilter, setSubCategoryFilter] = React.useState(null);
  const [imageUrl, setImageURL] = useState(null);
  const [imageerror, setImageError] = useState(false);
  const [removeimage, setRemoveImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [valuefilterid, setValueFilterid] = React.useState(null);
  const [valuefilterstatus, setValueFilterStatus] = React.useState(false);
  const [filterbycategory, setFilterByCategory] = useState(null);
  const [subcategorytitle, setSubcategoryTitle] = useState(null);
  const [subcategorytitleName, setSubcategoryTitleName] = useState(null);
  const [subcategorytitleerror, setSubcategoryTitleError] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  form.setFieldsValue({
    id: categorydata && categorydata.id ? categorydata.id : null,
    status: categorydata && categorydata.status === 0 ? false : true,
    level: categorydata && categorydata.level ? categorydata.level : null,
    priority:
      categorydata && categorydata.priority ? categorydata.priority : null,
    name:
      categorydata && categorydata.name.split('/').pop()
        ? categorydata.name.split('/').pop()
        : null,
    title: categorydata && categorydata.title ? categorydata.title : null,
    subcategory:
      categorydata && categorydata.name.split('/')[1]
        ? categorydata.name.split('/')[1]
        : null,
    meta_description:
      categorydata && categorydata.meta_description
        ? categorydata.meta_description
        : null,
    meta_title:
      categorydata && categorydata.meta_title ? categorydata.meta_title : null,
    meta_keywords:
      categorydata && categorydata.meta_keywords
        ? categorydata.meta_keywords
        : null,
    image_url:
      categorydata && categorydata.image_url ? categorydata.image_url : null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setImageURL(categorydata && categorydata.image_url);
    setSubcatefilter(
      categorydata &&
        categorydata.name.replace(/ /g, '-').split('/')[0].toLowerCase()
    );
    setAddSubCate(
      categorydata && categorydata.name.replace(/ /g, '-').split('/')[0]
    );
    setCatefilter(
      categorydata &&
        categorydata.name.replace(/ /g, '-').split('/').pop().toLowerCase()
    );
  }, [visible]);
  useEffect(() => {
    setValueED(null);
    setValueCategoty(categorydata && categorydata.name);
    setCatePosition(categorydata && categorydata.priority);
    setSubcategoryTitleName(categorydata && categorydata.title);
  }, [visible]);

  useEffect(() => {
    if (categories) {
      console.log(':::::::::categoryname::::::::::::');
      console.log('********************categorydata', categorydata);
      const categoryname =
        categories &&
        categories.data.filter((i) => i.id === categorydata.parent_id);
      // console.log(
      //   ':::::::::categoryname:::::::::::: ---- ' +
      //     categoryname[0].category_filter
      // );
      setFilterByCategory(categoryname[0].category_filter);
      setSubcategoryTitle(categoryname[0].subcategory_title);
    }
  }, [categorydata]);

  // console.log('/////// Get Filter ////' + JSON.stringify(filterbycategory));

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };

  const onFinish = async (values) => {
    // need to remove '-' and trim to resolve the bug where products dont come under subcat
    values.name = values.name.replaceAll('-', ' ');
    values.name.trim();
    if (subcategorytitleName === null) {
      setSubcategoryTitleError(true);
      return;
    } else if (imageUrl === null) {
      setImageError(true);
      return;
    } else {
      setImageError(false);
      try {
        const variables = {
          id: categorydata.id ? categorydata.id : null,
          status: values.status,
          level: 2,
          // name:
          //   valuesubcategory === null
          //     ? categorydata.name
          //     : categorydata.name.split('/')[2] !== values.name
          //     ? categorydata.name.split('/')[0] +
          //       '/' +
          //       categorydata.name.split('/')[1] +
          //       '/' +
          //       values.name
          //     : valuesubcategory + '/' + values.name,
          name: valuecategory
            ? valuecategory.split('/')[0] + '/' + values.name
            : categorydata.name,
          priority: values.priority,
          title: subcategorytitleName
            ? subcategorytitleName
            : categorydata && categorydata.title,
          parent_id: valuecategoryid ? valuecategoryid : categorydata.parent_id,
          meta_description: values.meta_description,
          meta_title: values.meta_title,
          meta_keywords: values.meta_keywords,
          image_url: imageUrl
            ? imageUrl
            : removeimage === true
            ? imageUrl
            : null,
          filter: valuefilterid,
          filterstatus: valuefilterstatus,
          categorystatus: valuecategorystatus,
        };
        console.log(
          'variables in Edit Sub Category EditCategoryModal',
          variables
        );
        // return;
        setSubmitLoading(true);
        const data = await axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.updateSubSubCategory}`,
            variables,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (result) {
            //console.log('@@@@@@@@@@@@@@@result', result);
            if (result) {
              if (result.data.updateSubSubCategory === 'success') {
                setSubmitLoading(false);
                setIsModalCloseable(true);
                handleCancel();
                Editcategoryflag(true);
                setImageURL(null);
                setValueFilterStatus(false);
                setValueFilterid(null);
                setValueCategotyStatus(false);
                setFilterByCategory(null);
              } else {
                //not deleted
              }
            } else {
              //error
            }
          })
          .catch(function (error) {
            //console.log('@@@@@@@@@@@@@@@result-1', error);
          });
      } catch (error) {
        //console.log('error signIn:', error.message);
        handleCancel();
        setSubmitLoading(false);
      }
    }
  };

  const handleChangeCategoty = (value) => {
    setSubcategoryTitleName(null);
    // console.log(`selected ${value}`);
    form.setFieldsValue({
      selectWithAllOption: [],
    });
    const categoryname =
      categories && categories.data.filter((i) => i.id === value);
    setValueCategoty(categoryname[0].name);
    setValueCategotyid(value);
    setSubCate(categoryname[0].name);
    setValueCategotyStatus(true);
    setFilterByCategory(categoryname[0].category_filter);
    setSubcategoryTitle(categoryname[0].subcategory_title);
  };
  const handleSubcategoryTitle = (value) => {
    //console.log(`selected :::::::::::::::: ${value}`);
    setSubcategoryTitleName(`${value}`);
    setSubcategoryTitleError(false);
  };
  const onChange = (value) => {
    //console.log('changed ############', value);
    setCatePosition(value);
  };

  const handleChangeSubCategoty = (value) => {
    console.log(`selected ${value}`);
    const categoryname =
      categories && categories.data.filter((i) => i.id === value);
    setValueSubCategoty(categoryname[0].name);
    setValueSubCategotyid(value);
  };

  // useEffect(() => {
  //   if (valuecategoryid) {
  //     const subcategory =
  //       categories &&
  //       categories.data.filter((i) => i.parent_id === valuecategoryid);
  //     setSubCategoryList(subcategory);
  //   }
  // }, [valuecategoryid]);

  // useEffect(() => {
  //   if (categorydata) {
  //     const subcategoryFilter =
  //       categories &&
  //       categories.data.filter((i) => i.id === categorydata.parent_id);
  //     setSubCategoryFilter(subcategoryFilter);
  //   }
  // }, [categorydata]);
  // useEffect(() => {
  //   if (subcategoryfilter) {
  //     const subcategory =
  //       categories &&
  //       categories.data.filter(
  //         (i) => i.parent_id === subcategoryfilter[0].parent_id
  //       );
  //     setSubCategoryList(subcategory);
  //   }
  // }, [subcategoryfilter]);

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

  const containerName = `categoryimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  console.log('calling uploadFileToBlob -------', storageAccountName);

  /* old
  const uploadFileToBlob = async (file) => {
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

    try {
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
      console.log('error signIn:', error);
      setLoading(false);
    }
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
    formData.append('category_id', categorydata?.id);
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
    setValueFilterStatus(true);
  };

  const FilterID =
    categorydata &&
    categorydata.cate_filter &&
    categorydata.cate_filter.map((item) => item.id);

  useEffect(() => {
    setValueFilterid(FilterID);
  }, [categorydata]);

  useEffect(() => {
    // console.log('^^^^^^^^^^^^^^^^^^^^1111', filterbycategory);
    if (categorydata && filterbycategory) {
      let f = filterbycategory.map((item) => {
        return {value: item.id, label: item.filter_name};
      });
      // console.log('^^^^^^^^^^^^^^^^^^^^^f', f);
      setFilterOptions(f);
    }
  }, [categorydata && filterbycategory]);

  // to disable modal close if image url is null
  useEffect(() => {
    console.log('imgurl', imageUrl);
    if (imageUrl == null) {
      setIsModalCloseable(false);
      setImageError(true);
    } else {
      setImageError(false);
      setIsModalCloseable(true);
    }
  }, [imageUrl]);

  const [getValueFromEvent, optionsWithAllOption] =
    useSelectAllOption(filterOptions);

  const handleKeyDownSubCatName = (e) => {
    // if (!/[0-9a-zA-Z]/.test(e.key)) {
    if (/[/,-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Modal
        title="Edit Sub Category"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
        destroyOnClose={true}
      >
        <Form
          key={categorydata && categorydata.id ? categorydata.id : null}
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
          initialValues={{
            id: categorydata && categorydata.id ? categorydata.id : null,
            status: categorydata && categorydata.status === 0 ? false : true,
            level:
              categorydata && categorydata.level ? categorydata.level : null,
            priority:
              categorydata && categorydata.priority
                ? categorydata.priority
                : null,
            name:
              categorydata && categorydata.name.split('/').pop()
                ? categorydata.name.split('/').pop()
                : null,
            title:
              categorydata && categorydata.title ? categorydata.title : null,
            subcategory:
              categorydata && categorydata.name.split('/')[1]
                ? categorydata.name.split('/')[1]
                : null,
            meta_description:
              categorydata && categorydata.meta_description
                ? categorydata.meta_description
                : null,
            meta_title:
              categorydata && categorydata.meta_title
                ? categorydata.meta_title
                : null,
            meta_keywords:
              categorydata && categorydata.meta_keywords
                ? categorydata.meta_keywords
                : null,
            image_url:
              categorydata && categorydata.image_url
                ? categorydata.image_url
                : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="Enable Category"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            name="status"
            value={categorydata && categorydata.status}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="category" label="Select Category">
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Select a category"
              onChange={handleChangeCategoty}
              defaultValue={categorydata && categorydata.name.split('/')}
            >
              {categories &&
                categories.data &&
                categories.data
                  .filter((i) => i.level === 1)
                  .map((item) => {
                    return (
                      <Option value={item.id}>
                        {item.name.split('/').pop()}
                      </Option>
                    );
                  })}
            </Select>
          </Form.Item>

          {/* <Form.Item
            //name="scategory"
            label="Select Category"
          >
            <Select
              placeholder="Select a category"
              onChange={handleChangeSubCategoty}
              defaultValue={categorydata && categorydata.name.split('/')[1]}
            >
              {subcategorylist &&
                subcategorylist.map((item) => {
                  return (
                    <Option value={item.id}>{item.name.split('/')[1]}</Option>
                  );
                })}
            </Select>
          </Form.Item> */}
          <Form.Item label="Title" required>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Select a subcategory title"
              onChange={handleSubcategoryTitle}
              value={subcategorytitleName}
              defaultValue={categorydata && categorydata.title}
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
              <div class="ant-form-item-explain ant-form-item-explain-error">
                <div role="alert">Please select subcategory title</div>
              </div>
            )}
          </Form.Item>
          <Form.Item
            getValueFromEvent={getValueFromEvent} //ishaan select
            label="Select Filter"
            name="selectWithAllOption" //ishaan select
            rules={[
              {
                required:
                  valuefilterid && valuefilterid.length != 0 ? false : true,
                message: 'Please select Filter',
              },
            ]}
          >
            {/* <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select a Filter"
              onChange={handleChangeFilter}
              allowClear
              mode="multiple"
              options={optionsWithAllOption}
              defaultValue={
                categorydata && categorydata.cate_filter
                  ? categorydata.cate_filter.map((item) => item.filter_name)
                  : []
              }
            /> */}
            <Select
              mode="multiple"
              placeholder="Select a Filter"
              onChange={handleChangeFilter}
              allowClear
              showSearch
              defaultValue={
                categorydata && categorydata.cate_filter && categorydata.cate_filter.map((item) => item.id)
              }
            >
              {optionsWithAllOption.map((item, i) => {
                return <Option value={item.value}>{item.label}</Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{required: true, message: 'Please enter subcategory name'}]}
          >
            <Input
              placeholder="Enter subcategory name"
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
            name="priority"
            rules={[
              {
                required: cateposition ? false : true,
                message: 'Please enter subcategory position',
              },
            ]}
          >
            {/* <InputNumber
              style={{width: '100%'}}
              min={1}
              // onChange={onChange}
              defaultValue={cateposition}
              max={100}
              placeholder="Enter category position"
            /> */}
            <Input placeholder="Enter category position" type="number" />
          </Form.Item>

          <Form.Item
            label="Meta Title"
            name="meta_title"
            // rules={[{required: true, message: 'Please enter category name'}]}
          >
            <Input placeholder="Enter meta title" />
          </Form.Item>
          <Form.Item label="Meta Description" name="meta_description">
            <TextArea placeholder="Enter meta description" rows={5} />
          </Form.Item>
          <Form.Item label="Meta Keywords" name="meta_keywords">
            <Input placeholder="Enter meta keywords" />
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
                  display: 'inline',
                  marginTop: '-5px',
                  height: '100px',
                }}
              >
                Please upload image
              </div>
            )}
          </Form.Item>

          <Form.Item style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategoryModal;
