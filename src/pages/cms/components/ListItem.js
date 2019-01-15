import React from 'react';
import Mask from './Mask';
import styles from './styles.less';

export default function ListItem({ data, index, size, onEdit, height, current }) {
  const edit = (type, value) => {
    // 点击编辑按钮后,初始化待编辑的元素数据
    onEdit(type, value, index);
  };
  const getImageUrl = ((file) => {
    if (file === undefined || typeof file !== 'object') {
      return false;
    }
    return file.url
  })(data.fileList && data.fileList[0]);
  
  return (
    <div className={styles.listItem} style={{ width: size === 2 ? '100%' : '48%' }}>
      {getImageUrl ? (
        <img src={getImageUrl} alt={data.name} style={{ height }} />
      ) : (
        <div style={{ height, lineHeight: height, backgroundColor: '#ccc', textAlign: 'center' }}>
          暂无图片
        </div>
      )}
      <div className={styles.name}>{data.displayName || data.name || '未命名'}</div>
      <div className={styles.price}>{data.price !== undefined ? `￥${data.price}` : '未定价'}</div>
      {current !== null ? null : (
        <div className={styles.mask}>
          <Mask onPress={edit} data={data} />
        </div>
      )}
    </div>
  );
}
