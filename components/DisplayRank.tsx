import React, {useEffect, useState} from "react";
import type {ShowPropertyProps} from 'adminjs';
import axios from "axios";

const DisplayRank: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [point, setPoint] = useState(0);
  const [rank, setRank] = useState<number>(null);
  useEffect(() => {
    axios.get<{rank: number, point: number}>('/api/collections/' + props.record.id + '/rank')
      .then((response) => {
        setPoint(response.data.point);
        setRank(response.data.rank);
      })
  }, [props.record.id]);

  return (
    <section style={{marginBottom: props.where === 'show' ? 24 : 0}}>
      {props.where === 'show' && (
        <label
          style={{
            display: 'block',
            fontFamily: 'Roboto, sans-serif',
            fontSize: 12,
            lineHeight: '16px',
            color: 'rgb(137, 138, 154)',
            marginBottom: 4,
            fontWeight: 300,
          }}
          htmlFor="image"
          className="adminjs_Label"
        >
          랭킹
        </label>
      )}
      <div>
        {rank ? `${rank}위 (${point})점` : '랭킹없음'}
      </div>
    </section>
  );
};

export default DisplayRank;
