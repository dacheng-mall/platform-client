import React, { PureComponent } from 'react';
import Uploader from '../../../../Components/Uploader';
import {source} from '../../../../../../setting'

// const 
export default class Img extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    if (props.value && props.value.value) {
      const fileList = (function(val){
        if(typeof val.value === 'string') {
          return Uploader.initSingleFile(val.url || `${source}${val.value}`)
        }
        return [val.value]
      }(props.value))
      return { ...state, fileList };
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
