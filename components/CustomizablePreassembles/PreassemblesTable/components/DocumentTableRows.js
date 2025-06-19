import {Upload, Button} from 'antd';
import {
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  FileOutlined,
} from '@ant-design/icons';
function DocumentTableRows({
  DocumentData,
  deleteDocumentRows,
  handleDocumentChange,
  beforeUpload,
  saveDocumentImage,
  styles,
}) {
  return DocumentData.map((data, index) => {
    const {DocumentName, DocumentImage} = data;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={DocumentName}
            onChange={(evnt) => handleDocumentChange(index, evnt)}
            name="DocumentName"
            className="form-control"
            placeholder="Enter Document Name"
          />
        </td>
        <td>
          <Upload
            listType="picture-circle"
            customRequest={(e) => saveDocumentImage({...e, index})}
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            <div>
              {/* {loading ? <LoadingOutlined /> : <UploadOutlined />} */}
              <Button
                icon={
                  data.UploadStatus ? <LoadingOutlined /> : <UploadOutlined />
                }
                style={{display: 'flex', alignItems: 'center'}}
              >
                Click to Upload
              </Button>
            </div>
          </Upload>
        </td>
        <td>
          {data.DocumentImage && (
            <div className={styles.UploadFile}>
              {data.DocumentImage.split('.')[1] === 'pdf' ? (
                <span className={styles.Icon}>
                  <FileOutlined />
                </span>
              ) : (
                <span className={styles.Image}>
                  <img
                    src={process.env.PRODUCT_CDN_URL + data.DocumentImage}
                    alt="avatar"
                  />
                </span>
              )}
              <span className={styles.FileName}>
                {data.DocumentImage.split('/')}
              </span>
            </div>
          )}
        </td>

        <td>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteDocumentRows(index)}
          >
            x
          </button>
        </td>
      </tr>
    );
  });
}
export default DocumentTableRows;
