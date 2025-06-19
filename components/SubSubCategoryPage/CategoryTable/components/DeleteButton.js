import React from 'react';
import {DeleteTwoTone} from '@ant-design/icons';
import {Row} from 'antd';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {Button, Modal, notification, Space} from 'antd';
import {setCategory} from '../../../../store/actions/categoryActions';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
const {confirm} = Modal;

const DeleteButton = ({category, Editcategoryflag}) => {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  //   console.log('@@@@@@@@@@@@@@@@@ category', category);

  const deleteSubCategory = () => {
    axios
      .delete(`${envUrl.baseUrl}${cmsendPoint.deleteSubCategory}`, {
        data: {id: category.id},
      })
      .then((res) => {
        if (res.status == 200) {
          openNotificationWithIcon('success');
          Editcategoryflag(true);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotificationWithIcon('error');
      });
  };

  const showPromiseConfirm = () => {
    confirm({
      title: 'Do you want to delete this Sub Category?',
      icon: <ExclamationCircleFilled />,
      //   content:
      //     'When clicked the OK button, this dialog will be closed after 1 second',
      //   onOk() {
      //     return new Promise((resolve, reject) => {
      //       setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      //     }).catch(() => console.log('Oops errors!'));
      //   },
      onOk() {
        deleteSubCategory();
      },
      onCancel() {},
    });
  };

  const openNotificationWithIcon = (type) => {
    if (type == 'success') {
      api[type]({
        message: 'TriCab CMS Notification',
        description: 'Sub Category Deleted!',
      });
    } else if (type == 'error') {
      api[type]({
        message: 'TriCab CMS Notification',
        description: 'Error from server, please contact system administrator!',
      });
    }
  };
  return (
    <Row>
      {contextHolder}
      <DeleteTwoTone
        twoToneColor="red"
        onClick={() => {
          dispatch(setCategory(category));
          console.log('dispatch', category);
          showPromiseConfirm();
        }}
        style={{fontSize: '150%', paddingTop: '21%'}}
      />
    </Row>
  );
};

export default DeleteButton;
