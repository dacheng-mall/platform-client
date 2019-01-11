import React, { PureComponent } from 'react';
import styles from './styles.less';
import Uploader from '../../../Components/Uploader';

export default class VideoEditor extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    if (!props.value) {
      return { ...state, name: [], poster: [] };
    }
    const value = {};
    const { poster, name, url, posterUrl } = props.value;
    if(typeof poster === 'string') {
      // 这是有初始化值的
      value.poster = Uploader.initSingleFile(posterUrl);
    } else if(poster && poster.originFileObj) {
      value.poster = [poster]
    } else {
      value.poster = []
    }
    if(typeof name === 'string') {
      // 这是有初始化值的
      value.name = Uploader.initSingleFile(url);
    } else if(name && name.originFileObj) {
      value.name = [name]
    } else {
      value.name = []
    }
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
