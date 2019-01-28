import React from 'react';
import Mask from './Mask';
import styles from './styles.less';
import { source } from '../../../../setting';

export default function ListItem({
  data,
  index,
  onEdit,
  current,
  width,
  attributes = {},
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
  const [a, b] = attributes.rate || [];
  return (
    <div className={styles.listItem} style={{ height: (b / a) * width + 'px' }}>
      {getImageUrl ? (
        <img src={getImageUrl} alt={data.name} />
      ) : (
        <div
          style={{
            backgroundColor: '#ccc',
            textAlign: 'center',
            fontSize: '0.22rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          暂无图片, 请编辑
        </div>
      )}
      {current !== null ? null : (
        <div className={styles.mask}>
          <Mask onPress={edit} data={data} isHead={isHead} isTail={isTail} />
        </div>
      )}
    </div>
  );
}
