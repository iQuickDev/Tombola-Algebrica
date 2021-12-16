var formulas = document.getElementsByTagName("cite")
var winWidth = window.innerWidth - 200
var winHeight = window.innerHeight - 200
var elapsedtime = 0
var extracted = 0
var toExtract = 90
var timeLeft = 0
var initialTime = 100
var isIdle = true
var participantscount = 0
var scoresAndPlayers = []

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
    })
    participantscount++

    document.querySelector("#playerscontainer").appendChild(testPlayer)

    document.querySelector("#participantscountwrapper").classList.add("participantsincrement")

    document.querySelector("#participantscount").textContent = participantscount

    await new Promise(r => setTimeout(r, 250))

    document.querySelector("#participantscountwrapper").classList.remove("participantsincrement")
    
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
  for (let i = 0; i < document.querySelectorAll("cite").length; i++)
  document.querySelectorAll("cite")[i].style.display = "none"
}

async function SortLeaderboard()
{
  let leaderboard = document.querySelector("#leaderboardplayers")

  document.querySelector("#leaderboard").classList.toggle("leaderboardupdate")

  await new Promise(r => setTimeout(r, 1000))

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
  initialTime = 30
  timeLeft = initialTime

  document.querySelector("#questioncontainer").classList.toggle("extractionanim")
  extracted++
  document.querySelector("#extractedcount").textContent = extracted
  document.querySelector("#toextractcount").textContent = toExtract - extracted
}

async function ClearExtraction()
{
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

var timerPie = document.querySelector(".timechart")

var timerPieElement = new EasyPieChart(timerPie,
{
  barColor: '#8d00ff',
  trackColor: "#00000050",
  scaleLength: 0,
  lineCap: "round",
  lineWidth: 10,
  size: 175,
  rotate: 0
})

function GetTimePercentage()
{
  let percentage = (timeLeft / initialTime) * 100

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

async function EndGame()
{
  let confettiDiv = document.createElement("div")
  confettiDiv.id = "confetti"
  document.body.insertBefore(confettiDiv, document.body.firstChild)

  document.querySelector("#screen").style.overflow = "hidden"

  document.querySelector("#screen").classList.remove("widescreen")

  for (let i = 0; i < document.querySelector("#screen").children.length; i++)
  document.querySelector("#screen").children[i].style.animation = "shrinkdisappear 1s linear forwards"
  
  document.querySelector("#leaderboard").classList.add("slideleft")
  document.querySelector("#info").classList.add("slideright")

  await new Promise(r => setTimeout(r, 1200))

  for (let i = 0; i < document.querySelector("#screen").children.length; i++)
  document.querySelector("#screen").children[i].style.display = "none"

  document.querySelector("#screen").classList.add("widescreen")

  document.querySelector("#leaderboard").style.display = "none"
  document.querySelector("#info").style.display = "none"

  await new Promise(r => setTimeout(r, 1200))

  document.querySelector("#screen").classList.remove("widescreen")
  document.querySelector("#screen").style.width = "80%"

  tsParticles.load("confetti", {
    fullScreen: {
      enable: false
    },
    particles: {
      number: {
        value: 0 // no starting particles
      },
      color: {
        value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"] // the confetti colors
      },
      shape: {
        type: "confetti", // the confetti shape
        options: {
          confetti: { // confetti shape options
            type: ["circle", "square"] // you can only have circle or square for now
          }
        }
      },
      opacity: {
        value: 1, // confetti are solid, so opacity should be 1, but who cares?
        animation: {
          enable: true, // enables the opacity animation, this will fade away the confettis
          minimumValue: 0, // minimum opacity reached with animation
          speed: 2, // the opacity animation speed, the higher the value, the faster the confetti disappear
          startValue: "max", // start always from opacity 1
          destroy: "min" // destroy the confettis at opacity 0
        }
      },
      size: {
        value: 7, // confetti size
        random: {
          enable: true, // enables a random size between 3 (below) and 7 (above)
          minimumValue: 3 // the confetti minimum size
        }
      },
      life: {
        duration: {
          sync: true, // syncs the life duration for those who spawns together
          value: 5 // how many seconds the confettis should be on screen
        },
        count: 1 // how many times the confetti should appear, once is enough this time
      },
      move: {
        enable: true, // confetti need to move right?
        gravity: {
          enable: true, // gravity to let them fall!
          acceleration: 20 // how fast the gravity should attract the confettis
        },
        speed: 50, // the confetti speed, it's the starting value since gravity will affect it, and decay too
        decay: 0.05, // the speed decay over time, it's a decreasing value, every frame the decay will be multiplied by current particle speed and removed from that value
        outModes: { // what confettis should do offscreen?
          default: "destroy", // by default remove them
          top: "none" // but since gravity attract them to bottom, when they go offscreen on top they can stay
        }
      }
    },
    background: {
      color: "transparent" // set the canvas background, it will set the style property
    },
    emitters: [ // the confetti emitters, the will bring confetti to life
      {
        direction: "top-right", // the first emitter spawns confettis moving in the top right direction
        rate: {
          delay: 0.1, // this is the delay in seconds for every confetti emission (10 confettis will spawn every 0.1 seconds)
          quantity: 10 // how many confettis must spawn ad every delay
        },
        position: { // the emitter position (values are in canvas %)
          x: 0,
          y: 50
        },
        size: { // the emitter size, if > 0 you'll have a spawn area instead of a point
          width: 0,
          height: 0
        }
      },
      {
        direction: "top-left", // same as the first one but in the opposite side
        rate: {
          delay: 0.1,
          quantity: 10
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
}
