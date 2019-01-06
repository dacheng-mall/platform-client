import React from "react";
import { Icon } from "antd";

export default function() {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: '0.2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#ccc'
      }}
    >
      <Icon type="loading" />
      <div>-加载中-</div>
    </div>
  )
}
