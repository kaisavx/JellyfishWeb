import _ from 'lodash'

export function getNByTemp({
  coefficients, temp
}: {
  coefficients: number[], temp: number
}): number | undefined {
  if (temp < -30) {
    return coefficients[0]
  } else if (temp >= 50) {
    return _.last(coefficients)
  }
  const _temp = temp + 30
  const t = Math.floor(_temp / 10)
  const min = coefficients[t]
  const max = coefficients[t + 1]
  return min + (max - min) * (_temp / 10 - t)
}

export function formula1({
  WEu, AEu, WEe, AEe, nt
}: {
  WEu: number,
  AEu: number,
  WEe: number,
  AEe: number,
  nt: number
}): number {
  return (WEu - WEe) - nt * (AEu - AEe)
}

export function formula2({
  WEu, AEu, WEe, AEe, WEo, AEo, kt
}: {
  WEu: number,
  AEu: number,
  WEe: number,
  AEe: number,
  WEo: number,
  AEo: number,
  kt: number
}): number {
  return (WEu - WEe) - kt * (WEo / AEo) * (AEu - AEe)
}

export function formula3({
  WEu, AEu, WEe, AEe, WEo, AEo, kt
}: {
  WEu: number,
  AEu: number,
  WEe: number,
  AEe: number,
  WEo: number,
  AEo: number,
  kt: number
}): number {
  return (WEu - WEe) - (WEo - AEo) - kt * (AEu - AEe)
}

export function formula4({
  WEu, WEe, WEo, kt
}: {
  WEu: number,
  WEe: number,
  WEo: number,
  kt: number
}): number {
  return (WEu - WEe) - WEo - kt
}

export function getFormula1S({
  WE1, WE0, AE1, AE0, nt, Standard
}: {
  WE1: number,
  WE0: number,
  AE1: number,
  AE0: number,
  nt: number,
  Standard: number,
}): number {
  return (WE1 - WE0 - nt * (AE1 - AE0)) / Standard
}

export function getFormula4S({
  WE1, WE0, Standard
}: {
  WE1: number,
  WE0: number,
  Standard: number,
}): number {
  return (WE1 - WE0) / Standard
}