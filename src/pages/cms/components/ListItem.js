import React from 'react';
import Mask from './Mask';
import styles from './styles.less';
import { source } from '../../../../setting';

export default function ListItem({
  disabled,
  data,
  index,
  size,
  onEdit,
  height,
  current,
  isHead,
  isTail,
}) {
  const edit = (type, value) => {
    // 点击编辑按钮后,初始化待编辑的元素数据
    onEdit(type, value, index);
  };
  const getImageUrl = ((file, data) => {
    if (file === undefined || typeof file !== 'object') {
      const { image, productImage } = data;
      const res = image || productImage;
      if (res) {
        return `${source}${res}`;
      }
      return false;
    }
    return file.url;
  })(data.fileList && data.fileList[0], data);
  // 商品列表的展现
  if (disabled) {
    return (
      <div className={styles.listItem} style={{backgroundColor: '#fff'}}>
        <img src={`${source}${data.mainImageUrl}`} alt={data.title} style={{ height }} />
        <div className={styles.name}>{data.title}</div>
        <div className={styles.price}>{data.price !== undefined ? `￥${data.price}` : null}</div>
      </div>
    );
  }
  // 元素列表的展现
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
          <Mask onPress={edit} data={data} isHead={isHead} isTail={isTail} />
        </div>
      )}
    </div>
  );
}
