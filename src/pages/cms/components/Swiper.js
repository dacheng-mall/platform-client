import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import { Input, Form, Radio, Button, Row, Col, message, InputNumber } from 'antd';
import SwiperItem from './SwiperItem';
import styles from './styles.less';
import Uploader from '../../Components/Uploader';
import { getProductsWithoutPage } from '../../products/services';
import { getPagesWithoutPage } from '../services';
import { source } from '../../../../setting';
import Selecter from './Selecter';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let timer;

export default class ProductsList extends PureComponent {
  state = {
    visible: false,
    editor: this.props.data || {},
    editing: null,
    attributes: this.props.attributes || {},
    height: 0,
    productOpts: [],
    pageOpts: [],
    itemType: 'product',
  };
  edit = (type, value, index) => {
    switch (type) {
      case 'edit': {
        // 点击元素上的编辑按钮, 进入编辑状态
        const editor = this.props.data[index];
        const newState = {
          visible: true,
          editor,
          editing: index,
        };
        if (editor.productId) {
          const { productId, productName, name, mainImage } = editor;
          newState.productOpts = [
            { title: productName || name, id: productId, mainImageUrl: mainImage },
          ];
          newState.itemType = 'product';
        }
        if (editor.pageId) {
          const { pageId, pageName } = editor;
          newState.pageOpts = [{ title: pageName, id: pageId }];
          newState.itemType = 'page';
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
  resetImage = () => {
    let fileList = [];
    const {fileList: FL, mainImage, productImage, productId, productName} = this.state.editor;
    if (FL) {
      fileList = FL;
    } else if (mainImage) {
      // 如果没有新上传的图, 并且有主图, 优先使用主图
      fileList.push({
        uid: 'init',
        name: 'mainImage',
        url: `${source}${mainImage}`,
      });
    } else if (productImage) {
      // 如果没有主图, 优先使用商品图
      fileList.push({
        uid: productId,
        name: productName,
        url: `${source}${productImage}`,
      });
    }
    this.setState({
      fileList,
    });
  };
  userProductImage = (editor) => {
    if (editor.productImage) {
      this.setState({
        fileList: [
          {
            uid: editor.productId,
            name: editor.name,
            url: `${source}${editor.productImage}`,
          },
        ],
      });
    } else {
      message.error('尚未绑定商品');
    }
  };
  hideModal = () => {
    this.setState({
      visible: false,
      editor: {},
      editing: null,
    });
    this.props.editing(null);
  };
  typeChange = (e) => {
    const { value } = e.target;
    this.setState({ itemType: value });
  };
  onSearch = (type, title) => {
    if (timer) {
      clearTimeout(timer);
    }
    const _this = this;
    timer = setTimeout(() => {
      switch (type) {
        case 'product': {
          getProductsWithoutPage({ title }).then(({ data }) => {
            _this.setState({
              productOpts: _.map(data, ({ id, title, mainImageUrl }) => ({
                id,
                title,
                mainImageUrl,
              })),
            });
          });
          break;
        }
        case 'page': {
          getPagesWithoutPage({ name: title }).then(({ data }) => {
            _this.setState({
              pageOpts: _.map(data, ({ id, name: title }) => ({ id, title })),
            });
          });
          break;
        }
        default: {
          return;
        }
      }
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  choose = (type, key) => {
    const { productOpts, pageOpts } = this.state;
    const newState = {};
    let editor = {};
    const fileList = [];
    switch (type) {
      case 'product': {
        /**
         * 选择商品时将商品的主图写入, 并写入fileList;
         * fileList其实是个临时文件, 所有图片的变更都更新fileList;
         * editor.productImage指向的是关联商品的主图
         * editor.mainImage指向的是该元素的主图,覆盖商品图
         * */
        const target = _.find(productOpts, ['id', key]);
        const { mainImageUrl, title } = target || {};
        editor = {
          ...this.state.editor,
          productId: key,
          productImage: mainImageUrl,
          mainImage: mainImageUrl,
          productName: title,
          pageId: undefined,
          pageName: undefined,
        };
        fileList.push({
          uid: key,
          name: title,
          url: `${source}${mainImageUrl}`,
          status: 'done',
        });
        newState.editor = editor;
        newState.fileList = fileList;
        break;
      }
      case 'page': {
        const target = _.find(pageOpts, ['id', key]);
        const { title } = target || {};
        editor = {
          ...this.state.editor,
          pageId: key,
          pageName: title,
          productId: undefined,
          productImage: undefined,
          productName: undefined,
        };
        newState.editor = editor;
        break;
      }
      default: {
        break;
      }
    }
    this.setState(newState);
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
  submit = () => {
    // 编辑元素信息的行为在这里交给状态容器处理
    const { editor, fileList, editing } = this.state;
    this.props.onEdit(
      'edit',
      { ...editor, fileList },
      editing,
    );
    this.hideModal();
  };
  newBlock = () => {
    this.props.onEdit('add');
  };
  change = (type, e) => {
    // 表单值的变更仅影响组件内的state, 用于最终subimt方法使用, 提交给上层状态容器
    switch (type) {
      case 'image': {
        this.setState((state) => {
          return { ...state, ...e };
        });
        break;
      }
      case 'title': {
        this.props.onEdit(type, e.target.value);
        break;
      }
      case 'attributes.rate[0]':
      case 'attributes.rate[1]': {
        this.props.onEdit(type, e);
        break;
      }
      default: {
        return false;
      }
    }
  };
  renderLink = (itemType) => {
    switch (itemType) {
      case 'product': {
        return (
          <Selecter
            onSearch={this.onSearch.bind(null, 'product')}
            onChange={this.choose.bind(null, 'product')}
            placeholder="请输入关键字搜索商品"
            value={this.state.editor.productId}
            options={this.state.productOpts}
            type="productOpts"
          />
        );
      }
      case 'page': {
        return (
          <Selecter
            onSearch={this.onSearch.bind(null, 'page')}
            onChange={this.choose.bind(null, 'page')}
            placeholder="请输入关键字搜索页面"
            value={this.state.editor.pageId}
            options={this.state.pageOpts}
            type="pageOpts"
          />
        );
      }
      default: {
        return null;
      }
    }
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { attributes, itemType, editing } = this.state;
    const { name, data } = this.props;
    return (
      <div className={styles.swiperWrap}>
        <div className={styles.preview}>
          <div className={styles.nameEditor} />
          <div className={styles.listWrap} id="_listWrap">
            {_.map(data, (d, i) => {
              return (
                <SwiperItem
                  key={`item_${d.id}_${i}`}
                  current={editing}
                  data={d}
                  index={i}
                  size={d.size}
                  onEdit={this.edit}
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
                  width: '100%'
                }}
              >
                暂无元素, 请点击下方按钮添加
              </div>
            ) : null}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button disabled={editing !== null} icon="plus" type="danger" onClick={this.newBlock}>
                添加滚图元素
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.editor}>
          <h2>{`编辑基础属性`}</h2>
          <Form layout="horizontal">
            <Form.Item label="元素组名称" {...wrapCol}>
              <Input
                value={name}
                placeholder="请输入列表名称"
                onChange={this.change.bind(null, 'title')}
              />
            </Form.Item>
            <Form.Item label="宽高比例" {...wrapCol} help="注意是比例, 例如, 1:1 或 4:3">
              <InputNumber
                placeholder="宽"
                value={attributes && attributes.rate && (attributes.rate[0] || 1)}
                onChange={this.change.bind(null, 'attributes.rate[0]')}
              />
              <span> : </span>
              <InputNumber
                placeholder="高"
                value={attributes && attributes.rate && (attributes.rate[1] || 1)}
                onChange={this.change.bind(null, 'attributes.rate[1]')}
              />
            </Form.Item>
          </Form>
          {this.state.visible ? (
            <Fragment>
              <h2>{`编辑第 ${editing + 1} 个元素`}</h2>
              <Form layout="horizontal">
                <Form.Item label="关联" {...wrapCol} help="选定关联内容后会覆盖之前的设置">
                  <RadioGroup onChange={this.typeChange} value={itemType} buttonStyle="solid">
                    <RadioButton value="product">商品</RadioButton>
                    <RadioButton value="page">页面</RadioButton>
                    <RadioButton value="category" disabled>
                      分类
                    </RadioButton>
                  </RadioGroup>
                  {this.renderLink(itemType)}
                </Form.Item>
                <Form.Item label="图片" {...wrapCol}>
                  <Uploader
                    fileList={this.state.fileList}
                    onChange={this.change.bind(null, 'image')}
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
