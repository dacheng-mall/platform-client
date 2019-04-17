import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Input, Form, Button, Row, Col, message, InputNumber } from 'antd';
import ListItem from './ListItem';
import styles from './styles.less';
import SelecterX from './Selector';

const source = window.config.source;

export default class ProductsList extends PureComponent {
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
  reset = () => {

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
    this.props.onEdit('submitQuery');
  };
  changeQuery = (type, value) => {
    this.props.onEdit('query', { type, value });
  };
  changeCategory = (type, oriented) => {
    if(oriented.id === 'clear') {
      this.setState({oriented: {}});
    } else {
      this.setState({oriented});
    }
    this.props.onEdit('query', { type, value: oriented });
  };
  change = (type, e) => {
    this.props.onEdit(type, e.target.value);
  };
  clear = () => {
    this.setState({
      oriented: {}
    })
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { oriented = {} } = this.state;
    const { name, data, attributes } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.preview}>
          <div className={styles.listWrap} id="_listWrap">
            {_.map(data, (d, i) => {
              return (
                <ListItem
                  key={`item_${d.id}_${i}`}
                  data={d}
                  disabled
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
                暂无商品元素<br />
                请在右侧添加查询商品条件
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.editor}>
          <h2>编辑基础属性</h2>
          <Form layout="horizontal">
            <Form.Item label="商品组名称" {...wrapCol}>
              <Input
                value={name}
                placeholder="请输入商品列表名称"
                onChange={this.change.bind(null, 'title')}
              />
            </Form.Item>
          </Form>
          <h2>商品查询条件</h2>
          <Form layout="horizontal">
            <Form.Item label="价格下限(元)" {...wrapCol}>
              <InputNumber
                value={attributes.min || 0}
                min={0}
                onChange={this.changeQuery.bind(null, 'min')}
                placeholder="请输入最低价"
              />
            </Form.Item>
            <Form.Item label="价格上限(元)" {...wrapCol}>
              <InputNumber
                value={attributes.max || 0}
                defaultValue={0}
                onChange={this.changeQuery.bind(null, 'max')}
                placeholder="请输入最高价"
              />
            </Form.Item>
            <Form.Item label="商品分类" {...wrapCol}>
              <SelecterX
                value={oriented}
                staticType="category"
                onSelect={this.changeCategory.bind(null, 'category')}
              />
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
                <Button size="large" onClick={this.reset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
