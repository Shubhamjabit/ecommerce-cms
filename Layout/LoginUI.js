import {Container, Row, Col, Form} from 'react-bootstrap';
import styles from './Login.module.scss';
import Link from 'next/link';
import {CustomButton} from '../Shared/Button';
import {CustomCheckbox} from '../Shared/Checkbox';
import {CustomTextField} from '../Shared/TextFields';
import {Formik} from 'formik';
// import {signIn} from '../../services/auth/authService';
import {CustomTextFieldPassword} from '../Shared/TextFieldPassword';
import Router from 'next/router';
// import {LoginFormValidation} from '../Shared/Forms/Validation/Validation';
// import {useAlert} from 'react-alert';

export const LoginUI = (props) => {
  // const alert = useAlert();
  const onSubmit = async (values) => {
    // const response = await signIn({
    //   email: values.email,
    //   password: values.password,
    // });
    // if (response && response.state == true) {
    //   alert.show('Signed in successfully.');
    //   Router.replace('/dashboard');
    // } else {
    //   alert.show(response.message);
    // }
  };

  return (
    <Row className={styles.loginBackgroundColor}>
      <Container>
        <Row>
          <Col sm={3} />
          <Col sm={6}>
            <div className={styles.loginBox}>
              <Container className={styles.innerBoxContainer}>
         
                <Form>
                  <Formik
                    validationSchema={LoginFormValidation}
                    onSubmit={(values) => onSubmit(values)}
                    initialValues={{terms: false}}>
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      submitCount,
                      isSubmitting,
                    }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <div className={styles.formDivRow}>
                          <CustomTextField
                            label="Email address*"
                            classLable="defaultLabel"
                            type="email"
                            name="email"
                            classType="defaultTextBox"
                            handleOnChange={handleChange}
                            onBlur={handleBlur}
                            errorMessage={errors.email}
                            isInvalid={
                              (submitCount > 0 && errors.email) ||
                              (errors.email && touched.email)
                            }
                          />
                          <Form.Group
                            className={styles.formBottom}
                            controlId="password">
                            <div className={styles.passwordDiv}>
                              <CustomTextFieldPassword
                                label="Password*"
                                classLable="defaultLabel"
                                name="password"
                                placeholder="Set password for (6-20 characters)"
                                classType="defaultTextBox"
                                handleOnChange={handleChange}
                                onBlur={handleBlur}
                                errorMessage={errors.password}
                                isInvalid={
                                  (submitCount > 0 && errors.password) ||
                                  (errors.password && touched.password)
                                }
                              />
                              <span className={styles.eyeIcon}>
                                <i className="fa fa-eye-slash"></i>
                              </span>
                              {/* <span className={styles.eyeIcon}><i class="fa fa-eye"></i></span>  //Toggle Password Should apply this Icon*/}
                            </div>
                          </Form.Group>
                        </div>
                        <Row>
                          <Col>
                            <CustomCheckbox
                              id="defaul-1"
                              value="random3"
                              name="example"
                              label="Remember me"
                              // handleClick={handleAPICall} (Include Function That want to do with Button)
                            />
                          </Col>
                          <Col className={styles.colAlignRight}>
                            <Link href="/forgotpassword">
                              <p className={styles.forgotPassword}>
                                Forgot Password?
                              </p>
                            </Link>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={5} className={styles.loginBtnCol}>
                            <CustomButton
                              buttonType="submit"
                              label="LOGIN"
                              type="defaultBtnDark"
                            />
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Form>
              </Container>
            </div>
          </Col>
          <Col sm={3} />
        </Row>
      </Container>
    </Row>
  );
};
