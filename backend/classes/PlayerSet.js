module.exports = class PlayerSet
{
  #players = { }
  #added = null

  get count()
  {
    return Object.keys(this.#players).length
  }

  set added(v)
  {
    this.#added = v
  }

  add(players)
  {
    const names = Object.keys(this.#players)

    for (const playerName in players)
      if (names.includes(playerName))
        return false

    this.#players = { ...this.#players, ...players}
    this.#added?.(players)
    return true;
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
