module.exports = class MathGenerator
{
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
    return /*html*/ `
      <div class="fraction limit ${fractionWithin ? 'fraction-within' : ''}">
        <span>lim</span>
        <span>x &xrarr; ${approach}</span>
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

  randomEquation(set, forceEqZero = false, x1 = null, x2 = null, alpha = null, xDen1 = 1, xDen2 = 1)
  {
    let complexity = 2

    if (x1 == null)
    {
      x1 = set[this.randomInt(0, set.length - 1)]
      set.splice(set.indexOf(x1), 1)
    }

    if (x2 == null)
    {
      if (x1 != 0 && this.randomInt(1, 6) <= 1)
        x2 = x1
      else
      {
        x2 = set[this.randomInt(0, set.length - 1)]
        set.splice(set.indexOf(x2), 1)
        complexity++
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

      do
        a = this.randomInt(-25, 25)
      while (a == 0 || a == 1)

      if (this.randomInt(1, 3) <= 1)
      {
        ++complexity

        do
          aDen = this.randomInt(2, 25)
        while (aDen / this.gcd(a, aDen) == 1)
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
        if (aDen == bDen && (bDen == cDen || cDen == 0) || aDen == cDen && bDen == 0)
        {
          complexity -= .5
          aBlock = a *= 3
          aDen *= 3
        }

        if (aDen != 1)
          aBlock &&= this.#fractionAsCoefficient(a, aDen)

        if (bDen != 1)
          bBlock &&= this.#fractionAsCoefficient(b, bDen)

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

    console.log(`[${a}/${aDen}](x - ${x1}/${xDen1})(x - ${x2}/${xDen2})`)

    return {
      set: set,
      x1: x1,
      x2: x2,
      xDen1: xDen1,
      xDen2: xDen2,
      complexity: complexity,

      text:
        this.#finalizeExpression(aBlock + bBlock + leftOfEq) +
        ' = ' +
        this.#finalizeExpression(rightOfEq)
    }
  }

  randomLimitZZ(set)
  {
    // [N(K - X)] / [D(K - Y)]
    // [N(R/N - R(Z + 1)/N)] / [N(R/N - (R + Z)/N)]
    // R = 8, N = 2, Z = 3
    //   K = R/N = 8/2 = 4
    //   X = R(Z + 1)/N = 8(3 + 1)/2 = 16
    //   Y = (R + Z)/N = (8 + 3)/2 = 11/2
    // N(K - X) = 2(4 - 16) = -24
    // N(K - Y) = 2(4 - 11/2) = -3
    // (-24)/(-3) = 8
    //
    // K = R/N
    // X = K(Z + 1)
    // Y = K + Z/N
    // [(Kn*Nn)/(Kd*Nn) + (Z*Nd*Kd)/(Nn*Kd)]


    const alpha = { num: 1, den: 1 }
    let complexity = 1, limR = set[this.randomInt(0, set.length - 1)], isOne = false, isZero = false
    console.log('limR: ' + limR)
    set.splice(set.indexOf(limR), 1)

    if (limR == 1)
    {
      isOne = true
      limR = -limR
    }
    else if (limR == 0 && this.randomInt(1, 4) <= 3)
    {
      console.log('here')
      isZero = true
      limR = this.randomInt(-8, 8)
    }

    do
      alpha.num = this.randomInt(-8, 8)
    while (alpha.num == 0 || alpha.num == 1)

    if (this.randomInt(1, 5) <= 1)
    {
      ++complexity

      do
        alpha.den = this.randomInt(2, 8)
      while (alpha.den / this.gcd(alpha.num, alpha.den) == 1)
    }

    let sign = alpha.num / Math.abs(alpha.num), salt, den, approach, xTop, xBottom

    do
    {
      salt = this.randomInt(-8, 8)
      den = alpha.num * sign
      approach = limR * alpha.den * sign
      xTop = isZero ? approach : limR * (salt + 1) * alpha.den * sign
      xBottom = (limR + salt) * alpha.den * sign
    } while (salt == limR || xTop == xBottom);

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
    complexity += equationTop.complexity + equationBottom.complexity

    if (den != 1)
      block &&= this.#fractionAsCoefficient(approach, den)

    const prefix = this.#renderLimitPrefix(
      this.#finalizeExpression(this.#renderBlock(approach < 0, block, '') || '0'),
      true
    )

    const suffix = (isOne ? '-' : '') + this.#fractionAsCoefficient(
      equationTop.text,
      equationBottom.text
    ).replaceAll(' = 0', '')

    return {
      set: set,
      result: (isZero ? 0 : limR) * (isOne ? -1 : 1),
      complexity: complexity,
      text: prefix + suffix
    }
  }

  randomLimitII()
  {

  }
}
