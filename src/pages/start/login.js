import { Input, Button, Checkbox, Form, Icon } from 'antd';
import { connect } from 'dva';
import { jump } from '../../utils/index';
import styles from './index.less';

function Login({ form: { getFieldDecorator, validateFields }, dispatch }) {
  const go = () => {
    // e.preventDefault();
    jump('overview');
  };
  const submit = e => {
    e.preventDefault();
    validateFields((err, val) => {
      if (!err) {
        console.log(val);
        go();
        dispatch({
          type: 'app/login',
        });
      }
    });
  };
  return (
    <div className={styles.login}>
      <div className={styles.formWrap}>
        <Form onSubmit={submit}>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />
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
              />
            )}
          </Form.Item>
          <Checkbox>在这台计算机上记住我的信息</Checkbox>
          <Button type="primary" htmlType="submit" className={styles.button}>
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
}

function mapStateToProps({ app }) {
  return app;
}

export default connect(mapStateToProps)(Form.create()(Login));
