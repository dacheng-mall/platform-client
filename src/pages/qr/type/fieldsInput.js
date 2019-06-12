import React, { useState, PureComponent } from 'react';
import _ from 'lodash';
import { Input, Button, Checkbox } from 'antd';
import styles from './index.less';

function FieldsItem(props) {
  const [value, setValue] = useState(props.value);
  const changeHandler = (key, e) => {
    if (key !== 'required') {
      props.onChange(e.target.value, key);
    } else {
      props.onChange(e.target.checked, key);
    }
  };
  const onRemove = () => {};
  return (
    <div className={styles.fieldWrap}>
      <div className={styles.fieldItem}>
        <div className={styles.fieldInput}>
          <Input
            value={props.value.label}
            className={styles.label}
            placeholder="请输入名称"
            onChange={changeHandler.bind(null, 'label')}
          />
          <Input
            value={props.value.code}
            className={styles.code}
            placeholder="请输入键名code"
            onChange={changeHandler.bind(null, 'code')}
          />
          <Checkbox checked={props.value.required} onChange={changeHandler.bind(null, 'required')}>
            必填
          </Checkbox>
        </div>
        <Input
          value={props.value.help}
          className={styles.help}
          placeholder="请输入帮助信息"
          onChange={changeHandler.bind(null, 'help')}
        />
      </div>
      <div className={styles.operator}>
        <Button disabled={props.isHead} onClick={props.onMove.bind(null, 'up')} icon="arrow-up" />
        <Button
          disabled={props.isTail}
          onClick={props.onMove.bind(null, 'down')}
          icon="arrow-down"
        />
        <Button type="danger" onClick={props.onRemove} icon="delete" />
      </div>
    </div>
  );
}
export default class FieldsGroup extends PureComponent {
  changeHandler = (index, value, key) => {
    const newValue = [...this.props.value];
    _.set(newValue[index], key, value);
    this.props.onChange(newValue);
  };
  add = () => {
    const newValue = [...this.props.value, {}];
    this.props.onChange(newValue);
  };
  remove = (index) => {
    const newValue = [...this.props.value];
    newValue.splice(index, 1);
    this.props.onChange(newValue);
  };
  move = (index, type) => {
    const newValue = [...this.props.value];
    const target = newValue.splice(index, 1)[0];
    switch(type) {
      case 'up': {
        newValue.splice(index - 1, 0, target);
        break;
      }
      case 'down': {
        newValue.splice(index + 1, 0, target);
        break;
      }
    }
    this.props.onChange(newValue);
  };
  render() {
    return (
      <div>
        {_.map(this.props.value, (item, i) => (
          <FieldsItem
            isHead={i === 0}
            isTail={i === this.props.value.length - 1}
            value={item}
            key={`FieldsGroup_${i}`}
            onChange={this.changeHandler.bind(null, i)}
            onRemove={this.remove.bind(null, i)}
            onMove={this.move.bind(null, i)}
          />
        ))}
        <Button onClick={this.add} icon="plus" type="primary">
          添加采集字段
        </Button>
      </div>
    );
  }
}
