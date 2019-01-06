import React, { PureComponent } from 'react';
import _ from 'lodash';
import styles from './styles.less';
import Uploader from '../../../Components/Uploader';

export default class VideoEditor extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    if (!props.value) {
      return { ...state, name: [], poster: [] };
    }
    const value = {};
    _.forEach(props.value, (val, key) => {
      if (val) {
        if (typeof val === 'object') {
          value[key] = [val];
        } else if (typeof val === 'string') {
          value[key] = Uploader.initSingleFile(val);
        }
      } else {
        value[key] = [];
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
      <div className={styles.videoWrap}>
        <div>
          <h3 className={styles.videoTitle}>视频封面文件</h3>
          <Uploader onChange={this.onChange.bind(null, 'poster')} fileList={this.state.poster} />
        </div>
        <div>
          <h3 className={styles.videoTitle}>视频文件</h3>
          <Uploader
            listType="text"
            onChange={this.onChange.bind(null, 'name')}
            fileList={this.state.name}
          />
        </div>
      </div>
    );
  }
}
