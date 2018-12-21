import React, { PureComponent } from 'react';
import { connect } from 'dva';

class Seller extends PureComponent {
  render() {
    return <div>Seller</div>;
  }
}

export default connect()(Seller)
