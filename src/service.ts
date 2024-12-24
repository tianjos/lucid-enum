import { CherryPick, EnumLike, KeyOf, ValueOf } from './types.js'

class EnumService<T> implements EnumLike<T> {
  #selected!: KeyOf<T> | ValueOf<T>

  #makeLookupReverse() {
    const found = Object.entries(this.$enum as any).find(([_, value]) => value === this.#selected)
    if (!found) {
      return
    }

    const [key, _] = found

    return key as keyof T
  }

  #makeLookup() {
    return (this.$enum as any)[this.#selected] as ValueOf<T>
  }

  static use<T>(enumLike: T) {
    return new EnumService(enumLike)
  }

  constructor(public readonly $enum: T) {}

  with(selected: KeyOf<T> | ValueOf<T>) {
    this.#selected = selected

    return this
  }

  keys(cherryPick?: Partial<CherryPick<KeyOf<T>>>) {
    // TODO: refact
    if (cherryPick?.omit || cherryPick?.pick) {
      const keys = []

      if (cherryPick.omit) {
        keys.push(
          ...Object.keys(this.$enum as any).filter((key) => !cherryPick.omit?.includes(key as any))
        )
      }

      if (cherryPick.pick) {
        keys.push(
          ...Object.keys(this.$enum as any).filter((key) => cherryPick.pick?.includes(key as any))
        )
      }

      return Array.from(new Set(keys)) as KeyOf<T>[]
    }

    return Object.keys(this.$enum as any) as KeyOf<T>[]
  }

  key() {
    return this.isKey(this.#selected) ? this.#selected : (this.#makeLookupReverse() as KeyOf<T>)
  }

  values(cherryPick?: Partial<CherryPick<ValueOf<T>>>) {
    // TODO: refact
    if (cherryPick?.omit || cherryPick?.pick) {
      const values = []
      if (cherryPick.omit) {
        values.push(
          ...Object.values(this.$enum as any).filter(
            (value) => !cherryPick.omit?.includes(value as any)
          )
        )
      }

      if (cherryPick.pick) {
        values.push(
          ...Object.values(this.$enum as any).filter((value) =>
            cherryPick.pick?.includes(value as any)
          )
        )
      }

      return Array.from(new Set(values)) as ValueOf<T>[]
    }

    return Object.values(this.$enum as any) as ValueOf<T>[]
  }

  value() {
    return this.isValue(this.#selected) ? this.#selected : (this.#makeLookup() as ValueOf<T>)
  }

  isKey(key: any): key is KeyOf<T> {
    return this.keys().includes(key)
  }

  isValue(value: any): value is ValueOf<T> {
    return this.values().includes(value)
  }

  isEquals(value: KeyOf<T> | ValueOf<T>): boolean {
    return this.#selected === value
  }

  toString() {
    return this.#selected
  }
}

export const $enum = <T>(enumLike: EnumLike<T>) => EnumService.use(enumLike)
