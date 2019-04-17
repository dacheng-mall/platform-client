import React from 'react';

const source = window.config.source;

export default function Img(props) {
  const { value, name } = props.data;
  const src = (function(v) {
    if (v && typeof v === 'string') {
      return `${source}${v}` ;
    }
    if (v && typeof v === 'object') {
      return v.url;
    }
  })(value);
  return <img style={{ width: '100%', margin: '0.04rem 0 0' }} src={src} alt={name} />;
}
