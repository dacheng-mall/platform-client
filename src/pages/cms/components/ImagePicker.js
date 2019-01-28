import React from 'react';
import { Button } from 'antd';
import Uploader from '../../Components/Uploader';

export default function(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Uploader fileList={props.fileList} onChange={props.onChange} />
      <Button.Group>
        <Button onClick={props.resetImage}>还原</Button>
        {props.oriented.productImage ? (
          <Button onClick={props.userProductImage}>
            使用商品主图
          </Button>
        ) : null}
      </Button.Group>
    </div>
  );
}
