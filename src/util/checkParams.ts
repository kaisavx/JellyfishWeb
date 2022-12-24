export function checkParams(params: _.Dictionary<any>): boolean{
  return Object.values(params).some(it=>it===undefined)
}