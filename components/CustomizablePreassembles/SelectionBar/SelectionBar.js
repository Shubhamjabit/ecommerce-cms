import React, {Component} from 'react';
import {Card, Col, Row, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Select} from 'antd';
import SearchTextbox from '../../../Shared/SearchBox/SearchTextbox';
import stlyes from './SelectionBar.module.scss';
import _ from 'lodash';

const SelectionBar = ({
  showModal,
  handleOnChange,
  clearAll,
  setPublishSort,
  setHiddenSort,
}) => {
  return (
    <Row className={stlyes.mainRow}>
      <Col xs={12} sm={6}>
        <Space style={{marginLeft: 16}}>
          <Button onClick={setPublishSort}>Sort Publish Product</Button>
          <Button onClick={setHiddenSort}>Sort Unpublished Product</Button>
          {/*  <Button onClick={this.clearFilters}>Clear filters</Button>*/}
          <Button onClick={clearAll}>Clear filters</Button>
        </Space>
      </Col>

      <Col xs={12} sm={6} className={stlyes.colEnd}>
        <div className="card-header-actions">
          <SearchTextbox
            placeholder="search user"
            style={{width: 300}}
            className="userSearch"
            handleOnChange={handleOnChange}
          />
        </div>
      </Col>
    </Row>
  );
};

export default SelectionBar;
