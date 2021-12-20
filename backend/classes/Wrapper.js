module.exports = class Wrapper
{
  #value
  #changed = null

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

  constructor(v)
  {
    this.value = v
  }
}
