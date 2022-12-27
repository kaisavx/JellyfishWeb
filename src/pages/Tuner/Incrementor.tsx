import React, { useEffect, useState } from "react"
import { Form, Tooltip, Typography } from "antd"
import { FormulaType, SensorOption } from "."

const { Text } = Typography

export function Incrementor({
  n,
  s,
  multiple,
  sensorOption
}: {
  n?: number
  s?: number
  multiple?: number
  sensorOption: SensorOption
}) {

  const [wep, setWep] = useState<number>()
  const [aep, setAep] = useState<number>()

  const { formula } = sensorOption

  useEffect(() => {
    if (
      s === undefined ) {
      return
    }
    

    switch (formula) {
      case FormulaType.Formula1: {
        if (multiple === undefined) {
          return
        }
        const aep = 1 / s * multiple
        setWep(aep)
        if (n === undefined) {
          return
        }
        setAep(-n * aep)
        break
      }
      case FormulaType.Formula4:
      case FormulaType.Formula5: {
        if (multiple === undefined) {
          return
        }
        const aep = 1 / s * multiple
        setWep(aep)
        break
      }
      case FormulaType.Formula6:
        setWep(1/s)
        break
    }

  }, [n, s, multiple])

  const getUnit = () => {
    switch (formula) {
      case FormulaType.Formula6:
        return 'PPB'
      default:
        return 'ug/m3'
    }
  }

  const renderAEP = () => {
    switch (formula) {
      case FormulaType.Formula1:
        return (<Form.Item
          label='AEp'
          name='AEp'
        >
          <Tooltip title={'AE每提升1个单位，最终计算数值减少N个'+getUnit()}>
            <Text>{(aep?.toFixed(2) ?? '-') + getUnit()}</Text>
          </Tooltip>
        </Form.Item>)
    }
  }

  return (<div>
    <Form
      name='s'
      layout="inline">
      <Form.Item
        label='s'
        name='s'
      >
        <Tooltip title='根据输入参数得出的灵敏度'>
          <Text>{s?.toFixed(2) ?? '-'}</Text>
        </Tooltip>
      </Form.Item>
      <Form.Item
        label='WEp'
        name='WEp'
      >
        <Tooltip title={'WE每提升1个单位，最终计算数值减少N个'+getUnit()}>
          <Text>{(wep?.toFixed(2) ?? '-') + getUnit()}</Text>
        </Tooltip>
      </Form.Item>

      {renderAEP()}
    </Form>
  </div>)
}