import React, { PureComponent, Fragment } from 'react';
import { Radio } from 'antd';
import _ from 'lodash';
import { getProductsWithoutPage, getCate } from '../../products/services';
import { getPagesWithoutPage } from '../services';
import { find as getActivitiesWithoutPage } from '../../activity/services/activity';
import Selecter from './Selecter';

const TYPES = [
  {
    label: '商品',
    code: 'product',
  },
  {
    label: '商品分类',
    code: 'category',
  },
  {
    label: '页面',
    code: 'page',
  },
  {
    label: '活动',
    code: 'activity',
  },
  {
    label: '系统功能',
    code: 'function',
  },
];
const FUNCTIONS = [
  { id: 'scan', title: '扫一扫' },
  { id: 'code-personal', title: '我的个人码' },
  { id: 'code-attendance', title: '签到码' },
  { id: 'code-visit', title: '拜访码' },
  { id: 'infomation', title: '个人信息' },
];
const NONE_OPT = { id: 'clear', name: '清空选项', title: '清空选项' };

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let timer;

export default class Selector extends PureComponent {
  state = {
    productOpts: [],
    pageOpts: [],
    activitesOpts: [],
    categoryOpts: [],
    functionOpts: [...FUNCTIONS],
    itemType: 'product',
  };
  componentDidMount() {
    if (this.props.value) {
      const { title, id, image, type } = this.props.value;
      const productOpts = [NONE_OPT];
      const pageOpts = [NONE_OPT];
      const activityOpts = [NONE_OPT];
      const categoryOpts = [NONE_OPT];
      const option = { title, id, image };
      switch (type) {
        case 'product': {
          const { productImage, price, institutionId } = this.props.value;
          option.mainImageUrl = productImage;
          option.price = price;
          option.institutionId = institutionId;
          option.productImage = productImage;
          productOpts.push(option);
          break;
        }
        case 'activity': {
          activityOpts.push(option);
          break;
        }
        case 'page': {
          pageOpts.push(option);
          break;
        }
        case 'category': {
          categoryOpts.push(option);
          break;
        }
        default: {
          return;
        }
      }
      this.setState({
        itemType: type,
        productOpts,
        pageOpts,
        activityOpts,
        categoryOpts,
      });
    }
  }
  typeChange = (e) => {
    const { value } = e.target;
    this.setState({ itemType: value });
    if (_.isFunction(this.props.changeType)) {
      this.props.changeType(value);
    }
  };
  onSearch = (type, title) => {
    if (timer) {
      clearTimeout(timer);
    }
    const _this = this;
    timer = setTimeout(async function() {
      switch (type) {
        case 'product': {
          const { data } = await getProductsWithoutPage({ title });
          _this.setState({
            productOpts: _.map(
              [NONE_OPT, ...data],
              ({ id, title, mainImageUrl, price, institutionId, name }) => ({
                id,
                title,
                price,
                institutionId, // 判断是否自营, 如果是空字符串则为自营
                productImage: mainImageUrl,
              }),
            ),
          });
          break;
        }
        case 'activity': {
          const { data } = await getActivitiesWithoutPage({ name: title, status: 1 });
          console.log(data);
          _this.setState({
            activityOpts: _.map([NONE_OPT, ...data], ({ id, name: title }) => ({ id, title })),
          });
          break;
        }
        case 'page': {
          const { data } = await getPagesWithoutPage({ name: title });
          _this.setState({
            pageOpts: _.map([NONE_OPT, ...data], ({ id, name: title }) => ({ id, title })),
          });
          break;
        }
        case 'category': {
          const { data } = await getCate({ name: title });
          _this.setState({
            categoryOpts: _.map([NONE_OPT, ...data], ({ id, name: title }) => ({ id, title })),
          });
          break;
        }
        default: {
          return;
        }
      }
      clearTimeout(timer);
      timer = null;
    }, 300);
  };
  choose = (type, key) => {
    const target = _.find(this.state[`${type}Opts`], ['id', key]);
    if (_.isFunction(this.props.onSelect) && target) {
      this.props.onSelect({ ...target, type });
    }
  };

  renderLink = (itemType) => {
    switch (itemType) {
      case 'product': {
        return (
          <Selecter
            onSearch={this.onSearch.bind(null, 'product')}
            onChange={this.choose.bind(null, 'product')}
            placeholder="请输入关键字搜索商品"
            value={this.props.value.id}
            options={this.state.productOpts}
            type="productOpts"
          />
        );
      }
      case 'activity': {
        return (
          <Selecter
            onSearch={this.onSearch.bind(null, 'activity')}
            onChange={this.choose.bind(null, 'activity')}
            placeholder="请输入关键字搜索活动"
            value={this.props.value.id}
            options={this.state.activityOpts}
            type="activityOpts"
          />
        );
      }
      case 'page': {
        return (
          <Selecter
            onSearch={this.onSearch.bind(null, 'page')}
            onChange={this.choose.bind(null, 'page')}
            placeholder="请输入关键字搜索页面"
            value={this.props.value.id}
            options={this.state.pageOpts}
            type="pageOpts"
          />
        );
      }
      case 'category': {
        return (
          <Selecter
            onSearch={this.onSearch.bind(null, 'category')}
            onChange={this.choose.bind(null, 'category')}
            placeholder="请输入关键字搜索商品分类"
            value={this.props.value.id}
            options={this.state.categoryOpts}
            type="categoryOpts"
          />
        );
      }
      case 'function': {
        return (
          <Selecter
            onChange={this.choose.bind(null, 'function')}
            placeholder="请选择系统功能"
            value={this.props.value.id}
            options={this.state.functionOpts}
            type="functionOpts"
          />
        );
      }
      default: {
        return null;
      }
    }
  };
  render() {
    const { itemType } = this.state;
    console.log()
    return (
      <Fragment>
        {!this.props.staticType ? (
          <RadioGroup onChange={this.typeChange} value={itemType} buttonStyle="solid">
            {_.map(TYPES, ({ code, label, disabled }, i) => (
              <RadioButton disabled={disabled} key={`${code}_${i}`} value={code}>
                {label}
              </RadioButton>
            ))}
          </RadioGroup>
        ) : null}
        {this.renderLink(this.props.staticType || this.state.itemType)}
      </Fragment>
    );
  }
}
