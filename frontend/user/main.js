var root = document.documentElement
root.addEventListener("click", () => root.requestFullscreen())

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

function SendGridToServer()
{
    let cells = document.querySelectorAll("#gameboard td")
    let gridArray = []
    let firstColumnArray = []
    let secondColumnArray = []
    let thirdColumnArray = []

    for (let i = 0; i < cells.length; i++)
    {
        if (parseInt(cells[i].id) < 9)
        {
            firstColumnArray.push({
                value: cells[i].innerText,
                marked: cells[i].classList.contains("marked")
            })
        }
        else if (parseInt(cells[i].id) < 18)
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

    gridArray.push(firstColumnArray)
    gridArray.push(secondColumnArray)
    gridArray.push(thirdColumnArray)

    console.log(gridArray)
}

async function PrepareGrid()
{
    document.querySelector("#gridusername").textContent = username

    let cells = document.querySelectorAll("#gameboard td")

    cells.forEach(e => e.textContent = e.id)

    let firstColumn = []
    let secondColumn = []
    let thirdColumn = []

    for (let i = 0; i < cells.length; i++)
    {
        cells[i].addEventListener("click", () =>
        {
            if (isMarkable && !cells[i].classList.contains("marked") && cells[i].textContent != String.fromCharCode(160)) /* 160 = char code for &nbsp; */
            {
                cells[i].classList.add("marked")
            }
            else if (isMarkable && cells[i].classList.contains("marked"))
            {
                cells[i].classList.remove("marked")
            }
        })

        if (parseInt(cells[i].id) < 9)
        {
            firstColumn.push(cells[i])
        }
        else if (parseInt(cells[i].id) < 18)
        {
            secondColumn.push(cells[i])
        }
        else
        {
            thirdColumn.push(cells[i])
        }
    }

    console.log(firstColumn)
    console.log(secondColumn)
    console.log(thirdColumn)

    document.querySelector("#gamegrid").classList.remove("hidden")
    document.querySelector("#gamegrid").style.animation = "dragupper 1s ease-in-out forwards"

    await new Promise(r => setTimeout(r, 1000))

    document.querySelector("#gamegrid").style.animation = ""
}