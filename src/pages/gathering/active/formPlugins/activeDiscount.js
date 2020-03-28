import { Fragment, PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { InputNumber, Button, Select, Input, Popconfirm, DatePicker, Switch } from 'antd';
import { FormItem } from '../../../../utils/ui';
import styles from './styles.less';

const { RangePicker } = DatePicker;

const Option = Select.Option;

function Items({ data, onChange }) {
  const onRemove = (i) => {
    const newdata = _.cloneDeep(data);
    newdata.splice(i, 1);
    onChange(newdata);
  };
  const change = (value, i) => {
    const newdata = _.cloneDeep(data);
    newdata[i] = value;
    onChange(newdata);
  };
  return _.map(data, (d, i) => (
    <Item
      key={`item_${i}`}
      data={d}
      index={i}
      onRemove={onRemove.bind(null, i)}
      onChange={change}
    />
  ));
}
function Range({ value = [], onChange, style }) {
  const change = (type, val) => {
    const newVal = [...value];
    newVal[type] = val;
    onChange(newVal);
  };
  return (
    <div
      style={{ ...style, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <InputNumber
        placeholder="开始"
        style={{ width: '88px' }}
        value={value[0]}
        onChange={change.bind(null, 0)}
      />
      至
      <InputNumber
        placeholder="结束"
        style={{ width: '88px' }}
        value={value[1]}
        onChange={change.bind(null, 1)}
      />
    </div>
  );
}
function Item({ data, index, onChange, onRemove }) {
  const change = (type, value) => {
    switch (type) {
      case 'type':
      case 'price':
      case 'forRole':
      case 'range': {
        data[type] = value;
        break;
      }
      case 'timeRange': {
        data[type] = [
          moment(value[0]).format('YYYY-MM-DDTHH:mm:ss'),
          moment(value[1]).format('YYYY-MM-DDTHH:mm:ss'),
        ];
        break;
      }
      case 'name': {
        data[type] = value.target.value;
        break;
      }
    }
    onChange(data, index);
  };
  return (
    <div className={styles.itemWrap}>
      <div className={styles.title}>
        <div className={styles.index}>{index + 1}</div>
        <Popconfirm title="是否删除优惠规则" onConfirm={onRemove}>
          <Button type="danger" size="small">
            删除
          </Button>
        </Popconfirm>
      </div>
      <div className={styles.itemCont}>
        <FormItem label="规则名称" style={{ marginBottom: '4px' }}>
          <Input
            onChange={change.bind(null, 'name')}
            placeholder="请输入"
            style={{ width: '200px' }}
            value={data.name}
          />
        </FormItem>
        <FormItem label="规则类型" style={{ marginBottom: '4px' }}>
          <Select
            onChange={change.bind(null, 'type')}
            placeholder="请选择"
            style={{ width: '200px' }}
            value={data.type}
            allowClear
          >
            <Option key="integer-orders">订单数优惠</Option>
            <Option key="integer-soldCount">平台售出数</Option>
            <Option key="integer-boughtCount">个人购买数</Option>
            <Option key="date-timeRange">时间</Option>
          </Select>
        </FormItem>
        <FormItem label="覆盖用户" style={{ marginBottom: '4px' }}>
          <Select
            onChange={change.bind(null, 'forRole')}
            placeholder="请选择"
            style={{ width: '200px' }}
            value={data.forRole}
            defaultValue="all"
            allowClear
          >
            <Option key="all">全员</Option>
            <Option key="member">业务员</Option>
            <Option key="notMember">个人</Option>
          </Select>
        </FormItem>
        {data.type && data.type.includes('integer') ? (
          <FormItem label="区间" style={{ marginBottom: '4px' }}>
            <Range
              style={{ width: '200px' }}
              value={data.range}
              onChange={change.bind(null, 'range')}
            />
          </FormItem>
        ) : null}
        {data.type && data.type.includes('time') ? (
          <FormItem label="区间" style={{ marginBottom: '4px' }}>
            <RangePicker
              value={data.timeRange && data.timeRange.map((time) => moment(time))}
              onChange={change.bind(null, 'timeRange')}
              showTime
            />
          </FormItem>
        ) : null}
        <FormItem label="优惠价(元)" style={{ marginBottom: '4px' }}>
          <InputNumber
            onChange={change.bind(null, 'price')}
            placeholder="请输入"
            style={{ width: '200px' }}
            value={data.price}
          />
        </FormItem>
      </div>
    </div>
  );
}

export default class Discount extends PureComponent {
  state = {
    value: this.props.value || [],
    editing: null,
  };
  static getDerivedStateFromProps(props, state) {
    if (props.value) {
      return { ...state, value: props.value };
    }
    return null;
  }
  edit = (newVal) => {
    this.setState(
      {
        value: newVal,
      },
      () => {
        this.props.onChange(newVal);
      },
    );
  };
  add = () => {
    this.props.onChange([{}, ...this.state.value]);
  };
  render() {
    return (
      <Fragment>
        <div className={styles.initBtn}>
          <Button icon="plus" type="primary" onClick={this.add}>
            添加优惠规则
          </Button>
        </div>
        <div>
          {this.state.value.length > 0 ? (
            <Items data={this.state.value} onChange={this.edit} />
          ) : (
            <div className={styles.centerWrap}>暂无优惠规则</div>
          )}
        </div>
      </Fragment>
    );
  }
}
