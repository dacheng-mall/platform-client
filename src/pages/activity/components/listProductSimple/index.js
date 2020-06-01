import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Modal, Form, Input, Select, InputNumber, Radio, Button, DatePicker, Col, Row } from 'antd';
import { FormItem } from '../../../../utils/ui';
import { upload } from '../../../../utils';
import { getProductsWithoutPage } from '../../../products/services';
import Images from '../../../products/components/form/Images';
import { updateActivityproducts, createActivityproducts } from '../../services/activity';
import styles from './index.less';
const source = window.config.source;

const RangePicker = DatePicker.RangePicker;

function Products(props) {
  const click = (p, e) => {
    e.preventDefault();
    props.onEdit(p);
    if (props.canRemove) {
    }
  };
  const remove = (id, aid, e) => {
    e.stopPropagation();
    if (props.canRemove) {
      props.onRemove(id, aid);
    }
  };
  return _.map(props.data, (p) => {
    return (
      <div
        onClick={click.bind(null, p)}
        key={p.id}
        className={styles.item}
        style={{ textAlign: 'center' }}
      >
        <img style={{ width: '88px', height: '88px' }} src={`${source}${p.images}`} />
        <br />
        {p.showName}
        {props.canRemove ? <div onClick={remove.bind(null, p.id, p.activityId)}>删除</div> : null}
      </div>
    );
  });
}

class ListProductSimple extends React.PureComponent {
  state = {
    current: null,
    products: [],
  };
  remove = (id, aid) => {
    this.props.dispatch({
      type: 'activities/remove',
      payload: { id, aid },
    });
  };
  show = (p) => {
    const { beginTime, finishTime, images: _images } = p;
    const images = [];
    let range;
    if (beginTime && finishTime) {
      range = [moment(beginTime), moment(finishTime)];
    }
    console.log('p', p);
    if (_images) {
      _.forEach(_images.split(','), (image) => {
        images.push({
          _url: image,
          url: `${source}${image}`,
        });
      });
    }
    this.setState({
      current: {
        ...p,
        range,
        price: p.product.price,
        images,
      },
      products: [
        {
          title: p.product.title,
          id: p.product.id,
          price: p.product.price,
          img: p.product.mainImageUrl,
        },
      ],
    });
  };
  hide = () => {
    this.setState({
      current: null,
      products: [],
    });
  };
  select = (productId) => {
    const target = _.find(this.state.products, ['id', productId]);
    this.setState({
      current: { ...this.state.current, productId, price: target.price },
    });
  };
  timer = null;
  search = (title) => {
    if (_.trim(title)) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        getProductsWithoutPage({ title }).then(({ data }) => {
          this.setState({
            products: _.map(data, (d) => ({
              title: d.title,
              id: d.id,
              price: d.price,
              img: d.mainImageUrl,
            })),
          });
        });
      }, 300);
    }
  };
  submit = async () => {
    if (this.props.user.userType === 3) {
      this.hide();
      return;
    }

    const { current } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      const todos = {};
      _.forEach(values.images, (img, i) => {
        if (img && img.originFileObj) {
          todos[`_images[${i}].url`] = upload(img.originFileObj);
          values.images[i] = {
            url: '',
          };
        } else {
          values.images[i].url = values.images[i]._url;
          delete values.images[i]._url;
          delete values.images[i].uid;
        }
      });

      if (!_.isEmpty(todos)) {
        const ups = Object.values(todos);
        if (ups.length > 0) {
          const [image] = await Promise.all(_.map(ups, (up) => up()));
          if (image) {
            values.images = image.key;
          }
        }
      } else {
        delete values.images;
      }

      console.log(values);
      // return;
      if (values.range) {
        values.beginTime = moment(values.range[0]).format('YYYY-MM-DD HH:mm:ss');
        values.finishTime = moment(values.range[1]).format('YYYY-MM-DD HH:mm:ss');
        delete values.range;
      }
      if (current.id) {
        // 这里是编辑商品
        delete values.productId;
        values.id = current.id;
        updateActivityproducts(values).then(({ data }) => {
          this.props.onEdit('update', data);
          this.hide();
        });
      } else {
        // 这里需要添加新的;
        values.activityId = this.props.activityId;
        values.displayOrder = _.isArray(this.props.data) ? this.props.data.length : 0;
        createActivityproducts(values).then(({ data }) => {
          this.props.onEdit('create', data);
          this.hide();
        });
      }
    });
  };
  renderProducts = (products) =>
    _.map(products, (p) => (
      <Select.Option key={p.id} value={p.id}>
        {p.title}
      </Select.Option>
    ));
  plusProduct = () => {
    this.setState({
      current: {},
      products: [],
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.wrap}>
        <div className={styles.products}>
          <Products
            data={this.props.data}
            key="product"
            onEdit={this.show}
            onRemove={this.remove}
            canRemove={this.props.user.userType === 1}
          />
        </div>
        {this.props.user.userType === 3 ? null : (
          <Button type="primary" icon="plus" shape="circle" onClick={this.plusProduct} />
        )}
        {this.state.current ? (
          <Modal
            visible={!!this.state.current}
            onCancel={this.hide}
            onOk={this.submit}
            key="modal"
            title={`${this.props.user.userType === 3 ? '查看' : '编辑'}活动关联商品`}
            width={1000}
          >
            <Form>
              <Row gutter={10}>
                <Col span={12}>
                  <FormItem label="图片">
                    {getFieldDecorator('images', {
                      initialValue: this.state.current.images,
                      rules: [{ required: false, message: '必填项' }],
                    })(<Images max={1} />)}
                  </FormItem>
                  <FormItem label="显示名称">
                    {getFieldDecorator('showName', {
                      initialValue: this.state.current.showName,
                      rules: [{ required: true, message: '必填项' }],
                    })(
                      <Input
                        placeholder="请输入活动显示名称"
                        disabled={this.props.user.userType === 3}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="原价(元)">
                    {getFieldDecorator('price', {
                      initialValue: this.state.current.price,
                    })(
                      <InputNumber
                        mix={0}
                        placeholder="请输入"
                        disabled={this.props.user.userType === 3}
                        style={{ width: '100px' }}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="活动价(元)">
                    {getFieldDecorator('activityPrice', {
                      initialValue: this.state.current.activityPrice,
                    })(
                      <InputNumber
                        mix={0}
                        placeholder="请输入"
                        disabled={this.props.user.userType === 3}
                        style={{ width: '100px' }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="周期">
                    {getFieldDecorator('range', {
                      initialValue: this.state.current.range,
                    })(
                      <RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabled={this.props.user.userType === 3}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="中奖概率">
                    {getFieldDecorator('probability', {
                      initialValue: this.state.current.probability,
                    })(
                      <InputNumber
                        min={0}
                        max={0.99999}
                        placeholder="小于1"
                        disabled={this.props.user.userType === 3}
                        style={{ width: '100px' }}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="库存(件)">
                    {getFieldDecorator('stock', {
                      initialValue: this.state.current.stock,
                      rules: [{ required: true, message: '必填项' }],
                    })(
                      <InputNumber
                        min={0}
                        placeholder="正整数"
                        disabled={this.props.user.userType === 3}
                        style={{ width: '100px' }}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="包含(件)">
                    {getFieldDecorator('totalCount', {
                      initialValue: this.state.current.totalCount || 1,
                    })(
                      <InputNumber
                        min={1}
                        placeholder="请输入库存"
                        disabled={this.props.user.userType === 3}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="状态">
                    {getFieldDecorator('status', {
                      initialValue: this.state.current.status || 'waiting',
                    })(
                      <Radio.Group disabled={this.props.user.userType === 3}>
                        <Radio.Button value="waiting">等待</Radio.Button>
                        <Radio.Button value="sellOut">售罄</Radio.Button>
                        <Radio.Button value="frozen">冻结</Radio.Button>
                        <Radio.Button value="expired">过期</Radio.Button>
                        <Radio.Button value="enable">进行中</Radio.Button>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        ) : null}
      </div>
    );
  }
}
function mapStateToProps({ activity, app }) {
  return { ...activity, user: app.user };
}
export default connect(mapStateToProps)(Form.create()(ListProductSimple));
