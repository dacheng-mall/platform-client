import React from 'react';

export default function Text({ data }) {
  const { align, size = 32, padding, italic, weight, underline, throughline, value } = data;
  let textDecoration = '';
  if (underline) {
    textDecoration += ' underline';
  }
  if (throughline) {
    textDecoration += ' line-through';
  }
  return (
    <div
      style={{
        textAlign: align,
        fontSize: `${size / 2}px`,
        padding: `${padding}px`,
        textDecoration,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight ? 'bold' : 'normal',
      }}
    >
      {value}
    </div>
  );
}
