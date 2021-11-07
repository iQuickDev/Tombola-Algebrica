var formulas = document.getElementsByTagName("cite")
var winWidth = window.innerWidth - 200
var winHeight = window.innerHeight - 200
var elapsedtime = 0
var extracted = 0
var toExtract = 0
var timeLeft = 0
var isIdle = true;

window.onload = () =>
{
  animateElement("#formula1")
  animateElement("#formula2")
  animateElement("#formula3")
  animateElement("#formula4")
  animateElement("#formula5")
  animateElement("#formula6")
  animateElement("#formula7")
  animateElement("#formula8")
}

document.querySelector("#startgame").addEventListener("click", StartGame)
document.querySelector("#extractionbox").addEventListener("click", NewExtraction)

function makeNewPosition()
{
  var nh = Math.floor(Math.random() * $(window).height() - 50)
  var nw = Math.floor(Math.random() * $(window).width() - 50)
  return [nh, nw];
}

function animateElement(element)
{
  var newq = makeNewPosition()
  $(element).animate({ top: newq[0], left: newq[1] }, 2500, () => {
    animateElement(element)
  })
}

async function SimulatePlayerJoin(amount)
{
  for (let i = 0; i < amount; i++) {
    let testPlayer = document.createElement("h4")
    testPlayer.classList.add("player")
    testPlayer.innerHTML = "testPlayer" + i
    testPlayer.addEventListener("click", async () => {
      testPlayer.style.animation = "leave .5s forwards"
      await new Promise(r => setTimeout(r, 500))
      testPlayer.remove()
    })

    document.querySelector("#playerscontainer").appendChild(testPlayer)
    await new Promise(r => setTimeout(r, 250))
  }
}

async function StartGame()
{
  StartTimer()
  document.querySelector("#pregame").style.animation = "dragabove 1s linear forwards"
  document.querySelector("#game").style.display = "block"
  document.querySelector("#game").style.animation = "showgamepanel 1s linear"
  await new Promise(r => setTimeout(r, 1000))
  document.querySelector("#pregame").style.display = "none"
}

async function SortLeaderboard()
{
  let leaderboard = document.querySelector("#leaderboardplayers")
  let scores = leaderboard.querySelectorAll(".score")
  let usernames = leaderboard.querySelectorAll(".username")
  let scoresAndPlayers = []

  document.querySelector("#leaderboard").classList.toggle("leaderboardupdate")

  await new Promise(r => setTimeout(r, 1000))

  for (let i = 0; i < scores.length; i++) {
    scoresAndPlayers.push({ "username": usernames[i].textContent, "score": scores[i].innerHTML })
  }

  scoresAndPlayers.sort((a, b) => b.score - a.score)

  for (let i = 0; i < leaderboard.children.length; i++) {
    leaderboard.children[i].innerHTML = "<span class='username'>" + scoresAndPlayers[i].username + "</span>" + " <span class='score'>" + scoresAndPlayers[i].score + "</span>"
  }

  await new Promise(r => setTimeout(r, 1000))

  document.querySelector("#leaderboard").classList.toggle("leaderboardupdate")
}

function NewExtraction()
{
  document.querySelector("#questioncontainer").style.display = "block"
  document.querySelector("#extractionbox").style.pointerEvents = "none"
  if (document.querySelector("#questioncontainer").classList.contains("removeextractednumberanim"))
  {
    document.querySelector("#questioncontainer").classList.remove("removeextractednumberanim")
    document.querySelector("#questioncontainer").classList.remove("extractionanim")
  }

  isIdle = false
  timeLeft = 5

  document.querySelector("#questioncontainer").classList.toggle("extractionanim")
  extracted++
  document.querySelector("#extractedcount").textContent = extracted
  document.querySelector("#toextractcount").textContent = 90 - extracted
}

async function ClearExtraction()
{
  document.querySelector("#extractionbox").style.pointerEvents = "all"
  document.querySelector("#hand").classList.toggle("handsanim")

  await new Promise(r => setTimeout(r, 1000))

  document.querySelector("#questioncontainer").classList.toggle("removeextractednumberanim")

  await new Promise(r => setTimeout(r, 3000))

  document.querySelector("#hand").classList.toggle("handsanim")
  SortLeaderboard()
}

var timerPie = document.querySelector(".timechart")

var timerPieElement = new EasyPieChart(timerPie,
{
  barColor: '#00ff00',
  trackColor: false,
  scaleLength: 0,
  lineCap: "round",
  lineWidth: 10,
  size: 175,
  rotate: 0
})

function GetTimePercentage()
{
  let percentage = (timeLeft / 120) * 100

  if (percentage > 75 && percentage < 100)
      timerPieElement.options.barColor = "#00ff00"
  else if (percentage > 50 && percentage < 75)
      timerPieElement.options.barColor = "#a6ff00"
  else if (percentage > 25 && percentage < 50)
      timerPieElement.options.barColor = "#ffff00"
  else if (percentage < 10)
      timerPieElement.options.barColor = "#ff0000"

  return percentage
}


function StartTimer()
{
  let timer = document.querySelector("#elapsedtime")
  let timeLeftLabel = document.querySelector("#timeleft")
  let interval = setInterval(() => {
    elapsedtime++
    if (timeLeft > 0 && !isIdle)
    {
      timeLeft--
      timeLeftLabel.textContent = timeLeft
      timerPieElement.update(GetTimePercentage())
    }
    else if (timeLeft == 0 && !isIdle)
    {
      ClearExtraction()
      isIdle = true
    }
    timer.textContent = new Date(elapsedtime * 1000).toISOString().substr(11, 8);

  }, 1000)
}
