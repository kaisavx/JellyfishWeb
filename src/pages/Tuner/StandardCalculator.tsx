import { formula1, formula4, formula5 } from "@src/util/formula";
import { Button, Form, Input, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import { FormulaType, SensorOption } from ".";
import { Standard } from "./SensitivityCalculator";

const { Text } = Typography

export interface Option {
  WE: number
  AE: number
  s: number
}

export function StandardCalculator({
  standard,
  n,
  multiple,
  sensorOption,
}: {
  standard?: Standard,
  n?: number
  multiple?: number
  sensorOption: SensorOption
}) {

  const [zeroPPB, setZeroPPB] = useState<number>()
  const [standardPPB, setStandardPPB] = useState<number>()
  const [zeroUgM3, setZeroUgM3] = useState<number>()
  const [standardUgM3, setStandardUgM3] = useState<number>()
  const [option, setOption] = useState<Option>()

  const { formula } = sensorOption

  const getUgm3 = (ppb?: number) => {
    if (multiple === undefined || ppb === undefined) {
      return undefined
    }

    return ppb * multiple
  }

  useEffect(() => {
    if (
      standard === undefined ||
      option === undefined
      ) {
      return
    }

    const {
      WE0,
      AE0,
      WE1,
      AE1,
    } = standard

    const { WE, AE, s } = option

    switch (formula) {
      case FormulaType.Formula1:
        if (n === undefined) {
          return
        }
        setZeroPPB(formula1({
          WEu: WE0,
          AEu: AE0,
          WEe: WE,
          AEe: AE,
          nt: n
        }) / s)

        setStandardPPB(formula1({
          WEu: WE1,
          AEu: AE1,
          WEe: WE,
          AEe: AE,
          nt: n
        }) / s)
        break
      case FormulaType.Formula4:
        if (n === undefined) {
          return
        }
        setZeroPPB(formula4({
          WEu: WE0,
          WEe: WE,
          WEo: 0,
          kt: n
        }) / s)

        setStandardPPB(formula4({
          WEu: WE1,
          WEe: WE,
          WEo: 0,
          kt: n
        }) / s)
        break
      case FormulaType.Formula5:
      case FormulaType.Formula6:
        setZeroPPB(formula5({
          WEu: WE0,
          WEe: WE,
        }) / s)

        setStandardPPB(formula5({
          WEu: WE1,
          WEe: WE,
        }) / s)
        break
    }



  }, [standard, n, option])

  useEffect(() => {
    if (zeroPPB === undefined ||
      multiple === undefined) {
      return
    }
    setZeroUgM3(getUgm3(zeroPPB))
  }, [zeroPPB, multiple])

  useEffect(() => {
    if (standardPPB === undefined ||
      multiple === undefined) {
      return
    }
    setStandardUgM3(getUgm3(standardPPB))
  }, [standardPPB, multiple])



  const handleSubmitOption = (value: any) => {
    console.info('[handleSubmitOption]', { value })
    const { WE, AE, s } = value
    setOption({
      WE: Number(WE),
      AE: Number(AE),
      s: Number(s)
    })
  }

  const renderAE = () => {
    switch (formula) {
      case FormulaType.Formula1:
        return (<Form.Item
          label='AE'
          name='AE'
          rules={[{ required: true, message: 'AE' }]}
        >
          <Input type='number' style={{ width: 100 }} />
        </Form.Item>)
    }
  }

  return (<div>
    <Form
      layout='inline'
      onFinish={handleSubmitOption}
    >
      <Form.Item
        label='WE'
        name='WE'
        rules={[{ required: true, message: 'WE' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>
      {renderAE()}
      <Form.Item
        label='s'
        name='s'
        rules={[{ required: true, message: 's' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        submit
      </Button>
    </Form>
    <Form layout='inline'>
      <Form.Item
        label='zero'
        name='zero'
      >
        <Tooltip title={`根据校准参数计算出零点数值`}>
          <Text>{`${zeroPPB?.toFixed(2) ?? '-'} ppb => ${zeroUgM3?.toFixed(2) ?? '-'} ug/m3`}</Text>
        </Tooltip>
      </Form.Item>
      <Form.Item
        label='Standard'
        name='Standard'
      >
        <Tooltip title={`根据校准参数计算出标气数值`}>
          <Text>{`${standardPPB?.toFixed(2) ?? '-'} ppb => ${standardUgM3?.toFixed(2) ?? '-'} ug/m3`}</Text>
        </Tooltip>
      </Form.Item>
    </Form>
  </div>)
}