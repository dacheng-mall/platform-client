import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Init from '../../Components/Init'

class Institutions extends PureComponent {
  render() {
    return <Init title="Institutions" />;
  }
}

export default connect()(Institutions)
