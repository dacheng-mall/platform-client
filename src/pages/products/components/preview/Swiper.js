import React from "react";
import _ from 'lodash';
import {Carousel} from 'antd';
import styles from "./styles.less";
import Empty from "./noneData";

export default function Swiper (props) {
  const {video, images = [], width = 400} = props;
  const children = [];

  if(video) {
    children.unshift(<video className={styles.carouselItem} key={`video`} src={video.url} />);
  }
  if(images.length > 0) {
    _.forEach(images, (img, i) => {
      children.push(<div className={styles.carouselItem} key={`img_${img.name}_${i}`}><img src={img.url} alt={img.name} /></div>)
    })
  }
  if(children.length > 0) {
    return (
      <div style={{width: `${width}px`}} className={styles.swiper}>
        <Carousel style={{widht: '320px'}} autoplay>
          {children}
        </Carousel>
      </div>
    );
  }
  return <Empty text="暂无图片或视频" />
}