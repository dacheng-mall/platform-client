import React, { PureComponent, Fragment } from 'react';
import { Radio } from 'antd';
import _ from 'lodash';
import { getProductsWithoutPage } from '../../products/services';
import { getPagesWithoutPage } from '../services';
import Selecter from './Selecter';

const TYPES = [
  {
    label: '商品',
    code: 'product',
  },
  {
    label: '页面',
    code: 'page',
  },
  {
    label: '分类',
    code: 'category',
    disabled: true,
  },
];

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let timer;

export default class Selector extends PureComponent {
  state = {
    productOpts: [],
    pageOpts: [],
    itemType: 'product',
  };
  // static getDerivedStateFromProps = (props, state) => {
  //   return null;
  // };
  componentDidMount() {
    if (this.props.value) {
      const { title, id, mainImage, type } = this.props.value;
      const productOpts = [];
      const pageOpts = [];
      const categoryOpts = [];
      const option = { title, id };
      switch (type) {
        case 'product': {
          option.mainImageUrl = mainImage;
          productOpts.push(option);
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
            productOpts: _.map(data, ({ id, title, mainImageUrl }) => ({
              id,
              title,
              mainImageUrl,
              productImage: mainImageUrl,
            })),
          });
          break;
        }
        case 'page': {
          const { data } = await getPagesWithoutPage({ name: title });
          _this.setState({
            pageOpts: _.map(data, ({ id, name: title }) => ({ id, title })),
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
    const { productOpts, pageOpts } = this.state;
    let target;
    switch (type) {
      case 'product': {
        target = _.find(productOpts, ['id', key]);
        break;
      }
      case 'page': {
        target = _.find(pageOpts, ['id', key]);
        break;
      }
      default: {
        break;
      }
    }
    if (_.isFunction(this.props.onSelect)) {
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
      default: {
        return null;
      }
    }
  };
  render() {
    const { itemType } = this.state;
    return (
      <Fragment>
        <RadioGroup onChange={this.typeChange} value={itemType} buttonStyle="solid">
          {_.map(TYPES, ({ code, label, disabled }, i) => (
            <RadioButton disabled={disabled} key={`${code}_${i}`} value={code}>
              {label}
            </RadioButton>
          ))}
        </RadioGroup>
        {this.renderLink(this.state.itemType)}
      </Fragment>
    );
  }
}
