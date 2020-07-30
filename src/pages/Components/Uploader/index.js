import React, { PureComponent } from 'react';
import { Upload, Icon, Button } from 'antd';
import _ from 'lodash';
import styles from './index.less';

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

function ListItem(props) {
  const { i, file, len, operator } = props;
  return (
    <div className={styles.img}>
      <img src={file.url} />
      <div className={styles.opt}>
        <Icon
          type="left"
          style={{ color: i === 0 ? '#ddd' : '#4cb0b2' }}
          onClick={operator.bind(null, i, 'left')}
        />
        <Icon
          type="right"
          style={{ color: i === len - 1 ? '#ddd' : '#4cb0b2' }}
          onClick={operator.bind(null, i, 'right')}
        />
      </div>
      <div className={styles.del}>
        <Icon onClick={operator.bind(null, i, 'delete')} type="delete-fill" />
      </div>
    </div>
  );
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
  return <Button icon="upload">上传文件</Button>;
};
export default class Uploader extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    return { ...state, fileList: props.fileList };
  };
  static initSingleFile = (value, type) => {
    // 将实际值转换成Uplaod组件中filelist属性可以解析的值
    if (value && typeof value === 'string') {
      const res = value.split('/');
      return [
        {
          uid: `${value}_${type}`,
          name: res[res.length - 1],
          status: 'done',
          url: value,
        },
      ];
    }
    if (value && typeof value === 'object') {
      if (value.lastModified) {
        // 这是新上传的
        return [value];
      }
      // 这是本来就有的
      return [
        {
          uid: `old`,
          name: value.name,
          url: value.url,
          status: 'done',
        },
      ];
    }
    return [];
  };
  state = {
    fileList: this.props.fileList || [],
  };
  handlePreview = () => {};
  handleChange = (args) => {
    if (args.file.status === 'removed') {
      return;
    }
    if (_.isFunction(this.props.onChange)) {
      args.fileList = args.fileList.slice(0, this.props.max || 1);
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
    }
    this.setState({
      fileList: newFileList,
    });
  };
  beforeUpload = (file, fileList = []) => {
    file.url = getObjectURL(file);
    this.setState(() => ({
      fileList,
    }));
    return false;
  };
  opt = (i, type) => {
    const { fileList } = this.state;
    const list = _.cloneDeep(fileList);
    switch (type) {
      case 'left': {
        if (i === 0) {
          return;
        }
        const target = list.splice(i, 1);
        list.splice(i - 1, 0, target[0]);
        break;
      }
      case 'right': {
        if (i === list.length - 1) {
          return;
        }
        const target = list.splice(i, 1);
        list.splice(i + 1, 0, target[0]);
        break;
      }
      case 'delete': {
        list.splice(i, 1);
        break;
      }
    }
    this.setState({ fileList: list });
    this.props.onChange({ fileList: list });
  };
  render() {
    return (
      <div>
        {this.props.showList !== true ? (
          <div
            className={styles.list}
            style={{ flexDirection: this.props.listMode === 'column' ? 'column' : 'row' }}
          >
            {_.map(this.state.fileList, (file, i) => {
              if (this.props.itemDOM) {
                const ItemDOM = this.props.itemDOM;
                return (
                  <ItemDOM
                    key={`image${i}${file.uid}`}
                    len={this.props.fileList.length}
                    file={file}
                    i={i}
                    operator={this.opt}
                  />
                );
              }
              return (
                <ListItem
                  key={`image${i}${file.uid}`}
                  len={this.props.fileList.length}
                  file={file}
                  i={i}
                  operator={this.opt}
                />
              );
            })}
          </div>
        ) : null}
        <Upload
          listType={this.props.listType || 'picture-card'}
          multiple={this.props.multiple}
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          customRequest={this.customRequest}
          beforeUpload={this.beforeUpload}
          onRemove={this.onRemove}
          showUploadList={this.props.showList !== false ? true : false}
        >
          {this.state.fileList && this.state.fileList.length === (this.props.max || 1) ? null : (
            <UploadButton type={this.props.listType} />
          )}
        </Upload>
      </div>
    );
  }
}
