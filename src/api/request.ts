// import fetch from 'node-fetch'
import axios from 'axios'

export interface UnitPrecision {
  unit: string
  precision: number
}

export interface SensorOption {
  type: string
  no?: string
  model: string
  isShow: boolean
  nameCN: string
  nameEN: string
  categoryCN: string
  categoryEN: string
  range?: number
  resolution?: number
  overload?: number
  randomSeed?: number
  randomBase?: number
  minValue?: number
  isShowOperator?: number
  unitPrecisions: UnitPrecision[]
  method?: string
  isPolluted: boolean
  m?: number
  opFirst?: number
  opSecond?: number
  we?: number
  ae?: number
  s?: number
  address?: number

}

export interface DeviceOption {
  id: string
  no: string
  type: string
  model: string
  updatedTime: number
  createdTime: number
  ad1: number
  ad2: number
  sensorList: SensorOption[]
  editByUser: boolean
  connectedTime: number
  isConnected: boolean
  disabledTime?: number
  firmwareVersion?: string
  hardwareVersion?: string
  isDisabled?: boolean
  isSend?: boolean
  remarks?: string
  sendTime?: number
}


export async function getDeviceByNo(no: string): Promise<void> {

  console.info('test')
  const url = 'http://134.175.109.232/Server/JellyfishServer/Device/getDeviceByNo'

  const res = await axios({
    method: 'post',
    url,
    data: { no }
  });
  console.info('json', JSON.stringify(res))

  // const res = await fetch(url, {
  //   body: JSON.stringify({ no }),
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   }
  // })

  // const json = await res.json()

  // console.info('json',JSON.stringify(json))
}