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
import React, {FormEvent, useState} from "react";
import Card from "./Card.js";
import {useTranslation} from "adminjs";
import axios from "axios";

export default function CouponIssueSection({}) {
  const { translateMessage } = useTranslation();
  const [type, setType] = useState<string>('defaultCredit');
  const [date, setDate] = useState<Date | null>(null);
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

  function onChangeType(type: string) {
    setType(type);
  }

  function onChangeCode(code: string) {
    setCode(code);
  }

  function onChangeCredit(credit: number) {
    setCredit(credit);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.post('/api/coupons', {
        code,
        credit,
        expiresAt: date,
        type,
      });
      setCode('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response.data);
      }
      console.error(err);
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
        <Box><Label>쿠폰코드</Label><Input onChange={onChangeCode} type="text" placeholder="쿠폰 코드" required /></Box>
        <Box><Label>크레딧</Label><Input onChange={onChangeCredit} type="number" placeholder="크레딧 수" /></Box>
        <Box><Label>만료기한</Label><DatePicker onChange={onChangeDate} propertyType="date" value={date.toString()} /></Box>
        <Box><Button variant="contained">생성</Button></Box>
      </Card>
    </Box>
  )
}
