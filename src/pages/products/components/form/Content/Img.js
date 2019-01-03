import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Button, Collapse, Icon, message } from 'antd';
import styles from './styles.less';
import Uploader from '../../../../Components/Uploader';

export default class Img extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    console.log(props, state);
    if(props.value && props.value.value) {
      return { ...state, fileList: Uploader.initFileList(props.value.value) };
    }
    return { ...state };
  };
  state = {};
  onChange = () => {};
  render() {
    return <Uploader onChange={this.onChange} fileList={this.state.fileList} />;
  }
}
