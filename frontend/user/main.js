var root = document.documentElement
document.querySelector("#fullscreenbtn").onclick = () => root.requestFullscreen()
window.onbeforeunload = () => { if (isGameStarted) return "Sei sicuro di voler uscire?" }
document.querySelector("#closepopup").onclick = HidePopup

const usernameTriggers =
{
    "Quanti grammi?": ["nencio", "dani"],
    "Hai mangiato le carote oggi ?": ["fanta", "ricca"],
    "BATTTTTTTTISTINI!!!!": ["bati", "batti"],
    "ΩLULLI": ["lulli", "omega", "filippo"],
    "Lanzoide asteroide ☄️": ["lanz", "drive", "guido", "giuido"],
    "I PIEDDI!": ["fab", "torre"],
    "🪜": ["erika", "ingenito"],
    "FRECCE SU TORRE CENTRALE!": ["jack", "mera"],
    "ER CORSARO NERO!!!": ["cors", "giacomone"],
    "ENDOJONE.": ["flav", "endo", "ndoj"],
    "Quante coppe oggi?": ["paci"],
    "Bella bimba!": ["sarto"],
    "Mar🖱️🖥️ 🎿🏔️🏔️": ["mar", "scialpi"],
    "⬇️SENATORE<br>⬆️SENATORE<br>➡️SENATORE<br>⬅️SENATORE<br>🎯SENATORE": ["sena", "gius", "guis"]
}

let maxAnswers = 2
var isMarkable = true
var username = ""
var isGameStarted = true
var gridObj = []
var increment = 30000
var timeLeft = 0

document.querySelector("#ready").onclick = JoinGame

function JoinGame()
{
    let loader = document.querySelector("#loader").cloneNode(true)

    username = document.querySelector("#username").value

    if (username.length < 1)
        return

    document.querySelector("#ready").textContent = "In attesa"
    document.querySelector("#ready").appendChild(loader)
    document.querySelector("#ready").disabled = true
    document.querySelector("#loader").classList.remove("hidden")
    GetMessage(username)

    const body = { }
    body[username] = 0

    fetch('/api/players',
    {
        method: 'POST',
        body: body
    }).then(res => res.json()).then(data =>
    {
        NewRound(data.question)
        StartGame(data.grid)
    })
}

function StartTime()
{
    setTimeout(EndRound, timeLeft)
}

async function StartGame(gridObj)
{
    isGameStarted = true

    document.querySelector("#pregame").style.animation = "dragup 1s ease-in-out forwards"
    document.querySelector("#infoparagraph").style.animation = "dragup 1s ease-in-out forwards"

    await new Promise(r => setTimeout(r, 1000))

    document.querySelector("#pregame").remove()
    document.querySelector("#infoparagraph").remove()
    PrepareGrid(gridObj)
}

function NewRound(questionObj)
{
    timeLeft = questionObj.complexity * increment
    isMarkable = true
    maxAnswers = questionObj.result.length
    StartTime()
}

function EndRound()
{
    isMarkable = false

    let cells = document.querySelectorAll("#gameboard td")

    for (let i = 0; i < cells.length; i++)
    {
        if (cells[i].classList.contains("marked"))
        {
            cells[i].classList.add("locked")
        }
    }

    SendGridToServer()
}

var oldMarked = []

function SendGridToServer()
{
    let cells = document.querySelectorAll("#gameboard td")
    let answers = {}

    for (let i = 0; i < cells.length; i++)
    {
        if (cells[i].classList.contains("marked") && !oldMarked.includes(cells[i].textContent))
        {
            oldMarked.push(cells[i].textContent)

            if (parseInt(cells[i].id.replace("cell-", "")) < 9)
                answers[cells[i].textContent] = 0
            else if (parseInt(cells[i].id.replace("cell-", "")) < 18)
                answers[cells[i].textContent] = 1
            else
                answers[cells[i].textContent] = 2
        }
    }

    const body = { }
    body[username] = answers

    fetch('/api/round/start',
    {
        method: 'POST',
        body: body
    }).then(res => res.json()).then(data => NewRound(data))
}


async function PrepareGrid(gridObj)
{
    document.querySelector("#gridusername").textContent = username

    let cells = document.querySelectorAll("#gameboard td")

    for (let i = 0; i < cells.length; i++)
    {
        if (parseInt(cells[i].id.replace("cell-", "")) < 9)
            cells[i].innerHTML = gridObj[0][parseInt(cells[i].id.replace("cell-", ""))]
        else if (parseInt(cells[i].id.replace("cell-", "")) < 18)
            cells[i].innerHTML = gridObj[1][parseInt(cells[i].id.replace("cell-", "")) - 9]
        else
            cells[i].innerHTML = gridObj[2][parseInt(cells[i].id.replace("cell-", "")) - 18]
    }

    for (let i = 0; i < cells.length; i++)
    {
        cells[i].addEventListener("click", () =>
        {
            if (isMarkable && maxAnswers > 0 && !cells[i].classList.contains("locked") && !cells[i].classList.contains("marked") && cells[i].textContent !="")
            {
                cells[i].classList.add("marked")
                maxAnswers--
            }
            else if (isMarkable && !cells[i].classList.contains("locked") && cells[i].classList.contains("marked"))
            {
                cells[i].classList.remove("marked")
                maxAnswers++
            }
        })
    }

    document.querySelector("#gamegrid").classList.remove("hidden")
    document.querySelector("#gamegrid").style.animation = "dragupper 1s ease-in-out forwards"

    await new Promise(r => setTimeout(r, 1000))

    document.querySelector("#gamegrid").style.animation = ""
}

function GetMessage(username)
{
    username = username.toLowerCase()
    for (const message in usernameTriggers)
    {
        for (const keyword of usernameTriggers[message])
        {
            if (username.includes(keyword))
            ShowPopup(message)
        }
    }
    return null
}

function ShowPopup(message)
{
    document.querySelector("#popup").classList.remove("hidden")
    document.querySelector("#popup").style.animation = "popupslideup 1s ease-in-out forwards"
    document.querySelector("#popupcontent").innerHTML = message
}

async function HidePopup()
{
    document.querySelector("#popup").style.animation = "popupslidedown 1s ease-in-out forwards"
    await new Promise(r => setTimeout(r, 1000))
    document.querySelector("#popup").classList.add("hidden")
    document.querySelector("#popup").style.animation = ""
}
