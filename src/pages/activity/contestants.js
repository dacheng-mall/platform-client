import React from 'react';
import { connect } from 'dva';
import { Table, Input } from 'antd';

function Contestants(props) {
  return 'contestants';
}

function mapStateToProps({ contestants }) {
  return contestants;
}

export default connect(mapStateToProps)(Contestants);
