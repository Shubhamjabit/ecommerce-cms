import React, { Component } from "react";
import { CRow, CCardHeader, CCol } from "@coreui/react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import SearchTextbox from "./../../../../../Components/SearchTextbox/SearchTextbox";


const Header = ({ showModal }) => {
  const { Option } = Select;


  return (
    <>
      <CCardHeader>
        Products
        <div className="card-header-actions">
          <Button
            className="dashboard-addNewProduct"
            onClick={() => {
              showModal();
            }}
            icon={<PlusOutlined />}
          >
            Add New Product
          </Button>
        </div>
      </CCardHeader>
      <CCardHeader>
        <CRow>
          <CCol xs="12" sm="6" md="1">
            show
          </CCol>
          <CCol xs="12" sm="6" md="1">
            <Select
              style={{ width: 50 }}
              placeholder=""
              optionFilterProp="children"
              onChange={() => console.log("")}
              onFocus={() => console.log("")}
              onBlur={() => console.log("")}
              onSearch={() => console.log("")}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option.Select value="jack">Jack</Option.Select>
              <Option.Select value="lucy">Lucy</Option.Select>
              <Option.Select value="tom">Tom</Option.Select>
            </Select>{" "}
          </CCol>
          <CCol xs="12" sm="6" md="1">
            Products
          </CCol>
          <CCol xs="12" sm="6" md="9">
            <div className="card-header-actions">
              <SearchTextbox
                placeholder="search user"
                onSearch={(value) => console.log(value)}
                style={{ width: 300 }}
                className="userSearch"
              />
            </div>
          </CCol>
        </CRow>
      </CCardHeader>{" "}
    </>
  );
};

export default Header;
