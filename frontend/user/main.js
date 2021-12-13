var root = document.documentElement
root.addEventListener("click", () => root.requestFullscreen())

var originServer = `http://${location.hostname}:${location.port}`
let maxAnswers = 2
var isMarkable = true
var username = ""

document.querySelector("#ready").onclick = JoinGame

async function JoinGame()
{
    username = document.querySelector("#username").value

    if (username.length < 1)
        return

    document.querySelector("#pregame").style.animation = "dragup 1s ease-in-out forwards"
    document.querySelector("#infoparagraph").style.animation = "dragup 1s ease-in-out forwards"

    await new Promise(r => setTimeout(r, 1000))

    document.querySelector("#pregame").remove()
    document.querySelector("#infoparagraph").remove()

    PrepareGrid()
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
}


async function PrepareGrid()
{
    document.querySelector("#gridusername").textContent = username

    let cells = document.querySelectorAll("#gameboard td")

    cells.forEach(e => e.textContent = e.id)

    for (let i = 0; i < cells.length; i++)
    {
        cells[i].addEventListener("click", () =>
        {
            if (isMarkable && maxAnswers > 0 && !cells[i].classList.contains("locked") && !cells[i].classList.contains("marked") && cells[i].textContent != String.fromCharCode(160)) /* 160 = char code for &nbsp; */
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