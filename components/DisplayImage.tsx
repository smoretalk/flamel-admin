import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';

const DisplayImage: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [errored, setErrored] = useState(false);
  const [src, setSrc] = useState(props.record.params[props.property.path].replace(/\/api\/users\//, '/api/admin/').replace(/\/api\/collections\//, `/api/admin/${props.record.params.ownerId || 0}/images/`) +
    '/thumb')

  const onError = () => {
    if (!errored) {
      setErrored(true);
      setSrc((prev) => prev?.replace("/thumb", ""));
    }
  };

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
          alt={props.record.params.originalPrompt}
          onError={onError}
          src={
            src
          }
        />
      </div>
    </section>
  );
};

export default DisplayImage;
