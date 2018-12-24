import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Button, Collapse, Icon, message } from 'antd';
import styles from './styles.less';

export default class Img extends PureComponent {
  render() {
    return JSON.stringify(this.props.value);
  }
}
