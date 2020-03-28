import { PureComponent } from 'react';
import { Input, Button, InputNumber, Popconfirm, message } from 'antd';
import _ from 'lodash';
import Picker from '../../convert/prizes/Picker/index';
import { FormItem } from '../../../utils/ui';
import styles from './Tasks.less';

const source = window.config.source;
export default class Products extends PureComponent {
  state = {
    newRule: null,
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
        const index = _.findIndex(this.props.value, ['code', value.code]);
        if (index === -1) {
          const newValue = this.props.value ? [...this.props.value, value] : [value];
          this.props.onChange(newValue);
          this.cancel();
        } else {
          message.warning(`code[${value.code}]有重复!`);
        }
        break;
      }
      case 'update': {
        const newValue = [...this.props.value];
        newValue[this.state.update] = value;
        const countByCode = _.countBy(newValue, 'code');
        if (countByCode[value.code] < 2) {
          this.props.onChange(newValue);
          this.cancel();
        } else {
          message.warning(`规则编码 ${value.code} 有重复!`);
        }
        break;
      }
      case 'startUpdate': {
        const newValue = [...this.props.value];
        const target = newValue[value];
        this.setState({
          newRule: {
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
        newRule: {
          ...val,
          showName: val.name,
          complete: val.complete || 1,
          max: val.max || 0,
          count: val.count || 1,
        },
      });
    } else {
      this.setState({
        newRule: null,
      });
    }
  };
  pChange = (type, e) => {
    switch (type) {
      case 'showName':
      case 'code':
      case 'title': {
        if (_.trim(e.target.value)) {
          this.setState({
            newRule: {
              ...this.state.newRule,
              [type]: e.target.value,
            },
          });
        } else {
          this.setState({
            newRule: {
              ...this.state.newRule,
              [type]: '',
            },
          });
        }
        break;
      }
      case 'max':
      case 'complete':
      case 'count': {
        if (_.isNumber(parseInt(e, 10))) {
          this.setState({
            newRule: {
              ...this.state.newRule,
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
      newRule: null,
      editing: false,
      update: null,
    });
  };
  add = () => {
    const { name, code } = this.state.newRule;
    if (!name || !code) {
      message.success('有必填项没有值');
      return;
    }
    this.onChange({
      type: 'add',
      value: this.state.newRule,
    });
  };
  update = () => {
    const { name, code } = this.state.newRule;
    if (!name || !code) {
      message.success('有必填项没有值');
      return;
    }
    this.onChange({
      type: 'update',
      value: this.state.newRule,
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
            选择奖励
          </Button>
        </div>
      );
    }
    if (this.state.editing) {
      return (
        <div>
          <FormItem label="关联奖励">
            <Picker
              type="missionPrize"
              onChange={this.onPick}
              value={this.state.newRule}
              maxHeight="auto"
            />
            {this.state.newRule ? null : (
              <Button type="default" onClick={this.cancel}>
                取消
              </Button>
            )}
          </FormItem>
          {this.state.newRule && (
            <div>
              <FormItem label="规则名称" required>
                <Input
                  value={this.state.newRule.title}
                  onChange={this.pChange.bind(null, 'title')}
                  placeholder="请输入规则名称"
                />
              </FormItem>
              <FormItem label="规则编码" help="同任务中的规则编码不可重复" required>
                <Input
                  value={this.state.newRule.code}
                  onChange={this.pChange.bind(null, 'code')}
                  placeholder="请输入规则编码"
                />
              </FormItem>
              <FormItem label="奖励原名称">
                <Input value={this.state.newRule.name} disabled />
              </FormItem>
              <FormItem label="奖励显示名称">
                <Input
                  onChange={this.pChange.bind(null, 'showName')}
                  value={this.state.newRule.showName}
                />
              </FormItem>
              <FormItem label="价值(元)">
                <InputNumber value={this.state.newRule.value} disabled />
              </FormItem>
              <FormItem label="可兑换上限" help="为0时,则无上限">
                <InputNumber
                  min={1}
                  onChange={this.pChange.bind(null, 'max')}
                  value={this.state.newRule.max || 0}
                  width={200}
                />
              </FormItem>
              <FormItem label="达成数据量">
                <InputNumber
                  min={1}
                  onChange={this.pChange.bind(null, 'complete')}
                  value={this.state.newRule.complete || 1}
                />
              </FormItem>
              <FormItem label="数量(件)">
                <InputNumber
                  min={1}
                  onChange={this.pChange.bind(null, 'count')}
                  value={this.state.newRule.count || 1}
                />
              </FormItem>
              <div style={{ textAlign: 'right' }}>
                <Button type="default" onClick={this.cancel}>
                  取消
                </Button>
                {this.state.update === null ? (
                  <Button type="danger" onClick={this.add}>
                    添加规则
                  </Button>
                ) : null}
                {this.state.update !== null ? (
                  <Button type="danger" onClick={this.update}>
                    更新规则
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
        {_.map(this.props.value, (value, i) => {
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
                <div className={styles.title}>{value.title}</div>
                <div className={styles.item}>编码: {value.code}</div>
                <div className={styles.item}>达成: {value.complete}</div>
                <div className={styles.item}>兑换上限: {value.max}</div>
                <div className={styles.item}>奖励: {value.showName}</div>
                <div className={styles.item}>类型: {TYPE}</div>
                <div className={styles.item}>价值: {value.value}元</div>
                <div className={styles.item}>数量: {value.count}件</div>
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
        })}
      </div>
    );
  }
}
