import { PureComponent } from 'react';
import { Input, Button, InputNumber, Popconfirm, message } from 'antd';
import _ from 'lodash';
import Picker from '../../../convert/prizes/Picker/index';
import { FormItem } from '../../../../utils/ui';
import styles from './index.less';

const source = window.config.source;
export default class Products extends PureComponent {
  state = {
    newProduct: null,
    editing: false,
    update: null,
  };
  editing = () => {
    this.setState({
      editing: true,
    });
  };
  onChange = ({ type, value }) => {
    switch (type) {
      case 'add': {
        const newValue = this.props.value ? [...this.props.value, value] : [value];
        this.props.onChange(newValue);
        this.cancel();
        break;
      }
      case 'update': {
        const newValue = [...this.props.value];
        newValue[this.state.update] = value;

        this.props.onChange(newValue);
        this.cancel();
        break;
      }
      case 'startUpdate': {
        const newValue = [...this.props.value];
        const target = newValue[value];
        this.setState({
          newProduct: {
            ...target,
          },
          editing: true,
          update: value,
        });
        break;
      }
      case 'move': {
        const newValue = [...this.props.value];
        const target = newValue.splice(Math.abs(value), 1)[0];
        if (value > 0) {
          // up
          newValue.splice(value - 1, 0, target);
        } else {
          // down
          newValue.splice(value + 1, 0, target);
        }
        this.props.onChange(newValue);
        break;
      }
      case 'del': {
        const newValue = [...this.props.value];
        newValue.splice(Math.abs(value), 1);
        this.props.onChange(newValue);
        break;
      }
    }
  };
  onPick = (val) => {
    if (val) {
      delete val.createTime;
      delete val.lastModifyTime;
      delete val.status;
      this.setState({
        newProduct: {
          ...val,
          showName: val.name,
          count: val.count || 1,
        },
      });
    } else {
      this.setState({
        newProduct: null,
      });
    }
  };
  pChange = (type, e) => {
    switch (type) {
      case 'showName': {
        if (_.trim(e.target.value)) {
          this.setState({
            newProduct: {
              ...this.state.newProduct,
              [type]: e.target.value,
            },
          });
        } else {
          this.setState({
            newProduct: {
              ...this.state.newProduct,
              [type]: '',
            },
          });
        }
        break;
      }
      case 'showPrice':
      case 'count': {
        if (_.isNumber(parseInt(e, 10))) {
          this.setState({
            newProduct: {
              ...this.state.newProduct,
              [type]: parseInt(e, 10),
            },
          });
        }
        break;
      }
    }
  };
  cancel = () => {
    this.setState({
      newProduct: null,
      editing: false,
      update: null,
    });
  };
  add = () => {
    this.onChange({
      type: 'add',
      value: this.state.newProduct,
    });
  };
  update = () => {
    this.onChange({
      type: 'update',
      value: this.state.newProduct,
    });
  };
  startUpdate = (index) => {
    this.onChange({
      type: 'startUpdate',
      value: index,
    });
  };
  del = (index) => {
    this.onChange({
      type: 'del',
      value: index,
    });
  };
  move = (index) => {
    this.onChange({
      type: 'move',
      value: index,
    });
  };
  render() {
    const { value } = this.props;
    if (!value && !this.state.editing) {
      return (
        <div className={styles.initBtn}>
          <Button type="primary" icon="plus" onClick={this.editing}>
            选择活动商品
          </Button>
        </div>
      );
    }
    if (this.state.editing) {
      return (
        <div>
          <FormItem label="关联商品">
            <Picker
              type="gatheringProducts"
              onChange={this.onPick}
              value={this.state.newProduct}
              maxHeight="auto"
            />
            {this.state.newProduct ? null : (
              <Button type="default" onClick={this.cancel}>
                取消
              </Button>
            )}
          </FormItem>
          {this.state.newProduct && (
            <div>
              <FormItem label="原名称">
                <Input value={this.state.newProduct.name} disabled />
              </FormItem>
              <FormItem label="显示名称">
                <Input
                  onChange={this.pChange.bind(null, 'showName')}
                  value={this.state.newProduct.showName}
                  placeholder="请输入"
                />
              </FormItem>
              <FormItem label="价值(元)">
                <InputNumber value={this.state.newProduct.price} disabled />
              </FormItem>
              <FormItem label="展现价值(元)">
                <InputNumber
                  value={this.state.newProduct.showPrice}
                  onChange={this.pChange.bind(null, 'showPrice')}
                  placeholder="请输入"
                />
              </FormItem>
              <FormItem label="数量(件)">
                <InputNumber
                  min={1}
                  onChange={this.pChange.bind(null, 'count')}
                  value={this.state.newProduct.count || 1}
                  placeholder="请输入"
                />
              </FormItem>
              <div style={{ textAlign: 'right' }}>
                <Button type="default" onClick={this.cancel}>
                  取消
                </Button>
                {this.state.update === null ? (
                  <Button type="danger" onClick={this.add}>
                    添加商品
                  </Button>
                ) : null}
                {this.state.update !== null ? (
                  <Button type="danger" onClick={this.update}>
                    更新商品
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <div className={styles.initBtn}>
          <Button type="primary" icon="plus" onClick={this.editing}>
            选择商品
          </Button>
        </div>
        {this.props.value.length > 0 ? (
          _.map(this.props.value, (value, i) => {
            const TYPE = (function(type) {
              switch (type) {
                case 'product': {
                  return '实物商品';
                }
                case 'point': {
                  return '积分';
                }
                case 'lotto': {
                  return '抽奖机会';
                }
              }
            })(value.type);
            return (
              <div key={`${value.id}_${i}`} className={styles.listItem}>
                <img src={`${source}${value.image}`} alt={value.showName} />
                <div className={styles.info}>
                  <div className={styles.title}>{value.name}</div>
                  <div className={styles.item}>显示名称: {value.showName}</div>
                  <div className={styles.item}>显示价值: {value.showPrice}元</div>
                  <div className={styles.item}>价值: {value.price}元</div>
                  <div className={styles.item}>数量: {value.count}件</div>
                  <div className={styles.item}>类型: {TYPE}</div>
                </div>
                <div className={styles.btns}>
                  {i !== 0 ? (
                    <Button shape="circle" icon="up" onClick={this.move.bind(null, i)}></Button>
                  ) : null}
                  <div>
                    <Button
                      shape="circle"
                      icon="edit"
                      type="primary"
                      onClick={this.startUpdate.bind(null, i)}
                    ></Button>
                    <Popconfirm
                      placement="topRight"
                      title={`您确认要删除${value.showName}吗?`}
                      onConfirm={this.del.bind(null, i)}
                      okText="删除"
                      cancelText="算了"
                    >
                      <Button shape="circle" icon="delete" type="danger"></Button>
                    </Popconfirm>
                  </div>
                  {i !== this.props.value.length - 1 ? (
                    <Button
                      shape="circle"
                      icon="down"
                      onClick={this.move.bind(null, i * -1)}
                    ></Button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{textAlign: 'center'}}>暂无关联商品</div>
        )}
      </div>
    );
  }
}
