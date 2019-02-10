import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Init from '../../Components/Init'

class Seller extends PureComponent {
  render() {
    return <Init title="seller" />;
  }
}

export default connect()(Seller)
