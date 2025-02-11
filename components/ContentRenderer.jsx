import React from 'react';

const ContentRenderer = ({ content, isHTML }) => {
  if (isHTML) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-base text-primary"
      />
    );
  }
  return <p className="text-base text-primary">{content}</p>;
};

export default ContentRenderer;
