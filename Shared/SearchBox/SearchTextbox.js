import React from 'react';
import {Input} from 'antd';
import {useDispatch} from 'react-redux';
import {setKeyword} from '../../store/actions/searchAction';

const SearchTextbox = ({handleOnChange}) => {
  const dispatch = useDispatch();

  return (
    <Input.Search
      placeholder="Search Products by Name"
      onSearch={(value) => dispatch(setKeyword(value))}
      className="userSearch"
      onChange={(e) => handleOnChange(e)}
      allowClear
    />
  );
};

export default SearchTextbox;
