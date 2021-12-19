var formulas = document.getElementsByTagName("cite")
var elapsedtime = 0
var extracted = 0
var toExtract = 90
var timeLeft = 0
var initialTime = 100
var isIdle = true
var participantscount = 0
var scoresAndPlayers = []
var isGameStarted = false
var song = new Audio("../common/audio/song.mp3")
var solutions = []

game.setTime = (time) => {timeLeft = time}

var timerPieElement = new EasyPieChart(document.querySelector(".timechart"),
{
  barColor: '#8d00ff',
  trackColor: "#00000050",
  scaleLength: 0,
  lineCap: "round",
  lineWidth: 10,
  size: 175,
  rotate: 0
})

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
document.querySelector("#stopgame").onclick = () => EndGame("NESSUNO")
document.querySelector("#extractionbox").addEventListener("click", NewExtraction)
document.querySelector("#showsolutions").onclick = () => ShowSolutions()
document.querySelector("#addtime").addEventListener("click", () => { timeLeft += 15 })
//document.querySelector("#localip").innerHTML = /* api call */
//document.querySelector("#gamelocalip").innerHTML = /* api call */
document.querySelector("#gamelocalport").innerHTML = location.port

function makeNewPosition()
{
  var nh = Math.floor(Math.random() * window.innerHeight - 50)
  var nw = Math.floor(Math.random() * window.innerWidth - 50)
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
  for (let i = 0; i < amount; i++)
  {
    let testPlayer = document.createElement("h4")
    testPlayer.classList.add("player")
    testPlayer.innerHTML = "testPlayer" + i

    testPlayer.addEventListener("click", async () =>
    {
      testPlayer.style.animation = "leave .5s forwards"
      await new Promise(r => setTimeout(r, 500))
      participantscount--
      document.querySelector("#participantscountwrapper").classList.add("participantsincrement")

      document.querySelector("#participantscount").textContent = participantscount
  
      await new Promise(r => setTimeout(r, 250))
  
      document.querySelector("#participantscountwrapper").classList.remove("participantsincrement")
      
      await new Promise(r => setTimeout(r, 250))
      testPlayer.remove()
      OnPlayerLeave(testPlayer.innerHTML)
    })

    participantscount++
    document.querySelector("#playerscontainer").appendChild(testPlayer)
    OnPlayerJoin(testPlayer.innerHTML)
    document.querySelector("#participantscountwrapper").classList.add("participantsincrement")
    document.querySelector("#participantscount").textContent = participantscount
    await new Promise(r => setTimeout(r, 250))
    document.querySelector("#participantscountwrapper").classList.remove("participantsincrement")
    await new Promise(r => setTimeout(r, 250))
  }
}

function OnPlayerJoin(username)
{
  if (!isGameStarted)
  {
    CheckNewPlayer(username)

    let leaderboard = document.querySelector("#leaderboardplayers")
    let positions = document.querySelector("#leaderboardpositions")
    let newPosition = document.createElement("li")
    newPosition.classList.add("leaderboardposition")
    let newPlayer = document.createElement("li")
  
    switch (positions.children.length)
    {
      case 0:
        newPosition.id = "first"
        newPosition.textContent = "1°"
        break
      case 1:
        newPosition.id = "second"
        newPosition.textContent = "2°"
        break
      case 2:
        newPosition.id = "third"
        newPosition.textContent = "3°"
        break
      default:
        newPosition.textContent = positions.children.length + 1 + "°"
    }
    positions.appendChild(newPosition)
    newPlayer.innerHTML = "<span class='username'>" + username + "</span>" + " <span class='score'>" + 0 + "</span>"
  
    leaderboard.appendChild(newPlayer)
  }
}

function OnPlayerLeave(username)
{
  let leaderboard = document.querySelector("#leaderboardplayers")
  let positions = document.querySelector("#leaderboardpositions")

  for (let i = 0; i < leaderboard.children.length; i++)
  {
    if (leaderboard.children[i].children[0].textContent == username)
    {
      positions.lastChild.remove()
      leaderboard.children[i].remove()
    }
  }
}

async function StartGame()
{
  /* todo: api call to get question */
  /* todo: api call solutions.push({text: "", result: []}) */
  isGameStarted = true
  StartTimer()
  document.querySelector("#pregame").style.animation = "dragabove 1s linear forwards"
  document.querySelector("#game").style.display = "block"
  document.querySelector("#game").style.animation = "showgamepanel 1s linear"
  await new Promise(r => setTimeout(r, 1000))
  document.querySelector("#pregame").style.display = "none"

  document.querySelector("#formula1").remove()
  document.querySelector("#formula2").remove()
  document.querySelector("#formula3").remove()
  document.querySelector("#formula4").remove()
  document.querySelector("#formula5").remove()
  document.querySelector("#formula6").remove()
  document.querySelector("#formula7").remove()
  document.querySelector("#formula8").remove()
}

function UpdateLeaderboard(leaderboardObj)
{
  let players = document.querySelector("#leaderboardplayers").children

  for (let i = 0; i < leaderboardObj.length; i++)
  {
    players[i].children[0].innerHTML = Object.keys(Object.values(leaderboardObj["scores"])[i])[0]
    players[i].children[1].innerHTML = Object.values(Object.values(leaderboardObj["scores"])[i])[0]
  }
}

async function SortLeaderboard()
{
  let leaderboard = document.querySelector("#leaderboardplayers")
  let players = document.querySelector("#leaderboardplayers").children

  document.querySelector("#leaderboard").classList.toggle("leaderboardupdate")

  await new Promise(r => setTimeout(r, 1000))

  for (let i = 0; i < players.length; i++)
  {
    scoresAndPlayers.push({ username: players[i].children[0].textContent, score: players[i].children[1].textContent })
  }

  scoresAndPlayers.sort((a, b) => b.score - a.score)

  for (let i = 0; i < leaderboard.children.length; i++) {
    leaderboard.children[i].innerHTML = "<span class='username'>" + scoresAndPlayers[i].username + "</span>" + " <span class='score'>" + scoresAndPlayers[i].score + "</span>"
  }

  scoresAndPlayers = []

  await new Promise(r => setTimeout(r, 1000))

  document.querySelector("#leaderboard").classList.toggle("leaderboardupdate")
}


function NewExtraction()
{
  /* todo: api call to get question */
  song.currentTime = 0
  song.play()
  document.querySelector("#questioncontainer").style.display = "block"
  document.querySelector("#extractionbox").style.pointerEvents = "none"
  if (document.querySelector("#questioncontainer").classList.contains("removeextractednumberanim"))
  {
    document.querySelector("#questioncontainer").classList.remove("removeextractednumberanim")
    document.querySelector("#questioncontainer").classList.remove("extractionanim")
  }

  isIdle = false
  initialTime = 30
  timeLeft = initialTime

  document.querySelector("#questioncontainer").classList.toggle("extractionanim")
  extracted++
  document.querySelector("#extractedcount").textContent = extracted
  document.querySelector("#toextractcount").textContent = toExtract - extracted
}

async function ClearExtraction()
{
  song.pause()
  document.querySelector("#extractionbox").style.pointerEvents = "all"
  document.querySelector("#hand").classList.toggle("handsanim")

  await new Promise(r => setTimeout(r, 900))

  document.querySelector("#questioncontainer").classList.toggle("removeextractednumberanim")

  await new Promise(r => setTimeout(r, 3000))

  document.querySelector("#hand").classList.toggle("handsanim")
  SortLeaderboard()

  if (toExtract == extracted)
  {
    EndGame()
  }
}

function GetTimePercentage()
{
  return (timeLeft / initialTime) * 100
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

async function ConfettiRain(delay)
{
  let confettiDiv = document.createElement("div")
  confettiDiv.id = "confetti"
  document.body.insertBefore(confettiDiv, document.body.firstChild)

  LoadConfetti()

  await new Promise(r => setTimeout(r, delay - 1000))

  confettiDiv.style.animation = "confettifadeout 1s linear forwards"

  await new Promise(r => setTimeout(r, 1000))

  confettiDiv.remove()
}

async function ShowNotification(message)
{
  if (message != null)
  {
    document.querySelector("#notification").style.display = "block"
    document.querySelector("#notificationcontent").innerHTML = message
    document.querySelector("#notification").style.animation = "shownotification 1s linear forwards"
    ConfettiRain(4000)
    await new Promise(r => setTimeout(r, 3000))
    document.querySelector("#notification").style.animation = "hidenotification 1s linear forwards"
    await new Promise(r => setTimeout(r, 1000))
    document.querySelector("#notification").style.animation = ""
    document.querySelector("#notification").style.display = "none"
  }
}

function ShowSolutions()
{
  document.querySelector("#solutionscontainer").style.animation = "expandsolutions 10s ease-in-out forwards"
}

function FillSolutionsScreen(solutions)
{
  for (let i = 0; i < solutions.length; i++)
  {
    let solutionContainer = document.createElement("div")
    solutionContainer.id = "solution-" + i
    solutionContainer.classList.add("solution")
    solutionContainer.innerHTML = /*html*/
    `
      <div class="expression">
        <h3>Espressione ${i}</h3>
        ${solutions[i].text}
      </div>

      <div class="expressionanswer">
        <h3>Soluzioni</h3>
        <h2>${solutions[i].result.toString().replace(",", ", ")}</h2>
      </div>
    `

    document.querySelector("#solutionscontainer").appendChild(solutionContainer)
  }
}


async function EndGame(winnerName)
{
  song.pause()

  FillSolutionsScreen(solutions)

  document.querySelector("#winner").innerHTML = winnerName

  document.querySelector("#stopgame").style.animation = "shrinkdisappear 1s linear forwards"

  document.querySelector("#screen").style.overflow = "hidden"

  document.querySelector("#screen").classList.remove("widescreen")

  for (let i = 0; i < document.querySelector("#screen").children.length; i++)
  document.querySelector("#screen").children[i].style.animation = "shrinkdisappear 1s linear forwards"
  
  document.querySelector("#leaderboard").classList.add("slideleft")
  document.querySelector("#info").classList.add("slideright")

  await new Promise(r => setTimeout(r, 1200))

  for (let i = 0; i < document.querySelector("#screen").children.length; i++)
  document.querySelector("#screen").children[i].style.display = "none"

  document.querySelector("#stopgame").style.display = "none"

  document.querySelector("#screen").classList.add("widescreen")

  document.querySelector("#leaderboard").style.display = "none"
  document.querySelector("#info").style.display = "none"

  await new Promise(r => setTimeout(r, 1200))

  document.querySelector("#screen").classList.remove("widescreen")
  document.querySelector("#screen").style.width = "80%"

  ConfettiRain(10000)

  document.querySelector("#preendgame").style.display = "block"
  document.querySelector("#preendgame").style.animation = ""
  document.querySelector("#winnermessage").style.animation = "winnermessageanim .5s linear infinite"

  await new Promise(r => setTimeout(r, 5000))

  document.querySelector("#winnermessage").style.animation = "winnermessagenormal .5s linear forwards"

  await new Promise(r => setTimeout(r, 500))

  document.querySelector("#winnermessage").style.animation = ""
  document.querySelector("#preendgame").style.marginTop = "0px"
  document.querySelector("#endgame").style.display = "block"
  document.querySelector("#endgame").style.animation = ""
  document.querySelector("#endgame").classList.add("growappear")

  document.querySelector("#screen").style.overflowY = "auto"
}

function LoadConfetti()
{
  tsParticles.load("confetti", {
    fullScreen: {
      enable: false
    },
    particles: {
      number: {
        value: 0 
      },
      color: {
        value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"] 
      },
      shape: {
        type: "confetti", 
        options: {
          confetti: {
            type: ["circle", "square"] 
          }
        }
      },
      opacity: {
        value: 1, 
        animation: {
          enable: true, 
          minimumValue: 0, 
          speed: 2, 
          startValue: "max", 
          destroy: "min" 
        }
      },
      size: {
        value: 7,
        random: {
          enable: false, 
          minimumValue: 3 
        }
      },
      life: {
        duration: {
          sync: true, 
          value: 5 
        },
        count: 1 
      },
      move: {
        enable: true, 
        gravity: {
          enable: true, 
          acceleration: 20 
        },
        speed: 50, 
        decay: 0.05, 
        outModes: {
          default: "destroy", 
          top: "none"
        }
      }
    },
    background: {
      color: "transparent" 
    },
    emitters: [ 
      {
        direction: "top-right",
        rate: {
          delay: 0.1, 
          quantity: 15 
        },
        position: {
          x: 0,
          y: 50
        },
        size: { 
          width: 0,
          height: 0
        }
      },
      {
        direction: "top-left",
        rate: {
          delay: 0.1,
          quantity: 15
        },
        position: {
          x: 100,
          y: 50
        },
        size: {
          width: 0,
          height: 0
        }
      }
    ]
  })
}