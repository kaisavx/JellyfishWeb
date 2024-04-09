/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { request, RequestOption } from "../request";
import { MainHello2Req, MainHelloRes } from "./data-contracts";

/**
 * No description
 *
 * @tags Test2
 * @name Test2Hello2
 * @request POST:/test2s/hello2
 */

export const test2Hello2 = async (
  query: {
    /** @format string */
    Name: string;
  },
  data: MainHello2Req,
  option?: RequestOption,
): Promise<MainHelloRes> => {
  return await request({
    Path: "/test2s/hello2",
    Method: "POST",
    Body: data,
    Query: query,
    Headers: {
      "content-type": "application/json",
    },
    Option: option,
  });
};
