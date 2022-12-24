import React, { useCallback, useEffect, useState } from "react"
import { Typography, Input, Button, Space, Checkbox, Tooltip, Form, } from 'antd'
import "./index.scoped.scss"
import { getDeviceByNo } from "@src/api/request"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { formula1, getFormula1S, getFormula4S, getNByTemp } from "@src/util/formula"
import _ from "lodash"
import { ppb2ugm3Multiple } from "@src/util/unit-conversion"

const { Search } = Input
const { Text } = Typography

enum SensorType {
  CO = 'CO',
  NO2 = 'NO2',
  O3 = 'O3',
  SO2 = 'SO2',
  H2S = 'H2S',
  NO = 'NO',
}

enum FormulaType {
  Formula1 = 'Formula1',
  Formula2 = 'Formula2',
  Formula3 = 'Formula3',
  Formula4 = 'Formula4',
  Formula5 = 'Formula5'
}

const data: _.Dictionary<{
  m?: number
  formula: FormulaType
  coefficients?: number[],
  isDefaultCheck?: boolean
}> = {
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
  }
}

interface Option {
  WE: number
  AE: number
  s: number
}

interface Standard {
  WE0: number
  AE0: number
  WE1: number
  AE1: number
  Standard: number
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
  const [standard, setStandard] = useState<Standard>()
  const [option, setOption] = useState<Option>()
  const [zeroPPB, setZeroPPB] = useState<number>()
  const [standardPPB, setStandardPPB] = useState<number>()
  const [isChanged, SetChanged] = useState(false)
  const [converted, setConverted] = useState<number>()
  const [convert,setConvert] = useState<number>()

  const sensorOption = data[sensor]

  const getN = () => {
    const coefficients = sensorOption?.coefficients
    if (temperature === undefined || !coefficients?.length) {
      return undefined
    }
    const n = getNByTemp({ coefficients, temp: temperature })
    return n
  }
const getMultiple = () => {
    return ppb2ugm3Multiple({
      m: sensorOption.m,
      pa: pressure,
      temp: temperature
    })
  }

  useEffect(() => {
    const n = getN()

    if (standard === undefined || option === undefined || n === undefined) {
      return
    }

    const {
      WE0,
      AE0,
      WE1,
      AE1,
    } = standard

    const { WE, AE, s } = option

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

  }, [standard, option])

  useEffect(()=>{
    const multiple = getMultiple()
    if(multiple === undefined || convert === undefined) {
      return
    }

    setConverted(isChanged
      ? convert /multiple
      : convert * multiple)
  },[isChanged,convert,temperature,pressure])

  

  const getUgm3 = (ppb?: number) => {
    const multiple = getMultiple()
    if (multiple === undefined || ppb === undefined) {
      return undefined
    }

    return ppb * multiple
  }

  const handleSubmitStandard = (value: any) => {
    console.info('[handleSubmitStandard]', { value })
    const { WE1, AE1, WE0, AE0, Standard } = value
    const nt = getN()
    if (WE1 === undefined ||
      WE0 === undefined ||
      AE1 === undefined ||
      AE0 === undefined ||
      Standard === undefined ||
      nt === undefined) {
      return
    }
    setS(getFormula1S({
      WE1: Number(WE1),
      WE0: Number(WE0),
      AE1: Number(AE1),
      AE0: Number(AE0),
      nt,
      Standard: Number(Standard)
    }))

    setStandard({
      WE1: Number(WE1),
      WE0: Number(WE0),
      AE1: Number(AE1),
      AE0: Number(AE0),
      Standard: Number(Standard)
    })
  }

  const handleSubmitOption = (value: any) => {
    console.info('[handleSubmitOption]', { value })
    const { WE, AE, s } = value
    setOption({
      WE: Number(WE),
      AE: Number(AE),
      s: Number(s)
    })

  }

  const getWEp = () => {
    const multiple = getMultiple()
    if (s === undefined || multiple === undefined) {
      return undefined
    }
    return 1 / s * multiple
  }

  const getAEp = () => {
    const n = getN()
    const multiple = getMultiple()
    if (
      n === undefined ||
      s === undefined ||
      multiple === undefined) {
      return undefined
    }
    return -n / s * multiple
  }

  const handleConvertFieldChange = (values: any[]) => {
    console.info('[handleConvertFieldChange]', { values })

    const value = Number(values[0].value)
    setConvert(value)
    // const multiple = getMultiple()
    // if (multiple === undefined) {
    //   return
    // }
    // setConverted(isChanged
    //   ? value / multiple
    //   : value * multiple
    // )
  }

  const handleConvertChange = () => {
    SetChanged(it => !it)
  }

  const getUnit = (isChanged: boolean) => {
    return isChanged ? 'ug/m3' : 'PPB'
  }

  return (<div>
    <Text>{sensor}</Text>
    <Form
      name='n'
      layout="inline">
      <Form.Item
        label='n'
        name='n'
      >
        <Tooltip title={`${temperature}℃ 下的温度补偿系数`}>
          <Text>{getN()?.toFixed(2) ?? '-'}</Text>
        </Tooltip>
      </Form.Item>
      <Form.Item
        label='multiple'
        name='multiple'
      >
        <Tooltip title={`${temperature}℃ ${pressure}Pa 下1ppb转ug/m3倍数`}>
          <Text>{getMultiple()?.toFixed(2) ?? '-'}</Text>
        </Tooltip>
      </Form.Item>
    </Form>

    <Form layout="inline"
      onFieldsChange={handleConvertFieldChange}>
      <Form.Item
        label='convert'
        name='convert'
        rules={[{ required: true, message: 'convert' }]}
      ><Input type='number' style={{ width: 150 }} addonAfter={getUnit(isChanged)} /></Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={handleConvertChange}>
          change
        </Button></Form.Item>
      <Form.Item
        label='converted'
        name='converted'
      >
        <Input 
        disabled
        type='number' style={{ width: 150 }} 
        placeholder={converted?.toFixed(2) ?? '-'} 
        addonAfter={getUnit(!isChanged)} />
        {/* <Text>{`${converted?.toFixed(2) ?? '-'} ${getUnit(!isChanged)}`}</Text> */}
      </Form.Item>
    </Form>
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
      <Form.Item
        label='AE0'
        name='AE0'
        rules={[{ required: true, message: 'AE0' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>
      <Form.Item
        label='WE1'
        name='WE1'
        rules={[{ required: true, message: 'WE1' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>
      <Form.Item
        label='AE1'
        name='AE1'
        rules={[{ required: true, message: 'AE1' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>
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
        <Tooltip title='WE每提升1个单位，最终计算数值减少N个ug/m3'>
          <Text>{(getWEp()?.toFixed(2) ?? '-') + 'ug/m3'}</Text>
        </Tooltip>
      </Form.Item>
      <Form.Item
        label='AEp'
        name='AEp'
      >
        <Tooltip title='AE每提升1个单位，最终计算数值减少N个ug/m3'>
          <Text>{(getAEp()?.toFixed(2) ?? '-') + 'ug/m3'}</Text>
        </Tooltip>
      </Form.Item>
    </Form>
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
      <Form.Item
        label='AE'
        name='AE'
        rules={[{ required: true, message: 'AE' }]}
      >
        <Input type='number' style={{ width: 100 }} />
      </Form.Item>
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
          <Text>{`${zeroPPB?.toFixed(2) ?? '-'} ppb => ${getUgm3(zeroPPB)?.toFixed(2) ?? '-'} ug/m3`}</Text>
        </Tooltip>
      </Form.Item>
      <Form.Item
        label='Standard'
        name='Standard'
      >
        <Tooltip title={`根据校准参数计算出标气数值`}>
          <Text>{`${standardPPB?.toFixed(2) ?? '-'} ppb => ${getUgm3(standardPPB)?.toFixed(2) ?? '-'} ug/m3`}</Text>
        </Tooltip>
      </Form.Item>
    </Form>
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
      {checkboxValues.map(sensor => SensorFrom({ sensor, temperature, pressure }))}
    </div>
  )
}