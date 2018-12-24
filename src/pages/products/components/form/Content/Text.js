import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Button, Collapse, Icon, message, Form, Radio } from 'antd';
import { FormItem } from '../../../../../utils/ui';
import styles from './styles.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;

class Text extends PureComponent {
  /* 
  type: 'text',
        align: 'center',
        size: 30,
        padding: 10,
        italic: true,
        weight: 'bold',
        value:
          '文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容',
  */
  render() {
    const { getFieldDecorator } = this.props.form;
    const { align, size, padding, italic, weight, value } = this.props.value;
    return (
      <Form layout="vertical">
        <Form.Item label="文本内容">
          {getFieldDecorator('value', {
            initialValue: value,
          })(<TextArea />)}
        </Form.Item>
        <Form.Item label="对齐方式">
          {getFieldDecorator('align', {
            initialValue: align,
          })(
            <RadioGroup>
              <RadioButton value="left">左</RadioButton>
              <RadioButton value="center">中</RadioButton>
              <RadioButton value="right">右</RadioButton>
            </RadioGroup>,
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Text);
