import React, { useEffect, Fragment } from 'react';
import { Input, Button, Checkbox, Form, Icon } from 'antd';
import { connect } from 'dva';
import Particleground from 'particleground-light';
import styles from './index.less';

function Login({ form: { getFieldDecorator, validateFields }, dispatch }) {
  useEffect(() => {
    new Particleground(document.getElementById('loginWrap'), {
      dotColor: '#5cbdaa',
      lineColor: '#5cbdaa',
    });
  }, []);
  const submit = (e) => {
    e.preventDefault();
    validateFields((err, val) => {
      if (!err) {
        dispatch({
          type: 'app/login',
          payload: val,
        });
      }
    });
  };
  return (
    <Fragment>
      <div
        id="loginWrap"
        style={{
          backgroundColor: '#009973',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <div className={styles.login}>
        <div className={styles.formWrap}>
          <div className={styles.title}>
            <img src={require('../../assets/imgs/logo.png')} alt="logo" />
            <div>
              欢迎登录礼全有管理端
            </div>
          </div>
          <Form onSubmit={submit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Checkbox>在这台计算机上记住我的信息</Checkbox>
            <Button type="primary" htmlType="submit" className={styles.button}>
              登录
            </Button>
          </Form>
        </div>
        <div style={{ position: 'absolute', bottom: '10px', fontSize: '14px', textAlign: 'center' }}>
          <div style={{color: '#fff'}}>河南洋白菜电子商务有限公司</div>
          <a style={{color: '#fff'}} href="http://www.beian.miit.gov.cn" target="_blank">
            豫ICP备18044641号
          </a>
        </div>
      </div>
    </Fragment>
  );
}

function mapStateToProps({ app }) {
  return app;
}

export default connect(mapStateToProps)(Form.create()(Login));
