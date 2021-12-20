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

  }
}
