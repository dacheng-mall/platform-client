import React, { useState } from 'react';
import { Form, Button, Input, Col, Row, Select } from 'antd';
import { connect } from 'dva';
import { post } from '../../../utils/request';
import _ from 'lodash';

function QrCreate(props) {
  const [url, setUrl] = useState('');
  const [page, setPage] = useState('pages/activity/detail');
  const [scene, setScene] = useState('?autoId=9');
  const [size, setSize] = useState(430);
  const onChange = (type, e) => {
    switch (type) {
      case 'page': {
        const value = e.target.value;
        setPage(value);
        break;
      }
      case 'scene': {
        const value = e.target.value;
        setScene(value);
        break;
      }
      case 'size': {
        setSize(e);
        break;
      }
    }
  };
  const onGeneration = (e) => {
    e.preventDefault();
    console.log(page, scene, size);
    post('v1/api/wx/createWXAQRCode', { page, scene }).then((blobObj) => {
      // var a = new FileReader();
      const src = `data:image/jpg;base64,${blobObj.data}`
      setUrl(src)
      // return
      // a.readAsDataURL(blobObj.data);
      // a.onload = function(e) {
      //   console.log(e.target.result);
      //   setUrl(e.target.result)
      // };
      // console.log('blobObj', window.URL.createObjectURL(blobObj.data))
      // setUrl(window.URL.createObjectURL(blobObj.data))
      // console.log(new Blob(data))
      // setUrl(url)
      // const r = new FileReader();
      // r.readAsDataURL(blobObj.data);
      // r.onload = function(e) {
      //   let base64 = e.target.result;
      //   console.log('base64', base64)
      //   setUrl(blobObj.data)
      // }
      // const canvas = document.createElement('canvas')
      // canvas.toBlob(function () {
      //   console.log(blobObj)
      //   let imgSrc = window.URL.createObjectURL(blobObj)
      //   // document.getElementById('img').src = imgSrc
      //   setUrl(imgSrc)
      // })
    });
  };
  return (
    <Row>
      <Col span={8}>
        <Button onClick={onGeneration} type="primary">
          生成二维码
        </Button>
        <Form>
          <Form.Item label="页面(page)">
            <Input
              placeholder="请输入小程序页面路径名称"
              onChange={onChange.bind(null, 'page')}
              defaultValue={page}
            />
          </Form.Item>
          <Form.Item label="参数(scene)">
            <Input
              placeholder="请输入参数"
              onChange={onChange.bind(null, 'scene')}
              defaultValue={scene}
            />
          </Form.Item>
          <Form.Item label="尺寸(size)">
            <Select
              placeholder="请选择二维码尺寸"
              onChange={onChange.bind(null, 'size')}
              defaultValue={size}
            >
              <Select.Option value={280}>小(280px)</Select.Option>
              <Select.Option value={430}>中(430px)</Select.Option>
              <Select.Option value={1280}>大(1280px)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>{url ? <img src={url} /> : '暂无二维码'}</Col>
    </Row>
  );
}
function mapStateToProps({ qrCreate }) {
  return qrCreate;
}
export default connect(mapStateToProps)(QrCreate);
