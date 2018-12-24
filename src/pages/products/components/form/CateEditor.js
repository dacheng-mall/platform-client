import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Button, Collapse, Icon, message } from 'antd';
import styles from './styles.less';

const Panel = Collapse.Panel;
const { TextArea } = Input;
let timer = '';
const debounce = (func, wait = 300) => {
  if (timer !== '') {
    clearTimeout(timer);
  }
  timer = setTimeout(func, wait);
};

function Header({ value, index, onRemove, onMove, isLast }) {
  const remove = (e) => {
    e.stopPropagation();
    onRemove(index);
  };
  const up = (e) => {
    e.stopPropagation();
    onMove(index, 'up');
  };
  const down = (e) => {
    e.stopPropagation();
    onMove(index, 'down');
  };
  return (
    <div className={styles.header}>
      {value}
      <div className={styles.icon}>
        {index !== 0 ? (
          <Icon onClick={up} type="caret-up" style={{ color: '#40a9ff', fontSize: '0.2rem' }} />
        ) : null}
        {isLast ? null : (
          <Icon onClick={down} type="caret-down" style={{ color: '#40a9ff', fontSize: '0.2rem' }} />
        )}
        <Icon onClick={remove} type="delete" style={{ color: '#f66', fontSize: '0.2rem' }} />
      </div>
    </div>
  );
}

export default class CateEditor extends PureComponent {
  state = {
    showInput: false,
  };
  show = () => {
    this.setState({
      showInput: true,
    });
  };
  cancel = () => {
    this.setState({
      showInput: false,
      label: '',
      content: '',
    });
  };
  add = () => {
    const { content, label } = this.state;
    const { value } = this.props;
    if (!label) {
      message.error('请输入分类说明标题');
    } else if (!content) {
      message.error('请输入分类说明内容');
    } else {
      this.props.onChange([...value, { label, content }]);
      this.cancel();
    }
  };
  remove = (index) => {
    this.props.onChange(_.filter(this.props.value, (val, i) => i !== index));
  };
  move = (index, type) => {
    const position = type === 'up' ? index - 1 : index + 1;
    const target = this.props.value.splice(index, 1)[0];
    this.props.value.splice(position, 0, target);
    this.props.onChange(this.props.value);
  };
  change = (type, e) => {
    e.stopPropagation();
    const value = e.target.value;
    debounce(() => {
      this.setState({
        [type]: value,
      });
    });
  };
  render() {
    const { value } = this.props;
    return (
      <Fragment>
        {value && value.length > 0 ? (
          <Collapse accordion>
            {_.map(value, (val, i) => (
              <Panel
                key={`cateEditor_${i}`}
                header={
                  <Header
                    onRemove={this.remove}
                    onMove={this.move}
                    value={val.label}
                    index={i}
                    isLast={i === value.length - 1}
                  />
                }
              >
                {val.content}
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div>没数据</div>
        )}
        {this.state.showInput ? (
          <div>
            添加新的类型说明
            <Input onChange={this.change.bind(null, 'label')} placeholder="请输入类型标题" />
            <TextArea
              onChange={this.change.bind(null, 'content')}
              placeholder="请输入类型说明内容"
            />
            <div>
              <Button onClick={this.cancel}>取消</Button>
              <Button type="primary" onClick={this.add}>
                添加
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button icon="plus" onClick={this.show}>
              添加新的类型说明
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}
