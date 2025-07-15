import {
  Box,
  Button,
  CheckBox,
  DatePicker,
  H5,
  Icon,
  Input,
  Label,
  Select,
} from "@adminjs/design-system";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Card from "./Card.js";
import { useTranslation } from "adminjs";
import axios from "axios";

export default function CouponIssueSection({}) {
  const { translateMessage } = useTranslation();
  const [type, setType] = useState<{ value: string; label: string }>({
    value: "defaultCredit",
    label: "디폴트 크레딧",
  });
  const [date, setDate] = useState<Date | null>(null);
  const [email, setEmail] = useState("");
  const [maxCount, setMaxCount] = useState<number | null>(null);
  const [code, setCode] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [credit, setCredit] = useState<number>(0);
  const [sendEmail, setSendEmail] = useState(false);

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

  function onChangeMaxCount(e: ChangeEvent<HTMLInputElement>) {
    setMaxCount(parseInt(e.target.value, 10));
  }

  function onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(
      "submitting",
      code,
      credit,
      date,
      type,
      maxCount,
      email,
      reason,
      sendEmail
    );
    try {
      await axios.post("/api/coupons", {
        code,
        credit,
        expiresAt: date,
        type: type.value,
        email: email || null,
        maxCount: maxCount || null,
        reason,
        sendEmail,
      });
      setCode("");
      alert("쿠폰이 발급되었습니다!");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response.data?.data);
      }
    }
  }

  function onChangeSendEmail(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.checked);
    setSendEmail(e.target.checked);
  }

  function onChangeReason(e: ChangeEvent<HTMLInputElement>) {
    setReason(e.target.value);
  }

  return (
    <Box width={[1, 1, 1 / 2]} p="lg">
      <Card as="form" onSubmit={onSubmit}>
        <Icon icon="Gift" />
        <H5 mt="lg">{translateMessage("issueCoupon_title")}</H5>
        <Box>
          <Label>유형</Label>
          <Select
            options={[
              { value: "defaultCredit", label: "디폴트 크레딧" },
              { value: "dailyCredit", label: "일간 크레딧" },
              { value: "monthlyCredit", label: "월간 크레딧" },
              { value: "onetime", label: "일일권" },
              { value: "basic", label: "basic 요금제" },
              { value: "pro", label: "pro 요금제" },
            ]}
            value={type}
            onChange={onChangeType}
          />
        </Box>
        <Box>
          <Label>쿠폰코드</Label>
          <Input
            onChange={onChangeCode}
            type="text"
            placeholder="쿠폰 코드"
            required
            value={code}
            style={{ width: "100%" }}
          />
        </Box>
        <Box>
          <Label>크레딧or기간</Label>
          <Input
            onChange={onChangeCredit}
            type="number"
            placeholder="크레딧 수 or 기간(basic)"
            value={credit}
            style={{ width: "100%" }}
          />
        </Box>
        <Box>
          <Label>발행량</Label>
          <Input
            onChange={onChangeMaxCount}
            type="number"
            placeholder="발행량(비워두면 1)"
            value={maxCount}
            style={{ width: "100%" }}
          />
        </Box>
        <Box>
          <Label>사용자</Label>
          <Input
            onChange={onChangeEmail}
            placeholder="지급 대상 이메일(빈칸이면 누구나 가능)"
            value={email}
            style={{ width: "100%" }}
          />
        </Box>
        <Box>
          <Label>만료기한</Label>
          <DatePicker
            onChange={onChangeDate}
            propertyType="date"
            value={date?.toString()}
          />
        </Box>
        <Box>
          <Label>쿠폰 발급 사유(HTML)</Label>
          <Input
            onChange={onChangeReason}
            type="text"
            placeholder="쿠폰 발급 사유"
            required
            value={reason}
            style={{ width: "100%" }}
          />
        </Box>
        <Box>
          <Label>
            이메일 전송 여부{" "}
            <CheckBox onChange={onChangeSendEmail} checked={sendEmail} />
          </Label>
        </Box>
        <Box>
          <Button variant="contained" onClick={onSubmit}>
            생성
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
