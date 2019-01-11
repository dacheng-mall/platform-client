import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Button, Radio } from 'antd';
import List from './List';
import Img from './Img';
import Text from './Text';
import Block from './Block';
import styles from './styles.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const ButtonGroup = Button.Group;
export default class ContEditor extends PureComponent {
  state = {
    editor: '',
    newElem: 'text',
  };
  change = (value, path) => {
    const _Value = this.props.value;
    _.set(_Value, path, value);
    this.props.onChange(_Value);
  };
  move = (index, type) => {
    const position = type === 'up' ? index - 1 : index + 1;
    const target = this.props.value.splice(index, 1)[0];
    this.props.value.splice(position, 0, target);
    this.props.onChange(this.props.value);
  };
  remove = (index) => {
    this.props.onChange(_.filter(this.props.value, (val, i) => i !== index));
  };
  showEditor = (type) => {
    this.setState({
      editor: type,
    });
  };
  chooseType = (e) => {
    this.setState({
      newElem: e.target.value,
    });
  };
  newElem = () => {
    const value = this.props.value || []
    const textDefaultAttr = { size: 30, padding: 10, align: 'left' };
    let changeAttr = {
      type: this.state.newElem
    }
    if(this.state.newElem === 'text') {
      changeAttr = {
        ...changeAttr,
        ...textDefaultAttr
      }
    }
    this.props.onChange([
      ...value,
      changeAttr,
    ]);
    this.setState(
      {
        editor: '',
        newElem: 'text',
      }
    );
  };
  editor = () => {
    switch (this.state.editor) {
      case 'unkown': {
        return (
          <div className={styles.chooseType}>
            <RadioGroup defaultValue="text" buttonStyle="solid" onChange={this.chooseType}>
              <RadioButton value="text">文本</RadioButton>
              <RadioButton value="image">图片</RadioButton>
              <RadioButton value="list">列表</RadioButton>
            </RadioGroup>

            <ButtonGroup>
              <Button type="ghost" onClick={this.showEditor.bind(null, '')}>
                取消
              </Button>
              <Button type="primary" onClick={this.newElem}>
                下一步
              </Button>
            </ButtonGroup>
          </div>
        );
      }
      default: {
        return (
          <div>
            <Button onClick={this.showEditor.bind(null, 'unkown')} icon="plus">
              添加新的图文内容
            </Button>
          </div>
        );
      }
    }
  };
  render() {
    let blockProps = {
      onMove: this.move,
      onRemove: this.remove,
    };
    return (
      <Fragment>
        {_.map(this.props.value, (val, i) => {
          blockProps = {
            ...blockProps,
            key: `content_${i}`,
            index: i,
            isLast: i === this.props.value.length - 1,
            type: val.type,
          };
          const elemProps = {
            value: val,
            onChange: this.change,
            index: i,
          };
          switch (val.type) {
            case 'text': {
              return (
                <Block {...blockProps}>
                  <Text {...elemProps} />
                </Block>
              );
            }
            case 'image': {
              return (
                <Block {...blockProps}>
                  <Img {...elemProps} />
                </Block>
              );
            }
            case 'list': {
              return (
                <Block {...blockProps}>
                  <List {...elemProps} />
                </Block>
              );
            }
            default: {
              return null;
            }
          }
        })}
        {this.editor()}
      </Fragment>
    );
  }
}
