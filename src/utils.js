export function toJSifNeeded(obj) {
  return obj && obj.toJS ? obj.toJS() : obj
}