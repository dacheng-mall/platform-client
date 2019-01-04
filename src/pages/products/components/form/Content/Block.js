import React from 'react';
import { Icon } from 'antd';
import styles from './styles.less';

export default function Block(props) {
  const { index, isLast, onMove, onRemove } = props;
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
  const remove = (e) => {
    e.stopPropagation();
    onRemove(index);
  };
  const up = (e) => {
    e.stopPropagation();
    onMove(index, 'up');
  };
  const down = (e) => {
    e.stopPropagation();
    onMove(index, 'down');
  };
  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <div>{parseType(props.type)}</div>
        <div className={styles.operatror}>
          {index !== 0 ? (
            <Icon onClick={up} type="caret-up" style={{ color: '#40a9ff', fontSize: '0.2rem' }} />
          ) : null}
          {isLast ? null : (
            <Icon
              onClick={down}
              type="caret-down"
              style={{ color: '#40a9ff', fontSize: '0.2rem' }}
            />
          )}
          <Icon onClick={remove} type="delete" style={{ color: '#f66', fontSize: '0.2rem' }} />
        </div>
      </div>
      <div className={styles.children}>{props.children}</div>
    </div>
  );
}
