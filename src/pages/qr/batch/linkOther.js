import React, { PureComponent, Fragment } from 'react';
import { Select, Button, message, Modal, InputNumber } from 'antd';
import _ from 'lodash';
import { get } from '../../../utils/request';
import styles from './linkOther.less';

const Option = Select.Option;

const TYPES = [
  {
    code: 'product',
    name: '商品',
  },
  {
    code: 'activity',
    name: '活动',
  },
  {
    code: 'institution',
    name: '机构',
  },
];
let timer = null;
export default class LinkOther extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      linked: props.value || [],
      options: [],
      currentType: undefined,
      currentTarget: undefined,
      plusVisable: false
    };
  }
  add = () => {
    const { currentTarget, currentType, options, linked } = this.state;
    if (currentTarget && currentType) {
      const target = _.find(options, ['id', currentTarget]);
      const type = _.find(TYPES, ['code', currentType]);
      linked.push({
        id: currentTarget,
        name: target.title || target.name,
        type: currentType,
        typeName: type.name,
      });
      this.setState({
        linked: [...linked],
        currentType: undefined,
        currentTarget: undefined,
        options: [],
      });
    }
  };
  remove = (i) => {
    const linked = [...this.state.linked];
    linked.splice(i, 1);
    this.setState({
      linked,
    });
  };
  searchTarget = (name) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const { currentType } = this.state;
      if (currentType && _.trim(name)) {
        get(`v1/api/sys/${currentType}`, {
          [currentType === 'product' ? 'title' : 'name']: name,
        }).then(({ data }) => {
          this.setState({
            options: data,
          });
        });
      }
    }, 300);
  };
  selectTarget = (value) => {
    this.setState({
      currentTarget: value,
    });
  };
  selectType = (currentType) => {
    this.setState({
      currentType,
    });
  };
  renderTypes = (data, linked) => {
    return _.map(data, (type) => (
      <Option disabled={_.some(linked, ['type', type.code])} key={type.code}>
        {type.name}
      </Option>
    ));
  };
  onChange = (value) => {
    this.setState({
      currentType: value,
      currentTarget: undefined,
      options: [],
    });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.wrap}>
          <Select
            placeholder="关联类型"
            disabled={this.props.disabled}
            style={{ width: '200px' }}
            onSelect={this.selectType}
            value={this.state.currentType}
            allowClear
            onChange={this.onChange}
          >
            {this.renderTypes(this.props.types || TYPES, this.state.linked)}
          </Select>
          <Select
            disabled={!this.state.currentType}
            value={this.state.currentTarget}
            showSearch
            placeholder="请输入关键字查询"
            onSearch={this.searchTarget}
            onSelect={this.selectTarget}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
          >
            {_.map(this.state.options, (option) => {
              return <Option key={option.id}>{option.title || option.name}</Option>;
            })}
          </Select>
          <Button
            disabled={!this.state.currentType || !this.state.currentTarget}
            type="primary"
            icon="link"
            title="关联其他实体"
            onClick={this.add}
          />
        </div>
        <div>
          {this.state.linked.length < 1 ? (
            '暂无关联实体'
          ) : (
            <ul className={styles.linked}>
              {_.map(this.state.linked, (link, i) => (
                <li key={i}>
                  <div>
                    [{link.typeName}]{link.name}
                  </div>
                  {this.props.disabled ? null : (
                    <div>
                      <Button
                        shape="circle"
                        icon="delete"
                        size="small"
                        type="danger"
                        onClick={this.remove.bind(null, i)}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Fragment>
    );
  }
}
