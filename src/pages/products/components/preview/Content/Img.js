import React from 'react';

export default function Img(props) {
  const { value, url, name } = props.data;
  const src = (function(v) {
    if (value && typeof v === 'string') {
      return url;
    }
    if (value && typeof v === 'object') {
      return value.url;
    }
  })(value);
  return <img style={{ width: '100%', margin: '0.04rem 0 0' }} src={src} alt={name} />;
}
