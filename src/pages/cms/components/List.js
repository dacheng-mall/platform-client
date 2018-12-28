import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Input, Form, Radio, Button, Row, Col } from 'antd';
import ListItem from './ListItem';
import styles from './styles.less';
import Uploader from '../../Components/Uploader';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class ProductsList extends PureComponent {
  state = {
    visible: false,
    editor: this.props.data || {},
    editing: null,
    height: 0,
  };
  edit = (type, value, index) => {
    switch (type) {
      case 'edit': {
        // 点击元素上的编辑按钮, 进入编辑状态
        this.resetImage(index);
        this.setState({
          visible: true,
          editor: { ...this.props.data[index] },
          editing: index,
        });
        this.props.editing(index);
        break;
      }
      default: {
        // move和delete行为都交给状态容器处理

        this.props.onEdit(type, value, index);
        break;
      }
    }
  };
  resetImage = (index) => {
    const fileList = [];
    if (this.props.data[index].mainImage) {
      fileList.push({
        uid: 'init',
        name: 'init',
        url: this.props.data[index].mainImage,
      });
    }
    this.setState({
      fileList: [...fileList],
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
      editor: {},
      editing: null,
    });
    this.props.editing(null);
  };
  onSearch = (e) => {
    console.log(e);
  };
  componentDidMount() {
    const width = document.getElementById('_listWrap').clientWidth - 20;
    this.setState({ height: width * 0.48 + 'px' });
  }
  submit = () => {
    // 编辑元素信息的行为在这里交给状态容器处理
    this.props.onEdit(
      'edit',
      { ...this.state.editor, fileList: this.state.fileList },
      this.state.editing,
    );
    this.hideModal();
  };
  change = (type, e) => {
    // 表单值的变更仅影响组件内的state, 用于最终subimt方法使用, 提交给上层状态容器
    switch (type) {
      case 'image': {
        
        this.setState((state) => {
          console.log(e);
          return { ...state, ...e };
        });
        break;
      }
      case 'size': {
        this.setState((state) => {
          return { ...state, editor: { ...state.editor, size: e.target.value } };
        });
        break;
      }
      default: {
        return false;
      }
    }
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.wrap}>
        <div className={styles.preview}>
          <div className={styles.nameEditor}>
            <Input placeholder="请输入列表名称" onChange={this.change.bind(null, 'name')} />
          </div>
          <div className={styles.listWrap} id="_listWrap">
            {_.map(this.props.data, (d, i) => {
              return (
                <ListItem
                  key={`item_${d.id}_${i}`}
                  current={this.state.editor.id}
                  data={d}
                  index={i}
                  size={d.size}
                  onEdit={this.edit}
                  height={this.state.height}
                />
              );
            })}
          </div>
        </div>
        {this.state.visible ? (
          <div className={styles.editor}>
            <h2>{`编辑元素-${this.state.editor.name}`}</h2>
            <Form layout="horizontal">
              <Form.Item label="关联商品" {...wrapCol}>
                <Input.Search onSearch={this.onSearch} placeholder="请输入关键字搜索商品" />
              </Form.Item>
              <Form.Item label="尺寸" {...wrapCol}>
                <RadioGroup
                  value={this.state.editor.size}
                  onChange={this.change.bind(null, 'size')}
                >
                  <RadioButton value={1}>1x</RadioButton>
                  <RadioButton value={2}>2x</RadioButton>
                </RadioGroup>
              </Form.Item>
              <Form.Item label="图片" {...wrapCol}>
                <Uploader
                  fileList={this.state.fileList}
                  onChange={this.change.bind(null, 'image')}
                />
                <Button onClick={this.resetImage.bind(null, this.state.editing)}>还原</Button>
              </Form.Item>
              <Row>
                <Col span={14} offset={6}>
                  <Button onClick={this.submit} type="danger">
                    修改
                  </Button>
                  <Button onClick={this.hideModal}>取消</Button>
                </Col>
              </Row>
            </Form>
          </div>
        ) : null}
      </div>
    );
  }
}
