import React from "react";
import { Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,

  CRow,
} from "@coreui/react";

const Login = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center loginBackground">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CRow className="justify-content-center">
              <div className="logoImage">
                <img src={"images/koala-logo.png"} width={"100"} />
              </div>
            </CRow>
            <CCardGroup className="loginCard">
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    {/* <h1 className="loginHeader">Login</h1> */}
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3 inputGroupLogin">
                      <Input
                        size="large"
                        placeholder="large size"
                        prefix={<UserOutlined />}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4 inputGroupLogin">
                      <Input.Password
                        size="large"
                        placeholder="large size"
                        visibilityToggle={false}
                        prefix={<LockOutlined />}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="loginButton px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        {/* <CButton
                          color="link"
                          className="px-0 forgotPasswordLink"
                        >
                          Forgot password?
                        </CButton> */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};   

export default Login;
