import React, { FC, useState } from 'react';
import type { ActionProps } from 'adminjs';
import { saveAs } from 'file-saver';
import format from 'date-fns/format';
import axios from 'axios';

export const getExportedFileName = (extension: string) =>
  `export-${format(Date.now(), 'yyyy-MM-dd_HH-mm')}.${extension}`;

const ExportCsv: FC<ActionProps> = ({ resource }) => {
  const [isFetching, setFetching] = useState<boolean>();
  const filter: Record<string, string> = {};
  const query = new URLSearchParams(
    location.search || localStorage.getItem('query'),
  );
  for (const entry of query.entries()) {
    const [key, value] = entry;
    if (key.match('filters.')) {
      filter[key.replace('filters.', '')] = value;
    }
  }

  const exportData = async () => {
    setFetching(true);
    try {
      const {
        data: { exportedData },
      } = await axios
        .create({
          baseURL: '/admin',
        })
        .request({
          url: `/api/resources/${resource.id}/actions/exportCsv`,
          method: 'POST',
          params: {
            filter,
          },
        });

      const blob = new Blob([exportedData], { type: 'text/csv' });
      saveAs(blob, getExportedFileName('csv'));
    } catch (e) {
      console.error(e);
    }
    setFetching(false);
  };

  const onClose = () => {
    history.back();
  };

  return (
    <div>
      <button onClick={exportData} disabled={isFetching}>
        CSV 다운로드
      </button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default ExportCsv;
