import React, { useEffect, useState, Fragment } from 'react';
import { Input, Button, Checkbox, Form, Icon } from 'antd';
import { connect } from 'dva';
import Particleground from 'particleground-light';
import styles from './index.less';

function Login({ form: { getFieldDecorator, validateFields, getFieldValue }, dispatch }) {
  useEffect(() => {
    new Particleground(document.getElementById('loginWrap'), {
      dotColor: '#5cbdaa',
      lineColor: '#5cbdaa',
    });
  }, []);
  const [RM, setRM] = useState(true);
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
  const remember = (e) => {
    console.log('e', e);
    setRM(e.target.checked);
    if (e.target.checked) {
      const username = getFieldValue('username');
      console.log('username', username);
      if (username && username.trim()) {
        localStorage.setItem('username', username);
      }
    } else {
      localStorage.removeItem('username');
    }
  };
  let timers;
  const changeUsername = (e) => {
    if (RM) {
      if (timers) {
        clearTimeout(timers);
      }
      timers = setTimeout(() => {
        const username = getFieldValue('username');
        localStorage.setItem('username', username);
      }, 300);
    }
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
            <img src={require('../../assets/imgs/logo.jpg')} alt="logo" />
            <div>智惠工牌 - 数据中心</div>
          </div>
          <Form onSubmit={submit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
                initialValue: localStorage.getItem('username')
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  onChange={changeUsername}
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
            <Checkbox onChange={remember} checked={RM}>
              在这台计算机上记住我的用户名
            </Checkbox>
            <Button type="primary" htmlType="submit" className={styles.button}>
              登录
            </Button>
          </Form>
        </div>
        <div
          style={{ position: 'absolute', bottom: '10px', fontSize: '14px', textAlign: 'center' }}
        >
          <div style={{ color: '#fff' }}>浙江米棉有电子商务有限公司</div>
          <a style={{ color: '#fff' }} href="http://www.beian.miit.gov.cn" target="_blank">
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
