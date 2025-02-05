import {
  Box,
  Button,
  H5,
  Icon,
  Input,
  Label,
} from "@adminjs/design-system";
import React, {ChangeEvent, FormEvent, useState} from "react";
import Card from "./Card.js";
import {useTranslation} from "adminjs";
import axios from "axios";

export default function TagToThemeSection({}) {
  const { translateMessage } = useTranslation();
  const [tags, setTags] = useState<string[]>(['']);
  const [themeId, setThemeId] = useState<number | null>(null);

  function onChangeTag(index: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setTags((prev) => {
        const next = [...prev];
        next[index] = e.target.value;
        return next;
      });
    }
  }

  function onChangeTheme(e: ChangeEvent<HTMLInputElement>) {
    setThemeId(parseInt(e.target.value, 10));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log('submitting', tags, themeId);
    const filtered = tags.filter((v) => !v.trim());
    if (filtered.length === 0) {
      alert('태그를 하나라도 입력해주세요');
      return;
    }
    if (!themeId) {
      alert('대주제 아이디를 입력해주세요');
      return;
    }
    try {
      await axios.patch(`/api/collections/tags/${filtered.join(',')}/connectTheme?themeId=${themeId}`, {}, {
        timeout: 60_000,
      });
      setTags([]);
      alert("태그가 추가되었습니다");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response.data?.data);
      }
    }
  }

  function onClickPlus(index: number) {
    return (e: MouseEvent) => {
      e.preventDefault();
      setTags((prev) => {
        return prev.concat('');
      })
    }
  }

  function onClickMinus(index: number) {
    return (e: MouseEvent) => {
      e.preventDefault();
      setTags((prev) => {
        return prev.slice(0, index).concat(prev.slice(index + 1));
      })
    }
  }

  return (
    <Box width={[1, 1, 1 / 2]} p="lg">
      <Card as="form" onSubmit={onSubmit}>
        <Icon icon="Gift" />
        <H5 mt="lg">{translateMessage('tagToTheme_title')}</H5>
        {tags.map((tag, index) => (
          <Box>
            <Label>태그 {index+1} (&& 관계)</Label>
            <Input onChange={onChangeTag(index)} type="text" placeholder="입력" required value={tag} style={{width: '100%'}} />
            <Button type="button" onClick={onClickPlus(index)}><Icon icon="Plus" /></Button>
            <Button type="button" onClick={onClickMinus(index)}><Icon icon="Minus" /></Button>
          </Box>
        ))}
        <Box><Label>대주제아이디</Label><Input onChange={onChangeTheme} type="number" placeholder="숫자" required value={themeId} style={{width: '100%'}} /></Box>
        <Box><Button type="submit" variant="contained" onClick={onSubmit}>추가</Button></Box>
      </Card>
    </Box>
  )
}
