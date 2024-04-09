import _ from "lodash"
import { v4 } from "uuid"
import { emqxPublish } from "./emqx"

export interface EHRequestOption {
  timeoutMs: number
}

export interface EHRequestBase {
  Path: string
  Method: string
  secure?: boolean
  Query?: any,
  Body?: any,
  Headers: any,
  Option?: EHRequestOption
}

export interface EHRequestFull extends EHRequestBase {
  id: string
  startTs: number
  resolve: (value: any) => void
  reject: (reason: any) => void
}

export class EmqxHttp {
  private reqDic: _.Dictionary<EHRequestFull> = {}

  constructor() {

    const checkTimeout = () => {
      // console.info("checkTimeout")
      const now = Date.now()

      Object.keys(this.reqDic).forEach(it => {
        const item = this.reqDic[it]
        const timeout = item.Option?.timeoutMs ?? 5000
        if (item.startTs + timeout < now) {
          delete this.reqDic[it]
          item.reject("timeout")
          console.info('request timeout', {
            item
          })
        }
      })

      setTimeout(checkTimeout, 100)
    }

    checkTimeout()
  }

  request<T>(req: EHRequestBase): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = v4()
      const fullReq: EHRequestFull = {
        id,
        startTs: Date.now(),
        ...req,
        resolve,
        reject,
      }
      this.reqDic[id] = fullReq

      const reqObject = Object.keys(req).reduce((prev, it) => {
        const value = (req as any)[it]
        if (value == null || value == undefined) {
          return prev
        }
        prev[it] = value
        return prev
      }, {} as any)

      emqxPublish({
        ...reqObject,
        RId: id,
      }, undefined, (error, packet) => {

        if (error) {
          console.error("emqxPublish err", error)
          delete this.reqDic[id]
          reject(error)
        }
      })

    })
  }

  response(topic: string, message: string) {
    try {
      const o = JSON.parse(message)
      const req = this.reqDic[o.RId ?? '']
      if (!req) {
        console.error('req not found', { topic, message })
        return;
      }
      req.resolve(o)
      delete this.reqDic[o.RId ?? '']
    } catch (e) {
      console.error('[response]', e, topic, message)
    }
  }
}

export const singleEmqxHttp = new EmqxHttp