import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';

const ReferenceImageBig: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  const [errored, setErrored] = useState(false);
  const [src, setSrc] = useState(() => {
    const referenceLink = props.record.params[props.property.props.name || 'GenerationInfo.referenceLink'];
    if (referenceLink) {
      if (referenceLink.includes('/')) {
        return `/api/admin/owners/${referenceLink.split('/')[0]}/images/${referenceLink.split('/')[1]}`
      }
      return `/api/admin/images/${referenceLink}/binary`;
    }
    return '';
  })

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
          참고 이미지
        </label>
      )}
      <div>
        <img
          width={512}
          id="image"
          alt={props.record.params.originalPrompt}
          src={src}
        />
        {src}
      </div>
    </section>
  );
};

export default ReferenceImageBig;
