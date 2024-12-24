import { LucidModel } from '@adonisjs/lucid/types/model'
import { $enum } from './service.js'
import type { EnumLike, EnumOptions, KeyOf, ValueOf } from './types.js'

const prepareEnumColumn = <T>(enumLike: EnumLike<T>, isLookupReverse: boolean = false) =>
  isLookupReverse ? enumLike.value() : enumLike.key()

const consumeEnumColumn = <T>(
  enumLike: EnumLike<T>,
  valueOrKey: KeyOf<EnumLike<T>> | ValueOf<EnumLike<T>>
) => $enum(enumLike).with(valueOrKey)

export const enumify = <T>(enumOpts: EnumOptions<T>) => {
  return function decorateAsColumn(target: any, property: string) {
    const Model = target.constructor as LucidModel
    Model.boot()

    const { enumLike, isLookupReverse } = enumOpts

    const options = Model.$columnsDefinitions.get(property)

    Model.$addColumn(property, {
      ...options,
      ...{
        prepare: (enumColumn: EnumLike<typeof enumLike> | null) =>
          enumColumn ? prepareEnumColumn(enumColumn, isLookupReverse) : null,
        consume: (value: any | null) => (value ? consumeEnumColumn(enumLike, value) : null),
        serialize: (enumColumn: EnumLike<T> | null) =>
          enumColumn ? (isLookupReverse ? enumColumn.value() : enumColumn.key()) : null,
      },
    })
  }
}
