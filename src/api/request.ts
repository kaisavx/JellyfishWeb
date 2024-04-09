// import fetch from 'node-fetch'
import { EHRequestBase, EHRequestOption, singleEmqxHttp } from '@src/util/EmqxHttp'

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

export async function request(params:EHRequestBase): Promise<any> {
  const token = 'test'
  if (params.secure) {
    params.Headers.authorization=`Bearer ${token}`
  }
  return singleEmqxHttp.request(params)
}

export type RequestOption = EHRequestOption