import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { Layout, Breadcrumb, Button, LocaleProvider } from 'antd';
import Menu from './Components/Menu';
import styles from './index.less';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const { Sider, Header, Content } = Layout;

class BasicLayout extends PureComponent {
  state = {
    menu: [],
  };
  static getDerivedStateFromProps(props, state) {
    return { menu: props.menu };
  }
  logout = () => {
    this.props.dispatch({
      type: 'app/logout'
    })
  }
  render() {
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div>
            <img alt="logo" src={require('../../assets/imgs/logo.png')} style={{width: '44px', borderRadius: '50%', marginRight: '10px'}} />答橙 · 平台管理
          </div>
          {this.props.user ? <div>
            {this.props.user.name}
            <Button style={{marginLeft: '10px'}} size="small" onClick={this.logout} icon="logout" type="default" />
          </div> : null}
        </Header>
        <Layout>
          <Sider className={styles.sider} collapsible theme="dark">
            <Menu data={this.state.menu} currentPath={this.props.location.pathname} />
          </Sider>
          <Content className={styles.contentWrap}>
            <Breadcrumb />
            <div className={styles.content}>
            <LocaleProvider locale={zhCN}>

              {this.props.children}
            </LocaleProvider>
            </div>
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
