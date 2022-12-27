import { getFormula1S, getFormula4S, getFormula5S, getFormula6S } from "@src/util/formula"
import { Button, Form, Input } from "antd"
import { useEffect, useState } from "react"
import { FormulaType, SensorOption } from "."


export interface Standard {
  WE0: number
  AE0: number
  WE1: number
  AE1: number
  Standard: number
}

export function SensitivityCalculator({
  onStandardChange,
  onSensitivityChange,
  nt,
  sensorOption,
}: {
  onStandardChange: (standard: Standard) => void
  onSensitivityChange: (s?: number) => void
    nt?: number,
  sensorOption:SensorOption,
}) {

  const [standard, setStandard] = useState<Standard>()

  const { formula } = sensorOption

  useEffect(() => {
    if (standard === undefined) {
      return
    }

    const { WE1, AE1, WE0, AE0, Standard } = standard

    let s

    switch (formula) {
      case FormulaType.Formula1:
        if (nt === undefined) {
          return
        }
        s = getFormula1S({
          WE1,
          WE0,
          AE1,
          AE0,
          nt,
          Standard
        })
        break
      case FormulaType.Formula4:
        s = getFormula4S({
          WE1,
          WE0,
          Standard
        })
      case FormulaType.Formula5:
        s = getFormula5S({
          WE1,
          WE0,
          Standard
        })
      case FormulaType.Formula6:
        s = getFormula6S({
          WE1,
          WE0,
          Standard
        })
    }

    onSensitivityChange(s)

  }, [nt, standard])

  const handleSubmitStandard = (value: any) => {
    console.info('[handleSubmitStandard]', { value })
    const { WE1, AE1, WE0, AE0, Standard } = value
    if (WE1 === undefined ||
        WE0 === undefined ||
        Standard === undefined) {
      return
    }

    switch (formula) {
      case FormulaType.Formula1:
        if( AE1 === undefined ||
          AE0 === undefined) {
          return
          }
        break
    }

    const standard = {
      WE1: Number(WE1),
      WE0: Number(WE0),
      AE1: Number(AE1),
      AE0: Number(AE0),
      Standard: Number(Standard)
    }
    onStandardChange(standard)
    setStandard(standard)
  }

  const renderAE = (name:string) => {
    switch (formula) {
      case FormulaType.Formula1:
        return (<Form.Item
          label={ name}
          name={ name}
          rules={[{ required: true, message:name }]}
        >
          <Input type='number' style={{ width: 100 }} />
        </Form.Item>)
    }
  }


  return (<div>
    <Form
      layout='inline'
      onFinish={handleSubmitStandard}
    >
      <Form.Item
        label='WE0'
        name='WE0'
        rules={[{ required: true, message: 'WE0' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>

      {renderAE('AE0')}

      <Form.Item
        label='WE1'
        name='WE1'
        rules={[{ required: true, message: 'WE1' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>

      {renderAE('AE1')}

      <Form.Item
        label='Standard'
        name='Standard'
        rules={[{ required: true, message: 'Standard' }]}
      >
        <Input type='number' addonAfter='PPB' style={{ width: 150 }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </Form.Item>
    </Form>
  </div>)
}