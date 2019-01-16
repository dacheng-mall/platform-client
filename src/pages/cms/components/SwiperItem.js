import React from 'react';
import Mask from './Mask';
import styles from './styles.less';
import { source } from '../../../../setting';

export default function ListItem({ data, index, size, onEdit, height, current }) {
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
    <div className={styles.listItem}>
      {getImageUrl ? (
        <img src={getImageUrl} alt={data.name} />
      ) : (
        <div style={{ backgroundColor: '#ccc', textAlign: 'center', height: '1rem', lineHeight: '1rem' }}>
          暂无图片
        </div>
      )}
      {current !== null ? null : (
        <div className={styles.mask}>
          <Mask onPress={edit} data={data} />
        </div>
      )}
    </div>
  );
}
