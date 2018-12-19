import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.less';

const { Sider, Header, Content, Footer } = Layout;

class BasicLayout extends PureComponent {
  render(){
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>header</Header>
        <Layout>
          <Sider className={styles.sider}>
            <Menu />
          </Sider>
          <Content>
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
export default connect(mapStateToProps)(BasicLayout);
