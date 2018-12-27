import React, { PureComponent } from 'react';
import { Upload, Icon } from 'antd';
import _ from 'lodash';

function getObjectURL(file) {
  let url = null;
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file);
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file);
  }
  return url;
}
export default class Uploader extends PureComponent {
  state = {
    fileList: [],
  };
  handlePreview = () => {};
  handleChange = (args) => {
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(args);
    }
  };
  onRemove = (file) => {
    this.setState((state) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };
  beforeUpload = (file) => {
    file.url = getObjectURL(file);
    this.setState(() => ({
      fileList: [file],
    }));
    return false;
  };
  render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Upload
        listType={this.props.listType || 'picture-card'}
        fileList={this.state.fileList}
        onPreview={this.handlePreview}
        onChange={this.handleChange}
        customRequest={this.customRequest}
        beforeUpload={this.beforeUpload}
        onRemove={this.onRemove}
      >
        {this.state.fileList && this.state.fileList.length === (this.props.max || 1)
          ? null
          : uploadButton}
      </Upload>
    );
  }
}
