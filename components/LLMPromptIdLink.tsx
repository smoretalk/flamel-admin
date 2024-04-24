import React, {useState} from "react";
import type {ShowPropertyProps} from 'adminjs';
import { Link, Label } from '@adminjs/design-system'

const LLMPromptIdLink: React.FC<ShowPropertyProps & { where: 'show' | 'list' }> = (
  props,
) => {
  console.log(props.record);
  const [src, setSrc] = useState(props.record.params[props.property.props.linkProp])

  const srcId = Number(src);
  return (
    <section style={{marginBottom: props.where === 'show' ? 24 : 0}}>
      {props.where === 'show' && (
        <Label variant="light">
          {props.property.props.linkLabel}
        </Label>
      )}
      {!Number.isNaN(srcId) && srcId !== 0
        ? <Link variant="success"
                href={`/admin/resources/llmPrompt/records/${srcId}/show`}>{srcId}</Link>
        : <span>{src}</span>
      }
    </section>
  );
};

export default LLMPromptIdLink;
