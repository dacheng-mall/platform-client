import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Input, Form, Radio, Button, Row, Col, Select, message } from 'antd';
import ListItem from './ListItem';
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
          const { productId, name, mainImage, price } = editor;
          newState.options = [{ title: name, id: productId, mainImageUrl: mainImage, price }];
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
      message.error('尚未绑定商品')
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
  chooseProduct = (key) => {
    const { options } = this.state;
    const target = _.find(options, ['id', key]);
    const { mainImageUrl, price, title } = target || {};
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
        name: title,
        displayName: title,
        productImage: mainImageUrl,
        mainImage: mainImageUrl,
        price,
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
  render() {
    const wrapCol = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.wrap}>
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
                <ListItem
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
                添加新的块元素
              </Button>
            </div>
          </div>
        </div>
        {this.state.visible ? (
          <div className={styles.editor}>
            <h2>{`编辑元素(${this.state.editor.name || '未关联商品'})`}</h2>
            <Form layout="horizontal">
              <Form.Item label="关联商品" {...wrapCol}>
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
              </Form.Item>
              <Form.Item label="显示名称" {...wrapCol}>
                <Input
                  value={this.state.editor.displayName}
                  onChange={this.changeName}
                  placeholder="请输入块元素名称"
                />
              </Form.Item>
              <Form.Item label="尺寸" {...wrapCol}>
                <RadioGroup
                  value={this.state.editor.size}
                  onChange={this.change.bind(null, 'size')}
                  buttonStyle="solid"
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
                <Button.Group>
                  <Button onClick={this.resetImage.bind(null, this.state.editing)}>还原</Button>
                  <Button onClick={this.userProductImage.bind(null, this.state.editor)}>
                    使用商品主图
                  </Button>
                </Button.Group>
              </Form.Item>
              <Row>
                <Col span={14} offset={6}>
                  <Button size="large" onClick={this.submit} type="primary" style={{marginRight: '0.1rem'}}>
                    确定
                  </Button> 
                  <Button size="large" onClick={this.hideModal}>取消</Button>
                </Col>
              </Row>
            </Form>
          </div>
        ) : null}
      </div>
    );
  }
}
