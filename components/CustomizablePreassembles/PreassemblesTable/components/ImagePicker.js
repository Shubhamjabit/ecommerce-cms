import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Upload, Modal, Tooltip} from 'antd';
import {PlusOutlined, InboxOutlined} from '@ant-design/icons';
import axios from 'axios';
import {cmsendPoint, envUrl} from '../../../../utils/factory';
import {imageURLDecode, imageURLs, imageURL} from '../../../../util/data';
import {useSelector, useDispatch} from 'react-redux';
import {
  setProductMediaList,
  setValueWhenProduUpdate,
  editProductModal,
} from '../../../../store/actions/productActions';
import {v4 as uuidv4} from 'uuid';
import update from 'immutability-helper';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {BlobServiceClient, ContainerClient} from '@azure/storage-blob';
const {Dragger} = Upload;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const type = 'DragableUploadList';

const DragableUploadListItem = ({originNode, moveRow, file, fileList}) => {
  const ref = React.useRef();
  const index = fileList.indexOf(file);
  const [{isOver, dropClassName}, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const {index: dragIndex} = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
      // console.log('dragIndex index::::::::::::::' + index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const errorNode = (
    <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>
  );
  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ''
      }`}
      style={{cursor: 'move'}}
    >
      {file.status === 'error' ? errorNode : originNode}
    </div>
  );
};

const ImagePicker = ({uploadImage, getimageno}) => {
  const dispatch = useDispatch();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imagesArray, setImagesArray] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  //const [filetype, setFileType] = useState();

  //console.log('imagre preview @@@@ -1', fileList);
  // console.log('imagre preview @@@@ -2', previewImage);
  // console.log('imagre preview @@@@ -3', previewTitle);
  // console.log('imagre preview @@@@ -4', fileList);

  let beforeUploadCounter = 0;
  let filetype;
  const {confirm} = Modal;

  useEffect(() => {
    //console.log('dispatching file list  from effect at imagePicker:', fileList);
    dispatch(setProductMediaList(fileList));
  }, [fileList]);

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const containerName = `productimages`;
  const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
  const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

  const saveRequest = ({file, onSuccess}) => {
    // sendImage(file, onSuccess);
    // console.log('$$$$$$$$$ file = ', file);
    uploadFileToBlob(file, onSuccess);
  };

  /* old
  const sendImage = async (file, onSuccess) => {
    uploadImage(true);
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

      await fileList.push({
        uid: imageID,
        name: '/' + key,
        status: 'done',
        url: imageURL({path: '/' + key}),
        defaultImage: 0,
        priority:
          fileList && fileList.length > 0
            ? parseInt(
                fileList[fileList.length - 1].priority
                  ? fileList[fileList.length - 1].priority
                  : 0
              ) + 1
            : 1,
      });
      beforeUploadCounter--;
      if (beforeUploadCounter == 0) {
        fileList.sort((a, b) => {
          return a.priority - b.priority;
        });
        //console.log('at line 109 in if WITH SORT :', fileList);
        setFileList(fileList);
        dispatch(setProductMediaList(fileList));
        dispatch(editProductModal(true));
        dispatch(editProductModal(false));
        uploadImage(false);
      }
    } catch (error) {
      //console.log('error>>>>>>>>:', error);
      uploadImage(false);
    }
  };
  */

  // new for node
  const uploadFileToBlob = async (file, onSuccess) => {
    // uploadImage(true);
    setIsUploading(true);
    if (!file) return [];
    // upload file to server
    const formData = new FormData();
    formData.append('new_file', file);
    formData.append('type', 'productimages');
    // console.log('@@@@@', file);
    // console.log('!!!!!!!', formData);
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.uploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status == 200) {
          // console.log('$$$$$$$$ response.data = ', response.data);
          fileList.push({
            uid: response.data.data,
            name: '/' + response.data.data,
            status: 'done',
            url: imageURL({path: '/' + response.data.data}),
            defaultImage: 0,
            priority:
              fileList && fileList.length > 0
                ? parseInt(
                    fileList[fileList.length - 1].priority
                      ? fileList[fileList.length - 1].priority
                      : 0
                  ) + 1
                : 1,
          });
          beforeUploadCounter--;
          if (beforeUploadCounter == 0) {
            fileList.sort((a, b) => {
              return a.priority - b.priority;
            });
            //console.log('at line 109 in if WITH SORT :', fileList);
            setFileList(fileList);
            dispatch(setProductMediaList(fileList));
            dispatch(editProductModal(true));
            dispatch(editProductModal(false));
            // uploadImage(false);
            setIsUploading(false);
          }
        } else {
          throw new ERROR('Error in product image Upload');
        }
      })
      .catch((error) => {
        // inform the user
        console.log('error in Uploading product image', error);
        // uploadImage(false);
        setIsUploading(false);
      });
  };

  const handleChange = ({fileList, file, event}) => {
    //console.log('file type ::::::::::::::' + file.type);
    filetype = file.type;
    if (file.status === 'done') {
      fileList = fileList.filter(async function (obj) {
        let isDefaultUploadIncludedInFileList = obj.uid.includes('rc-upload-');
        return !isDefaultUploadIncludedInFileList;
      });
    }

    if (file.status === 'removed') {
      setFileList(fileList);
      dispatch(setProductMediaList(fileList));
    }
  };

  /* old
  const removeImg = async (file) => {
    //console.log('###############removeImg', file);
    return new Promise((resolve, reject) => {
      confirm({
        title: 'Are you sure to remove this image?',
        onOk: async () => {
          try {
            await axios
              .post(
                process.env.PRODUCT_MEDIA_DELETE,
                {mediaKey: file.uid},
                {
                  headers: {
                    'x-api-key': process.env.BACKEND_MEDIA_API_KEY,
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/json',
                  },
                }
              )
              .then((res) => {
                DeleteProductMedia({
                  variables: {mediaKey: file.uid},
                }).then(function (result) {
                  if (result.data.deleteProductMedia === 'Success') {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                });
              })
              .catch((err) => {
                // console.log('error in request', err);
              });
          } catch (error) {
            resolve(false);
            //  console.log('error', error);
          }
        },
      });
    });
  };
  */

  // new for node
  const removeFileToBlob = async (file, index, fileType) => {
    // console.log('@@@@@@@@@@@@@@@@@ file', file);
    const formData = new FormData();
    formData.append('new_file', file.name);
    formData.append('type', 'productimages');
    // console.log('@@@@@ delete', file);
    // console.log('!!!!!!!', formData);
    await axios
      .post(`${envUrl.baseUrl}${cmsendPoint.deleteUploadImage}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // console.log('!!!!!!!!!!!!4444444 response.data', response.data);
        if (response.status == 200) {
          const newFileList = fileList.filter((f) => f.uid !== file.uid);
          beforeUploadCounter--;
          if (beforeUploadCounter == 0) {
            newFileList.sort((a, b) => {
              return a.priority - b.priority;
            });
            //console.log('at line 109 in if WITH SORT :', fileList);
            setFileList(newFileList);
            dispatch(setProductMediaList(newFileList));
            dispatch(editProductModal(true));
            dispatch(editProductModal(false));
            // uploadImage(false);
            setIsUploading(false);
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

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      getimageno();
      const dragRow = fileList[dragIndex];

      setFileList(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [fileList]
  );

  // function beforeUpload(file) {
  //   console.log('file :::::::::::::::::' + file.type);
  //     setFileType(file.type);
  //   }
  const uploadButton = (
    <div style={{marginBottom: 8}}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </div>
  );
  // console.log('!!!!!!!!!!!!!!!!! fileList =', fileList);
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Dragger
          customRequest={saveRequest}
          listType="picture-card"
          fileList={fileList}
          multiple={true}
          // onRemove={removeImg}
          onRemove={removeFileToBlob}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={(file) => {
            beforeUploadCounter++;
            // allFilesLength = fileList.length
          }}
          itemRender={(originNode, file, currFileList) => (
            <DragableUploadListItem
              originNode={originNode}
              file={file}
              fileList={currFileList}
              moveRow={moveRow}
            />
            // <>
            //   {isUploading ? (
            //     <>
            //       <Spin
            //         tip="Please Wait...."
            //         size="large"
            //         className={styles.Spin}
            //       >
            //         <div className="content" />
            //       </Spin>
            //     </>
            //   ) : (
            //     <>
            //       {' '}
            //       <DragableUploadListItem
            //         originNode={originNode}
            //         file={file}
            //         fileList={currFileList}
            //         moveRow={moveRow}
            //       />
            //     </>
            //   )}
            // </>
          )}
        >
          {fileList.length >= 20 ? null : uploadButton}
        </Dragger>
      </DndProvider>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{width: '100%'}} src={previewImage} />
      </Modal>
    </>
  );
};
export default ImagePicker;
