import React, { useState } from "react";
import { Button, FormGroup, Label } from "@adminjs/design-system";
import axios from "axios";
export default function AddEditedImage(props) {
    const { record } = props;
    const [file, setFile] = useState(null);
    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };
    const onCopy = (e) => {
        e.preventDefault();
        if (!file) {
            return alert('파일을 업로드하세요.');
        }
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`/api/images/${record.id}/editedImage`, formData)
            .then((response) => {
            alert('편집 이미지를 추가했습니다.');
            location.href = `/admin/resources/Image/records/${response.data.imageId}/show`;
        })
            .catch(console.error);
    };
    return (React.createElement(FormGroup, null,
        React.createElement(Label, null, "\uD3B8\uC9D1 \uC774\uBBF8\uC9C0 \uCD94\uAC00"),
        React.createElement("input", { type: "file", accept: "image/*", onChange: handleChange }),
        React.createElement(Button, { onClick: onCopy }, "\uD655\uC778")));
}
//# sourceMappingURL=AddEditedImage.js.map