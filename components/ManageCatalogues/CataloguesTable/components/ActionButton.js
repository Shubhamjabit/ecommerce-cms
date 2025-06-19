import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {Button, Tooltip} from 'antd';
import styles from './styles.module.scss';
import {
  EyeFilled,
  EyeInvisibleFilled,
  SendOutlined,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {setCategory} from '../../../../store/actions/categoryActions';
import QRCode from 'react-qr-code';

const ActionButton = ({showEditModal, category, showDeleteModal}) => {
  const dispatch = useDispatch();
  const categorydata = useSelector((status) => status.categoryReducer.category);
  console.log('@@@@@@@@@@@@@ categorddata', categorydata);
  console.log('@@@@@@@@@@@@@22222 category', category);

  const onImageDownload = () => {
    const svg = document.getElementById('QRCodeScaled');
    console.log('********* svg = ', svg);
    // return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QRCode-${category.name.replace(' ', '-')}`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const qrCodeContainer = () => {
    /*
    return (
      <>
        {category ? (
          <div>
            <QRCode
              id="QRCode"
              title="QR Code"
              value={`${process.env.BRAND_CDN_URL + category.file_url}`}
            />
          </div>
        ) : null}
      </>
     
    );
    */
    return (
      // <div>
      //   <QRCode
      //     id="QRCode"
      //     title="QR Code"
      //     value={`${process.env.BRAND_CDN_URL + category.file_url}`}
      //   />
      // </div>
      <div
        style={{
          height: 'auto',
          margin: '1%',
          maxWidth: 50,
          width: '100%',
          display: 'none',
        }}
      >
        <QRCode
          id="QRCodeScaled"
          size={256}
          style={{height: 'auto', maxWidth: '100%', width: '100%'}}
          title="Custom Title"
          // value={`${process.env.BRAND_CDN_URL + category.file_url}`}
          // value={
          //   window.location.hostname +
          //   ':3000' +
          //   '/' +
          //   category.name.replace(' ', '-').toLowerCase()
          // }
          value={
            process.env.WEB_DOMAIN +
            category.name.replace(' ', '-').toLowerCase()
          }
          viewBox={`0 0 256 256`}
        />
      </div>
    );
  };

  return (
    <div className={styles.dashboardProductTableAction}>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setCategory(category));
          console.log('dispatch', category);
          showEditModal();
        }}
      >
        <EditOutlined style={{fontSize: '14px'}} />
        Edit
      </Button>
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setCategory(category));
          onImageDownload();
        }}
      >
        {' '}
        <DownloadOutlined style={{fontSize: '14px'}} /> QR Code{' '}
      </Button>
      {qrCodeContainer()}
      <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setCategory(category));
          showDeleteModal();
        }}
      >
        <DeleteOutlined style={{fontSize: '14px'}} />
        Delete
      </Button>

      {/* <Button
        className={styles.dashboardProductTableActionButtonDelete}
        onClick={() => {
          dispatch(setBanner(banner));
            console.log("dispatch",banner);
            showModal3();
            
        }}>
        <DeleteOutlined style={{ fontSize: "14px" }} />
            Delete
        </Button>
      {banner.status == 'Unpublish' ? (<Button
        className={styles.dashboardProductTableActionButtonPublish}
        onClick={() => {
            dispatch(setBanner(banner));
            console.log("dispatch",banner);
            showModal1();
        }}>
        <SendOutlined style={{ fontSize: "16px" }} />
            Publish
      </Button>) :
      <Button
        className={styles.dashboardProductTableActionButtonHide}
        onClick={() => {
          dispatch(setBanner(banner));
            console.log("dispatch",banner);
            showModal2();
            
        }}>
        <EyeInvisibleFilled style={{ fontSize: "14px" }} />
            Hide
        </Button>} */}
    </div>
  );
};

export default ActionButton;
