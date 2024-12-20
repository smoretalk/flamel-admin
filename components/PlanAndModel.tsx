import React, {useEffect} from "react";
import {ApiClient} from "adminjs";
import Select, {ActionMeta, MultiValue } from 'react-select';
import axios from "axios";

type PlanModel = { modelId: number; apiName: string; PlanModels: Array<{ type: string; Plan: { planId: number } }> };
type EnterpriseModel = { modelId: number; apiName: string; EnterpriseModels: Array<{ type: string; Enterprise: { userId: number } }> };
export const PlanAndModel: React.FC = () => {
  const [plans, setPlans] = React.useState([]);
  const [models, setModels] = React.useState([]);
  const [enterprises, setEnterprises] = React.useState([]);
  const [modelPlanRelationship, setModelPlanRelationship] = React.useState<PlanModel[]>([]);
  const [modelEnterpriseRelationship, setModelEnterpriseRelationship] = React.useState<EnterpriseModel[]>([]);
  useEffect(() => {
    const api = new ApiClient();

    api.searchRecords({resourceId: 'Plan', query: ''})
      .then((plans) => {
        console.log(plans);
        setPlans(plans);
      });

    api.searchRecords({resourceId: 'Model', query: ''})
      .then((models) => {
        console.log(models);
        setModels(models);
      })

    api.searchRecords({resourceId: 'Enterprise', query: ''})
      .then((enterprises) => {
        console.log(enterprises);
        setEnterprises(enterprises);
      })

    axios.get<PlanModel[]>('/api/models/relationship/plan')
      .then((res) => {
        setModelPlanRelationship(res.data);
      })

    axios.get<EnterpriseModel[]>('/api/models/relationship/enterprise')
      .then((res) => {
        setModelEnterpriseRelationship(res.data);
      })
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

  const onChange = (feature: string, target: 'plan' | 'enterprise', id: number) => (value: MultiValue<{ label: string, value: string }>, actionMeta: ActionMeta<{ label: string, value: string }>) => {
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
          } else {
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
    } else if (actionMeta.action === 'remove-value') {
      axios.delete(`/api/models/relationship/${target}?modelId=${actionMeta.removedValue.value}&${target}Id=${id}&type=${feature}`)
        .then((res) => {
          if (target === 'plan') {
            setModelPlanRelationship((prev) => prev.filter((v) => !(v.modelId === res.data.modelId && v.PlanModels.find((p) => p.type === feature && p.Plan.planId === id))));
          } else {
            setModelEnterpriseRelationship((prev) => prev.filter((v) => !(v.modelId === res.data.modelId && v.EnterpriseModels.find((p) => p.type === feature && p.Enterprise.userId === id))));
          }
        })
        .catch(console.error);
    }
  }

  return (
    <div style={{overflow: 'visible'}}>
      <table style={{border: '1px solid lightgray'}} border={1}>
        <colgroup>
          <col/>
          <col style={{backgroundColor: 'lightgray'}}/>
          <col/>
          <col style={{backgroundColor: 'lightgray'}}/>
          <col/>
          <col style={{backgroundColor: 'lightgray'}}/>
          <col/>
          <col style={{backgroundColor: 'lightgray'}}/>
          <col/>
          <col style={{backgroundColor: 'lightgray'}}/>
          <col/>
        </colgroup>
        <thead>
        <tr>
          <th style={{padding: 20, fontWeight: 'bold'}}>플랜</th>
          {features.map((item, index) => (
            <th style={{padding: 20}} key={item}>{item}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {plans.filter((v) => v.params.grade !== 'enterprise').map((plan) => {
          return (
            <tr key={plan.params.planId}>
              <td style={{padding: 20}}><a
                href={`/admin/resources/Plan/records/${plan.params.planId}/show`}>{plan.params.grade}</a></td>
              {features.map((item, index) => (
                <td key={item} style={{padding: 20}}>
                  <div style={{width: 300}}>
                    <Select
                      isMulti
                      isClearable={false}
                      onChange={onChange(item, 'plan', plan.params.planId)}
                      value={modelPlanRelationship.filter((v) => v.PlanModels.find((p) => p.Plan.planId === plan.params.planId && item === p.type)).map((v) => ({ label: v.apiName, value: v.modelId.toString()}))}
                      options={models.map((model) => {
                        return {
                          label: model.params.apiName,
                          value: model.params.modelId,
                        };
                      })}
                      components={{
                        MultiValueLabel: (model) => <a
                          style={{overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderRadius: 2,
                            color: 'rgb(51, 51, 51)',
                            fontSize: '85%',
                            padding: '3px 3px 3px 6px',
                            boxSizing:'border-box',
                          }}
                          href={`/admin/resources/Model/records/${model.data.value}/show`}>
                          {model.data.label}
                        </a>
                      }}
                    />
                  </div>
                </td>
              ))}
            </tr>
          )
        })}
        <tr>
          <td>-</td>
          {features.map((item, index) => (
            <td key={item} style={{padding: 20}}>
              -
            </td>
          ))}
        </tr>
        {plans.filter((v) => v.params.grade === 'enterprise').map((plan) => {
          return (
            <tr key={plan.params.planId}>
              <td style={{padding: 20}}><a
                href={`/admin/resources/Plan/records/${plan.params.planId}/show`}>{plan.params.grade}</a></td>
              {features.map((item, index) => (
                <td key={item} style={{padding: 20}}>
                  <div style={{width: 300}}>
                    <Select
                      isMulti
                      isClearable={false}
                      onChange={onChange(item, 'plan', plan.params.planId)}
                      value={modelPlanRelationship.filter((v) => v.PlanModels.find((p) => p.Plan.planId === plan.params.planId && item === p.type)).map((v) => ({ label: v.apiName, value: v.modelId.toString()}))}
                      options={models.map((model) => {
                        return {
                          label: model.params.apiName,
                          value: model.params.modelId,
                        };
                      })}
                      components={{
                        MultiValueLabel: (model) => <a
                          style={{overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderRadius: 2,
                            color: 'rgb(51, 51, 51)',
                            fontSize: '85%',
                            padding: '3px 3px 3px 6px',
                            boxSizing:'border-box',
                          }}
                          href={`/admin/resources/Model/records/${model.data.value}/show`}>
                          {model.data.label}
                        </a>
                      }}
                    />
                  </div>
                </td>
              ))}
            </tr>
          )
        })}
        {enterprises.map((plan) => {
          return (
            <tr key={plan.params.userId}>
              <td style={{padding: 20}}><a
                href={`/admin/resources/Enterprise/records/${plan.params.userId}/show`}>{plan.params.name}({plan.params.userId})</a></td>
              {features.map((item, index) => (
                <td key={item} style={{padding: 20}}>
                  <div style={{width: 300}}>
                    <Select
                      isMulti
                      isClearable={false}
                      onChange={onChange(item, 'enterprise', plan.params.userId)}
                      value={modelEnterpriseRelationship.filter((v) => v.EnterpriseModels.find((p) => p.Enterprise.userId === plan.params.userId && item === p.type)).map((v) => ({ label: v.apiName, value: v.modelId.toString()}))}
                      options={models.map((model) => {
                        return {
                          label: model.params.apiName,
                          value: model.params.modelId.toString(),
                        };
                      })}
                      components={{
                        MultiValueLabel: (model) => <a
                          style={{overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderRadius: 2,
                            color: 'rgb(51, 51, 51)',
                            fontSize: '85%',
                            padding: '3px 3px 3px 6px',
                            boxSizing:'border-box',
                          }}
                          href={`/admin/resources/Model/records/${model.data.value}/show`}>
                          {model.data.label}
                        </a>
                      }}
                    />
                  </div>
                </td>
              ))}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  );
};

export default PlanAndModel;
