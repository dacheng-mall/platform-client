import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Input, Button, Icon, Divider, message } from 'antd';
import styles from './styles.less';

const { TextArea } = Input;

function Icons({ index, isLast, onMove, onRemove }) {
  const up = () => {
    onMove(index, 'up');
  };
  const down = () => {
    onMove(index, 'down');
  };
  const remove = () => {
    onRemove(index);
  };
  return (
    <div className={styles.icons}>
      {index !== 0 ? (
        <Icon onClick={up} type="up" style={{ color: '#40a9ff', fontSize: '0.1rem' }} />
      ) : null}
      {index !== 0 && !isLast ? <Divider type="vertical" /> : null}
      {isLast ? null : (
        <Icon onClick={down} type="down" style={{ color: '#40a9ff', fontSize: '0.1rem' }} />
      )}
      <Divider type="vertical" />
      <Icon onClick={remove} type="cross" style={{ color: '#f66', fontSize: '0.1rem' }} />
    </div>
  );
}

export default class ListEditor extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    // 由于props.value.value是个引用变量, 所以重新赋值给state时需要浅拷贝
    return { ...state, value: [...props.value.value || []] };
  }

  state = {
    editor: null,
    newItem: { label: '', content: '' },
  };
  showEditor = () => {
    this.setState({
      editor: { label: '', content: '' },
    });
  };
  move = (index, type) => {
    const position = type === 'up' ? index - 1 : index + 1;
    const { value } = this.props.value;
    const target = value.splice(index, 1)[0];
    value.splice(position, 0, target);
    this.props.onChange([...value]);
  };
  remove = (index) => {
    this.props.onChange(
      _.filter(this.state.value, (v, i) => index !== i),
      `[${this.props.index}].value`,
    );
  };
  add = () => {
    const { label, content } = this.state.newItem;
    if (label && content) {
      this.props.onChange([...this.state.value, this.state.newItem], `[${this.props.index}].value`);
      this.setState({
        newItem: {},
        editor: null,
      });
    } else {
      message.error('提交信息不完整');
    }
  };
  cancel = () => {
    this.setState({
    newItem: {},
    editor: null,
  });

  }
  newItem = (type, e) => {
    const { value } = e.target;
    this.setState({
      newItem: { ...this.state.newItem, [type]: value },
    });
  };
  render() {
    const { value } = this.state;
    return (
      <div className={styles.listEditor}>
        <ul className={styles.preview}>
          {_.map(value, (val, i) => {
            return (
              <li key={`list_preview_${this.props.index}_${i}`}>
                <b>{val.label}</b>
                <div className={styles.content}>{val.content}</div>
                <span>
                  <Icons
                    index={i}
                    isLast={i === value.length - 1}
                    onMove={this.move}
                    onRemove={this.remove}
                  />
                </span>
              </li>
            );
          })}
        </ul>
        {this.state.editor ? (
          <div>
            <Input onChange={this.newItem.bind(null, 'label')} placeholder="请输入标题" />
            <TextArea onChange={this.newItem.bind(null, 'content')} placeholder="请输入内容" />
            <Button onClick={this.cancel}>取消</Button>
            <Button onClick={this.add} type="primary">
              添加
            </Button>
          </div>
        ) : (
          <div>
            <Button onClick={this.showEditor} icon="plus" type="danger">
              添加新的列表项
            </Button>
          </div>
        )}
      </div>
    );
  }
}
