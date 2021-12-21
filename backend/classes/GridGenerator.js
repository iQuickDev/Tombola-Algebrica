// Imports.
const MathGenerator = require('./MathGenerator')

const min = -45, generator = new MathGenerator()

const replacements =
{
  '-45': '&empty;',
  '-44': '-&infin;',
  '44': '+&infin;'
}

module.exports = class GridGenerator
{
  static newGrid()
  {
    const series = [ ]
    const grid = [ new Array(9), new Array(9), new Array(9) ]

    for (const col of grid)
    {
      let count = 0, skips = col.length - 5

      for (let i = 0; i < col.length; ++i)
      {
        if (count == 5 || skips > 0 && generator.randomBool())
        {
          --skips
          col[i] = ''
        }
        else
        {
          ++count

          series.push(
            col[i] = generator.randomInt(
              min + i * 10,
              min + (i + 1) * 10 - 1,
              r => series.includes(r)
            )
          )

          if (col == grid[grid.length - 1])
          {
            const t = grid.flatMap(col => col[i] !== '' ? [col[i]] : []).sort((a, b) => a - b)

            for (const col of grid)
            {
              if (col[i] !== '')
              {
                const first = t.shift()
                col[i] = first in replacements ? replacements[first] : first
              }
            }
          }
        }
      }
    }

    return grid
  }
}
