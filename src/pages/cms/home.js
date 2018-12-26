import React, { PureComponent } from "react";
import { connect } from "dva";

class CmsHome extends PureComponent {
  render(){
    return <div>CmsHome</div>
  }
}
export default connect()(CmsHome)