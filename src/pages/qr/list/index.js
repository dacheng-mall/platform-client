import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Button, Switch, Modal, Icon, Input, Divider } from 'antd';
import Editor from './editor';
import styles from './index.less';

class QrList extends PureComponent {
  render() {
    return 'qrList';
  }
}
function mapStateToProps({ qrList }) {
  return qrList;
}
export default connect(mapStateToProps)(QrList);
