import React, { PureComponent } from 'react';
import _ from 'lodash';
import Uploader from '../../../Components/Uploader';

export default class ImageEditor extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    let fileList = [];
    fileList = _.map(props.value, (data, i) => {
      if (data.lastModified) {
        // 这是新上传的
        return data;
      }
      // 这是本来就有的
      console.log('这是本来就有的')
      return {
        uid: `old_${i}`,
        name: data.name,
        url: data.url,
        status: 'done',
        dontTouch: true,
      };
    });
    return { ...state, fileList };
  };
  state = {
    fileList: [],
  };
  onChange = ({ fileList }) => {
    this.props.onChange(fileList);
  };
  render() {
    return <Uploader multiple max={5} onChange={this.onChange} fileList={this.state.fileList} />;
  }
}
