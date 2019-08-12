import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash';
import Products from './item';
import Selector from './selector';

/**
 * 本来打算用stateless component, 但是报了个warning:
 * ---------------
 * Function components cannot be given refs.
 * Attempts to access this ref will fail. Did you mean to use React.forwardRef()
 * ---------------
 * 其实我并不需要ref, 不知道怎么的react认为我需要createRef...
 * 还是改用有状态的吧
 */

export default class LinkProduct extends PureComponent {
  onChange = (value, type, index) => {
    let newVal = _.cloneDeep(this.props.value);
    switch (type) {
      case 'add': {
        if (newVal.length > 4) {
          return;
        }
        newVal.push(value);
        break;
      }
      case 'update': {
        newVal[index] = value;
        break;
      }
      case 'up': {
        const target = newVal.splice(index, 1)[0];
        newVal.splice(index - 1, 0, target);
        break;
      }
      case 'down': {
        const target = newVal.splice(index, 1)[0];
        newVal.splice(index + 1, 0, target);
        break;
      }
      case 'remove': {
        newVal = _.filter(newVal, (v, i) => i !== index);
        break;
      }
      default: {
      }
    }
    this.props.onChange(newVal);
  };
  renderProducts = (data = []) => {
    if(data.length < 1) {
      return <div style={{color: '#ccc'}}>请添加商品</div>
    }
    return _.map(data, (d, i) => (
      <Products
        key={`prod_${i}`}
        isTail={i === data.length - 1}
        isHeader={i === 0}
        value={d}
        index={i}
        onChange={this.onChange}
      />
    ));
  };
  render() {
    return (
      <Fragment>
        {this.props.value.length > 4 ? null : <Selector onChange={this.onChange} />}
        {this.renderProducts(this.props.value)}
      </Fragment>
    );
  }
}
