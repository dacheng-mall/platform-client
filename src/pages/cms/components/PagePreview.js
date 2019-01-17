import React from 'react';
import _ from 'lodash';
import { Carousel } from 'antd';
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

function Swiper(props) {
  return (
    <Carousel className={styles.swipterWrap}>
      {_.map(props.data, (data, i) => {
        return <img key={`${props.id}_${i}`} src={`${source}${data.mainImage}`} alt={data.name} />;
      })}
    </Carousel>
  );
}

export default function PagePreview(props) {
  const render = (elem) => {
    const { type, data, id } = elem;
    switch (type) {
      case 'list': {
        return <List id={id} key={id} height={props.height} data={JSON.parse(data)} />;
      }
      case 'swiper': {
        return <Swiper id={id} key={id} data={JSON.parse(data)} />;
      }
      default: {
        return null;
      }
    }
  };
  return <div>{_.map(props.data, render)}</div>;
}
