import React from 'react';

export default function Text({data}) {
  const {align, size = 32, padding, italic, weight, value} = data;
  return (
    <div style={{
      textAlign: align,
      fontSize: `${size / 2}px`,
      padding: `${padding}px`,
      textDecoration: italic ? 'italic' : 'none',
      fontWeight: weight
    }}>{value}</div>
  )
}
