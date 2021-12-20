const QuestionGenerator = require('./QuestionGenerator')

module.exports = class Game
{
  #generator
  #rankings

  constructor(players, generator)
  {
    this.#rankings = { fake: players, real: JSON.parse(JSON.stringify(players)) }
    this.#generator = generator

    for (let i = -43; i <= 43; ++i)
      this.#set.push(i)
  }
}
