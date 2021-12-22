const QuestionGenerator = require('./QuestionGenerator')

module.exports = class Game
{
  #prizes =
  {
    'ambo': false,
    'terna': false,
    'quaterna': false,
    'cinquina': false,
    'tombola': false
  }

  #changes = { }
  #fakeSelections = { }
  #realSelections = { }
  #oldQuestion
  #question
  rankings

  get question()
  {
    return this.#question
  }

  set question(v)
  {
    this.#oldQuestion = this.#question
    this.#question = v
  }

  constructor(players, oldQuestion = null)
  {
    this.rankings = { fake: players, real: { ...players } }
    this.#oldQuestion = oldQuestion

    for (const name in players)
    {
      this.#fakeSelections[name] = [ 0, 0, 0 ]
      this.#realSelections[name] = [ 0, 0, 0 ]
    }
  }

  clearChanges()
  {
    this.#changes = { }
  }

  insertChanges(changes)
  {
    this.#changes = { ...this.#changes, ...changes }
  }

  calculate()
  {
    let fakeScore = 0, realScore = 0, message = null, user = null

    for (const name in this.#changes)
    {
      for (const answer in this.#changes[name])
      {
        let n = 0

        switch (++this.#fakeSelections[name][this.#changes[name][answer]])
        {
          case 2:
            if (!this.#prizes['ambo'])
            {
              n = 2
              user = name
              this.#prizes[message = 'ambo'] = true
            }
            break

          case 3:
            if (!this.#prizes['terna'])
            {
              n = 3
              user = name
              this.#prizes[message = 'terna'] = true
            }
            break

          case 4:
            if (!this.#prizes['quaterna'])
            {
              n = 4
              user = name
              this.#prizes[message = 'quaterna'] = true
            }
            break

          case 5:
            if (!this.#prizes['cinquina'])
            {
              n = 5
              user = name
              this.#prizes[message = 'cinquina'] = true
            }
            break
        }

        fakeScore += n + 1

        if (this.#oldQuestion.result.includes(answer))
        {
          ++realScore

          if (++this.#realSelections[name][this.#changes[name][answer]] == n && n > 0)
            realScore += n
        }
      }

      if (!this.#prizes['tombola'] && this.#fakeSelections[name].every(s => s == 5))
      {
        if (this.#realSelections[name].every(s => s == 5))
          realScore += 10

        fakeScore += 10
        user = name
        this.#prizes[message = 'tombola'] = true
        break
      }

      this.rankings.fake[name] += fakeScore
      this.rankings.real[name] += realScore
    }

    if (message != null)
      message = `${user} ha fatto ${message}!`

    return { message: message, name: user}
  }
}
