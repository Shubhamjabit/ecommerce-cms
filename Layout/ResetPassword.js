import React, {useState, useEffect} from 'react';
import Head from 'next/head';
// import 'antd/dist/antd.css';
import {Layout} from 'antd';
import {Card} from 'antd';
import {Form, Input, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import styles from './styles.module.scss';
import {resetPassword} from '../service/auth/authService';
import {LoadingOutlined} from '@ant-design/icons';
import {Image} from 'antd';
import {Row} from 'react-bootstrap';

const {Header, Footer, Sider, Content} = Layout;
const ResetPassword = (props) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [loading, setLoading] = useState(false);
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const response = await resetPassword({
      email: values.username,
      tempPassword: values.temppassword,
      password: values.password,
    });
    if (response && response.state == true) {
      props.history.replace('/');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Content className={styles.divsec}>
        <Row className="justify-content-md-center">
          <Image
            width={130}
            src="http://www.colomboterminusconsulting.com/images/icons/ll.png"
            className={styles.image}
          />
        </Row>
        <Row className="justify-content-md-center">
          <Card className={styles.resetPasswordCard}>
            <Form
              form={form}
              name="horizontal_login"
              layout="inline"
              onFinish={onFinish}
              className={styles.form}
            >
              <Form.Item>
                <p className={styles.title}>Reset Password</p>
                {/* <p className={styles.subTitle}>Sign in to your account</p> */}
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input
                  className={styles.usernameInput}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>

              <Form.Item
                name="temppassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your temporary password!',
                  },
                ]}
              >
                <Input
                  className={styles.passwordInput}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Temporary Password"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {required: true, message: 'Please input your password!'},
                ]}
              >
                <Input
                  className={styles.passwordInput}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'The two passwords that you entered do not match!'
                      );
                    },
                  }),
                ]}
              >
                <Input
                  className={styles.passwordInput}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <Form.Item shouldUpdate={true}>
                {() => (
                  <Button
                    // disabled={loading}
                    className={styles.loginButton}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      form.getFieldsError().filter(({errors}) => errors.length)
                        .length
                    }
                  >
                    {loading ? (
                      <LoadingOutlined style={{fontSize: 24}} spin />
                    ) : (
                      'Reset'
                    )}
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Card>
        </Row>
      </Content>
      {/* </div> */}
    </>
  );
};

export default ResetPassword;
