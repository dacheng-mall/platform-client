import React from 'react';
import Swiper from './Swiper';
import Tags from './Tags';
import Content from './Content';
import Catrgories from './Catrgories';
import styles from './styles.less';

export default function Preview({ data }) {
  const { images, video, title, price, attributes, content, categories = [] } = data || {};
  return (
    <div className={styles.wrap}>
      <Swiper video={video} images={images} />
      <div className={styles.productInfo}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.price}>￥{price}</div>
        <Tags data={attributes} />
        {categories.length > 0 ? <Catrgories data={categories} /> : null}
        <Content data={content} />
      </div>
    </div>
  );
}
