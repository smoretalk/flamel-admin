import React from 'react';
import { type ShowPropertyProps } from 'adminjs';

const DisplayImage: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  console.log('href', location.href, props);
  if (!location.href.includes('actions/exportCsv')) {
    localStorage.setItem(
      'query',
      new URLSearchParams(location.search).toString(),
    );
  }
  return (
    <section>
      <div>{props.record.params.id}</div>
    </section>
  );
};

export default DisplayImage;
