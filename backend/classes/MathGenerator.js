module.exports = class MathGenerator
{
  #renderBlock(negative, coefficient, suffix)
  {
    const r = (negative ? '-' : '+') + this.dynamicAbs(coefficient) + suffix
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

  randomBool()
  {
    return Math.floor(Math.random()) == 1
  }

  randomInt(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  randomEquation(set, x1 = null, forceEqZero = false)
  {
    let x2, complexity = 1
    x1 ??= set[this.randomInt(0, set.length - 1)]
    set.splice(set.indexOf(x1), 1)

    if (x1 != 0 && this.randomInt(1, 6) <= 1)
      x2 = x1
    else
    {
      x2 = set[this.randomInt(0, set.length - 1)]
      set.splice(set.indexOf(x2), 1)
      ++complexity
    }

    let a = 1, aDen = 1, bDen = 1, cDen = 1

    if (this.randomBool(1, 5) <= 3)
    {
      do
        a = this.randomInt(-25, 25)
      while (a == 0 || a == 1)

      ++complexity

      if (this.randomInt(1, 3) <= 1)
      {
        do
          aDen = bDen = cDen = this.randomInt(2, 25)
        while (aDen / this.gcd(a, aDen) == 1)

        ++complexity
      }
    }

    let b = -a * (x1 + x2), c = a * x1 * x2
    let cRight = false, fullFraction = false
    let aBlock = a, bBlock = b, cBlock = c

    if (!forceEqZero && c != 0 && this.randomInt(1, 4) <= 1)
    {
      cRight = true
      c = -c
      complexity += .5
    }

    if (aDen != 1)
    {
      let gcd = this.gcd(a, aDen)
      a /= gcd
      aDen /= gcd
      gcd = this.gcd(b, bDen)
      b /= gcd
      bDen /= gcd
      gcd = this.gcd(c, cDen)
      c /= gcd
      cDen /= gcd
      complexity += (bDen != 1) + (bDen != cDen && cDen != 1)

      if (c == 0)
        complexity -= .5
      else if (b == 0)
        complexity += .5

      if (aDen == bDen && (bDen == cDen || cDen == 0) || aDen == cDen && bDen == 0)
      {
        complexity -= .5
        a *= 3
        aDen *= 3
      }

      if (!forceEqZero && c != 0 && this.randomInt(1, 5) <= 1)
      {
        fullFraction = true

        if (!cRight)
        {
          cRight = true
          c = -c
          complexity += .5
        }

        complexity += .5
        b *= aDen / bDen
        bBlock = b
      }
      else
      {
        aBlock = this.#fractionAsCoefficient(a, aDen)

        if (bDen != 1)
          bBlock = this.#fractionAsCoefficient(b, bDen)

        if (cDen != 1)
          cBlock &&= this.#fractionAsCoefficient(c, cDen)
      }
    }

    aBlock = this.#renderBlock(a < 0, aBlock, /*html*/ `x<sup>2</sup>`)
    bBlock = this.#renderBlock(b < 0, bBlock, 'x')
    cBlock = this.#renderBlock(c < 0, cBlock, '')

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

    let leftOfEq, rightOfEq

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

    return {
      set: set,
      x1: x1,
      x2: x2,
      complexity: complexity,

      text:
        this.#finalizeExpression(aBlock + bBlock + leftOfEq) +
        ' = ' +
        this.#finalizeExpression(rightOfEq)
    }
  }

  randomLimitZZ(resultSet)
  {
    // R
    // [N(K - X)] / [D(K - Y)]
    //
    // [N(R/N - 2R/N)] / [D(R/D - (R + 1)/D)] => { N = D }
    //
    // [RD(K - (K + 1)] / [D(K - (K + 1)] => { X = Y }
  }

  randomLimitII()
  {

  }
}
