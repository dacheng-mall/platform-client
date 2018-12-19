import React, { PureComponent } from 'react';
import _ from 'lodash';
import { jump } from '../../../../utils';
// import { icon } from '../../../../utils/ui';
import styles from './index.less';

const Item = ({ data, activity }) => {
  return (
    <div className={styles[activity ? 'activity' : 'item']} data-path={data.path}>
      {/* {icon(data.icon)} */}
      {data.name}
    </div>
  );
};

export default class Menu extends PureComponent {
  renderItems = data => {
    return _.map(data, (d, index) => {
      if (d.authority) {
        return (
          <Item
            key={index}
            data={d}
            activity={_.includes(this.props.pathname, d.path)}
            authority={d.authority}
          />
        );
      }
      return null;
    });
  };
  clickHandle = e => {
    e.stopPropagation();
    e.preventDefault();
    let path = e.target.dataset.path;
    if (!path) {
      path = e.target.parentNode.dataset.path;
    }
    if (this.props.pathname !== path) {
      jump(path);
    }
  };
  render() {
    return (
      <div onClick={this.clickHandle} className={styles.menuWrap}>
        {this.renderItems(this.props.data)}
      </div>
    );
  }
}
