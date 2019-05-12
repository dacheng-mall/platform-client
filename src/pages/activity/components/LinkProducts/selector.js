import React, { useState } from 'react';
import { Select, InputNumber, Button } from 'antd';
import _ from 'lodash';
import { getProductsWithoutPage } from '../../../products/services';
import styles from './styles.less';

/**
 * 商品选择器, 自定义表单域组件, 选择活动关联商品
 * @param {*} props 传入组件的属性集合
 * @param {Object} props.value 表单的值
 * @param {String} props.value.productId - 商品id
 * @param {String} props.value.productId - 商品id
 * @param {Number} props.value.totalCount - 商品数量
 * @param {Number} props.value.displayOrder - 商品排序
 * @param {Function} props.value.onChange - 值变更时的回调函数
 */
export default function ProductSelector(props) {
  const [opts, setOpts] = useState([]);
  const [productId, setProductId] = useState(undefined);
  const [totalCount, setTotalCount] = useState(1);
  const [img, setImg] = useState('');
  const [title, setTitle] = useState('');
  let timer = null;
  const onSearch = (value) => {
    const title = _.trim(value);
    if (!title) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      getProductsWithoutPage({ title }).then(({ data }) => {
        const res = _.map(data, ({ id, title, mainImageUrl: img }) => ({
          id,
          title,
          img
        }));
        setOpts(res);
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  const changeCount = (totalCount) => {
    setTotalCount(totalCount);
    // onChange({ totalCount });
  };
  const changeProduct = (productId) => {
    setProductId(productId);
    const target = _.find(opts, ({id}) => id === productId);
    if(target) {
      setImg(target.img);
      setTitle(target.title);
    }
    // onChange({ productId });
  };
  const renderOpts = (data) =>
    _.map(data, (d) => <Select.Option key={d.id}>{d.title}</Select.Option>);
  const add = () => {
    props.onChange(
      {
        totalCount,
        productId,
        title,
        img,
      },
      'add',
    );
  };
  const reset = () => {
    setTotalCount(1);
    setProductId(undefined);
    setImg('');
  }
  return (
    <div className={styles.selector}>
      <Select
        showSearch
        onSearch={onSearch}
        onChange={changeProduct}
        value={productId}
        showArrow={false}
        filterOption={false}
        placeholder="输入商品关键字查询"
      >
        {renderOpts(opts)}
      </Select>
      <InputNumber
        min={1}
        defaultValue={1}
        value={totalCount}
        onChange={changeCount}
        formatter={(value) => `${value}件`}
        style={{width: '128px', margin: '0 10px'}}
      />
      <Button
        disabled={props.isTail && props.isHeader}
        icon="plus"
        type="primary"
        onClick={add}
      />
      <Button
        disabled={props.isTail && props.isHeader}
        icon="undo"
        type="danger"
        onClick={reset}
      />
    </div>
  );
}
