import React, {useState, useEffect} from 'react';
import Head from 'next/head';
// import 'antd/dist/antd.css';
import {Layout} from 'antd';
import {Card} from 'antd';
import {Form, Input, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import styles from './styles.module.scss';
import {signIn} from '../service/auth/authService';
import {LoadingOutlined} from '@ant-design/icons';
import {Image} from 'antd';
import {Row} from 'react-bootstrap';

const {Header, Footer, Sider, Content} = Layout;
const Login = (props) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [inActiveUser, setInactiveUser] = useState(false);
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const response = await signIn({
      email: values.username,
      password: values.password,
    });
    console.log('^^^^^^^^^ response = ', response);
    if (response && response.state == true) {
      props.history.replace('/');
    } else if ((response.message = 'inactive')) {
      setInactiveUser(true);
    } else {
      // alert.show(response.message);
      setLoginError(true);
    }
    setLoading(false);
  };

  const handlePasswordChange = (e) => {
    if (e.target.value == '') {
      setLoginError(false);
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Content className={styles.divsec}>
        {/* <Row className="justify-content-md-center">
          <Image
            width={130}
            src="http://www.colomboterminusconsulting.com/images/icons/ll.png"
            className={styles.image}
          />
        </Row> */}
        <Row className="justify-content-md-center">
          <Card className={styles.card}>
            <Form
              form={form}
              name="horizontal_login"
              layout="inline"
              onFinish={onFinish}
              className={styles.form}
            >
              <Form.Item>
                <p className={styles.title}>Login</p>
                {/* <p className={styles.subTitle}>Sign in to your account</p> */}
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  // {
                  //   type: 'email',
                  //   message: 'The input is not valid E-mail!',
                  // },
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
                  onChange={handlePasswordChange}
                />
              </Form.Item>
              {loginError && (
                <div
                  class="invalid-feedback"
                  style={{
                    display: 'block',
                  }}
                >
                  Invalid username or password
                </div>
              )}
              {inActiveUser && (
                <div
                  class="invalid-feedback"
                  style={{
                    display: 'block',
                  }}
                >
                  User Inactive! Please contact Administrator
                </div>
              )}
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
                      'Log in'
                    )}
                  </Button>
                )}
              </Form.Item>
              {/* 
              <Form.Item>
                <p className={styles.forgetPasswordText}>Forget password?</p>
              </Form.Item> */}
            </Form>
          </Card>
        </Row>
      </Content>
      {/* </div> */}
    </>
  );
};

export default Login;
