import type { ColumnOptions } from '@adonisjs/lucid/types/model'

type EnumColumnDecorator<T> = {
  enumLike: EnumLike<T>
  isLookupReverse?: boolean
}

export type EnumOptions<T> = Partial<Pick<ColumnOptions, 'columnName' | 'meta' | 'serialize'>> &
  EnumColumnDecorator<T>

export type ValueOf<T> = T[keyof T]

export type KeyOf<T> = Extract<keyof T, string>

export type CherryPick<T> = {
  pick?: T[]
  omit?: T[]
}

export interface EnumLike<T> {
  with(selected: KeyOf<T> | ValueOf<T>): this

  keys(cherryPick?: Partial<CherryPick<KeyOf<T>>>): KeyOf<T>[]

  values(cherryPick?: Partial<CherryPick<ValueOf<T>>>): ValueOf<T>[]

  key(): KeyOf<T>

  value(): ValueOf<T>

  isKey(key: any): key is KeyOf<T>

  isValue(value: any): value is ValueOf<T>

  isEquals(value: KeyOf<T> | ValueOf<T>): boolean

  toString(): KeyOf<T> | ValueOf<T>
}
