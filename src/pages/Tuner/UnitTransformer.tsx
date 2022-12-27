import { Button, Form, Input } from "antd"
import React, { useEffect, useState } from "react"

export function UnitTransformer({
  multiple
}: {
  multiple?: number
}) {
  const [isChanged, SetChanged] = useState(false)
  const [converted, setConverted] = useState<number>()
  const [convert, setConvert] = useState<number>()

  useEffect(() => {
    if (convert === undefined ||
      multiple === undefined) {
      return
    }

    setConverted(isChanged
      ? convert / multiple
      : convert * multiple)

  }, [convert, multiple, isChanged])

  const handleConvertFieldChange = (values: any[]) => {
    console.info('[handleConvertFieldChange]', { values })

    const value = Number(values[0].value)
    setConvert(value)
  }

  const handleConvertChange = () => {
    SetChanged(it => !it)
  }

  const getUnit = (isChanged: boolean) => {
    return isChanged ? 'ug/m3' : 'PPB'
  }

  return (<div>
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
      </Form.Item>
    </Form>
  </div>)
}