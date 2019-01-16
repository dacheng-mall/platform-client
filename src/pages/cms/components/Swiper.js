import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Input, Form, Radio, Button, Row, Col, Select, message } from 'antd';
import SwiperItem from './SwiperItem';
import styles from './styles.less';
import Uploader from '../../Components/Uploader';
import { getProductsWithoutPage } from '../../products/services';
import { source } from '../../../../setting';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let timer;
export default class ProductsList extends PureComponent {
  state = {
    visible: false,
    editor: this.props.data || {},
    editing: null,
    height: 0,
    options: [],
    itemType: 'product'
  };
  static getDerivedStateFromProps(props, state) {
    return state;
  }
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
          const { productId, name, mainImage } = editor;
          newState.options = [{ title: name, id: productId, mainImageUrl: mainImage }];
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
  resetImage = (index) => {
    let fileList = [];
    const target = this.state.editor;
    if (target.fileList) {
      fileList = target.fileList;
    } else if (target.mainImage) {
      // 如果没有新上传的图, 并且有主图, 优先使用主图
      fileList.push({
        uid: target.productId,
        name: target.name,
        url: `${source}${target.mainImage}`,
      });
    } else if (target.productImage) {
      // 如果没有主图, 优先使用商品图
      fileList.push({
        uid: target.productId,
        name: target.name,
        url: `${source}${target.productImage}`,
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
  onSearch = (title) => {
    if (timer) {
      clearTimeout(timer);
    }
    const _this = this;
    timer = setTimeout(() => {
      getProductsWithoutPage({ title }).then(({ data }) => {
        _this.setState({
          options: data,
        });
      });
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  typeChange = (e) => {
    const { value } = e.target;
    this.setState({
      itemType: value,
    });
  };
  chooseProduct = (key) => {
    const { options } = this.state;
    const target = _.find(options, ['id', key]);
    const { mainImageUrl, title } = target || {};
    /**
     * 选择商品时将商品的主图写入, 并写入fileList;
     * fileList其实是个临时文件, 所有图片的变更都更新fileList;
     * editor.productImage指向的是关联商品的主图
     * editor.mainImage指向的是该元素的主图,覆盖商品图
     * */
    this.setState({
      editor: {
        ...this.state.editor,
        productId: key,
        productImage: mainImageUrl,
        mainImage: mainImageUrl,
        name: title,
      },
      fileList: [
        {
          uid: key,
          name: title,
          url: `${source}${mainImageUrl}`,
          status: 'done',
        },
      ],
    });
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
    this.props.onEdit(
      'edit',
      { ...this.state.editor, fileList: this.state.fileList },
      this.state.editing,
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
      default: {
        return false;
      }
    }
  };
  renderLink = (itemType) => {
    switch (itemType) {
      case 'product': {
        return (
          <Select
            onSearch={this.onSearch}
            onChange={this.chooseProduct}
            placeholder="请输入关键字搜索商品"
            showSearch
            filterOption={false}
            defaultValue={this.state.editor.productId}
          >
            {_.map(this.state.options, (opt, i) => (
              <Select.Option key={`productOpt_${i}`} value={opt.id}>
                {opt.title}
              </Select.Option>
            ))}
          </Select>
        );
      }
      case 'path': {
        return (
          <Input placeholder="请输入跳转路径" />
        );
      }
      default: {
        return;
      }
    }
  };
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.swiperWrap}>
        <div className={styles.preview}>
          <div className={styles.nameEditor}>
            <Input
              value={this.props.name}
              placeholder="请输入列表名称"
              onChange={this.change.bind(null, 'title')}
            />
          </div>
          <div className={styles.listWrap} id="_listWrap">
            {_.map(this.props.data, (d, i) => {
              return (
                <SwiperItem
                  key={`item_${d.id}_${i}`}
                  current={this.state.editing}
                  data={d}
                  index={i}
                  size={d.size}
                  onEdit={this.edit}
                  height={this.state.height}
                />
              );
            })}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button
                disabled={this.state.editing !== null}
                icon="plus"
                type="danger"
                onClick={this.newBlock}
              >
                添加滚图元素
              </Button>
            </div>
          </div>
        </div>
        {this.state.visible ? (
          <div className={styles.editor}>
            <h2>{`编辑元素(${this.state.editor.name || '未关联商品'})`}</h2>
            <Form layout="horizontal">
              <Form.Item label="关联" {...wrapCol}>
                <RadioGroup onChange={this.typeChange} value={this.state.itemType}>
                  <RadioButton value="product">商品</RadioButton>
                  <RadioButton value="category" disabled>分类</RadioButton>
                  <RadioButton value="path" disabled>页面</RadioButton>
                </RadioGroup>
                {this.renderLink(this.state.itemType)}
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
          </div>
        ) : null}
      </div>
    );
  }
}
