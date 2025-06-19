
import React, { useEffect, useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { imageURLDecode, imageURLs } from '../../../../../util/data';
import Axios from 'axios';
import { useMutation } from '@apollo/client';
import { DELETE_MEDIA } from '../../../../../graphql/Mutations/Products'
import axios from 'axios';
const { Dragger } = Upload;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ImagePickerSection = ({ bannerImage, bannerSection, bannerSubSection }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imagesArray, setImagesArray] = useState([]);
  const [imageUrl, setImageURL] = useState(null);
  const [DeleteProductMedia, { data }] = useMutation(DELETE_MEDIA);
  const { confirm } = Modal;

  useEffect(() => {
    // const value = imageURLs(bannerImage);
    setImageURL(process.env.PRODUCT_CDN_URL + '/banners/' + bannerImage);
    // const imgs = value.map((i) => {
    //   return {
    //     uid: imageURLDecode(i.thumbnail),
    //     name: i.thumbnail.split("/")[5],
    //     status: "done",
    //     url: i.thumbnail
    //   };
    // });
    // setFileList(imgs);
  }, [bannerImage, bannerSection, bannerSubSection]);

  const handleCancel = () => { setPreviewVisible(false) };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    );
  };

  const saveRequest = ({ file, onSuccess }) => { sendImage(file, onSuccess); };

  // const sendImage = async (file, onSuccess) => {

  //   console.log('process.env.BANNER_MEDIA_UPLOAD', process.env.BANNER_MEDIA_UPLOAD);
  //   await Axios.post(process.env.BANNER_MEDIA_UPLOAD, {
  //     bannerSection: bannerSection,
  //     bannerSubSection: bannerSubSection,
  //     total: 1
  //   }
  //     ,
  //     {
  //       headers: {
  //         "x-api-key": process.env.BACKEND_MEDIA_API_KEY,
  //         "Access-Control-Allow-Origin": '*',
  //         "Content-Type": "text/json"
  //       }
  //     }
  //   ).then(res => {
  //     let presignedURLInfo = res.data.presignedURLs[0];
  //     console.log('presignedURLInfo', presignedURLInfo);
  //     try {
  //       const data = Axios.put(presignedURLInfo.url, file, {
  //         headers: {
  //           "Access-Control-Allow-Origin": '*',
  //           'Content-Type': file.type,
  //         },
  //       });

  //       setImageURL(process.env.PRODUCT_CDN_URL + '/banners/' + bannerID + '.png');

  //       console.log('data', data);
  //       onSuccess("ok");
  //     } catch (error) {
  //       console.log('error: ', error);
  //     }
  //   }).catch(err => {
  //     console.log('error in request', err);
  //   });
  // };
  const sendImage = async (file, onSuccess) => {
    await axios
      // .post(
      //   process.env.BANNER_MEDIA_UPLOAD,
      //   {
      //     bannerSection: 1,
      //     bannerSubSection: 1,
      //     total: 1,
      //     filetype: filetype,
      //   },
      //   {
      //     headers: {
      //       'x-api-key': process.env.BACKEND_MEDIA_API_KEY,
      //       'Access-Control-Allow-Origin': '*',
      //       'Content-Type': 'text/json',
      //     },
      //   }
      // )
      .post(
        'https://drawqis306.execute-api.ap-southeast-2.amazonaws.com/prd/media/banner/upload',
        {
          bannerSection: 1,
          bannerSubSection: 1,
          total: 1,
          bucketType: 1,
        },
        {
          headers: {
            'x-api-key': 'zf7nKdBlnM4COflXalYsbaGTwnumlt6H99WYrguX', //'lnF9mfXpOn8dytte0qWAu1lGYGVLAKZm1DgntoFN', //'zf7nKdBlnM4COflXalYsbaGTwnumlt6H99WYrguX', //process.env.BACKEND_MEDIA_API_KEY,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/json',
          },
        }
      )
      .then(async (res) => {
        let uploadInfo = res.data.presignedURLs[0];
        console.log('uploadInfo: ', uploadInfo);
        await axios.put(uploadInfo.presignedURL, file, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': file.type,
          },
        });

        console.log('uploadInfo: ', file.type);
        console.log('uploadInfo: ', uploadInfo.imagePath);
        console.log('imageUrl: ', imageUrl);
        // setFileType(file.type);
        setImageFourURL('/' + uploadInfo.imagePath);
        onSuccess('ok');
      })
      .catch((err) => {
        console.log('error in request', err);
      });
  };

  const handleChange = ({ fileList, file }) => {
    // setFileList(fileList);
  };

  const removeImg = file => {
    confirm({
      title: 'Are you sure to remove this image?',
      onOk: () => {
        try {
          Axios.post(
            process.env.PRODUCT_MEDIA_DELETE,
            {
              mediaKey: file.uid
            },
            {
              headers: {
                "x-api-key": process.env.BACKEND_MEDIA_API_KEY,
                "Access-Control-Allow-Origin": '*',
                "Content-Type": "text/json"
              }
            }
          ).then(res => {
            console.log('res', res);
            DeleteProductMedia({
              variables: { mediaKey: file.uid },
            }).then(function (result) {
              console.log('res', result);
              if (result.data.deleteProductMedia === "Success") {
                resolve(true);
              } else {
                resolve(false);
              }
            });
            onSuccess("ok");
          }).catch(err => {
            console.log('error in request', err);
          });
        } catch (error) {
          resolve(false);
          console.log('error', error);
        }

      },
    });
  };

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    return isJpgOrPng;
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        customRequest={saveRequest}
        listType="picture-card"
        // fileList={fileList}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onRemove={removeImg}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="Banner" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImagePickerSection;
