import React, { PureComponent } from 'react';
import { Menu as MenuAntd } from 'antd';
import _ from 'lodash';
import { jump } from '../../../../utils';
import styles from './index.less';

const { Item, SubMenu } = MenuAntd;

const parsePathname = (pathname, state) => {
  const keyPath = pathname.replace(/^\//, '').split('/');
  const page = keyPath[keyPath.length - 1];
  if (keyPath.length > 1) {
    const openKeys = keyPath.slice(0, keyPath.length - 1);
    return { ...state, openKeys, page };
  }
  return { ...state, page };
};

export default class Menu extends PureComponent {
  state = {
    currentPath: this.props.currentPath,
    openKeys: [],
    page: '',
  };
  static getDerivedStateFromProps = (props, state) => {
    return parsePathname(props.currentPath, state);
  };
  renderItems = data => {
    return _.map(data, (d, index) => {
      if (d.authority) {
        if (d.children && d.children.length > 0) {
          return (
            <SubMenu title={d.name} key={d.path} onTitleClick={this.clickSub}>
              {this.renderItems(d.children, d.path)}
            </SubMenu>
          );
        }
        return (
          <Item key={d.path} title={d.name}>
            {d.name}
          </Item>
        );
      }
      return null;
    });
  };
  clickHandler = e => {
    const path = `/${e.keyPath.reverse().join('/')}`;
    // 限制不跳转到自身
    if (this.props.currentPath !== path) {
      jump(path);
    }
  };
  render() {
    if (!this.props.data) {
      return null;
    }
    return (
      <div className={styles.menuWrap}>
        <MenuAntd
          defaultOpenKeys={this.state.openKeys}
          defaultSelectedKeys={[this.state.page]}
          mode="inline"
          onClick={this.clickHandler}
          theme="light"
        >
          {this.renderItems(this.props.data)}
        </MenuAntd>
      </div>
    );
  }
}
