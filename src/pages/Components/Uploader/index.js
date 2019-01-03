import React, { PureComponent } from 'react';
import { Upload, Icon, Button } from 'antd';
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

const UploadButton = ({ type }) => {
  if (!type || type === 'picture-card') {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
  }
  return (
    <Button icon="upload">
      上传文件
    </Button>
  );
};
export default class Uploader extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    return { ...state, fileList: props.fileList };
  };
  state = {
    fileList: this.props.fileList || [],
  };
  handlePreview = () => {};
  handleChange = (args) => {
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(args);
    }
  };
  onRemove = (file) => {
    const { fileList } = this.state;
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange({ fileList: newFileList });
    } else {
      this.setState({
        fileList: newFileList,
      });
    }
  };
  beforeUpload = (file, fileList) => {
    file.url = getObjectURL(file);
    this.setState(() => ({
      fileList,
    }));
    return false;
  };
  render() {
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
        {this.state.fileList && this.state.fileList.length === (this.props.max || 1) ? null : (
          <UploadButton type={this.props.listType} />
        )}
      </Upload>
    );
  }
}
