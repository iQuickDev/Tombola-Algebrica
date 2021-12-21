const MathGenerator = require('./MathGenerator')

module.exports = class QuestionGenerator
{
  #generator
  #set = [ '&empty;', '-&infin;', '+&infin;' ]

  constructor()
  {
    this.#generator = new MathGenerator(10, 50, false, true)

    for (let i = -43; i <= 43; ++i)
      this.#set.push(i)
  }

  randomQuestion()
  {
    const prediction = this.#set[this.#generator.randomInt(0, this.#set.length - 1)]

    if (typeof prediction == 'string')
    {
      if (prediction == '&empty;')
      {
        if (this.#generator.randomBool())
          return this.#generator.randomEquation(this.#set)
        else
          return this.#generator.randomCombinatoricExpression(this.#set)
      }
      else
      {
        if (this.#generator.randomBool)
          return this.#generator.randomLimitZZ(this.#set)
        else
          this.#generator.randomLimitII(this.#set)
      }
    }
    else
    {
      switch (this.#generator.randomInt(1, 4))
      {
        case 1:
          return this.#generator.randomEquation(this.#set)

        case 2:
          return this.#generator.randomLimitZZ(this.#set)

        case 3:
          return this.#generator.randomLimitII(this.#set)

        default:
          return this.#generator.randomCombinatoricExpression(this.#set)
      }
    }
  }
}
