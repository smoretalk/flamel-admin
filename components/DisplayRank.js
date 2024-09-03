import React, { useEffect, useState } from "react";
import axios from "axios";
const DisplayRank = (props) => {
    const [point, setPoint] = useState(0);
    const [rank, setRank] = useState(null);
    useEffect(() => {
        axios.get('/api/collections/' + props.record.id + '/rank')
            .then((response) => {
            setPoint(response.data.point);
            setRank(response.data.rank);
        });
    }, [props.record.id]);
    return (React.createElement("section", { style: { marginBottom: props.where === 'show' ? 24 : 0 } },
        props.where === 'show' && (React.createElement("label", { style: {
                display: 'block',
                fontFamily: 'Roboto, sans-serif',
                fontSize: 12,
                lineHeight: '16px',
                color: 'rgb(137, 138, 154)',
                marginBottom: 4,
                fontWeight: 300,
            }, htmlFor: "image", className: "adminjs_Label" }, "\uB7AD\uD0B9")),
        React.createElement("div", null, rank ? `${rank}위 (${point})점` : '랭킹없음')));
};
export default DisplayRank;
//# sourceMappingURL=DisplayRank.js.map