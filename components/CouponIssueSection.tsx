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

export default function CouponIssueSection({}) {
  const { translateMessage } = useTranslation();
  const [type, setType] = useState<{ value: string; label: string }>({ value: 'defaultCredit', label: '디폴트 크레딧'});
  const [date, setDate] = useState<Date | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [code, setCode] = useState<string>('');
  const [credit, setCredit] = useState<number>(0);

  function onChangeDate(date: string | null) {
    console.log(date);
    if (date) {
      setDate(new Date(date));
    } else {
      setDate(null);
    }
  }

  function onChangeType(type: { label: string; value: string }) {
    setType(type);
  }

  function onChangeCode(e: ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
  }

  function onChangeCredit(e: ChangeEvent<HTMLInputElement>) {
    setCredit(parseInt(e.target.value, 10));
  }

  function onChangeOwnerId(e: ChangeEvent<HTMLInputElement>) {
    let value = parseInt(e.target.value, 10);
    if (value) {
      setOwnerId(value);
    } else {
      setOwnerId(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log('submitting', code, credit, date, type, ownerId);
    try {
      await axios.post('/api/coupons', {
        code,
        credit,
        expiresAt: date,
        type: type.value,
        ownerId,
      });
      setCode('');
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response.data);
      }
    }
  }

  return (
    <Box width={[1, 1, 1 / 2]} p="lg">
      <Card as="form" onSubmit={onSubmit}>
        <Icon icon="Gift" />
        <H5 mt="lg">{translateMessage('issueCoupon_title')}</H5>
        <Box><Label>유형</Label><Select options={[
          { value: 'defaultCredit', label: '디폴트 크레딧' },
          { value: 'dailyCredit', label: '일간 크레딧' },
          { value: 'monthlyCredit', label: '월간 크레딧' },
          { value: 'onetime', label: '일일권' },
          { value: 'basic', label: 'basic 요금제' },
        ]} value={type} onChange={onChangeType} /></Box>
        <Box><Label>쿠폰코드</Label><Input onChange={onChangeCode} type="text" placeholder="쿠폰 코드" required value={code}/></Box>
        <Box><Label>크레딧</Label><Input onChange={onChangeCredit} type="number" placeholder="크레딧 수" value={credit} /></Box>
        <Box><Label>사용자</Label><Input onChange={onChangeOwnerId} type="number" placeholder="지급 대상(빈칸이면 누구나 가능)" value={ownerId} /></Box>
        <Box><Label>만료기한</Label><DatePicker onChange={onChangeDate} propertyType="date" value={date?.toString()} /></Box>
        <Box><Button variant="contained" onClick={onSubmit}>생성</Button></Box>
      </Card>
    </Box>
  )
}
