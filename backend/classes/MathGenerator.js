module.exports = class MathGenerator
{
  #combinations = [ ]
  #partials = [ ]
  #permutations = [ ]
  #combinatoricSets

  constructor(kMax = 0, max = 0, lockPermutations = false, parallel = false)
  {
    let lastPermutation = 0

    for (let k = 2; k <= kMax; ++k)
    {
      const kFact = this.fact(k)
      let lastPartial = 0, lastCombination = 0
      this.#combinations[k] = [ ]
      this.#partials[k] = [ ]

      if (!lockPermutations || lastPermutation < max)
        lastPermutation = this.#permutations[k] = kFact

      for (let n = k + 1; lastPartial < max || lastCombination < max; ++n)
      {
        const nFact = this.fact(n)

        if (parallel || lastPartial < max)
          lastPartial = this.#partials[k][n] = Math.round(nFact / kFact);

        if (parallel || lastCombination < max)
          lastCombination =
            this.#combinations[k][n] =
              Math.round(nFact / (this.fact(n - k) * kFact))
      }
    }

    this.#combinatoricSets =
    {
      'C': this.#combinations,
      'D': this.#partials,
      'P': this.#permutations
    }
  }

  #renderBlock(negative, coef, suffix)
  {
    coef = this.dynamicAbs(coef)
    const r =  (negative ? '-' : '+') + (coef == 1 && suffix != '' ? '' : coef) + suffix
    return r.startsWith('+0') ? '' : r
  }

  #finalizeExpression(exp)
  {
    if (exp.startsWith('+'))
      exp = exp.slice(1)

    let left = exp.slice(0, 1), right = exp.slice(1)
    right = right.replaceAll('+', ' + ')
    right = right.replaceAll('-', ' - ')
    return left + right
  }

  #fractionAsCoefficient(n, d)
  {
    return /*html*/ `
      <div class="fraction">
        <span>${this.dynamicAbs(n)}</span>
        <hr>
        <span>${this.dynamicAbs(d)}</span>
      </div>
    `.replaceAll(/\n|\r|\t|\s\s/g, '')
  }

  #renderLimitPrefix(approach, fractionWithin = false)
  {
    fractionWithin |= approach.includes('fraction')

    return /*html*/ `
      <div class="fraction limit ${fractionWithin ? 'fraction-within' : ''}">
        <span>lim</span>
        <span>x &xrarr; ${approach}</span>
      </div>
    `.replaceAll(/\n|\r|\t|\s\s/g, '')
  }

  #renderPower(base, exponent)
  {
    if (exponent == 0)
      return ''
    if (exponent == 1)
      return String(base)
    else
      return /*html*/ `${base}<sup>${exponent}</sup>`
  }

  #randomCobinatoricSetKey()
  {
    let keys = Object.keys(this.#combinatoricSets)
    return keys[this.randomInt(0, keys.length - 1)]
  }

  dynamicAbs(obj)
  {
    return typeof obj == 'number' ? Math.abs(obj) : obj
  }

  gcd(a, b)
  {
    let t
    a = Math.abs(a)
    b = Math.abs(b)

    if (a < b)
    {
      t = b
      b = a
      a = t
    }

    while (b != 0)
    {
      t = b
      b = a % b
      a = t
    }

    return a
  }

  fact(n)
  {
    let r = 1;

    for (var i = 2; i <= n; ++i)
      r *= i;

    return r;
  }

  randomBool()
  {
    return Math.random() < 0.5
  }

  randomInt(min, max, exclusionPredicate = () => false)
  {
    let r

    do
      r = Math.floor(Math.random() * (max - min + 1) + min)
    while (exclusionPredicate(r))

    return r
  }

  randomEquation(set, forceEqZero = false, x1 = null, x2 = null, alpha = null, xDen1 = 1, xDen2 = 1)
  {
    let complexity = 2, isImpossible = false

    if (x1 == null)
    {
      x1 = set[
        this.randomInt(
          0,
          set.length - 1,
          r => typeof set[r] == 'string' && set[r].endsWith('&infin;')
        )
      ]

      set.splice(set.indexOf(x1), 1)

      if (isImpossible = x1 == '&empty;')
      {
        x1 = this.randomInt(2, 25)
        x2 = this.randomInt(2, 25)
      }
    }

    if (x2 == null)
    {
      if (x1 != 0 && this.randomInt(1, 6) <= 1)
        x2 = x1
      else
      {
        x2 = set[this.randomInt(0, set.length - 1)]
        set.splice(set.indexOf(x2), 1)
        ++complexity
      }
    }

    let a = 1, aDen = 1

    if (alpha != null)
    {
      a = alpha.num
      aDen = alpha.den
    }
    else if (this.randomInt(1, 5) <= 3)
    {
      ++complexity
      a = this.randomInt(-25, 25, r => r == 0 || r == 1)

      if (this.randomInt(1, 3) <= 1)
      {
        ++complexity
        aDen = this.randomInt(2, 25, r => r / this.gcd(a, r) == 1)
      }
    }

    let b = -a * (x1 * xDen2 + x2 * xDen1), c = a * x1 * x2
    let bDen = aDen * xDen1 * xDen2, cDen = aDen * xDen1 * xDen2
    let cRight = false, fullFraction = false
    let aBlock = a, bBlock = b, cBlock = c

    if (!forceEqZero && c != 0 && this.randomInt(1, 4) <= 1)
    {
      cRight = true
      cBlock = c = -c
      complexity += .5
    }

    if (aDen != 1 || bDen != 1 || cDen != 1)
    {
      let gcd = this.gcd(a, aDen)
      aBlock = a /= gcd
      aDen /= gcd
      gcd = this.gcd(b, bDen)
      bBlock = b /= gcd
      bDen /= gcd
      gcd = this.gcd(c, cDen)
      cBlock = c /= gcd
      cDen /= gcd
      complexity += (bDen != 1) + (bDen != cDen && cDen != 1)

      if (c == 0)
        complexity -= .5
      else if (b == 0)
        complexity += .5

      if (!forceEqZero && c != 0 && this.randomInt(1, 5) <= 1)
      {
        fullFraction = true

        if (!cRight)
        {
          cRight = true
          cBlock = c = -c
          complexity += .5
        }

        complexity += .5
        bBlock = b *= aDen / bDen
      }
      else
      {
        if (aDen != 1)
        {
          if (aDen == bDen && (bDen == cDen || cDen == 0) || aDen == cDen && bDen == 0)
          {
            complexity -= .5
            aBlock = a *= 3
            aDen *= 3
          }

          aBlock &&= this.#fractionAsCoefficient(a, aDen)
        }

        if (bDen != 1)
          bBlock &&= this.#fractionAsCoefficient(b, bDen)

        if (cDen != 1)
          cBlock &&= this.#fractionAsCoefficient(c, cDen)
      }
    }

    aBlock = this.#renderBlock(!isImpossible && a < 0, aBlock, /*html*/ `x<sup>2</sup>`)
    bBlock = this.#renderBlock(!isImpossible && b < 0, bBlock, 'x')
    cBlock = this.#renderBlock(!isImpossible && c < 0, cBlock, '')

    if (b != 0 && this.randomInt(1, 5) <= 2)
    {
      let t
      complexity += .5

      switch (cRight ? 1 : this.randomInt(1, 3))
      {
        case 1:
          t = bBlock
          bBlock = aBlock
          aBlock = t
          break

        case 2:
          t = cBlock
          cBlock = bBlock
          bBlock = t
          break

        default:
          t = cBlock
          cBlock = aBlock
          aBlock = t
          break
      }
    }

    if (fullFraction)
    {
      aBlock = this.#fractionAsCoefficient(aBlock + bBlock, aDen)
      bBlock = ''
    }

    let leftOfEq, rightOfEq, result

    if (cRight)
    {
      leftOfEq = ''
      rightOfEq = cBlock
    }
    else
    {
      leftOfEq = cBlock
      rightOfEq = '0'
    }

    console.log(`[${a}/${aDen}](x - ${x1}/${xDen1})(x - ${x2}/${xDen2})`)

    if (isImpossible)
      result = [ '&empty;' ]
    else if (x1 == x2)
      result = [ x1 ]
    else
      result = [ x1, x2 ]

    return {
      result: result,
      complexity: complexity,

      text:
        this.#finalizeExpression(aBlock + bBlock + leftOfEq) +
        ' = ' +
        this.#finalizeExpression(rightOfEq)
    }
  }

  randomLimitZZ(set)
  {
    const alpha = { num: this.randomInt(-8, 8, r => r == 0), den: 1 }
    let complexity = 2, isOne = false, isZero = false, infinitySign = null
    let limR = set[this.randomInt(0, set.length - 1, r => set[r] == '&empty;')]
    set.splice(set.indexOf(limR), 1)

    if (typeof limR == 'string')
    {
      infinitySign = limR[0]
      limR = this.randomInt(2, 8)
      alpha.num = 1
    }
    else if (limR == 1)
    {
      isOne = true
      limR = -limR
    }
    else if (limR == 0 && this.randomInt(1, 4) <= 3)
    {
      isZero = true
      limR = this.randomInt(-8, 8, r => r == 0 || r == 1)
    }

    if (infinitySign == null && this.randomInt(1, 5) <= 1)
    {
      ++complexity
      alpha.den = this.randomInt(2, 8, r => r / this.gcd(alpha.num, r) == 1)
    }

    let sign = alpha.num / Math.abs(alpha.num)
    let den = alpha.num * sign
    let multiplier, salt, approach, xTop, xBottom

    do
    {
      multiplier = infinitySign == null ?
        this.randomInt(-8, 8, r => r == 0) : this.randomInt(-8, -1)

      salt = infinitySign == null ? this.randomInt(-8, 8, r => r == 0) : 0
      approach = (limR + salt) * alpha.den * sign
      xTop = isZero ? approach : (limR * multiplier + limR + salt) * alpha.den * sign
      xBottom = infinitySign == null ? (limR + multiplier + salt) * alpha.den * sign : approach
    } while (xTop == xBottom)

    const equationTop = this.randomEquation(
      null,
      true,
      approach,
      xTop,
      alpha,
      den,
      den
    )

    const equationBottom = this.randomEquation(
      null,
      true,
      approach,
      xBottom,
      alpha,
      den,
      den
    )

    const gcd = this.gcd(approach, den)
    let block = approach /= gcd
    den /= gcd

    if (den != 1)
    {
      complexity += .5
      block &&= this.#fractionAsCoefficient(approach, den)
    }

    const prefix = this.#renderLimitPrefix(
      this.#finalizeExpression(
        this.#renderBlock(
          approach < 0,
          block,
          infinitySign == null ? '' : /*html*/ `<sup>@</sup>`
        ) || '0'
      ).replace('@', infinitySign),
      true
    )

    const suffix = (isOne ? '-' : '') + this.#fractionAsCoefficient(
      equationTop.text,
      equationBottom.text
    ).replaceAll(' = 0', '')

    if (infinitySign == null)
      limR = (isZero ? 0 : limR) * (isOne ? -1 : 1)
    else
    {
      complexity -= .5
      limR = infinitySign + '&infin;'
    }

    return {
      result: [ limR ],
      complexity: complexity + equationTop.complexity + equationBottom.complexity,
      text: prefix + suffix
    }
  }

  randomLimitII(set)
  {
    // Draw.

    let complexity = 2, limR = set[this.randomInt(0, set.length - 1, r => set[r] == '&empty;')]
    set.splice(set.indexOf(limR), 1)

    // Generation.

    let denTerms = new Array(this.randomInt(2, 4)), numTerms = new Array(this.randomInt(2, 4))
    const maxTerms = Math.max(denTerms.length, numTerms.length)
    const approachSign = this.randomBool() ? 1 : -1
    denTerms[0] = { coef: this.randomInt(-8, 8, r => r == 0) }

    if (typeof limR == 'string')
    {
      numTerms[0] =
      {
        coef: denTerms[0].coef * this.randomInt(-8, 8, r => r == 0),
        exponent: this.randomInt(maxTerms, 12)
      }

      denTerms[0].exponent = this.randomInt(maxTerms - 1, numTerms[0].exponent - 1)
      const resultSign = parseInt(limR[0] + 1)
      const internalApproachSign = approachSign ** (numTerms[0].exponent - denTerms[0].exponent)
      let numSign = numTerms[0].coef / Math.abs(numTerms[0].coef) * internalApproachSign
      let denSign = denTerms[0].coef / Math.abs(denTerms[0].coef)

      if (numSign / denSign != resultSign)
        numTerms[0].coef *= resultSign
    }
    else if (limR == 0)
    {
      denTerms[0].exponent = this.randomInt(maxTerms, 12)

      numTerms[0] =
      {
        coef: denTerms[0].coef * this.randomInt(-8, 8, r => r == 0),
        exponent: this.randomInt(maxTerms - 1, denTerms[0].exponent - 1)
      }
    }
    else
    {
      numTerms[0] =
      {
        coef: denTerms[0].coef * limR,
        exponent: denTerms[0].exponent = this.randomInt(maxTerms - 1, 12)
      }
    }

    const filler = (terms, min, max) =>
    {
      const exponents = [ ]

      for (let i = 0; i < terms[0].exponent - 1; ++i)
        exponents[i] = i + 1

      for (let i = 1; i < terms.length; ++i)
      {
        const exponent = exponents[this.randomInt(0, exponents.length - 1)]
        exponents.splice(exponents.indexOf(exponent), 1)

        terms[i] =
        {
          coef: this.randomInt(min, max, r => r == 0),
          exponent: i == terms.length - 1 ? 0 : this.randomInt(1, exponent)
        }
      }
    }

    filler(denTerms, -80, 80)
    filler(numTerms, -160, 160)
    const prefix = this.#renderLimitPrefix((approachSign < 0 ? '-' : '+') + '&infin;', true)

    const mixer = terms =>
    {
      if (terms.length > 2 && this.randomBool())
      {
        let index = this.randomInt(1, terms.length - 1), t = terms[0]
        terms[0] = terms[index]
        terms[index] = t
        index = this.randomInt(1, terms.length - 1, r => r == index)
        t = terms[0]
        terms[0] = terms[index]
        terms[index] = t
        complexity += 0.5
      }

      return terms
    }

    const suffix = this.#fractionAsCoefficient(
      this.#finalizeExpression(
        mixer(
          numTerms.map(term => this.#renderBlock(
            term.coef < 0,
            term.coef,
            this.#renderPower('x', term.exponent)
          ))
        ).join('')
      ),
      this.#finalizeExpression(
        mixer(
          denTerms.map(term => this.#renderBlock(
            term.coef < 0,
            term.coef,
            this.#renderPower('x', term.exponent)
          ))
        ).join('')
      )
    )

    return {
      result: [ limR ],
      complexity: complexity,
      text: prefix + suffix
    }
  }

  randomCombinatoricExpression(set)
  {
    let k = null, n = null, adding = 0, setKey = this.#randomCobinatoricSetKey()

    let value = set[
      this.randomInt(
        0,
        set.length - 1,
        r => typeof set[r] == 'string' && set[r].endsWith('&infin;')
      )
    ]

    set.splice(set.indexOf(value), 1)

    if (value == '&empty;')
    {
      if (setKey == 'P')
        k = this.randomInt(-9, -1)
      else if (this.randomBool())
      {
        k = this.randomInt(2, 10)
        n = this.randomInt(k + 1, k + 9)
      }
      else
      {
        k = this.randomInt(-9, -1)
        n = this.randomInt(2, 10) * (this.randomBool() ? -1 : 1)

        if (this.randomBool())
        {
          let t = n
          n = k
          k = t
        }
      }
    }
    else if (setKey == 'P')
    {
      for (let i = 2; i < this.#combinatoricSets[setKey].length; ++i)
      {
        if (this.#combinatoricSets[setKey][i] == value)
        {
          k = i
          break
        }
      }

      if (k == null)
      {
        k = this.randomInt(2, this.#combinatoricSets[setKey].length - 1)
        adding = value - this.#combinatoricSets[setKey][k]
      }
    }
    else
    {
      k = this.randomInt(2, this.#combinatoricSets[setKey].length - 1)

      for (let i = k + 1; i < this.#combinatoricSets[setKey][k].length; ++i)
      {
        if (this.#combinatoricSets[setKey][k][i] == value)
        {
          n = i
          break
        }
      }

      if (n == null)
      {
        n = this.randomInt(k + 1, this.#combinatoricSets[setKey][k].length - 1)
        adding = value - this.#combinatoricSets[setKey][k][n]
      }
    }

    return {
      result: [ value ],
      complexity: 1,

      text:
        /*html*/ `${setKey}<sub>${setKey == 'P' ? '' : n + ','}${k}` +
        this.#finalizeExpression(/*html*/ `</sub>${this.#renderBlock(adding < 0, adding, '')}`)
    }
  }
}
