import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { Layout, Breadcrumb } from 'antd';
import Menu from './Components/Menu';
import styles from './index.less';

const { Sider, Header, Content } = Layout;

class BasicLayout extends PureComponent {
  state = {
    menu: [],
  };
  static getDerivedStateFromProps(props, state) {
    return { menu: props.menu };
  }
  render() {
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>答橙 · 平台管理</Header>
        <Layout>
          <Sider className={styles.sider} collapsible theme="dark">
            <Menu data={this.state.menu} currentPath={this.props.location.pathname} />
          </Sider>
          <Content className={styles.contentWrap}>
            <Breadcrumb />
            <div className={styles.content}>{this.props.children}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
function mapStateToProps({ app }) {
  return app;
}
export default withRouter(connect(mapStateToProps)(BasicLayout));
