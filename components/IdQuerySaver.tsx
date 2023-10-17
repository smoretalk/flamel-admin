import React from 'react';
import { type ShowPropertyProps } from 'adminjs';

const IdQuerySaver: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  if (!location.href.includes('actions/exportCsv')) {
    const model = location.pathname.split('/').at(-1);
    localStorage.setItem(
      `query-${model}`,
      new URLSearchParams(location.search).toString(),
    );
  }
  return (
    <section>
      <div>{props.record.params.userId || props.record.params.imageId}</div>
    </section>
  );
};

export default IdQuerySaver;
