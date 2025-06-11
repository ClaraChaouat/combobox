import React from 'react';

const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <React.Fragment>{text}</React.Fragment>;

  const regex = new RegExp(`(${query})`, 'i');
  const parts = text.split(regex);

  return (
    <React.Fragment>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : part))}
    </React.Fragment>
  );
};

export default HighlightedText;
