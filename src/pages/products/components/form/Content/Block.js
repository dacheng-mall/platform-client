import React from 'react';
import styles from './styles.less';

export default function Block(props) {
  const parseType = (type) => {
    switch (type) {
      case 'text': {
        return '文本';
      }
      case 'image': {
        return '图片';
      }
      case 'list': {
        return '列表';
      }
      default: {
        return '未知';
      }
    }
  };
  return (
    <div className={styles.block}>
      <div className={styles.header}>{parseType(props.type)}</div>
      {props.children}
    </div>
  );
}
