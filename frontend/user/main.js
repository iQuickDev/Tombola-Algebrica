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

var originServer = `http://${location.hostname}:${location.port}`
let maxAnswers = 2
var isMarkable = true
var username = ""
var isGameStarted = true
var gridObj = []

document.querySelector("#ready").onclick = JoinGame

async function JoinGame()
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
}

async function StartGame(gridObj)
{
    /* gridObj = api call */
    isGameStarted = true

    document.querySelector("#pregame").style.animation = "dragup 1s ease-in-out forwards"
    document.querySelector("#infoparagraph").style.animation = "dragup 1s ease-in-out forwards"

    await new Promise(r => setTimeout(r, 1000))

    document.querySelector("#pregame").remove()
    document.querySelector("#infoparagraph").remove()
    PrepareGrid(gridObj)
}

function NewRound()
{
    let fetchedMaxAnswers = 2 /* to replace with API call */
    isMarkable = true
    maxAnswers = fetchedMaxAnswers
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

async function SendGridToServer()
{
    let cells = document.querySelectorAll("#gameboard td")
    let gridArray = []
    let roundAnswers = []
    let firstColumnArray = []
    let secondColumnArray = []
    let thirdColumnArray = []

    for (let i = 0; i < cells.length; i++)
    {
        if (parseInt(cells[i].id.replace("cell-", "")) < 9)
        {
            firstColumnArray.push({
                value: cells[i].innerText,
                marked: cells[i].classList.contains("marked")
            })
        }
        else if (parseInt(cells[i].id.replace("cell-", "")) < 18)
        {
            secondColumnArray.push({
                value: cells[i].innerText,
                marked: cells[i].classList.contains("marked")
            })
        }
        else
        {
            thirdColumnArray.push({
                value: cells[i].innerText,
                marked: cells[i].classList.contains("marked")
            })
        }
    }

    gridArray.push(firstColumnArray, secondColumnArray, thirdColumnArray)
    
    for (let i = 0; i < gridArray.length; i++)
    {
        for (let j = 0; j < gridArray[i].length; j++)
        {
            if (gridArray[i][j].marked)
            {
                roundAnswers.push(gridArray[i][j].value)
            }
        }
    }

    console.log(username)
    console.log(gridArray)
    console.log(roundAnswers)
    
    /* send(username, gridArray, roundAnswers) to replace with API call */

    roundAnswers = []
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