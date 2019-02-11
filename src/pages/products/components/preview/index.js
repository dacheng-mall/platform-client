import React from 'react';
import Swiper from './Swiper';
import Tags from './Tags';
import Content from './Content';
import Catrgories from './Catrgories';
import styles from './styles.less';
import Empty from './noneData';

export default function Preview({ data }) {
  const { images, video, title, price, attributes = [], content, information = [] } = data || {};
  return (
    <div className={styles.wrap}>
      <Swiper video={video} images={images} />
      <div className={styles.productInfo}>
        {title ? <h2 className={styles.title}>{title}</h2> : <Empty text="暂无标题" />}
        {price !== undefined ? (
          <div className={styles.price}>￥{price}</div>
        ) : (
          <Empty text="暂无价格" />
        )}
        {attributes && attributes.length > 0 ? <Tags data={attributes} /> : <Empty text="暂无属性标签" />}
        {information && information.length > 0 ? <Catrgories data={information} /> : <Empty text="暂无信息" />}
        <Content data={content} />
      </div>
    </div>
  );
}
