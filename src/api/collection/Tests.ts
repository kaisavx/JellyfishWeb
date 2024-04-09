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
import { MainHelloRes } from "./data-contracts";

/**
 * No description
 *
 * @tags Test
 * @name TestHello
 * @request GET:/tests/hello
 */

export const testHello = async (
  query: {
    /**
     * Your name
     * @format string
     */
    Name: string;
  },
  option?: RequestOption,
): Promise<MainHelloRes> => {
  return await request({
    Path: "/tests/hello",
    Method: "GET",
    Query: query,
    Headers: {
      "content-type": "application/json",
    },
    Option: option,
  });
};
