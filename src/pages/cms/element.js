import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'dva';
import List from './components/List';
import styles from './styles.less';

const confirm = Modal.confirm;
class ElementEditor extends PureComponent {
  state = {
    editing: null,
  };
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
      type: 'elementEditor/change',
      payload: {
        type,
        value,
        index,
      },
    });
  };

  editing = (editing) => {
    this.setState({
      editing,
    });
  };

  renderCont = () => {
    const { type } = this.props;
    switch (type) {
      case 'list': {
        return <List {...this.props} onEdit={this.edit} editing={this.editing} />;
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
        <div className={styles.saveBtn}>
          <Button>返回</Button>
          <Button type="primary" disabled={this.state.editing !== null}>
            保存
          </Button>
        </div>
        {this.renderCont()}
      </div>
    );
  }
}

function mapStateToProps({ elementEditor }) {
  return elementEditor;
}

export default connect(mapStateToProps)(ElementEditor);
