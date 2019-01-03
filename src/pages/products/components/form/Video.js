import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import styles from './styles.less';
import Uploader from '../../../Components/Uploader';

const initFileList = (value, type) => {
  // 将实际值转换成Uplaod组件中filelist属性可以解析的值
  if (!value || typeof value !== 'string') {
    return [];
  }
  const res = /\w*\.\w*$/.exec(value);
  return [
    {
      uid: `${res.input}_${type}`,
      name: res[0],
      status: 'done',
      url: res.input,
    },
  ];
};
export default class VideoEditor extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    if (!props.value) {
      return { ...state, url: [], poster: [] };
    }
    const value = {};
    _.forEach(props.value, (val, key) => {
      if (val) {
        if (typeof val === 'object') {
          value[key] = [val];
        } else if (typeof val === 'string') {
          value[key] = initFileList(val);
        }
      } else {
        value[key] = []
      }
    });
    if (props.value && typeof props.value === 'object') {
      return { ...state, ...value };
    }
    return null;
  };
  state = {};
  onChange = (type, { fileList }) => {
    const { value } = this.props;
    this.props.onChange({ ...value, [type]: fileList[0] });
  };
  render() {
    return (
      <Fragment>
        <h3 className={styles.videoTitle}>视频文件:</h3>
        <Uploader
          listType="text"
          onChange={this.onChange.bind(null, 'url')}
          fileList={this.state.url}
        />
        <h3 className={styles.videoTitle}>视频封面文件:</h3>
        <Uploader onChange={this.onChange.bind(null, 'poster')} fileList={this.state.poster} />
      </Fragment>
    );
  }
}
