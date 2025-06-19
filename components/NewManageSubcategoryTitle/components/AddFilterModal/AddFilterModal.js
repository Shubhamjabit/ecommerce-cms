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
import './AddFilterModal.module.scss';
import {WithContext as ReactTags} from 'react-tag-input';
import {cmsendPoint, envUrl, CategoryimageUrl} from '../../../../utils/factory';
const {TextArea} = Input;

/* for hooks and functions forreact tags */
const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
/* react tags end */

const AddFilterModal = ({
  visible,
  handleOk,
  handleCancel,
  categories,
  filter,
  Addcategoryflag,
  refreshState,
  setRefreshState,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueed, setValueED] = React.useState(true);
  const [valuecategory, setValueCategory] = React.useState(null);
  const [valuecategoryid, setValueCategoryid] = React.useState(null);
  const [filterError, setFilterError] = useState(false);

  const Footer = () => {
    return (
      <Button className="dashboard-addNewProduct" htmlType="submit">
        Submit
      </Button>
    );
  };
  const onReset = () => {
    form.resetFields();
    setTags([]);
  };

  function onChangeED(e) {
    // console.log('radio checked', e.target.value);
    setValueED(e.target.value);
  }

  const handleChangeCategory = (value) => {
    // console.log(`selected ${value}`);
    const categoryname =
      categories && categories.data.filter((i) => i.id === value);
    setValueCategory(categoryname[0].name);
    setValueCategoryid(value);
  };
  // console.log('filter ============>', filter);
  // console.log(' valuecatid ', valuecategoryid);
  // console.log('valuecat', valuecategory);
  // start => formatting filter array for react input tag
  if (filter) {
    function toString(o) {
      Object.keys(o).forEach((k) => {
        if (typeof o[k] === 'object') {
          return toString(o[k]);
        }

        o[k] = '' + o[k];
      });

      return o;
    }

    for (let i = 0; i < filter.length; i++) {
      toString(filter[i]);
    }
    // console.log('new filter @@@@@@@@@@@@@@@>', filter);
  }
  //end

  /* for hooks and functions forreact tags */
  const [tags, setTags] = React.useState([]);

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
    // console.log('The tag at index ' + index + ' was clicked');
  };

  const onClearAll = () => {
    setTags([]);
  };
  // console.log('tags^^^^^^^^^', tags);
  /* react tags end */

  const onFinish = async (values) => {
    // console.log('@@@@@@@@@@@@ filterError', filterError);
    // console.log('@@@@@@@@@@@@2222 tags', tags);
    if (tags.length == 0) {
      setFilterError(true);
    } else {
      setFilterError(false);
      setSubmitLoading(true);
      try {
        const jsonToPost = {
          categoryId: valuecategoryid,
          filterName: tags,
        };
        // console.log('jsonToPost', jsonToPost);
        const data = await axios
          .post(
            `${envUrl.baseUrl}${cmsendPoint.addFilterWithCategory}`,
            jsonToPost,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            }
          )
          .then(function (response) {
            // console.log('@@@@@@@@@@@@@@@response', response);
            if (response.data.message === 'success') {
              setSubmitLoading(false);
              handleCancel();
              onReset();
              Addcategoryflag(true);
              setRefreshState(refreshState + 1);
            } else {
              console.log('error FROM RESPONSE AddFilterModal::::: ');
            }
          })
          .catch(function (error) {
            console.log('error in SAVING AddFilterModal::::: ', error.message);
            setSubmitLoading(false);
            return {state: false, message: error.message};
          });
      } catch (error) {
        console.log('error SAVING AddFilterModal::::::', error.message);
        handleCancel();
        setSubmitLoading(false);
      }
    }
  };

  return (
    <>
      <Modal
        title="Add Filter"
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
          handleCancel(), onReset();
        }}
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
          {/* <Form.Item
            label="Enable Filter"
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
          </Form.Item> */}

          <Form.Item
            name="category"
            label="Select Category"
            rules={[{required: true, message: 'Please select category'}]}
          >
            <Select
              placeholder="Select a category"
              onChange={handleChangeCategory}
              name="status"
              allowClear
              showSearch
              optionFilterProp="children"
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

          <Form.Item
            label="Filter Names"
            name="filters"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter at least one filter name',
            //   },
            // ]}
          >
            <div>
              <ReactTags
                tags={tags}
                // suggestions={filter}
                labelField={'filter_name'}
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
                allowUnique
                handleInputChange={() => {
                  setFilterError(false);
                }}
              />
            </div>
            {filterError && (
              <div
                class="invalid-feedback"
                style={{
                  display: 'block',
                  marginTop: '-5px',
                  height: '100px',
                }}
              >
                Please enter at least one Filter Name
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

export default AddFilterModal;
