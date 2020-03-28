import { PureComponent } from 'react';
import { Input, Button, InputNumber, Popconfirm } from 'antd';
import _ from 'lodash';
import Picker from './Picker/index';
import { FormItem } from '../../../utils/ui';
import styles from './Products.less';

const source = window.config.source;
export default class Products extends PureComponent {
  state = {
    newProduct: null,
    editing: false,
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
    console.log(val);
    if (val) {
      this.setState({
        newProduct: { ...val, showName: val.name, showPrice: val.price, count: val.count || 1 },
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
              showName: e.target.value,
            },
          });
        }
        break;
      }
      case 'showPrice':
      case 'price1':
      case 'price2': {
        if (_.isNumber(parseFloat(e))) {
          this.setState({
            newProduct: {
              ...this.state.newProduct,
              [type]: parseFloat(e),
            },
          });
        }
        break;
      }
      case 'count': {
        if (_.isNumber(parseInt(e, 10))) {
          this.setState({
            newProduct: {
              ...this.state.newProduct,
              count: parseInt(e, 10),
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
    });
  };
  add = () => {
    this.onChange({
      type: 'add',
      value: this.state.newProduct,
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
            选择商品
          </Button>
        </div>
      );
    }
    if (this.state.editing) {
      return (
        <div>
          <FormItem label="关联商品">
            <Picker
              type="product"
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
              <FormItem label="礼包内显示名称">
                <Input
                  onChange={this.pChange.bind(null, 'showName')}
                  value={this.state.newProduct.showName}
                />
              </FormItem>
              <FormItem label="原价(元)">
                <InputNumber value={this.state.newProduct.price} disabled />
              </FormItem>
              <FormItem label="显示价(元)">
                <InputNumber
                  onChange={this.pChange.bind(null, 'showPrice')}
                  value={this.state.newProduct.showPrice}
                />
              </FormItem>
              <FormItem label="其他价1(元)" help="备用字段">
                <InputNumber
                  onChange={this.pChange.bind(null, 'price1')}
                  value={this.state.newProduct.price1 || 0.0}
                  width={200}
                />
              </FormItem>
              <FormItem label="其他价2(元)" help="备用字段">
                <InputNumber
                  onChange={this.pChange.bind(null, 'price2')}
                  value={this.state.newProduct.price2 || 0.0}
                />
              </FormItem>
              <FormItem label="数量(件)">
                <InputNumber
                  min={1}
                  onChange={this.pChange.bind(null, 'count')}
                  value={this.state.newProduct.count || 1}
                />
              </FormItem>
              <div style={{ textAlign: 'right' }}>
                <Button type="default" onClick={this.cancel}>
                  取消
                </Button>
                <Button type="danger" onClick={this.add}>
                  添加商品
                </Button>
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
        {_.map(this.props.value, (value, i) => {
          return (
            <div key={value.id} className={styles.listItem}>
              <img src={`${source}${value.image}`} alt={value.showName} />
              <div className={styles.info}>
                <div className={styles.showName}>{value.showName}</div>
                <div className={styles.price}>原价: {value.price}元</div>
                <div className={styles.showPrice}>显示价: {value.showPrice}元</div>
                <div className={styles.showPrice}>数量: {value.count}件</div>
              </div>
              <div className={styles.btns}>
                {i !== 0 ? (
                  <Button shape="circle" icon="up" onClick={this.move.bind(null, i)}></Button>
                ) : null}
                {i !== this.props.value.length - 1 ? (
                  <Button
                    shape="circle"
                    icon="down"
                    onClick={this.move.bind(null, i * -1)}
                  ></Button>
                ) : null}
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
            </div>
          );
        })}
      </div>
    );
  }
}
