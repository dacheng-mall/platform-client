import React, { Fragment, PureComponent } from 'react';
import _ from 'lodash';
import { Input, Modal, Form, Radio, Upload, Icon } from 'antd';
import ListItem from './ListItem';
import styles from './styles.less';
import Uploader from '../../Components/Uploader';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class ProductsList extends PureComponent {
  state = {
    visible: false,
    editor: this.props.data || {},
    height: 0,
  };
  edit = (type, value, index) => {
    switch (type) {
      case 'edit': {
        this.setState({
          visible: true,
          editor: this.props.data[index],
        });
        break;
      }
      default: {
        break;
      }
    }
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  onSearch = (e) => {
    console.log(e);
  };
  componentDidMount() {
    const width = document.getElementById('_listWrap').clientWidth - 20;
    this.setState({ height: width * 0.48 + 'px' });
  }
  customRequest = (observer) => {
    this.props.dispatch({
      type: 'app/upload',
      payload: observer,
    });
    // console.log(path)
    /* 
    uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
   name: 'xx.png'   // 文件名
   status: 'done', // 状态有：uploading done error removed
    */
    // const fileList = [{ uid: observer.file.uid, status: 'done', name: observer.file.name }];
    // this.setState({
    //   observer,
    //   fileList
    // });
  };
  submit = () => {};
  change = (type, e) => {
    switch (type) {
      case 'image': {
        this.setState((state) => {
          return { ...state, ...e };
        });
        break;
      }
      case 'size': {
        this.setState((state) => {
          console.log('size', state)
          return { ...state, editor: { ...state.edior, size: e.target.value } };
        });
        break;
      }
      default: {
        return false;
      }
    }
    if (type === 'image') {
    } else {
      console.log(type, e.target.value);
    }
    // this.props.onChange();
  };
  render() {
    return (
      <Fragment>
        <div className={styles.nameEditor}>
          <Input placeholder="请输入列表名称" onChange={this.change.bind(null, 'name')} />
        </div>
        <div className={styles.listWrap} id="_listWrap">
          {_.map(this.props.data, (d, i) => {
            return (
              <ListItem
                key={`item_${d.id}_${i}`}
                data={d}
                index={i}
                size={d.size}
                onEdit={this.edit}
                height={this.state.height}
              />
            );
          })}
        </div>
        <Modal
          title={`编辑商品-${this.state.editor.name}`}
          visible={this.state.visible}
          onCancel={this.hideModal}
          onOk={this.submit}
        >
          <Form layout="vertical">
            <Form.Item label="关联商品">
              <Input.Search onSearch={this.onSearch} placeholder="请输入关键字搜索商品" />
            </Form.Item>
            <Form.Item label="尺寸">
              <RadioGroup
                defaultValue={this.state.editor.size}
                onChange={this.change.bind(null, 'size')}
              >
                <RadioButton value={1}>1x</RadioButton>
                <RadioButton value={2}>2x</RadioButton>
              </RadioGroup>
            </Form.Item>
            <Form.Item label="图片">
              <Uploader onChange={this.change.bind(null, 'image')} />
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
