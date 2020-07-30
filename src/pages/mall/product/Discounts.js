import { PureComponent, useState } from 'react';
import _ from 'lodash';
import { InputNumber, Button, Select, Input, message } from 'antd';
import { FormItem } from '../../../utils/ui';
import styles from './discounts.less';

function List(props) {
  const onChange = (type, i) => {
    const data = _.cloneDeep(props.data);
    const [target] = data.splice(i, 1);
    switch (type) {
      case 'up': {
        data.splice(i - 1, 0, target);
        break;
      }
      case 'down': {
        data.splice(i + 1, 0, target);
        break;
      }
    }
    props.onChange(data);
  };
  if (props.data.length > 0) {
    return _.map(props.data, (d, i) => {
      return (
        <div key={`item_${i}`} className={styles.item}>
          <div className={styles.info}>
            <div>名称: {d.name}</div>
            <div>类型: {d.typeName}</div>
            <div>受众: {d.audienceName}</div>
            <div>条件: {d.premise}</div>
            <div>优惠: {d.result}</div>
          </div>
          <div className={styles.opt}>
            <Button
              sharp="circle"
              type="primary"
              icon="up"
              disabled={i === 0}
              onClick={onChange.bind(null, 'up', i)}
            />
            <Button
              sharp="circle"
              type="danger"
              icon="delete"
              onClick={onChange.bind(null, 'delete', i)}
            />
            <Button
              sharp="circle"
              type="primary"
              icon="down"
              disabled={i === props.data.length - 1}
              onClick={onChange.bind(null, 'down', i)}
            />
          </div>
        </div>
      );
    });
  }
  return '暂无优惠';
}
const TYPES = [
  {
    key: 'freeCarriage',
    label: '满包邮',
    disabled: false,
  },
  {
    key: 'cutPrice',
    label: '满就减',
    disabled: false,
  },
];
const AUDIENCES = [
  {
    key: 'all',
    label: '全员',
    disabled: false,
  },
  {
    key: 'vip',
    label: 'VIP',
    disabled: false,
  },
  {
    key: 'normal',
    label: '普通',
    disabled: false,
  },
];
function Editor(props) {
  const [data, setData] = useState(null);
  const add = () => {
    setData({
      name: '',
      type: '',
      typeName: '',
      audience: '',
      audienceName: '',
      premise: '',
      result: 0,
    });
  };
  const cancel = () => {
    setData(null);
  };
  const onChange = (type, e) => {
    switch (type) {
      case 'type': {
        const { disabled, ..._type } = e;
        setData({ ...data, type: _type.key, typeName: _type.label });
        break;
      }
      case 'audience': {
        const { disabled, ..._type } = e;
        console.log('audience', _type);
        setData({ ...data, audienceName: _type.label, audience: _type.key });
        break;
      }
      case 'name': {
        setData({ ...data, name: e.currentTarget.value });
        break;
      }
      case 'premise':
      case 'result': {
        setData({ ...data, [type]: e });
        break;
      }
    }
  };
  const submit = () => {
    console.log(data);
    if (!data.name) {
      message.error('请输入优惠名称');
      return;
    }
    if (!data.type) {
      message.error('请选择优惠类型');
      return;
    }
    if (!data.audience) {
      message.error('请选择受众类型');
      return;
    }
    if (!data.premise) {
      message.error('请输入触发条件');
      return;
    }
    props.onSubmit(data);
    cancel();
  };
  return (
    <div>
      {data ? (
        <div>
          <FormItem label="名称">
            <Input defaultValue={props.name} onChange={onChange.bind(null, 'name')} />
          </FormItem>
          <FormItem label="优惠类型">
            <Select labelInValue onChange={onChange.bind(null, 'type')}>
              {_.map(TYPES, (type) => (
                <Select.Option disabled={type.disabled} key={type.key}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="受众类型">
            <Select labelInValue onChange={onChange.bind(null, 'audience')}>
              {_.map(AUDIENCES, (type) => (
                <Select.Option disabled={type.disabled} key={type.key}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="触发条件">
            <InputNumber onChange={onChange.bind(null, 'premise')} />
          </FormItem>
          <FormItem label="减免金额(元)">
            <InputNumber onChange={onChange.bind(null, 'result')} />
          </FormItem>
          <div>
            <Button onClick={cancel}>取消</Button>
            <Button onClick={submit}>添加优惠</Button>
          </div>
        </div>
      ) : (
        <Button icon="plus" type="primary" onClick={add}>
          添加优惠
        </Button>
      )}
    </div>
  );
}
export default class Discounts extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    return { ...state, data: props.value || [] };
  };
  state = {
    data: [],
    editor: null,
  };
  add = (e) => {
    this.props.onChange([...this.state.data, e]);
  };
  change = (e) => {
    this.props.onChange(e);
  };
  render() {
    return (
      <div style={{ padding: '0 10px' }}>
        <Editor onSubmit={this.add} />
        <List data={this.state.data} onChange={this.change} />
      </div>
    );
  }
}
