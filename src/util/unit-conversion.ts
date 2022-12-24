import { checkParams } from "./checkParams"

export interface ppb2ugm3Params {
  m?: number
  pa?: number
  ppb?: number
  temp?: number
}

export function ppb2ugm3Multiple(params: {
  m?: number,
  pa?: number,
  temp?: number,
  }): number | undefined {
  if (checkParams(params)) {
    return undefined
  }
  const {
    m=1,
    pa=1,
    temp=1
  } = params
  return m / 22.4 * 273 * pa / 101325 / (273 + temp)
}

export function ppb2ugm3(params: ppb2ugm3Params): number|undefined {
  if (checkParams(params)) {
    return undefined
  }
  const {
    m =1,
    pa =1,
    ppb=1,
    temp=1,
  } = params
  const multiplier = ppb2ugm3Multiple({ m, pa, temp }) 
  if (!multiplier) {
    return undefined
  }
  return ppb * multiplier
}

