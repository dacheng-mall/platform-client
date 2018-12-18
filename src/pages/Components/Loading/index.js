import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default function Loading() {
  return (
    <div className={styles.loadingWrap}>
      <span><Icon type="loading" /><br />加载中...</span>
    </div>
  );
}
