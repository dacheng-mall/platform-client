import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Form, Radio, Button, Row, Col, message } from 'antd';
import ListItem from './ListItem';
import styles from './styles.less';
import SelecterX from './Selector';
import ImagePicker from './ImagePicker';

const source = window.config.source
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
export default class ListEditor extends PureComponent {
  state = {
    visible: false,
    editor: this.props.data || {},
    editing: null,
    height: 0,
    oriented: {},
  };
  // same
  edit = (type, value, index) => {
    switch (type) {
      case 'edit': {
        // 点击元素上的编辑按钮, 进入编辑状态
        const editor = _.cloneDeep(this.props.data[index] || {});
        const newState = {
          visible: true,
          editor,
          editing: index,
          oriented: {
            title: editor.name,
            id: editor.id,
            image: editor.image,
            displayName: editor.displayName,
          },
        };
        switch (editor.type) {
          case 'product': {
            const { productImage, institutionId, price } = editor;
            newState.oriented.productImage = productImage;
            newState.oriented.institutionId = institutionId;
            newState.oriented.price = price;
            newState.oriented.type = 'product';
            break;
          }
          default: {
            newState.oriented.type = editor.type;
            break;
          }
        }
        this.setState(newState, () => {
          this.resetImage();
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
  // same
  resetImage = () => {
    let fileList = [];
    const { fileList: FL, image, productImage, id, name } = this.state.editor;
    if (FL && FL.length > 0) {
      fileList = FL;
    } else if (image) {
      // 如果没有新上传的图, 并且有主图, 优先使用主图
      fileList.push({
        uid: 'init',
        name: 'mainImage',
        url: `${source}${image}`,
      });
    } else if (productImage) {
      // 如果没有主图, 优先使用商品图
      fileList.push({
        uid: id,
        name: name,
        url: `${source}${productImage}`,
      });
    }
    this.setState({
      fileList,
    });
  };
  // same
  userProductImage = (editor, oriented) => {
    const fileList = []; 
    if (oriented.productImage) {
      fileList.push({
        uid: oriented.id,
        name: oriented.title,
        url: `${source}${oriented.productImage}`,
      });
      editor.image = oriented.productImage;
    } else if (editor.productImage) {
      fileList.push({
        uid: editor.id,
        name: editor.name,
        url: `${source}${editor.productImage}`,
      });
      editor.image = editor.productImage;
    } else {
      message.error('尚未绑定商品');
      return;
    }
    this.setState({
      fileList,
      editor,
    });
  };
  // same
  hideModal = () => {
    this.setState({
      visible: false,
      editor: {},
      editing: null,
      oriented: {},
    });
    this.props.editing(null);
  };
  changeName = (e) => {
    this.setState({
      editor: { ...this.state.editor, displayName: e.target.value },
    });
  };
  componentDidMount() {
    const width = document.getElementById('_listWrap').clientWidth - 20;
    this.setState({ height: width * 0.48 + 'px' });
  }
  // most be the same, 也可以全部一样, 只是swiper组建中的商品数据会有些冗余
  submit = () => {
    // 编辑元素信息的行为在这里交给状态容器处理
    const { fileList, editing, oriented, editor } = this.state;
    const { id, title, productImage, institutionId, price, type } = oriented;
    const { size, displayName, image } = editor;
    const newData = {
      id,
      name: title,
      size: size,
      displayName: displayName,
      image: fileList.length === 0 ? '' : (image || productImage),
      type,
    };
    if (oriented.type === 'product') {
      newData.productImage = productImage;
      newData.institutionId = institutionId;
      newData.price = price;
    }
    this.props.onEdit('edit', { ...newData, fileList }, editing);
    this.hideModal();
  };
  // same
  newBlock = () => {
    this.props.onEdit('add');
  };
  // most be the same
  change = (type, e) => {
    // 表单值的变更仅影响组件内的state, 用于最终subimt方法使用, 提交给上层状态容器
    switch (type) {
      case 'image': {
        this.setState((state) => {
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
      case 'title': {
        this.props.onEdit(type, e.target.value);
        break;
      }
      default: {
        return false;
      }
    }
  };
  onSelect = (detail) => {
    const update = {
      oriented: detail,
    };
    if (!this.state.editor.type) {
      update.editor = { ...this.state.editor, ...detail };
    }
    
    if(update.oriented.id === 'clear') {
      this.setState({oriented: {}, editor: {}, fileList: []});
    } else {
      this.setState(update);
    }
  };
  changeType = (value) => {
    if (this.state.editor.type === value) {
      this.onSelect(this.state.editor);
    } else {
      this.onSelect({ type: value });
    }
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { editing, editor, visible, oriented, fileList } = this.state;
    const { name, data } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.preview}>
          <div className={styles.listWrap} id="_listWrap">
            {_.map(data, (d, i) => {
              return (
                <ListItem
                  key={`item_${d.id}_${i}`}
                  current={editing}
                  data={d}
                  index={i}
                  size={d.size}
                  onEdit={this.edit}
                  isHead={i === 0}
                  isTail={i === data.length - 1}
                  height={this.state.height}
                />
              );
            })}
            {data.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.3rem 0',
                  fontSize: '0.16rem',
                  color: '#aaa',
                  width: '100%',
                }}
              >
                暂无元素, 请点击下方按钮添加
              </div>
            ) : null}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button disabled={editing !== null} icon="plus" type="danger" onClick={this.newBlock}>
                添加新的块元素
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.editor}>
          <h2>编辑基础属性</h2>
          <Form layout="horizontal">
            <Form.Item label="元素组名称" {...wrapCol}>
              <Input
                value={name}
                placeholder="请输入列表名称"
                onChange={this.change.bind(null, 'title')}
              />
            </Form.Item>
          </Form>
          {visible ? (
            <Fragment>
              <h2>{`编辑第 ${editing + 1} 个元素`}</h2>
              <Form layout="horizontal">
                <Form.Item label="显示名称" {...wrapCol}>
                  <Input
                    value={editor.displayName}
                    onChange={this.changeName}
                    placeholder="请输入块元素名称"
                  />
                </Form.Item>
                <Form.Item label="关联" {...wrapCol} help="选定关联内容后会覆盖之前的设置">
                  <SelecterX
                    value={oriented}
                    changeType={this.changeType}
                    onSelect={this.onSelect}
                  />
                </Form.Item>
                <Form.Item label="图片" {...wrapCol}>
                  <ImagePicker
                    fileList={fileList}
                    onChange={this.change.bind(null, 'image')}
                    resetImage={this.resetImage.bind(null, editing)}
                    userProductImage={this.userProductImage.bind(null, editor, this.state.oriented)}
                    oriented={oriented}
                  />
                </Form.Item>
                <Form.Item label="尺寸" {...wrapCol}>
                  <RadioGroup
                    value={editor.size}
                    onChange={this.change.bind(null, 'size')}
                    buttonStyle="solid"
                  >
                    <RadioButton value={1}>1x</RadioButton>
                    <RadioButton value={2}>2x</RadioButton>
                  </RadioGroup>
                </Form.Item>
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      size="large"
                      onClick={this.submit}
                      type="primary"
                      style={{ marginRight: '0.1rem' }}
                    >
                      确定
                    </Button>
                    <Button size="large" onClick={this.hideModal}>
                      取消
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}
