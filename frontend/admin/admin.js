var formulas = document.getElementsByTagName("cite");
var winWidth = window.innerWidth - 200;
var winHeight = window.innerHeight - 200;

window.onload = () =>
{
    animateElement("#formula1");
    animateElement("#formula2");
    animateElement("#formula3");
    animateElement("#formula4");
    animateElement("#formula5");
    animateElement("#formula6");
    animateElement("#formula7");
    animateElement("#formula8");
}

document.querySelector("#startgame").addEventListener("click", StartGame)

function makeNewPosition()
{
  var nh = Math.floor(Math.random() * $(window).height() - 50);
  var nw = Math.floor(Math.random() * $(window).width() - 50);
  return [nh, nw];
}

function animateElement(element)
{
  var newq = makeNewPosition();
  $(element).animate({ top: newq[0], left: newq[1] }, 1500, function()
  {
    animateElement(element);
  });
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
            testPlayer.style.animation = "leave .5s forwards";
            await new Promise(r => setTimeout(r, 500));
            testPlayer.remove()
        })

        document.querySelector("#playerscontainer").appendChild(testPlayer)
        await new Promise(r => setTimeout(r, 250));
    }
}

async function StartGame()
{
  document.querySelector("#pregame").style.animation = "dragabove 1s linear forwards"
  await new Promise(r => setTimeout(r, 1000));
  document.querySelector("#pregame").style.display = "none"
}

// async function SwapPlayer(firstElementIndex, secondElementIndex)
// {
//   let leaderboard = document.querySelector("#leaderboardplayers")
//   let nodes = leaderboard.children
//   let iterations = secondElementIndex - firstElementIndex
//   let temp

//   nodes[firstElementIndex].classList.add("swapping", "positive")
//   nodes[secondElementIndex].classList.add("swapping", "negative")

//   nodes[firstElementIndex].style.transform = "translateY(" + 41 * iterations + "px)" // 41px is the height of a list item btw (i love magic numbers)
//   nodes[secondElementIndex].style.transform = "translateY(-" + 41 * iterations + "px)"

//   temp = nodes[firstElementIndex].innerHTML
//   nodes[firstElementIndex].innerHTML = nodes[secondElementIndex].innerHTML
//   nodes[secondElementIndex].innerHTML = temp

//   await new Promise(r => setTimeout(r, 1000))

//   nodes[firstElementIndex].style.transform = "translateY(0)"
//   nodes[secondElementIndex].style.transform = "translateY(0)"
  
//   await new Promise(r => setTimeout(r, 2000))

//   nodes[firstElementIndex].classList.remove("swapping", "positive")
//   nodes[secondElementIndex].classList.remove("swapping", "negative")
// }

async function SortLeaderboard()
{
  let leaderboard = document.querySelector("#leaderboardplayers")
  let scores = leaderboard.querySelectorAll(".score")
  let usernames = leaderboard.children
  let scoresAndPlayers = []

  for (let i = 0; i < scores.length; i++)
  {
    scoresAndPlayers.push({"username": usernames[i].textContent.slice(0, -2).replace(" ", ""), "score": scores[i].innerHTML})
  }

  scoresAndPlayers.sort((a, b) => b.score - a.score)

  for (let i = 0; i < leaderboard.children.length; i++)
  {
    usernames[i].innerHTML = scoresAndPlayers[i].username + " <span class='score'>" + scoresAndPlayers[i].score + "</span>"
  }
}
