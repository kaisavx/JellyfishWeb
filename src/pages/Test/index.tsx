import { emqxPublish } from "@src/util/emqx"
import "./index.scoped.scss"

import { Button } from "antd"
import React, { useEffect } from "react"
import { test2Hello2 } from "@src/api/collection/Test2S"

export default function Test() {
  useEffect(() => {

    return () => {
    }
  }, [])

  const handleClick = async() => {
    console.log('click')

    // singleEmqxHttp.request({
    //   timeoutMs: 10000,
    //   params: {
    //     path: 'test',
    //     body: { name: 'body' },
    //     headers: {name:'headers'},
    //   }
    // }).then(res => {
    //   console.info('request res',res)
    // }).catch(err => {
    //   console.info('request err',err)
    // })
    // emqxPublish({ Msg: 'hello world' },undefined)
    // const res = await testHello({ Name: 'emqx test' })
    const res = await test2Hello2({ Name: 'emqx test2' }, {
      Age: 13, DataList: [{
        Id: 11,
        Value: "test1",
      }, {
        Id: 12,
        Value: "test2",
      }], DatumItem: {
        Id: 1,
        Value: "test"
      }
    })
    console.info("testHello",res)
  }

  return (
    <div className='test-body'>
      <Button type="primary" htmlType="button" onClick={handleClick}>
        submit
      </Button>
    </div>
  )
}