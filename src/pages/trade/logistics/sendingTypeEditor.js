import React, { Fragment } from 'react';
import _ from 'lodash';
import { InputNumber, Checkbox, Button, message } from 'antd';
import styles from './sendingTypeEditor.less';

const TYPES = [
  { name: '物流', code: 'logistic' },
  { name: '快递', code: 'express' },
  { name: 'EMS', code: 'EMS' },
];

export default class SendingTypeEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      billingType: '',
      value: props.value || [],
      unit: props.unit,
    };
  }
  static getDerivedStateFromProps = (props, state) => {
    return { ...state, value: props.value || [], unit: props.unit };
  };
  checked = (code) => {
    const res = _.some(this.state.value, ['code', code]);
    console.log(code, this.state.value, res)
    return res
  };
  renderItems = (code, index) => {
    const target = _.find(this.state.value, ['code', code]);
    if (target) {
      return _.map(target.items, (item, i) => {
        const unitText = (function(unit) {
          switch (unit) {
            case 'count':
              return '件';
            case 'weight':
              return 'kg';
            case 'volume':
              return 'm³';
            default:
              break;
          }
        })(this.state.unit);
        if (i === 0) {
          return (
            <div key={`${code}_${i}`}>
              <span>默认设置: </span>
              <InputNumber
                style={{ width: '64px' }}
                min={1}
                max={9999}
                onChange={this.onChagne.bind(null, code, i, 'first.count')}
                value={item.first.count}
              />
              <span>{unitText}内</span>
              <InputNumber
                style={{ width: '64px' }}
                min={1}
                max={999}
                onChange={this.onChagne.bind(null, code, i, 'first.price')}
                value={item.first.price}
              />
              <span>元, </span>
              <span>每增加</span>
              <InputNumber
                style={{ width: '64px' }}
                min={1}
                max={9999}
                onChange={this.onChagne.bind(null, code, i, 'additional.count')}
                value={item.additional.count}
              />
              <span>{unitText}</span>
              <span>, 运费增加</span>
              <InputNumber
                style={{ width: '64px' }}
                min={1}
                max={999}
                onChange={this.onChagne.bind(null, code, i, 'additional.price')}
                value={item.additional.price}
              />
              <span>元</span>
              {target.items.length === 1 ? (
                <div>
                  <Button type="primary" onClick={this.add.bind(this, target, index)}>
                    添加地区差异设置
                  </Button>
                </div>
              ) : null}
            </div>
          );
        }
        return (
          <div key={`${code}_${i}`}>
            {i === 1 ? (
              <div className={styles.header}>
                <div className={styles.col1}>运送到</div>
                <div className={styles.col}>首({unitText})</div>
                <div className={styles.col}>首费(元)</div>
                <div className={styles.col}>续{unitText}</div>
                <div className={styles.col}>续费(元)</div>
                <div className={styles.col}>操作</div>
              </div>
            ) : null}
            <div className={styles.row}>
              <div className={styles.col1}>未添加地区</div>
              <div className={styles.col}>
                <InputNumber
                  className={styles.colInput}
                  min={1}
                  max={9999}
                  onChange={this.onChagne.bind(null, code, i, 'first.count')}
                  value={item.first.count}
                />
              </div>
              <div className={styles.col}>
                <InputNumber
                  className={styles.colInput}
                  min={1}
                  max={999}
                  onChange={this.onChagne.bind(null, code, i, 'first.price')}
                  value={item.first.price}
                />
              </div>
              <div className={styles.col}>
                <InputNumber
                  className={styles.colInput}
                  min={1}
                  max={9999}
                  onChange={this.onChagne.bind(null, code, i, 'additional.count')}
                  value={item.additional.count}
                />
              </div>
              <div className={styles.col}>
                <InputNumber
                  className={styles.colInput}
                  min={1}
                  max={999}
                  onChange={this.onChagne.bind(null, code, i, 'additional.price')}
                  value={item.additional.price}
                />
              </div>
              <div className={styles.col}>
                <a onClick={this.remove.bind(this, target, index, i)}>删除</a>
              </div>
            </div>

            {target.items.length - 1 === i ? (
              <div>
                <Button type="primary" onClick={this.add.bind(this, target, index)}>
                  添加地区差异设置
                </Button>
              </div>
            ) : null}
          </div>
        );
      });
    }
    return null;
  };
  onChagne = (code, index, type, val) => {
    const value = [...this.state.value];
    const target = _.find(value, ['code', code]);
    if (target) {
      _.set(target.items[index], type, val);
      this.props.onChange(value);
    }
  };
  changeType = (type, e) => {
    const checked = e.target.checked;
    if (checked) {
      const value = [
        ...this.state.value,
        {
          ...type,
          items: [
            { isDefault: true, first: { count: 1, price: 10 }, additional: { count: 1, price: 5 } },
          ],
        },
      ];
      this.props.onChange(value);
    } else {
      const value = _.filter(this.state.value, (val) => val.code !== type.code);
      this.props.onChange(value);
    }
  };
  add = (target, index) => {
    if (target.items.length >= 4) {
      message.warning('最多设置3个');
      return;
    }
    target.items.push({ first: { count: 1, price: 10 }, additional: { count: 1, price: 5 } });
    const value = [...this.state.value];
    value[index] = target;
    this.props.onChange(value);
  };
  remove = (target, index, i) => {
    target.items.splice(i, 1);
    const value = [...this.state.value];
    value[index] = target;
    this.props.onChange(value);
  };
  render() {
    return (
      <div className={styles.wrap}>
        {_.map(TYPES, (type, i) => {
          return (
            <div key={type.code}>
              <Checkbox
                checked={this.checked(type.code)}
                onChange={this.changeType.bind(this, type)}
              >
                {type.name}
              </Checkbox>
              <div className={styles.items}>{this.renderItems(type.code, i)}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
