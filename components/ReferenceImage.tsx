import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';

const ReferenceImage: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [errored, setErrored] = useState(false);
  const [src, setSrc] = useState(() => {
    console.log(props.record);
    const referenceLink = props.record.params.GenerationInfo?.referenceLink;
    if (referenceLink) {
      return `/api/admin/${referenceLink.split('/')[0]}/images/${referenceLink.split('/')[1]}/thumb`
    }
    return '';
  })

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

export default ReferenceImage;
