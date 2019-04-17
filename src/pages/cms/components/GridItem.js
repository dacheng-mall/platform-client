import React from 'react';
import Mask from './Mask';
import styles from './styles.less';

const source = window.config.source

export default function GridItem({ data = {}, index, size, onEdit, current }) {
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
  })(data && data.fileList && data.fileList[0], data);

  return (
    <div className={styles.gridItem}>
      {getImageUrl ? (
        <img src={getImageUrl} alt={data.name} />
      ) : null}
      <div className={styles.name}>{data.displayName}</div>
      {current !== null ? null : (
        <div className={styles.mask}>
          <Mask onPress={edit} data={data} />
        </div>
      )}
    </div>
  );
}
