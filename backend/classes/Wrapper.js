module.exports = class Wrapper
{
  #value
  #changed = null

  constructor(v)
  {
    this.value = v
  }

  get value()
  {
    return this.#value
  }

  set value(v)
  {
    this.#value = v
    this.#changed?.()
  }

  set changed(v)
  {
    this.#changed = v
  }
}
