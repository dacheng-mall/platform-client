import React, { PureComponent } from 'react';
import _ from 'lodash';
import Uploader from '../../../Components/Uploader';
const source = window.config.source;

export default class ImageEditor extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    let fileList = [];
    if (_.isString(props.value)) {
      const old = {
        uid: props.value,
        name: props.value,
        url: /^http/.test(props.value) ? props.value : `${source}${props.value}`,
      };
      fileList.push(old);
    } else if (_.isArray(props.value)) {
      fileList = _.map(props.value, (data, i) => {
        if (data.lastModified) {
          // 这是新上传的
          return data;
        }
        // 这是本来就有的
        const old = {
          uid: `old_${i}`,
          name: data.name,
          url: data.url,
        };
        if (data._url) {
          old._url = data._url;
        }
        return old;
      });
    }
    return { ...state, fileList };
  };
  state = {
    fileList: [],
  };
  onChange = ({ fileList }) => {
    this.props.onChange(fileList);
  };
  render() {
    return (
      <Uploader
        multiple={this.props.max > 1}
        max={this.props.max || 5}
        onChange={this.onChange}
        fileList={this.state.fileList}
      />
    );
  }
}
