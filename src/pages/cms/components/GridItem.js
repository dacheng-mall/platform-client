import React from 'react';
import Mask from './Mask';
import styles from './styles.less';
import { source } from '../../../../setting';

export default function GridItem({ data, index, size, onEdit, height, current }) {
  const edit = (type, value) => {
    // 点击编辑按钮后,初始化待编辑的元素数据
    onEdit(type, value, index);
  };
  const getImageUrl = ((file, data) => {
    if (file === undefined || typeof file !== 'object') {
      const { mainImage, productImage } = data;
      const res = mainImage || productImage;
      if (res) {
        return `${source}${res}`;
      }
      return false;
    }
    return file.url;
  })(data.fileList && data.fileList[0], data);

  return (
    <div className={styles.listItem} style={{ width: size === 2 ? '100%' : '48%' }}>
      {getImageUrl ? (
        <img src={getImageUrl} alt={data.name} style={{ height }} />
      ) : (
        <div style={{ height, lineHeight: height, backgroundColor: '#ccc', textAlign: 'center' }}>
          暂无图片
        </div>
      )}
      <div className={styles.name}>{data.displayName || data.name || null}</div>
      <div className={styles.price}>{data.price !== undefined ? `￥${data.price}` : null}</div>
      {current !== null ? null : (
        <div className={styles.mask}>
          <Mask onPress={edit} data={data} />
        </div>
      )}
    </div>
  );
}
