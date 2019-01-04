import React, { PureComponent } from 'react';
import Uploader from '../../../../Components/Uploader';

// const 
export default class Img extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    if (props.value && props.value.value) {
      return { ...state, fileList: Uploader.initSingleFile(props.value.value) };
    }
    return { ...state, fileList: [] };
  };
  state = {
    fileList: [],
  };
  onChange = ({ fileList }) => {
    const file = fileList[0]
    this.props.onChange(file || null, `[${this.props.index}].value`);
  };
  render() {
    return <Uploader onChange={this.onChange} fileList={this.state.fileList} />;
  }
}
