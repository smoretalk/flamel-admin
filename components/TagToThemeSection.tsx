import {
  Box,
  Button,
  DatePicker,
  DropDown,
  DropDownItem,
  H5,
  Icon,
  Input,
  Label,
  Select,
  Text
} from "@adminjs/design-system";
import React, {ChangeEvent, FormEvent, useState} from "react";
import Card from "./Card.js";
import {useTranslation} from "adminjs";
import axios from "axios";

export default function TagToThemeSection({}) {
  const { translateMessage } = useTranslation();
  const [tag, setTag] = useState('');
  const [themeId, setThemeId] = useState<number | null>(null);

  function onChangeTag(e: ChangeEvent<HTMLInputElement>) {
    setTag(e.target.value);
  }

  function onChangeTheme(e: ChangeEvent<HTMLInputElement>) {
    setThemeId(parseInt(e.target.value, 10));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log('submitting', tag, themeId);
    try {
      await axios.patch(`/api/collection/tags/${tag}/connectTheme?themeId=${themeId}`, {}, {
        timeout: 60_000,
      });
      setTag('');
      alert("태그가 추가되었습니다");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response.data?.data);
      }
    }
  }

  return (
    <Box width={[1, 1, 1 / 2]} p="lg">
      <Card as="form" onSubmit={onSubmit}>
        <Icon icon="Gift" />
        <H5 mt="lg">{translateMessage('tagToTheme_title')}</H5>
        <Box><Label>태그</Label><Input onChange={onChangeTag} type="text" placeholder="입력" required value={tag} style={{width: '100%'}} /></Box>
        <Box><Label>대주제아이디</Label><Input onChange={onChangeTheme} type="number" placeholder="숫자" required value={themeId} style={{width: '100%'}} /></Box>
        <Box><Button variant="contained" onClick={onSubmit}>추가</Button></Box>
      </Card>
    </Box>
  )
}
