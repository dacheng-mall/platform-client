import { PureComponent } from 'react';
import { InputNumber } from 'antd';
import { FormItem } from '../../../utils/ui';

export default class Prices extends PureComponent {
  static getDerivedStateFromProps = (props, state) => {
    return { ...state, ...props.value };
  };
  state = {};
  onChange = (type, e) => {
    this.setState({
      ...this.state,
      [type]: e,
    });
    this.props.onChange({
      ...this.state,
      [type]: e,
    });
  };
  render() {
    return (
      <div>
        <FormItem label="原价(元)">
          <InputNumber
            value={this.state.normal}
            min={0}
            onChange={this.onChange.bind(null, 'normal')}
          />
        </FormItem>
        <FormItem label="优惠价(元)">
          <InputNumber
            value={this.state.discount}
            min={0}
            onChange={this.onChange.bind(null, 'discount')}
          />
        </FormItem>
        <FormItem label="VIP价(元)">
          <InputNumber value={this.state.vip} min={0} onChange={this.onChange.bind(null, 'vip')} />
        </FormItem>
        <FormItem label="VIP优惠价(元)">
          <InputNumber
            value={this.state.vipDiscount}
            min={0}
            onChange={this.onChange.bind(null, 'vipDiscount')}
          />
        </FormItem>
        <FormItem label="积分价(元)">
          <InputNumber
            value={this.state.point}
            min={0}
            onChange={this.onChange.bind(null, 'point')}
          />
        </FormItem>
        <FormItem label="积分优惠价(元)">
          <InputNumber
            value={this.state.pointDiscount}
            min={0}
            onChange={this.onChange.bind(null, 'pointDiscount')}
          />
        </FormItem>
        <FormItem label="市场价(元)">
          <InputNumber
            value={this.state.marketing}
            min={0}
            onChange={this.onChange.bind(null, 'marketing')}
          />
        </FormItem>
      </div>
    );
  }
}
