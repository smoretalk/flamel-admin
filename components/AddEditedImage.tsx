import React, { ChangeEventHandler, useState } from "react";
import { Button, FormGroup, Label, CheckBox } from "@adminjs/design-system";
import { EditPropertyProps } from "adminjs";
import axios from "axios";

export default function AddEditedImage(props: EditPropertyProps) {
  const { record } = props;
  const [file, setFile] = useState<File>(null);
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    setFile(e.target.files[0]);
  };

  const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) {
      return alert("파일을 업로드하세요.");
    }
    const formData = new FormData();
    formData.append("bgRemoved", isBackgroundRemoved.toString());
    formData.append("file", file);
    axios
      .post(`/api/images/${record.id}/editedImage`, formData)
      .then((response) => {
        alert("편집 이미지를 추가했습니다.");
        location.href = `/admin/resources/Image/records/${response.data.imageId}/show`;
      })
      .catch(console.error);
  };

  return (
    <FormGroup>
      <div>
        <Label>편집 이미지 추가</Label>
        <input type="file" accept="image/*" onChange={handleChange} />
      </div>
      <div>
        <Label>배경 제거된 이미지?</Label>
        <CheckBox
          checked={isBackgroundRemoved}
          onChange={() => {
            setIsBackgroundRemoved(!isBackgroundRemoved);
          }}
        />
      </div>
      <Button onClick={onCopy}>추가하기</Button>
    </FormGroup>
  );
}
