import {Upload, Button} from 'antd';
import {
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  FileOutlined,
} from '@ant-design/icons';
function CertificationTableRows({
  CertificationData,
  deleteCertificationRows,
  handleCertificationChange,
  beforeUpload,
  saveImage,
  loading,
  styles,
}) {
  return CertificationData.map((data, index) => {
    const {CertificateName, CertificateImage} = data;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={CertificateName}
            onChange={(evnt) => handleCertificationChange(index, evnt)}
            name="CertificateName"
            className="form-control"
            placeholder="Enter Certificate Name"
          />
        </td>
        <td>
          <Upload
            listType="picture-circle"
            customRequest={(e) => saveImage({...e, index})}
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
          {data.CertificateImage && (
            <div className={styles.UploadFile}>
              {data.CertificateImage.split('.')[1] === 'pdf' ? (
                <span className={styles.Icon}>
                  <FileOutlined />
                </span>
              ) : (
                <span className={styles.Image}>
                  <img
                    src={process.env.PRODUCT_CDN_URL + data.CertificateImage}
                    alt="avatar"
                  />
                </span>
              )}
              <span className={styles.FileName}>
                {data.CertificateImage.split('/')}
              </span>
            </div>
          )}
        </td>

        <td>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteCertificationRows(index)}
          >
            x
          </button>
        </td>
      </tr>
    );
  });
}
export default CertificationTableRows;
