import React from 'react';
import Mask from './Mask';
import styles from './styles.less';

export default function ListItem({ data, index, size, onEdit, height }) {
  const edit = (type, value) => {
    onEdit(type, value, index);
  };
  return (
    <div className={styles.listItem} style={{ width: size === 2 ? '100%' : '48%' }}>
      <img src={data.mainImage} alt={data.name} style={{height}} />
      <div className={styles.name}>{data.name}</div>
      <div className={styles.price}>￥{data.price}</div>
      <div className={styles.mask}>
        <Mask onPress={edit} data={data} />
      </div>
    </div>
  );
}
