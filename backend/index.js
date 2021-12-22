// Imports.
const QuestionGenerator = require('./classes/QuestionGenerator')
const GridGenerator = require('./classes/GridGenerator')
const Wrapper = require('./classes/Wrapper')
const PlayerSet = require('./classes/PlayerSet')
const Game = require('./classes/Game')
const path = require('path')
const ip = require('ip')
const express = require('express')

let echoReceiving = null, userResPreprocessor = null, game = null, entered = false, stop = true
const port = 8080
const generator = new QuestionGenerator()
const firstQuestion = generator.randomQuestion()
const echo = new Wrapper(null)
const players = new PlayerSet()
const playersQueue = [ ]
const usersResponses = [ ]
const app = express()
app.use(express.json())

echo.changed = () =>
{
  if (echo.value != null)
  {
    const first = playersQueue.shift()

    if (first != null)
    {
      const res = echo.value
      echo.value = null
      const echoReceived = echoReceiving?.()
      res.json(first)
      echoReceived?.()
    }
  }
}

players.added = (input) =>
{
  if (echo.value == null)
    playersQueue.push(input)
  else
  {
    const res = echo.value
    echo.value = null
    res.json(input)
  }
}

app.use((req, res, next) =>
{
  if (!req.path.startsWith('/common/'))
  {
    if (!req.path.startsWith('/api/'))
      req.url = path.join(isLoopback(req.ip) ? '/admin' : '/user', req.url)
    else if (req.path != '/api/entry' && !entered)
      req.url = '/status/409'
  }

  next()
})

// Static server.
app.use('/common', express.static(path.join(__dirname, '../frontend/common')))
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')))
app.use('/user', express.static(path.join(__dirname, '../frontend/user')))
app.get('/admin', (req, res) => res.redirect('/admin.html'))
app.get('/user', (req, res) => res.redirect('/user.html'))
app.all('/status/:code', (req, res) => res.status(parseInt(req.params.code)).end())

app.post('/api/entry', (req, res) =>
{
  res.json({ address: `${ip.address()}:${port}`, question: firstQuestion })

  if (isLoopback(req.ip))
    entered = true
})

app.post('/api/start', (req, res) =>
{
  if (game != null || echoReceiving != null)
    res.status(409).end()
  if (isLoopback(req.ip))
  {
    ;(echoReceiving = () =>
    {
      if (playersQueue.length == 0)
      {
        game = new Game(players.toObject(), firstQuestion)
        echoReceiving = null
        return () => res.status(200).end()
      }
      else
        return null
    })()?.()
  }
  else
    res.status(403).end()
})

app.post('/api/round/start', (req, res) =>
{
  if (game == null || !stop)
    res.status(409).end()
  else if (isLoopback(req.ip))
  {
    for (const userRes of usersResponses)
    {
      userResPreprocessor?.(userRes)
      userRes.json(userRes.bodyObj)
    }

    stop = false
    res.status(200).end()
  }
  else
    res.status(403).end()
})

app.post('/api/round/end', (req, res) =>
{
  if (game == null || stop)
    res.status(409).end()
  else if (isLoopback(req.ip))
  {
    game.question = generator.randomQuestion()
    userResPreprocessor = userRes => userRes.bodyObj = game.question

    setTimeout(() =>
    {
      stop = true
      res.json({ message: game.calculate(), ...game.rankings })
      game.clearChanges()
    }, 3000)
  }
  else
  {
    game.insertChanges(req.body)
    usersResponses.push(res)
  }
})

app.post('/api/players', (req, res) =>
{
  if (game != null || echoReceiving != null)
    res.status(409).end()
  else if (players.add(req.body))
  {
    res.bodyObj = { grid: GridGenerator.newGrid(), question: firstQuestion}
    userResPreprocessor = null
    usersResponses.push(res)
  }
  else
    res.status(401).end()
})

app.get('/api/players/echo', (req, res) =>
{
  if (game != null)
    res.status(409).end()
  else if (isLoopback(req.ip))
    echo.value = res
  else
    res.status(403).end()
})

app.listen(port)

function isLoopback(ip)
{
  return ip == '::1' || ip.endsWith('127.0.0.1')
}
