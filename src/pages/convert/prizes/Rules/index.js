import { PureComponent } from 'react';
import { Input, Button, Divider } from 'antd';
import _ from 'lodash';
import styles from './index.less';

export default class Rules extends PureComponent {
  state = {
    value: this.props.value,
    currentRule: '',
  };
  renderValue = (value = []) => {
    if (value.length < 1) {
      return '无规则说明';
    }
    return _.map(value, (val, i) => {
      return (
        <div key={`rule_${i}`} className={styles.rule}>
          <div className={styles.index}>{i + 1}.</div>
          <div className={styles.text}>{val}</div>
          <div className={styles.btns}>
            <Button
              type="default"
              onClick={this.move.bind(null, i, 'up')}
              shape="circle"
              icon="up"
              disabled={i === 0}
            ></Button>
            <Button
              type="default"
              onClick={this.move.bind(null, i, 'down')}
              shape="circle"
              icon="down"
              disabled={i === value.length - 1}
            ></Button>
            <Divider type="vertical" />
            <Button
              type="danger"
              onClick={this.del.bind(null, i)}
              shape="circle"
              icon="delete"
            ></Button>
          </div>
        </div>
      );
    });
  };
  input = (e) => {
    const currentRule = e.target.value;
    this.setState({
      currentRule,
    });
  };
  move = (i, type) => {
    const rules = [...this.props.value];
    const [target] = rules.splice(i, 1);
    switch (type) {
      case 'up': {
        rules.splice(i - 1, 0, target);
        break;
      }
      case 'down': {
        rules.splice(i + 1, 0, target);
        break;
      }
      default:
        break;
    }
    this.props.onChange(rules);
  };
  add = () => {
    const rules = this.props.value
      ? [...this.props.value, this.state.currentRule]
      : [this.state.currentRule];
    this.props.onChange(rules);
    this.setState({
      currentRule: '',
    });
    return rules;
  };
  del = (i) => {
    const rules = this.props.value;
    rules.splice(i, 1);
    this.props.onChange(rules);
    return rules;
  };
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.input}>
          <Input placeholder="请输入规则" onChange={this.input} value={this.state.currentRule} />
          <Button type="primary" icon="plus" onClick={this.add}>
            添加
          </Button>
        </div>
        <div>{this.renderValue(this.props.value)}</div>
      </div>
    );
  }
}
