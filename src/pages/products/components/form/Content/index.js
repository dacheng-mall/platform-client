import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Button, Collapse, Icon, message } from 'antd';
import styles from './styles.less';
import List from './List';
import Img from './Img';
import Text from './Text';
import Block from './Block';

export default class CateEditor extends PureComponent {
  change = (value) => {};
  move = () => {};
  render() {
    return (
      <Fragment>
        {_.map(this.props.value, (val, i) => {
          switch (val.type) {
            case 'text': {
              return (
                <Block type={val.type} onMove={this.move}>
                  <Text value={val} onChange={this.change} />
                </Block>
              );
            }
            case 'image': {
              return (
                <Block type={val.type} onMove={this.move}>
                  <Img value={val} onChange={this.change} />
                </Block>
              );
            }
            case 'list': {
              return (
                <Block type={val.type} onMove={this.move}>
                  <List value={val} onChange={this.change} />
                </Block>
              );
            }
            default: {
              return null;
            }
          }
        })}
        <div>
          <Button icon="plus">添加新的图文内容</Button>
        </div>
      </Fragment>
    );
  }
}
