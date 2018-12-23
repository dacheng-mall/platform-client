import React, { PureComponent } from "react";
import { connect } from "dva";
import { Form, Button } from "antd";
import Preview from "./components/preview";
import styles from "./detail.less";

class Detail extends PureComponent {
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <Button icon="left">返回</Button>
          <Button icon="check" type="primary">提交</Button>
        </div>
        <div className={styles.content}>
          <div className={styles.preview}>
            <Preview data={this.props.data} />
          </div>
          <div className={styles.form}>
            
            <Form></Form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({detail}){
  return detail;
}

export default connect(mapStateToProps)(Detail);
