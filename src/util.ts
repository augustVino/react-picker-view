interface Item {
  label: string
  value: any
}

export function findItem(val: any, arr: Item[]) {
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]
    if (item.value === val) return item
  }
  return null
}

export function hasVal(val: any, arr: any) {
  return arr.some((item: Item) => item.value === val)
}

export function bound(position: number, min: number | undefined, max: number | undefined) {
  let ret = position
  if (min !== undefined) {
    ret = Math.max(position, min)
  }
  if (max !== undefined) {
    ret = Math.min(ret, max)
  }
  return ret
}

export function rubberband(distance: number, dimension: number, constant: number) {
  return (distance * dimension * constant) / (dimension + constant * distance)
}

// eslint-disable-next-line max-params
export function rubberbandIfOutOfBounds(
  position: number,
  min: number,
  max: number,
  dimension: number,
  constant = 0.15
) {
  if (constant === 0) return bound(position, min, max)
  if (position < min) return -rubberband(min - position, dimension, constant) + min
  // eslint-disable-next-line no-implicit-coercion
  if (position > max) return +rubberband(position - max, dimension, constant) + max
  return position
}

export const PREFIX_CLS = 'hipin-picker-view'
