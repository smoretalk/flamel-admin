import React, {ChangeEventHandler, useState} from "react";
import {Button, FormGroup, Label } from "@adminjs/design-system";
import {EditPropertyProps} from "adminjs";
import axios from "axios";

export default function AddEditedImage(props: EditPropertyProps) {
  const {record} = props
  const [file, setFile] = useState<File>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    setFile(e.target.files[0]);
  }

  const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) {
      return alert('파일을 업로드하세요.');
    }
    const formData = new FormData();
    formData.append('file', file);
    axios.post(`/api/images/${record.id}/editedImage`, formData)
      .then((response) => {
        alert('편집 이미지를 추가했습니다.');
        location.href = `/admin/resources/Style/records/${response.data.imageId}/show`;
      })
      .catch(console.error);
  }

  return (
    <FormGroup>
      <Label>편집 이미지 추가</Label>
      <input type="file" accept="image/*" onChange={handleChange}/>
      <Button onClick={onCopy}>확인</Button>
    </FormGroup>
  )
}
