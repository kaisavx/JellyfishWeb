import React, { useEffect, useState } from "react"
import { Typography, Input, Button, Checkbox, Form, } from 'antd'
import "./index.scoped.scss"
import { getNByTemp } from "@src/util/formula"
import _ from "lodash"
import { ppb2ugm3Multiple } from "@src/util/unit-conversion"
import { UnitTransformer } from "./UnitTransformer"
import { Incrementor } from "./Incrementor"
import { TempCoefficient } from "./TempCoefficient"
import { StandardCalculator } from "./StandardCalculator"
import { SensitivityCalculator, Standard } from "./SensitivityCalculator"

const { Text } = Typography

enum SensorType {
  CO = 'CO',
  NO2 = 'NO2',
  O3 = 'O3',
  SO2 = 'SO2',
  H2S = 'H2S',
  NO = 'NO',
  NH3 = 'NH3',
  Cl2 = 'Cl2',
  HCN = 'HCN',
  HCl = 'HCl',
  CO2 = 'CO2',
  TGS = 'TGS',
  VOCs = 'VOCs',
}

export enum FormulaType {
  Formula1 = 'Formula1',
  Formula2 = 'Formula2',
  Formula3 = 'Formula3',
  Formula4 = 'Formula4',
  Formula5 = 'Formula5',
  Formula6 = 'Formula6',
}

export interface SensorOption {
  m?: number
  formula: FormulaType
  coefficients?: number[],
  isDefaultCheck?: boolean
}

const data: _.Dictionary<SensorOption> = {
  [SensorType.CO]: {
    m: 28,
    formula: FormulaType.Formula1,
    coefficients: [0.7, 0.7, 0.7, 0.7, 1, 3, 3.5, 4, 4.5],
    isDefaultCheck: true,
  },
  [SensorType.NO2]: {
    m: 46,
    formula: FormulaType.Formula1,
    coefficients: [1.3, 1.3, 1.3, 1.3, 1, 0.6, 0.4, 0.2, -1.5],
    isDefaultCheck: true,
  },
  [SensorType.O3]: {
    m: 48,
    formula: FormulaType.Formula1,
    coefficients: [0.9, 0.9, 1, 1.3, 1.5, 1.7, 2, 2.5, 3.7],
    isDefaultCheck: true,
  },
  [SensorType.SO2]: {
    m: 64,
    formula: FormulaType.Formula4,
    coefficients: [-4, -4, -4, -4, -4, 0, 20, 140, 450],
    isDefaultCheck: true,
  },
  [SensorType.H2S]: {
    m: 34,
    formula: FormulaType.Formula1,
    coefficients: [-0.6, -0.6, 0.1, 0.8, -0.7, -2.5, -2.5, -2.2, -1.8]
  },
  [SensorType.NO]: {
    m: 30,
    formula: FormulaType.Formula1,
    coefficients: [1.8, 1.8, 1.4, 1.1, 1.1, 1, 0.9, 0.9, 0.8]
  },
  [SensorType.NH3]: {
    m: 17,
    formula: FormulaType.Formula5,
  },
  [SensorType.Cl2]: {
    m: 70,
    formula: FormulaType.Formula5,
  },
  [SensorType.HCN]: {
    m: 27,
    formula: FormulaType.Formula5,
  },
  [SensorType.HCl]: {
    m: 36,
    formula: FormulaType.Formula5,
  },
  [SensorType.CO2]: {
    m: 44,
    formula: FormulaType.Formula5,
  },
  [SensorType.TGS]: {
    formula: FormulaType.Formula6,
  },
  [SensorType.VOCs]: {
    formula: FormulaType.Formula6,
  }
}

export function SensorFrom({
  sensor,
  temperature,
  pressure,
}: {
  sensor: string,
  temperature?: number,
  pressure?: number
}) {

  const [s, setS] = useState<number>()
  const [n, setN] = useState<number>()
  const [standard, setStandard] = useState<Standard>()
  const [multiple, setMultiple] = useState<number>()

  const sensorOption = data[sensor]

  const { m,coefficients } = sensorOption

  useEffect(() => {
    if (temperature === undefined || !coefficients?.length) {
      return undefined
    }
    setN(getNByTemp({ coefficients, temp: temperature }))
  }, [temperature])


  useEffect(() => {
    setMultiple(ppb2ugm3Multiple({
      m: sensorOption.m,
      pa: pressure,
      temp: temperature
    }))
  }, [pressure, temperature])

  const renderUnitTransformer = () => {
    if (!m) {
      return
    }
    return (
      <div>
        <TempCoefficient
          n={n}
          temperature={temperature}
          pressure={pressure}
          multiple={multiple}
          sensorOption={sensorOption}
        />
        <UnitTransformer multiple={multiple} />
      </div>
    )
  }

  return (<div
    key={sensor}
  >
    <Text>{sensor}</Text>

    {renderUnitTransformer()}

    <SensitivityCalculator
      onStandardChange={setStandard}
      onSensitivityChange={setS}
      nt={n}
      sensorOption={sensorOption}
    />

    <Incrementor
      n={n}
      s={s}
      multiple={multiple}
      sensorOption={sensorOption}
    />

    <StandardCalculator
      standard={standard}
      n={n}
      multiple={multiple}
      sensorOption={sensorOption}
    />
    <div style={{ width: '100%', height: 1, background: 'black' }} />
  </div>
  )
}

export default function Tuner() {

  const checkboxOptions = Object.keys(data).map(it => ({ label: it, value: it }))
  const checkboxDefaultValues = Object.keys(data).filter(it => data[it]?.isDefaultCheck)

  const [checkboxValues, setCheckboxValues] = useState(checkboxDefaultValues)
  const [temperature, setTemperature] = useState<number>()
  const [pressure, setPressure] = useState<number>()

  const handleCheckboxChange = (value: any[]) => {
    console.info('[handleCheckboxChange]', { value })
    setCheckboxValues(value)
  }

  return (
    <div className="tuner-body">
      <Checkbox.Group options={checkboxOptions} value={checkboxValues} onChange={handleCheckboxChange} />
      <Form
        style={{ width: 400, marginTop: 20 }}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={(values) => {
          console.info('[Form] onFinish', values)
          const template = Number(values.temp)
          const pressure = Number(values.pressure)
          setTemperature(template)
          setPressure(pressure)
        }}
        initialValues={{ pressure: '101325' }}
      >
        <Form.Item
          label='temp'
          name='temp'
          rules={[{ required: true, message: 'Please input temperature!' }]}
        >
          <Input addonAfter='℃' type='number' />
        </Form.Item>
        <Form.Item
          label='pressure'
          name='pressure'
          rules={[{ required: true, message: 'Please input pressure!' }]}
        >
          <Input addonAfter='Pa' type='number' />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item>
      </Form>

      <div style={{ width: '100%', height: 1, background: 'black' }} />
      {checkboxValues.map(sensor => (<SensorFrom
        key={sensor}
        sensor={sensor}
        temperature={temperature}
        pressure={pressure}
      />))}
    </div>
  )
}