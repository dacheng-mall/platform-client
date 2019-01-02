import React from 'react';

export default function({ text }) {
  return (
    <div style={{ color: '#ccc', textAlign: 'center', padding: '20px' }}>{text || '暂无内容'}</div>
  );
}
