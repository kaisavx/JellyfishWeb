import React from "react"

import { Form, Tooltip, Typography } from "antd"
import _ from "lodash"
import { SensorOption } from "."

const { Text } = Typography

export function TempCoefficient({
  n,
  temperature,
  pressure,
  multiple,
  sensorOption,
}: {
  n?: number
  temperature?: number
  pressure?: number
    multiple?: number
  sensorOption:SensorOption
  }) {
  
  const { coefficients } = sensorOption
  
  const renderN = () => {
    if (_.isEmpty(coefficients)) {
      return 
    }
    return ( <Form.Item
      label='n'
      name='n'
    >
      <Tooltip title={`${temperature ?? '-'}℃ 下的温度补偿系数`}>
        <Text>{n?.toFixed(2) ?? '-'}</Text>
      </Tooltip>
    </Form.Item>)
  }
  
  return (<div>
    <Form
      name='n'
      layout="inline">
      { renderN() }
      <Form.Item
        label='multiple'
        name='multiple'
      >
        <Tooltip title={`${temperature ?? '-'}℃ ${pressure ?? '-'}Pa 下1ppb转ug/m3倍数`}>
          <Text>{multiple?.toFixed(2) ?? '-'}</Text>
        </Tooltip>
      </Form.Item>
    </Form>
  </div>)
}