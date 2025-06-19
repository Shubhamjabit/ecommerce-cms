import React, {useState, useEffect} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
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
  Typography,
  Space,
  Tooltip,
  notification,
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
  DeleteTwoTone,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './styles.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import {setManageFilterData} from '../../../../store/actions/manageFilterActions';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import {WithContext as ReactTags} from 'react-tag-input';
// const ReactTags = require('react-tag-input').WithOutContext;
import {ExclamationCircleFilled} from '@ant-design/icons';

const {confirm} = Modal;
const {TextArea} = Input;
const {Title} = Typography;

/* for hooks and functions forreact tags */
const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
/* react tags end */

const EditFilterModal = ({
  visible,
  handleOk,
  handleCancel,
  Editcategoryflag,
  categories,
  filter,
  refreshState,
  setRefreshState,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  let data = useSelector(
    (state) => state.manageFilterReducer.dataForSubcatTitle
  );
  // data = data.data;
  const [dataState, setDataState] = useState({});
  const [filterData, setFilterData] = useState({});
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
  const [submitLoading, setSubmitLoading] = useState(false); //// Get Filter ////' + filter);
  let jsonToSend = [];

  /* for hooks and functions for react tags */
  const [categoryData, setCategoryData] = useState(null);
  const [tags, setTags] = React.useState([]);
  let suggestions = [];

  useEffect(() => {
    if (data) {
      // const reformattedArray = data.filterJson.map(({id, filterName}) => ({
      //   [id]: filterName,
      // }));
      var object = data.filterJson.reduce(
        (obj, item) => Object.assign(obj, {[item.id]: item.subcategory_title}),
        {}
      );
      setFilterData(object);
      setDataState(data);
    }
  }, [data]);

  useEffect(() => {
    // setFilterData(data);
    if (data) {
      setCategoryData({...data});
    }
    // to make the form updated with state by removing last updated text in form
    form.resetFields();
  }, [data, filterData, visible]);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const onClearAll = () => {
    setTags([]);
  };
  /* react tags end */

  form.setFieldsValue({
    id:
      categoryData && categoryData.category_id
        ? categoryData.category_id
        : null,
    status: categoryData && categoryData.status === 0 ? false : true,
    categoryName:
      data && categoryData && categoryData.categoryName
        ? data.categoryName
        : null,
  });

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      delete values.status;
      delete values.categoryName;
      const jsonToPost = {
        categoryId: categoryData.category_id,
        categoryStatus: values.status,
        categoryName: categoryData.categoryName,
        filterNameArray: values,
      };
      console.log('JSON TO POST @@@@@@@@@@@@@@@@@@@@', jsonToPost);
      const data = await axios
        .post(
          `${envUrl.baseUrl}${cmsendPoint.updateManageSubcategoryTitle}`,
          jsonToPost,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(async function (response) {
          console.log('@@@@@@@@@@@@@@@response', response);
          if ((response.data.message = 'success')) {
            console.log('Data updated!');
            // setSubmitLoading(false);
            // handleCancel();
            setTimeout(() => {
              console.log('Delayed for 1 second.');
              setRefreshState(refreshState + 1);
              setSubmitLoading(false);
              handleCancel();
            }, '2000');
            // setRefreshState(refreshState + 1);
          } else {
            throw new ERROR('Data not updated! error in node');
          }
        })
        .catch(function (error) {
          console.log(error.message);
          setSubmitLoading(false);
          return {state: false, message: error.message};
        });
    } catch (error) {
      console.log('error in try:', error.message);
      handleCancel();
      setSubmitLoading(false);
    }
  };

  const containerName = `categoryimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  const {confirm} = Modal;

  // const handleFilterNameChange = (id, event) => {
  //   jsonToSend = filterData.map((d) => {
  //     if (d.id == id) {
  //       d.filterName = event.target.value;
  //     }
  //   });
  //   setFilterData(filterData);
  //   // console.log('--------------------- data', data);
  //   // console.log('bbbbbbbbbbbbbbbbbbbbbb filterData', filterData);
  //   // for (let i = 0; i < filterData.length; i++) {
  //   //   if (filterData[i].id == id) {
  //   //     filterData[i].filterName = event.target.value;
  //   //   }
  //   // }
  //   // setFilterData(filterData);
  //   // console.log('--------------------- data', data.filterJson);
  //   console.log('bbbbbbbbbbbbbbbbbbbbbb filterData', filterData.filterJson);
  // };

  console.log('+++++++++++++++++++++ data', data);
  console.log('^^^^^^^^^^^^^^^^^^^^^^^^ dataState', dataState);
  console.log('aaaaaaaaaaaaaaaaaaaaaa filterData', filterData);
  console.log('yyyyyyyyyyyyyyyyyyyyyy categoryData', categoryData);

  // const onFinish = (values) => {
  //   console.log('VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV', {values});
  // };
  // const initialValues = {
  //   ...filterData,
  //   category: 'default',
  // };
  // console.log('IIIIIIIIIIIIII', initialValues);

  const afterClose = () => {
    form.resetFields();
  };
  const deleteFilter = (id) => {
    axios
      .delete(`${envUrl.baseUrl}${cmsendPoint.deleteSubcategoryTitle}`, {
        data: {id: id},
      })
      .then((res) => {
        if (res.status == 200) {
          const newData = dataState.filterJson.filter((data) => data.id !== id);
          data = newData;
          setDataState({...dataState, filterJson: newData});
          openNotificationWithIcon('success');
          setRefreshState(refreshState + 1);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotificationWithIcon('error');
      });
  };
  const handleDeleteButton = (id) => {
    /*
    const element = document.getElementById(id);
    // element.remove();
    element.style.display = 'none';
    */
    confirm({
      title: 'Do you want to delete this Sub Category Title?',
      icon: <ExclamationCircleFilled />,
      //   content:
      //     'When clicked the OK button, this dialog will be closed after 1 second',
      //   onOk() {
      //     return new Promise((resolve, reject) => {
      //       setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      //     }).catch(() => console.log('Oops errors!'));
      //   },
      onOk() {
        deleteFilter(id);
      },
      onCancel() {},
    });
  };

  // old
  // const handleDeleteButton = (id) => {
  //   const newData = dataState.filterJson.filter((data) => data.id !== id);
  //   data = newData;
  //   setDataState({...dataState, filterJson: newData});
  // };

  const openNotificationWithIcon = (type) => {
    if (type == 'success') {
      api[type]({
        message: 'TriCab CMS Notification',
        description: 'Sub Category Title Deleted!',
        duration: 2,
      });
    } else if (type == 'error') {
      api[type]({
        message: 'TriCab CMS Notification',
        description:
          'Error from server in deleting Filter, please contact system administrator!',
      });
    }
  };

  // if (Object.keys(filterData).length > 0) {
  return (
    <>
      {contextHolder}
      {/* <DndProvider backend={HTML5Backend}> */}
      <Modal
        title="Edit Sub Category Title"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{top: 20}}
        afterClose={afterClose}
      >
        <Form
          key={
            categoryData && categoryData.category_id
              ? categoryData.category_id
              : null
          }
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 24}}
          autoComplete="off"
          initialValues={{
            ...filterData,
            id:
              categoryData && categoryData.category_id
                ? categoryData.category_id
                : null,
            status: categoryData && categoryData.status === 0 ? false : true,
            categoryName:
              categoryData && categoryData.categoryName
                ? categoryData.categoryName
                : null,
          }}
          onFinish={(values) => onFinish(values)}
        >
          {/* <Form.Item
              label="Enable Category"
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              name="status"
              value={categoryData && categoryData.category_id}
            >
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value={true}>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item> */}

          <Form.Item name="categoryName" label="Category">
            <Input disabled />
          </Form.Item>

          {/* <div>
                <ReactTags
                  tags={tags}
                  // suggestions={suggestions}
                  labelField={'filterName'}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  handleTagClick={handleTagClick}
                  inputFieldPosition="bottom"
                  autocomplete
                  editable
                  clearAll
                  onClearAll={onClearAll}
                  allowDeleteFromEmptyInput={false}
                  allowUnique={true}
                />
              </div> */}
          {/* <Title>{data.categoryName}</Title> */}
          {dataState?.filterJson?.map((d, index) => (
            <Row>
              <Col span={22}>
                <Form.Item
                  label="Subcategory Title"
                  name={d.id}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Sub Category Title',
                    },
                  ]}
                  style={{paddingLeft: '30px'}}
                  // initialValue={d.filterName}
                >
                  <Input
                  // id={d.id}
                  // placeholder="Enter Filter name"
                  // value={d.filterName}
                  // defaultValue={d.filterName}
                  // onChange={() => handleFilterNameChange(d.id, event)}
                  // onClick={() => handleMoreClick(ordersList.id)}
                  // style={{width: 'auto'}}
                  />
                </Form.Item>
              </Col>
              <Col span={1} offset={1}>
                {d.isLinked > 0 ? (
                  <Tooltip
                    placement="right"
                    title={
                      'Title cannot be deleted since it is linked with a Sub Category'
                    }
                    trigger={'hover'}
                    color={'red'}
                  >
                    <Button
                      type="link"
                      onClick={() => handleDeleteButton(d.id)}
                      icon={<DeleteTwoTone />}
                      disabled
                    ></Button>
                  </Tooltip>
                ) : (
                  <Button
                    type="link"
                    onClick={() => handleDeleteButton(d.id)}
                    icon={<DeleteTwoTone />}
                  ></Button>
                )}
              </Col>
            </Row>
          ))}
          <Form.Item style={{textAlign: 'right'}}>
            <Button
              type="primary"
              htmlType="submit"
              style={{marginTop: '10px'}}
              loading={submitLoading}
              disabled={Object.keys(filterData).length <= 0}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* </DndProvider> */}
    </>
  );
  // } else {
  //   return <></>;
  // }
};

export default EditFilterModal;
