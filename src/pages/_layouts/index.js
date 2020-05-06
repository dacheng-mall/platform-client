import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import {
  Layout,
  Breadcrumb,
  Button,
  Icon,
  Form,
  LocaleProvider,
  Dropdown,
  Modal,
  Menu as MenuX,
  Input,
  message,
} from 'antd';
import Menu from './Components/Menu';
import styles from './index.less';
import { FormItem, mapPropsToFields } from '../../utils/ui';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const { Sider, Header, Content } = Layout;

class BasicLayout extends PureComponent {
  state = {
    menu: [],
    dropMenu: [],
    showPWEditor: false,
    showPW: false,
  };
  static getDerivedStateFromProps(props, state) {
    return { menu: props.menu };
  }
  logout = () => {
    this.props.dispatch({
      type: 'app/logout',
    });
  };
  changePW = (show) => {
    this.setState({
      showPWEditor: show,
    });
  };
  showPassword = () => {
    this.setState({
      showPW: !this.state.showPW,
    });
  };
  submitPW = () => {
    const { validateFields } = this.props.form;
    validateFields((err, val) => {
      if (!err) {
        console.log(val);
        if (val.oldpassword === val.newpassword) {
          message.warning('新旧密码一样, 不需要修改');
          return;
        }
        this.props.dispatch({
          type: 'app/changePassword',
          payload: val,
        });
      }
    });
  };
  render() {
    const menu = (
      <MenuX>
        <MenuX.Item>
          <a onClick={this.changePW.bind(this, true)}>修改密码</a>
        </MenuX.Item>
      </MenuX>
    );
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div>
            <img
              alt="logo"
              src={require('../../assets/imgs/logo.jpg')}
              style={{ width: '44px', borderRadius: '50%', marginRight: '10px' }}
            />
            智惠工牌 - 数据中心
          </div>
          {this.props.user ? (
            <div>
              <Dropdown overlay={menu}>
                <a
                  style={{ color: '#fff', marginRight: '20rpx' }}
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  {this.props.user.userType === 1 ? '平台' : this.props.user.institutionName}-
                  {this.props.user.name}
                  <Icon type="down" />
                </a>
              </Dropdown>
              <Button
                style={{ marginLeft: '10px' }}
                size="small"
                onClick={this.logout}
                icon="logout"
                type="default"
              />
              <Modal
                title="修改密码"
                visible={this.state.showPWEditor}
                onCancel={this.changePW.bind(this, false)}
                onOk={this.submitPW}
              >
                <div style={{ margin: '0 48px', textAlign: 'right' }}>
                  <a onClick={this.showPassword}>{this.state.showPW ? '隐藏密码' : '显示密码'}</a>
                </div>
                <Form layout="horizontal">
                  <FormItem label="原密码" help="请输入原密码">
                    {getFieldDecorator('oldpassword', {
                      rules: [{ required: true, message: '必填项' }],
                    })(
                      <Input
                        type={this.state.showPW ? 'text' : 'password'}
                        placeholder="请输入原密码"
                      />,
                    )}
                  </FormItem>
                  <FormItem label="新密码" help="请输入新密码">
                    {getFieldDecorator('newpassword', {
                      rules: [{ required: true, message: '必填项' }],
                    })(
                      <Input
                        type={this.state.showPW ? 'text' : 'password'}
                        placeholder="请输入新密码"
                      />,
                    )}
                  </FormItem>
                </Form>
              </Modal>
            </div>
          ) : null}
        </Header>
        <Layout>
          <Sider className={styles.sider} collapsible theme="dark">
            <Menu data={this.state.menu} currentPath={this.props.location.pathname} />
          </Sider>
          <Content className={styles.contentWrap}>
            <Breadcrumb />
            <div className={styles.content}>
              <LocaleProvider locale={zhCN}>{this.props.children}</LocaleProvider>
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
export default withRouter(connect(mapStateToProps)(Form.create({ mapPropsToFields })(BasicLayout)));
