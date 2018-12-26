import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import List from './components/List';
import styles from './styles.less';

class ElementEditor extends PureComponent {
  edit = () => {}
  renderCont = () => {
    const { type } = this.props;
    switch (type) {
      case 'list': {
        return <List {...this.props} onEdit={this.edit} />;
      }
      case 'swiper': {
        return null;
      }
      default: {
        return null;
      }
    }
  };
  render() {
    return (
      <div className={styles.wrap}>
        <Button>保存</Button>
        <div className={styles.preview}>{this.renderCont()}</div>
      </div>
    );
  }
}

function mapStateToProps({ elementEditor }) {
  return elementEditor;
}

export default connect(mapStateToProps)(ElementEditor);
