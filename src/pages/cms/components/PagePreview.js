import React from 'react';
import _ from 'lodash';
import { Swiper } from 'antd';
import styles from './styles.less';
import { source } from '../../../../setting';

function ListItem({ height, data }) {
  return (
    <div className={styles.listItem} style={{ width: data.size === 2 ? '100%' : '48%' }}>
      <img
        src={`${source}${data.mainImage || data.productImage}`}
        alt={data.name}
        style={{ height }}
      />
      <div className={styles.name}>{data.displayName || data.name || '未命名'}</div>
      <div className={styles.price}>{data.price !== undefined ? `￥${data.price}` : '未定价'}</div>
    </div>
  );
}

function List(props) {
  return (
    <div className={styles.listWrap}>
      {_.map(props.data, (data, i) => (
        <ListItem key={`${props.id}_${i}`} data={data} height={props.height} />
      ))}
    </div>
  );
}

export default function PagePreview(props) {
  const render = (elem, i) => {
    const { type, data, id } = elem;
    switch (type) {
      case 'list': {
        return <List id={id} key={id} height={props.height} data={JSON.parse(data)} />;
      }
      case 'swiper': {
        return 'swiper';
      }
      default: {
        return null;
      }
    }
  };
  return <div>{_.map(props.data, render)}</div>;
}
