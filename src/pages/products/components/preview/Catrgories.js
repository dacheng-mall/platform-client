import React from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import styles from "./styles.less";

const Option = Select.Option;

export default class Categories extends React.PureComponent {
  state = {
    data: this.props.data,
    current: 0,
  };
  changeHandle = (current) => {
    this.setState({
      current,
    });
  };
  render() {
    return (
      <div className={styles.categories}>
        <Select defaultValue={0} style={{ width: '100%' }} onChange={this.changeHandle} placeholder="请选择类型">
          {_.map(this.props.data, (val, i) => {
            return (
              <Option key={`cate_${i}`} value={i}>
                {val.label}
              </Option>
            );
          })}
        </Select>
        <div className={styles.cateCont}>
          {this.state.data[this.state.current].content}
        </div>
      </div>
    );
  }
}
