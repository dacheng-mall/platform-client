import React, { Fragment } from 'react';
import _ from 'lodash';
import { InputNumber, Checkbox } from 'antd';
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
    console.log(props.value);
    return { ...state, value: props.value || [], unit: props.unit };
  };
  checked = (code) => {
    return _.some(this.state.value, ['code', code]);
  };
  renderItems = (code) => {
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
            <Fragment>
              <div key={`${code}_${i}`}>
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
              </div>
              <div >
                <div></div>
              </div>
            </Fragment>
          );
        }
      });
    }
    return null;
  };
  onChagne = (code, index, type, val) => {
    console.log(code, index, type, val);
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
  render() {
    return (
      <div className={styles.wrap}>
        {_.map(TYPES, (type) => {
          return (
            <div key={type.code}>
              <Checkbox
                defaultChecked={this.checked(type.code)}
                onChange={this.changeType.bind(this, type)}
              >
                {type.name}
              </Checkbox>
              <div className={styles.items}>{this.renderItems(type.code)}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
