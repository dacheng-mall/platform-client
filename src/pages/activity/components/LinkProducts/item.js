import React from 'react';
import { Button } from 'antd';
import moment from 'moment';
// import _ from 'lodash';
import styles from './styles.less';

const source = window.config.source;

/**
 * 商品选择器, 自定义表单域组件, 选择活动关联商品
 * @param {*} props 传入组件的属性集合
 * @param {Object} props.value 表单的值
 * @param {String} props.value.productId - 商品id
 * @param {Number} props.value.totalCount - 商品数量
 * @param {Number} props.value.displayOrder - 商品排序
 * @param {Function} props.value.onChange - 值变更时的回调函数
 */
export default function Products(props) {
  const remove = (index) => {
    props.onChange(null, 'remove', index);
  };
  const move = (index, type) => {
    props.onChange(null, type, index);
  };
  const status = ((s) => {
    switch (s) {
      case 'waiting': {
        return '等待开抢';
      }
      case 'sellOut': {
        return '售罄';
      }
      case 'expired': {
        return '到期';
      }
      case 'frozen': {
        return '冻结';
      }
      case 'enable': {
        return '可以抢';
      }
    }
  })(props.value.status);
  return (
    <div className={styles.wrap}>
      <div className={styles.product}>
        <div className={styles.img}>
          <img src={`${source}${props.value.img}?imageView2/1/w/88/h/88`} alt="码" />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.title}>{props.value.showName || props.value.title}</div>
          <div className={styles.info}>库存: {props.value.stock}件</div>
          <div className={styles.info}>单件包含: {props.value.totalCount}件</div>
          <div className={styles.info}>
            开始时间: {moment(props.value.beginTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div className={styles.info}>
            停止时间: {moment(props.value.finishTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div className={styles.info}>状态: {status}</div>
        </div>
      </div>
      {props.disabled
        ? null
        : [
            <Button
              icon="arrow-up"
              onClick={move.bind(null, props.index, 'up')}
              disabled={props.isHeader}
              key="products-up"
            />,
            <Button
              icon="arrow-down"
              onClick={move.bind(null, props.index, 'down')}
              disabled={props.isTail}
              key="products-down"
            />,
            <Button
              icon="delete"
              type="danger"
              onClick={remove.bind(null, props.index, 'remove')}
              key="products-del"
            />,
          ]}
    </div>
  );
}
