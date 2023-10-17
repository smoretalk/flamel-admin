import React from 'react';
import { type ShowPropertyProps } from 'adminjs';

const IdQuerySaver: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  if (!location.href.includes('actions/exportCsv')) {
    localStorage.setItem(
      'query',
      new URLSearchParams(location.search).toString(),
    );
    localStorage.setItem(
      'model',
      location.pathname.split('/').at(-1)
    );
  }
  return (
    <section>
      <div>{props.record.params.userId || props.record.params.imageId}</div>
    </section>
  );
};

export default IdQuerySaver;
