import React, { Fragment, PureComponent } from 'react';
import _ from 'lodash';
import { Input, Modal, Form, Radio } from 'antd';
import ListItem from './ListItem';
import styles from './styles.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class ProductsList extends PureComponent {
  state = {
    visible: false,
    editor: {}
  };
  edit = (type, value, index) => {
    switch (type) {
      case 'edit': {
        this.setState({
          visible: true,
          editor: this.props.data[index]
        })
        break;
      }
      default: {
        break;
      }
    }
  };
  render() {
    return (
      <Fragment>
        <div className={styles.nameEditor}>
          <Input />
        </div>
        <div className={styles.listWrap}>
          {_.map(this.props.data, (d, i) => {
            return (
              <ListItem
                key={`item_${d.id}_${i}`}
                data={d}
                index={i}
                size={d.size}
                onEdit={this.edit}
              />
            );
          })}
        </div>
        <Modal title={`编辑商品-${this.state.editor.name}`} visible={this.state.visible}>
          <Form layout="inline">
            <Form.Item label="尺寸">
              <RadioGroup defaultValue={this.state.editor.size}>
                <RadioButton value={1}>1x</RadioButton>
                <RadioButton value={2}>2x</RadioButton>
              </RadioGroup>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
