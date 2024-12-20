import React, { useEffect } from "react";
import { ApiClient } from "adminjs";
import Select from 'react-select';
import axios from "axios";
export const PlanAndModel = () => {
    const [plans, setPlans] = React.useState([]);
    const [models, setModels] = React.useState([]);
    const [enterprises, setEnterprises] = React.useState([]);
    const [modelPlanRelationship, setModelPlanRelationship] = React.useState([]);
    const [modelEnterpriseRelationship, setModelEnterpriseRelationship] = React.useState([]);
    useEffect(() => {
        const api = new ApiClient();
        api.searchRecords({ resourceId: 'Plan', query: '' })
            .then((plans) => {
            console.log(plans);
            setPlans(plans);
        });
        api.searchRecords({ resourceId: 'Model', query: '' })
            .then((models) => {
            console.log(models);
            setModels(models);
        });
        api.searchRecords({ resourceId: 'Enterprise', query: '' })
            .then((enterprises) => {
            console.log(enterprises);
            setEnterprises(enterprises);
        });
        axios.get('/api/models/relationship/plan')
            .then((res) => {
            setModelPlanRelationship(res.data);
        });
        axios.get('/api/models/relationship/enterprise')
            .then((res) => {
            setModelEnterpriseRelationship(res.data);
        });
    }, []);
    const features = [
        'text2img',
        'img2img',
        'style',
        'retry',
        'inpaint',
        'erase',
        'outpaint',
        'removebg',
        'upscale',
        'enhance',
    ];
    const onChange = (feature, target, id) => (value, actionMeta) => {
        console.log(feature, actionMeta, value);
        if (actionMeta.action === 'select-option') {
            axios.post(`/api/models/relationship/${target}?modelId=${actionMeta.option.value}&${target}Id=${id}&type=${feature}`)
                .then((res) => {
                if (target === 'plan') {
                    setModelPlanRelationship((prev) => [...prev, {
                            apiName: res.data.apiName,
                            modelId: res.data.modelId,
                            PlanModels: [{
                                    type: feature,
                                    Plan: {
                                        planId: id,
                                    }
                                }]
                        }]);
                }
                else {
                    setModelEnterpriseRelationship((prev) => [...prev, {
                            apiName: res.data.apiName,
                            modelId: res.data.modelId,
                            EnterpriseModels: [{
                                    type: feature,
                                    Enterprise: {
                                        userId: id,
                                    }
                                }]
                        }]);
                }
            })
                .catch(console.error);
        }
        else if (actionMeta.action === 'remove-value') {
            axios.delete(`/api/models/relationship/${target}?modelId=${actionMeta.removedValue.value}&${target}Id=${id}&type=${feature}`)
                .then((res) => {
                if (target === 'plan') {
                    setModelPlanRelationship((prev) => prev.filter((v) => !(v.modelId === res.data.modelId && v.PlanModels.find((p) => p.type === feature && p.Plan.planId === id))));
                }
                else {
                    setModelEnterpriseRelationship((prev) => prev.filter((v) => !(v.modelId === res.data.modelId && v.EnterpriseModels.find((p) => p.type === feature && p.Enterprise.userId === id))));
                }
            })
                .catch(console.error);
        }
    };
    return (React.createElement("div", { style: { overflow: 'visible' } },
        React.createElement("table", { style: { border: '1px solid lightgray' }, border: 1 },
            React.createElement("colgroup", null,
                React.createElement("col", null),
                React.createElement("col", { style: { backgroundColor: 'lightgray' } }),
                React.createElement("col", null),
                React.createElement("col", { style: { backgroundColor: 'lightgray' } }),
                React.createElement("col", null),
                React.createElement("col", { style: { backgroundColor: 'lightgray' } }),
                React.createElement("col", null),
                React.createElement("col", { style: { backgroundColor: 'lightgray' } }),
                React.createElement("col", null),
                React.createElement("col", { style: { backgroundColor: 'lightgray' } }),
                React.createElement("col", null)),
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: { padding: 20, fontWeight: 'bold' } }, "\uD50C\uB79C"),
                    features.map((item, index) => (React.createElement("th", { style: { padding: 20 }, key: item }, item))))),
            React.createElement("tbody", null,
                plans.filter((v) => v.params.grade !== 'enterprise').map((plan) => {
                    return (React.createElement("tr", { key: plan.params.planId },
                        React.createElement("td", { style: { padding: 20 } },
                            React.createElement("a", { href: `/admin/resources/Plan/records/${plan.params.planId}/show` }, plan.params.grade)),
                        features.map((item, index) => (React.createElement("td", { key: item, style: { padding: 20 } },
                            React.createElement("div", { style: { width: 300 } },
                                React.createElement(Select, { isMulti: true, isClearable: false, onChange: onChange(item, 'plan', plan.params.planId), value: modelPlanRelationship.filter((v) => v.PlanModels.find((p) => p.Plan.planId === plan.params.planId && item === p.type)).map((v) => ({ label: v.apiName, value: v.modelId.toString() })), options: models.map((model) => {
                                        return {
                                            label: model.params.apiName,
                                            value: model.params.modelId,
                                        };
                                    }), components: {
                                        MultiValueLabel: (model) => React.createElement("a", { style: { overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                borderRadius: 2,
                                                color: 'rgb(51, 51, 51)',
                                                fontSize: '85%',
                                                padding: '3px 3px 3px 6px',
                                                boxSizing: 'border-box',
                                            }, href: `/admin/resources/Model/records/${model.data.value}/show` }, model.data.label)
                                    } })))))));
                }),
                React.createElement("tr", null,
                    React.createElement("td", null, "-"),
                    features.map((item, index) => (React.createElement("td", { key: item, style: { padding: 20 } }, "-")))),
                plans.filter((v) => v.params.grade === 'enterprise').map((plan) => {
                    return (React.createElement("tr", { key: plan.params.planId },
                        React.createElement("td", { style: { padding: 20 } },
                            React.createElement("a", { href: `/admin/resources/Plan/records/${plan.params.planId}/show` }, plan.params.grade)),
                        features.map((item, index) => (React.createElement("td", { key: item, style: { padding: 20 } },
                            React.createElement("div", { style: { width: 300 } },
                                React.createElement(Select, { isMulti: true, isClearable: false, onChange: onChange(item, 'plan', plan.params.planId), value: modelPlanRelationship.filter((v) => v.PlanModels.find((p) => p.Plan.planId === plan.params.planId && item === p.type)).map((v) => ({ label: v.apiName, value: v.modelId.toString() })), options: models.map((model) => {
                                        return {
                                            label: model.params.apiName,
                                            value: model.params.modelId,
                                        };
                                    }), components: {
                                        MultiValueLabel: (model) => React.createElement("a", { style: { overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                borderRadius: 2,
                                                color: 'rgb(51, 51, 51)',
                                                fontSize: '85%',
                                                padding: '3px 3px 3px 6px',
                                                boxSizing: 'border-box',
                                            }, href: `/admin/resources/Model/records/${model.data.value}/show` }, model.data.label)
                                    } })))))));
                }),
                enterprises.map((plan) => {
                    return (React.createElement("tr", { key: plan.params.userId },
                        React.createElement("td", { style: { padding: 20 } },
                            React.createElement("a", { href: `/admin/resources/Enterprise/records/${plan.params.userId}/show` },
                                plan.params.name,
                                "(",
                                plan.params.userId,
                                ")")),
                        features.map((item, index) => (React.createElement("td", { key: item, style: { padding: 20 } },
                            React.createElement("div", { style: { width: 300 } },
                                React.createElement(Select, { isMulti: true, isClearable: false, onChange: onChange(item, 'enterprise', plan.params.userId), value: modelEnterpriseRelationship.filter((v) => v.EnterpriseModels.find((p) => p.Enterprise.userId === plan.params.userId && item === p.type)).map((v) => ({ label: v.apiName, value: v.modelId.toString() })), options: models.map((model) => {
                                        return {
                                            label: model.params.apiName,
                                            value: model.params.modelId.toString(),
                                        };
                                    }), components: {
                                        MultiValueLabel: (model) => React.createElement("a", { style: { overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                borderRadius: 2,
                                                color: 'rgb(51, 51, 51)',
                                                fontSize: '85%',
                                                padding: '3px 3px 3px 6px',
                                                boxSizing: 'border-box',
                                            }, href: `/admin/resources/Model/records/${model.data.value}/show` }, model.data.label)
                                    } })))))));
                })))));
};
export default PlanAndModel;
//# sourceMappingURL=PlanAndModel.js.map