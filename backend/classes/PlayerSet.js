module.exports = class PlayerSet
{
  #players = { }
  #added = null

  set added(v)
  {
    this.#added = v
  }

  add(players)
  {
    this.#players = { ...this.#players, ...players}
    this.#added?.(players)
  }

  remove(playerName)
  {
    delete this.#players[playerName]
  }

  toObject()
  {
    return this.#players
  }
}
