import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import SearchTextbox from '../../../../../../Shared/SearchBox/SearchTextbox';
import stlyes from './SelectionBar.module.scss';

const SelectionBar = ({ showModal }) => {
  const { Option } = Select;

  return (
    <Row className={stlyes.mainRow}>
    <Col xs={12} sm={6}>
      <Row>
        <div className={stlyes.col1}>
          <p className={stlyes.labelText}>Show </p>
        </div>
        <div>
          <Select
            style={{width: 60}}
            placeholder=""
            optionFilterProp="children"
            // onChange={() => console.log('')}
            // onFocus={() => console.log('')}
            // onBlur={() => console.log('')}
            // onSearch={() => console.log('')}
            // filterOption={(input, option) =>
            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
            defaultValue ={10}
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </Select>
        </div>

      </Row>
    </Col>

    <Col xs={12} sm={6} className={stlyes.colEnd}>
      <div className="card-header-actions">
        <SearchTextbox
          placeholder="search user"
          onSearch={(value) => console.log(value)}
          style={{width: 300}}
          className="userSearch"
        />
      </div>
    </Col>
  </Row>
  );
};

export default SelectionBar;
