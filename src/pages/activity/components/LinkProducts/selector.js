import React, { useState } from 'react';
import { Select, InputNumber, Button, Row, Col, DatePicker, Input, message } from 'antd';
import _ from 'lodash';
import { getProductsWithoutPage } from '../../../products/services';
import styles from './styles.less';

const { RangePicker } = DatePicker;
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
  const [showName, setShowName] = useState('');
  const [range, setRange] = useState([]);
  const [price, setPrice] = useState(0);
  const [activityPrice, setActivityPrice] = useState(0);
  const [stock, setStock] = useState(1);
  // const [productName, set] = useState('');
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
        const res = _.map(data, ({ id, title, mainImageUrl: img, price }) => ({
          id,
          title,
          img,
          price,
        }));
        setOpts(res);
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  const changeCount = (totalCount) => {
    setTotalCount(totalCount);
  };
  const changeStock = (stock) => {
    setStock(stock);
  };
  const changeActivityPrice = (ap) => {
    setActivityPrice(ap);
  };
  const changeRange = (range) => {
    setRange(range);
  };
  const changeShowName = (e) => {
    // console.log(e.target.value)
    setShowName(e.target.value);
  };
  const changeProduct = (productId) => {
    setProductId(productId);
    const target = _.find(opts, ({ id }) => id === productId);
    if (target) {
      setImg(target.img);
      setPrice(target.price);
      setActivityPrice(target.price);
      setTitle(target.title);
      setShowName(target.title);
    }
  };
  const renderOpts = (data) =>
    _.map(data, (d) => <Select.Option key={d.id}>{d.title}</Select.Option>);
  const add = () => {
    if (productId) {
      props.onChange(
        {
          totalCount,
          productId,
          title,
          img,
          price,
          activityPrice,
          stock,
          range,
          showName,
        },
        'add',
      );
      reset();
    } else {
      message.error('没有关联商品')
    }
  };
  const reset = () => {
    setTotalCount(1);
    setProductId(undefined);
    setShowName('');
    setTitle('');
    setRange([]);
    setImg('');
    setStock(1);
    setActivityPrice(0);
    setPrice(0);
  };
  return (
    <div>
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
      {productId ? (
        <Row>
          <Col span={8}>
            <span style={{ display: 'inline-block', width: '80px' }}>库存:</span>
            <InputNumber
              min={1}
              defaultValue={1}
              value={stock}
              onChange={changeStock}
              formatter={(value) => `${value}件`}
              style={{ width: '128px', margin: '0 10px' }}
            />
          </Col>
          <Col span={8}>
            <span style={{ display: 'inline-block', width: '80px' }}>单件数量:</span>
            <InputNumber
              min={1}
              defaultValue={1}
              value={totalCount}
              onChange={changeCount}
              formatter={(value) => `${value}件`}
              style={{ width: '128px', margin: '0 10px' }}
            />
          </Col>
          <Col span={8}>
            <span style={{ display: 'inline-block', width: '80px' }}>活动价:</span>
            <InputNumber
              value={activityPrice}
              onChange={changeActivityPrice}
              formatter={(value) => `${value}元`}
              style={{ width: '128px', margin: '0 10px' }}
            />
          </Col>
          <Col span={24}>
            <span style={{ display: 'inline-block', width: '80px' }}>显示名称:</span>
            <Input
              style={{ width: '480px' }}
              defaultValue=""
              placeholder="请输入显示名称"
              value={showName}
              onChange={changeShowName}
            />
          </Col>
          <Col span={24}>
            <span style={{ display: 'inline-block', width: '80px' }}>抢购周期:</span>
            <RangePicker
              style={{ width: '480px' }}
              value={range}
              onChange={changeRange}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Col>
        </Row>
      ) : null}
    </div>
  );
}
