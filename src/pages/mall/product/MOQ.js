import { PureComponent } from 'react';
import { InputNumber } from 'antd';
import { FormItem } from '../../../utils/ui';

export default class MOQ extends PureComponent {
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
        <FormItem label="普客起订量">
          <InputNumber
            value={this.state.normal}
            min={0}
            onChange={this.onChange.bind(null, 'normal')}
          />
        </FormItem>
        <FormItem label="vip起订量">
          <InputNumber
            value={this.state.vip}
            min={0}
            onChange={this.onChange.bind(null, 'vip')}
          />
        </FormItem>
      </div>
    );
  }
}
