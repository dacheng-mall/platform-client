import React from 'react';
import _ from "lodash";
import { Select } from 'antd';

export default ({ onSearch, onChange, value, options = [], placeholder, type }) => {
  console.log(value, options, placeholder, type)
  return (
    <Select
      onSearch={onSearch}
      onSelect={onChange}
      placeholder={placeholder}
      showSearch
      filterOption={false}
      value={value}
    >
      {_.map(options, (opt, i) => (
        <Select.Option key={`${type}_${i}`} value={opt.id}>
          {opt.title}
        </Select.Option>
      ))}
    </Select>
  );
};
