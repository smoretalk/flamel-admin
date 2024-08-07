import { Box, Button, DatePicker, H5, Icon, Input, Label, Select } from "@adminjs/design-system";
import React, { useState } from "react";
import Card from "./Card.js";
import { useTranslation } from "adminjs";
import axios from "axios";
export default function CouponIssueSection({}) {
    const { translateMessage } = useTranslation();
    const [type, setType] = useState({ value: 'defaultCredit', label: '디폴트 크레딧' });
    const [date, setDate] = useState(null);
    const [email, setEmail] = useState('');
    const [maxCount, setMaxCount] = useState(null);
    const [code, setCode] = useState('');
    const [credit, setCredit] = useState(0);
    function onChangeDate(date) {
        console.log(date);
        if (date) {
            setDate(new Date(date));
        }
        else {
            setDate(null);
        }
    }
    function onChangeType(type) {
        setType(type);
    }
    function onChangeCode(e) {
        setCode(e.target.value);
    }
    function onChangeCredit(e) {
        setCredit(parseInt(e.target.value, 10));
    }
    function onChangeMaxCount(e) {
        setMaxCount(parseInt(e.target.value, 10));
    }
    function onChangeEmail(e) {
        setEmail(e.target.value);
    }
    async function onSubmit(e) {
        e.preventDefault();
        console.log('submitting', code, credit, date, type, maxCount, email);
        try {
            await axios.post('/api/coupons', {
                code,
                credit,
                expiresAt: date,
                type: type.value,
                email,
                maxCount: maxCount || null,
            });
            setCode('');
        }
        catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                alert(err.response.data?.data);
            }
        }
    }
    return (React.createElement(Box, { width: [1, 1, 1 / 2], p: "lg" },
        React.createElement(Card, { as: "form", onSubmit: onSubmit },
            React.createElement(Icon, { icon: "Gift" }),
            React.createElement(H5, { mt: "lg" }, translateMessage('issueCoupon_title')),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uC720\uD615"),
                React.createElement(Select, { options: [
                        { value: 'defaultCredit', label: '디폴트 크레딧' },
                        { value: 'dailyCredit', label: '일간 크레딧' },
                        { value: 'monthlyCredit', label: '월간 크레딧' },
                        { value: 'onetime', label: '일일권' },
                        { value: 'basic', label: 'basic 요금제' },
                    ], value: type, onChange: onChangeType })),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uCFE0\uD3F0\uCF54\uB4DC"),
                React.createElement(Input, { onChange: onChangeCode, type: "text", placeholder: "\uCFE0\uD3F0 \uCF54\uB4DC", required: true, value: code, style: { width: '100%' } })),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uD06C\uB808\uB527"),
                React.createElement(Input, { onChange: onChangeCredit, type: "number", placeholder: "\uD06C\uB808\uB527 \uC218", value: credit, style: { width: '100%' } })),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uBC1C\uD589\uB7C9"),
                React.createElement(Input, { onChange: onChangeMaxCount, type: "number", placeholder: "\uBC1C\uD589\uB7C9(\uBE44\uC6CC\uB450\uBA74 1)", value: maxCount, style: { width: '100%' } })),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uC0AC\uC6A9\uC790"),
                React.createElement(Input, { onChange: onChangeEmail, placeholder: "\uC9C0\uAE09 \uB300\uC0C1 \uC774\uBA54\uC77C(\uBE48\uCE78\uC774\uBA74 \uB204\uAD6C\uB098 \uAC00\uB2A5)", value: email, style: { width: '100%' } })),
            React.createElement(Box, null,
                React.createElement(Label, null, "\uB9CC\uB8CC\uAE30\uD55C"),
                React.createElement(DatePicker, { onChange: onChangeDate, propertyType: "date", value: date?.toString() })),
            React.createElement(Box, null,
                React.createElement(Button, { variant: "contained", onClick: onSubmit }, "\uC0DD\uC131")))));
}
//# sourceMappingURL=CouponIssueSection.js.map