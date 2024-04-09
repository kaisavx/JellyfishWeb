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

export interface MainHello2Req {
  /**
   * Your age
   * @format int
   */
  Age: number;
  /**
   * data list
   * @format []main.Datum
   */
  DataList: MainDatum[];
  DatumItem?: MainDatum;
}

export interface MainDatum {
  /** @format int */
  Id?: number;
  /** @format string */
  Value?: string;
}

export interface MainHelloRes {
  /**
   * Reply content
   * @format string
   */
  ReplyContent?: string;
}

export type MainHelloReq = object;
