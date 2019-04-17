import React from 'react';
import _ from 'lodash';
import { Carousel } from 'antd';
import styles from './styles.less';
import EditorPreview from '../../products/components/preview/Content';

const source = window.config.source

function ListItem({ height, data }) {
  return (
    <div className={styles.listItem} style={{ width: data.size === 2 ? '100%' : '48%' }}>
      <img src={`${source}${data.image || data.productImage}`} alt={data.name} style={{ height }} />
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
  let height = props.width || 0;
  if (props.attributes.rate) {
    const [w = 1, h = 1] = props.attributes.rate;
    height = height * (h / w);
  }
  return (
    <Carousel className={styles.swipterWrap}>
      {_.map(props.data, (data, i) => {
        return (
          <div key={`${props.id}_${i}`}>
            <img
              style={{ height: height + 'px', width: '100%' }}
              src={`${source}${data.image}`}
              alt={data.name}
            />
          </div>
        );
      })}
    </Carousel>
  );
}
function GridItem({ data }) {
  return (
    <div className={styles.gridItem}>
      {data.image ? (
        <img src={`${source}${data.image || data.productImage}`} alt={data.name} />
      ) : null}
      {data.displayName ? (
        <div className={styles.name}>{data.displayName || data.name || null}</div>
      ) : null}
    </div>
  );
}
function Grids(props) {
  const { attributes: { cols = 4, rows = 2 } = {}, data } = props;
  const size = 1 / cols;
  const initCount = new Array(cols * rows);
  return (
    <div className={styles.listWrap}>
      {_.map(initCount, (d, i) => {
        return (
          <div
            key={`item_${i}`}
            style={{ width: `${size * 100}%`, height: props.width * size + 'px' }}
          >
            {data[i] ? <GridItem data={data[i]} /> : null}
          </div>
        );
      })}
    </div>
  );
}
function Article(props) {
  return <EditorPreview data={props.data} />;
}

export default function PagePreview(props) {
  const render = (elem) => {
    const { type, data, id, attributes } = elem;
    switch (type) {
      case 'list': {
        return <List id={id} key={id} height={props.height} data={JSON.parse(data)} />;
      }
      case 'swiper': {
        return (
          <Swiper
            id={id}
            key={id}
            data={JSON.parse(data)}
            width={props.width}
            attributes={JSON.parse(attributes || {})}
          />
        );
      }
      case 'grid': {
        return (
          <Grids
            id={id}
            key={id}
            data={JSON.parse(data)}
            width={props.width}
            attributes={JSON.parse(attributes || {})}
          />
        );
      }
      case 'article': {
        return <Article id={id} key={id} data={JSON.parse(data)} />;
      }
      default: {
        return null;
      }
    }
  };
  return <div>{_.map(props.data, render)}</div>;
}
