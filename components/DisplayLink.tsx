import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';

const DisplayLink: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [src, setSrc] = useState(props.record.params.link)

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
          미리보기
        </label>
      )}
      <div>
        <img
          width={100}
          id="image"
          alt={props.record.params.code}
          src={
            src
          }
        />
      </div>
    </section>
  );
};

export default DisplayLink;
