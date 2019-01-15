import React, { PureComponent } from 'react';
import { Button, Modal, Radio } from 'antd';
import { connect } from 'dva';
import List from './components/List';
import styles from './styles.less';

const confirm = Modal.confirm;
class ElementEditor extends PureComponent {
  state = {
    editing: null,
    type: '',
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
  changeType = (e) => {
    this.setState({
      type: e.target.value,
    });
  };
  newElement = () => {
    this.props.dispatch({
      type: 'elementEditor/upState',
      payload: {
        type: this.state.type
      }
    })
  }
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
        return (
          <div className={styles.beforeNew}>
            <h2>请选择要创建的元素类型</h2>
            <Radio.Group value={this.state.type} onChange={this.changeType} buttonStyle="solid">
              <Radio.Button value="list">块状列表</Radio.Button>
              <Radio.Button value="swiper">滚动图</Radio.Button>
            </Radio.Group>
            <div className={styles.nextbtn}>
              <Button type="danger" disabled={!this.state.type} onClick={this.newElement}>下一步</Button>
            </div>
          </div>
        );
      }
    }
  };
  submit = () => {
    this.props.dispatch({
      type: 'elementEditor/submit',
    });
  };
  render() {
    return (
      <div className={styles.wrap}>
        {this.props.type ? <div className={styles.saveBtn}>
          <Button>返回</Button>
          <Button onClick={this.submit} type="primary" disabled={this.state.editing !== null}>
            保存
          </Button>
        </div> : null}
        {this.renderCont()}
      </div>
    );
  }
}

function mapStateToProps({ elementEditor }) {
  return elementEditor;
}

export default connect(mapStateToProps)(ElementEditor);
