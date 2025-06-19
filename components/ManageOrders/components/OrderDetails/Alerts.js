import {Alert, Space} from 'antd';
const Alerts = (successAlert, errorAlert) => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
    {successAlert.length > 0 ? (
      <Alert message={successAlert} type="success" showIcon closable />
    ) : null}
    {errorAlert.length > 0 ? (
      <Alert message={errorAlert} type="error" showIcon closable />
    ) : null}
    {/* <Alert message="Success Tips" type="success" showIcon closable /> */}
    {/* <Alert message="Informational Notes" type="info" showIcon closable /> */}

    {/* <Alert message="Warning" type="warning" showIcon closable /> */}
    {/* <Alert message="Error" type="error" showIcon /> */}
    {/* <Alert
      message="Success Tips"
      description="Detailed description and advice about successful copywriting."
      type="success"
      showIcon
    />
    <Alert
      message="Informational Notes"
      description="Additional description and information about copywriting."
      type="info"
      showIcon
    />
    <Alert
      message="Warning"
      description="This is a warning notice about copywriting."
      type="warning"
      showIcon
      closable
    />
    <Alert
      message="Error"
      description="This is an error message about copywriting."
      type="error"
      showIcon
    /> */}
  </Space>
);
export default Alerts;
