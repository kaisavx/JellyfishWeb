import mqtt, { QoS } from "mqtt/dist/mqtt"
import {mqttOption} from './config'
import { singleEmqxHttp } from "./EmqxHttp"

const TopicPrefix = 'web'

let client: mqtt.MqttClient | undefined = undefined
let clientId: string | undefined = undefined

interface MqttMsg{
  Msg: string
}

export function subscribe(clientId: string,qos?:QoS) {
  client?.subscribe(`${TopicPrefix}/server/${clientId}`, { qos: qos ?? 2 }, (err, granted) => {
    if (err) {
      console.error(`cId:${clientId} subscribe`,err)
    }
  })
}

export function emqxPublish(msg: object, qos: QoS|undefined, callback?: mqtt.PacketCallback | undefined) {
  const m = JSON.stringify(msg)

  console.info(`publish:${m}`)
  client?.publish(`${TopicPrefix}/client/${clientId}`,m , { qos: qos ?? 2 }, callback)
}

export function emqxInit(_clientId: string) {
  clientId = _clientId
  const c = mqtt.connect(mqttOption.mqttUrl, {
    clean: true,
    connectTimeout: 4000,
    clientId,
    username: mqttOption.mqttUser,
    password: mqttOption.mqttPswd,
  })
  client = c
  c.on('connect', packet => {
    console.info(`cId:${clientId} connection`, packet)
    if (clientId) {
      subscribe(clientId)
    }
  })
  c.on('reconnect', () => {
    console.info(`cId:${clientId} reconnect`)
    if (clientId) {
      subscribe(clientId)
    }
  })
  c.on('error', err => {
    console.error('Connection failed:',err)
  })
  c.on('message', (topic, message, packet) => {
    console.log('receive message：', topic, message.toString(), packet)
    singleEmqxHttp.response(topic, message.toString())
  })  
}

export function emqxClose() {
  client?.end(false, undefined, err => {
    console.error('end', err)
    if (!err) {
      client = undefined
    }
  })

  
}