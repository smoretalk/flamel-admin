import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';

const DisplayStyleImage: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [errored, setErrored] = useState(false);
  const [src, setSrc] = useState(() => {
    const referenceLink: string = props.record.params[props.property.props.target];
    if (referenceLink) {
      if (referenceLink.startsWith('/api/collections')) {
        return referenceLink;
      } else if (referenceLink.startsWith('/api/images/reference/')) {
        const name = referenceLink.replace('/api/images/reference/', '');
        return `/api/admin/owners/${props.record.params.userId}/images/${name}/thumb`
      } else if (referenceLink.startsWith('/api/images/')) {
        const id = parseInt(referenceLink.replace('/api/images/', ''));
        return `/api/admin/images/${id}/thumb`;
      }
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
          alt={props.record.params.styleId}
          onError={onError}
          src={
            src
          }
        />
      </div>
    </section>
  );
};

export default DisplayStyleImage;
