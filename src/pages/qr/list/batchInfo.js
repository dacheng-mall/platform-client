import React from 'react';
import _ from 'lodash';

export default function BatchInfo({ batch, type }) {
  if (!batch || !type) {
    return '查询中...';
  }
  const status = (function(s) {
    switch (s) {
      case 0: {
        return '未制作';
      }
      case 1: {
        return '制码中...';
      }
      case 2:
      case 3: {
        return '空闲';
      }
    }
  })(batch.status);
  const fields = (function(f) {
    if (!f) {
      return '不采集';
    }
    const _f = JSON.parse(f);
    return _.map(_f, ({ label }, i) => label).join(',');
  })(type.fields);
  return (
    <div style={{ clear: 'both', overflow: 'hidden' }}>
      {batch ? (
        <div style={{ float: 'left', width: '45%' }}>
          <ul>
            <li>
              <span>批次名称: </span>
              {batch.name}
            </li>
            <li>
              <span>批次序号: </span>
              {batch.autoId}
            </li>
            <li>
              <span>码总数: </span>
              {batch.total}
            </li>
            <li>
              <span>制码状态: </span>
              {status}
            </li>
          </ul>
        </div>
      ) : null}
      {type ? (
        <div style={{ float: 'right', width: '45%' }}>
          <ul>
            <li>
              <span>类型名称: </span>
              {type.name}
            </li>
            <li>
              <span>采集信息: </span>
              {fields}
            </li>
            <li>
              <span>类型描述: </span>
              {type.description}
            </li>
            <li>
              <span>是否强制绑定业务员: </span>
              {type.bindSalesman ? '是' : '否'}
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
