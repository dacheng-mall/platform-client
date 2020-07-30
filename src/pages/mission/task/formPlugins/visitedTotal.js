import { Fragment, PureComponent } from 'react';
import { InputNumber } from 'antd';
import { FormItem } from '../../../../utils/ui';

export default class Visited extends PureComponent {
  state = {
    ...this.props.value,
  };
  static getDerivedStateFromProps(props, state) {
    if (props.value) {
      return { ...state, ...props.value };
    }
    return null;
  }
  edit = (type, val) => {
    this.props.onChange({ ...this.state, [type]: val });
  };
  render() {
    return (
      <Fragment>
        <FormItem label="单客得分上限" help="0则忽略, 单个客户在任务期内提供工分值上限">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'singleCustomerVisitedMax')}
            placeholder="请输入"
            value={this.state.singleCustomerVisitedMax}
          />
        </FormItem>
        <FormItem label="单日得分上限" help="0则忽略, 单日基础分获得上限">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'delayMax')}
            placeholder="请输入"
            value={this.state.delayMax}
          />
        </FormItem>
        <FormItem label="基础得分" help="0则忽略, 单次有效的拜访得分">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'visitedPoint')}
            placeholder="请输入"
            value={this.state.visitedPoint}
          />
        </FormItem>
        <FormItem label="单日有效拜访次数" help="0则忽略, 单日前若干次拜访可以获得工分">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'delayOldMax')}
            placeholder="请输入"
            value={this.state.delayOldMax}
          />
        </FormItem>
        <FormItem label="新客额外分" help="0则忽略, 除基础分外的额外加分">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'newCustomerPoint')}
            placeholder="请输入"
            value={this.state.newCustomerPoint}
          />
        </FormItem>
        <FormItem label="单日新客额外分上限" help="0则忽略, 单日新客户拜访额外得分上限">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'delayNewCustomerMax')}
            placeholder="请输入"
            value={this.state.delayNewCustomerMax}
          />
        </FormItem>
        <FormItem label="单日统计下限(次)" help="至少1次才会触发活跃状态, 连续2天活跃触发连续拜访状态">
          <InputNumber
            min={1}
            onChange={this.edit.bind(null, 'delayMin')}
            placeholder="请输入"
            value={this.state.delayMin || 1}
          />
        </FormItem>
        <FormItem label="连续拜访得分" help="连续满足单日下限访问量时的额外加分, 每日只触发一次加分">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'continuePoint')}
            placeholder="请输入"
            value={this.state.continuePoint}
          />
        </FormItem>
        {/* <FormItem label="连续额外分修正" help="连续额外分递增修正值">
          <InputNumber
            min={0}
            onChange={this.edit.bind(null, 'continueAdjustment')}
            placeholder="请输入"
            value={this.state.continueAdjustment}
          />
        </FormItem> */}
      </Fragment>
    );
  }
}
