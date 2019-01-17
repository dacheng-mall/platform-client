import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'dva';
import PageEditor from './components/Page';
import styles from './styles.less';
const confirm = Modal.confirm;

class Pages extends PureComponent {
  edit = (type, value, index) => {
    if (type === 'del') {
      confirm({
        title: '是否要删除元素?',
        content: '',
        onOk: () => {
          this.changeData(type, value, index);
        },
        onCancel: () => {},
      });
      return;
    }
    this.changeData(type, value, index);
  };
  changeData = (type, value, index) => {
    this.props.dispatch({
      type: 'pages/change',
      payload: {
        type,
        value,
        index,
      },
    });
  };
  submit = () => {
    this.props.dispatch({
      type: 'pages/submit'
    })
  };
  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.saveBtn}>
          <Button>返回</Button>
          <Button onClick={this.submit} type="primary">
            保存
          </Button>
        </div>
        <PageEditor {...this.props} onEdit={this.edit} />
      </div>
    );
  }
}

function mapStateToProps({ pages }) {
  return { ...pages };
}

export default connect(mapStateToProps)(Pages);
