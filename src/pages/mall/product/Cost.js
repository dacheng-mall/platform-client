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
        <FormItem label="原料(元)">
          <InputNumber
            value={this.state.material}
            min={0}
            onChange={this.onChange.bind(null, 'material')}
          />
        </FormItem>
        <FormItem label="包装(元)">
          <InputNumber
            value={this.state.packing}
            min={0}
            onChange={this.onChange.bind(null, 'packing')}
          />
        </FormItem>
        <FormItem label="人力(元)">
          <InputNumber
            value={this.state.labour}
            min={0}
            onChange={this.onChange.bind(null, 'labour')}
          />
        </FormItem>
        <FormItem label="税费(元)">
          <InputNumber
            value={this.state.taxation}
            min={0}
            onChange={this.onChange.bind(null, 'taxation')}
          />
        </FormItem>
        <FormItem label="仓储物流(元)">
          <InputNumber
            value={this.state.storage}
            min={0}
            onChange={this.onChange.bind(null, 'storage')}
          />
        </FormItem>
      </div>
    );
  }
}
