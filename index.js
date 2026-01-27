require('dotenv').config(); // Load environment variables from .env

require("reflect-metadata");
const express = require("express");
//const { DataSource, EntitySchema } = require("typeorm");
const { Client } = require("pg");
const fs = require("fs");
//const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function testFunction() {
    document.getElementById("para").style.textAlign = "center";
}

function renderPage(title, content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>${title}</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <style>
        body { padding-top: 50px; }
        .container { max-width: 800px; }
        /* Fireworks animation styles */
        .fireworks-container {
          position: absolute;
          pointer-events: none;
        }
        .firework {
          position: absolute;
          width: 8px;
          height: 8px;
          background: gold;
          border-radius: 50%;
          opacity: 1;
          animation: firework-animation 0.8s ease-out forwards;
        }
        @keyframes firework-animation {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    </body>
  </html>
  `;
}

app.get("/", (req, res) => {
  console.log("poop butt");
  const content = `<div>
    <h1>Jacebase</h1>
    <p id="para">enter username and password</p>
    <form id="upformm">
        <label for="fname">Username:</label>
        <input type="text" id="uname" name="uname"><br><br>
        <label for="pword">Password:</label>
        <input type="text" id="pword" name="pword"><br><br>
        <button type="submit">Submit</button>
    </form>
    <button type="button" onclick="testFunction()">function</button>
    <p id="answer"></p>
    <script>
    document.getElementById("upformm").addEventListener("submit", function(event){
    event.preventDefault();
    username = document.getElementById("uname").value;
    password = document.getElementById("pword").value;

    if(username === "admin" && password === "admin"){
        document.getElementById("answer").innerHTML = "Welcome, admin!";
        setTimeout(function(){window.location.href = "/home"}, 2000);
    }else{
        document.getElementById("answer").innerHTML = "Incorrect username or password.";
    }
    });
    function testFunction() {
      document.getElementById("para").style.textAlign = "center";
    }
    </script>
  </div>`;
  res.send(renderPage("Zachariah Friesen Test Website", content));
});

app.get("/home", (req, res) => {
    const content = `    <h1>Jacebase</h1>
    <p id="para">Welcome</p>
    <h1>Jacebase</h1>
    <p>Welcome</p>
    <p>Select number of players</p>
    <select name="Number of Players" id="pnumber">
        <option value="p0">select</option>
        <option value="p3">3</option>
        <option value="p4">4</option>
        <option value="p5">5</option>
    </select>

    <p id="tester">testvalue</p>

    <div style="gap: 20px; display:none"  id="orderedBox">
        <p>Ordered?:</p>
        <select name="Ordered" id="orderedSelect">
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>
        <div style="gap: 20px; display:none"  id="pentagramBox">
            <p>Pentagram?:</p>
            <select name="Pentagram" id="pentagramSelect">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <p>Are enemy positions known?:</p>
            <select name="knownp" id="knownPentagram">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
    </div>

    <div style="gap: 20px; display:none"  id="player1Input">
        <div style="display:flex; gap: 10px">
            <p>Deck 1:</p>
            <input type="text" id="deck1"></input>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Player 1:</p>
            <input type="text" id="player1"></input>
        </div>
        <div style="display:none; gap: 10px" id="player1Enemies">
            <p>Enemy 1:</p>
            <input type="text" id="deck1enemy1"></input>
            <p>Enemy 2:</p>
            <input type="text" id="deck1enemy2"></input>
        </div>
    </div>

    <div style="gap: 20px; display:none" id="player2Input">
        <div style="display:flex; gap: 10px">
            <p>Deck 2:</p>
            <input type="text" id="deck2"></input>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Player 2:</p>
            <input type="text" id="player2"></input>
        </div>
        <div style="display:none; gap: 10px" id="player2Enemies">
            <p>Enemy 1:</p>
            <input type="text" id="deck2enemy1"></input>
            <p>Enemy 2:</p>
            <input type="text" id="deck2enemy2"></input>
        </div>
    </div>

    <div style="gap: 20px; display:none" id="player3Input">
        <div style="display:flex; gap: 10px">
            <p>Deck 3:</p>
            <input type="text" id="deck3"></input>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Player 3:</p>
            <input type="text" id="player3"></input>
        </div>
        <div style="display:none; gap: 10px" id="player3Enemies">
            <p>Enemy 1:</p>
            <input type="text" id="deck3enemy1"></input>
            <p>Enemy 2:</p>
            <input type="text" id="deck3enemy2"></input>
        </div>
    </div>

    <div style="gap: 20px; display:none" id="player4Input">
        <div style="display:flex; gap: 10px">
            <p>Deck 4:</p>
            <input type="text" id="deck4"></input>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Player 4:</p>
            <input type="text" id="player4"></input>
        </div>
        <div style="display:none; gap: 10px" id="player4Enemies">
            <p>Enemy 1:</p>
            <input type="text" id="deck4enemy1"></input>
            <p>Enemy 2:</p>
            <input type="text" id="deck4enemy2"></input>
        </div>
    </div>

    <div style="gap: 20px; display:none" id="player5Input">
        <div style="display:flex; gap: 10px">
            <p>Deck 5:</p>
            <input type="text" id="deck5"></input>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Player 5:</p>
            <input type="text" id="player5"></input>
        </div>
        <div style="display:none; gap: 10px" id="player5Enemies">
            <p>Enemy 1:</p>
            <input type="text" id="deck5enemy1"></input>
            <p>Enemy 2:</p>
            <input type="text" id="deck5enemy2"></input>
        </div>
    </div>

    <div style="gap: 20px; display:flex"  id="winnerBox">
        <p>Winner:</p>
        <select name="Winner" id="winnerSelect">
            <option value="N/A">Select Player Count</option>
        </select>
        <button id="submitButton">Submit</button>
    </div>

    <script src="scripts.js"></script>
    <script>

        //$("#pnumber").bind('focusout', function() {
        //    console.log("testing")
        //    document.getElementById("tester").textContent = $(this).find('option:selected').text();
        //}); 
        document.addEventListener("DOMContentLoaded", function() {
            playernumber = "";
            winOptions = [];


            document.getElementById("pnumber").addEventListener("change", function() {
                document.getElementById("tester").textContent = this.value;
                playernumber = this.value;
                loadPlayerInputs();
            });

            document.getElementById("knownPentagram").addEventListener("change", function() {
                if (this.value === "yes" && document.getElementById("orderedSelect").value === "no") {
                    showPentagramBoxes();
                }else{
                    hidePentagramBoxes();
                }
            });

            document.getElementById("orderedSelect").addEventListener("change", function() {
                if (this.value === "yes"){
                    hidePentagramBoxes();
                }
            });

            function hidePentagramBoxes() {
                document.getElementById("player1Enemies").style.display = "none";
                document.getElementById("player2Enemies").style.display = "none";
                document.getElementById("player3Enemies").style.display = "none";
                document.getElementById("player4Enemies").style.display = "none";
                document.getElementById("player5Enemies").style.display = "none";
            }

            function showPentagramBoxes() {
                document.getElementById("player1Enemies").style.display = "flex";
                document.getElementById("player2Enemies").style.display = "flex";
                document.getElementById("player3Enemies").style.display = "flex";
                document.getElementById("player4Enemies").style.display = "flex";
                document.getElementById("player5Enemies").style.display = "flex";
            }

            function populateWinBox(winOptions){
                var winBox = document.getElementById("winnerSelect");
                winBox.options.length = 0;
                for (let i = 0; i < winOptions.length; i++) {
                    let option = document.createElement("option");
                    option.value = winOptions[i].value;
                    option.text = winOptions[i].text;
                    winBox.add(option);
                }
            }

            function loadPlayerInputs() {
                if (playernumber === "p3") {
                    document.getElementById("orderedBox").style.display = "flex";
                    document.getElementById("pentagramBox").style.display = "none";
                    document.getElementById("player1Input").style.display = "flex";
                    document.getElementById("player2Input").style.display = "flex";
                    document.getElementById("player3Input").style.display = "flex";
                    document.getElementById("player4Input").style.display = "none";
                    document.getElementById("player5Input").style.display = "none";
                    hidePentagramBoxes();
                    winOptions = [{value:'player1',text:"Player 1"}, {value:'player2',text:"Player 2"}, {value:'player3',text:"Player 3"}];
                    populateWinBox(winOptions);
                }else if (playernumber === "p4") {
                    document.getElementById("orderedBox").style.display = "flex";
                    document.getElementById("pentagramBox").style.display = "none";
                    document.getElementById("player1Input").style.display = "flex";
                    document.getElementById("player2Input").style.display = "flex";
                    document.getElementById("player3Input").style.display = "flex";
                    document.getElementById("player4Input").style.display = "flex";
                    document.getElementById("player5Input").style.display = "none";
                    hidePentagramBoxes();
                    winOptions = [{value:'player1',text:"Player 1"}, {value:'player2',text:"Player 2"}, {value:'player3',text:"Player 3"}, {value:'player4',text:"Player 4"}];
                    populateWinBox(winOptions);
                }else if (playernumber === "p5") {
                    document.getElementById("orderedBox").style.display = "flex";
                    document.getElementById("pentagramBox").style.display = "flex";
                    document.getElementById("player1Input").style.display = "flex";
                    document.getElementById("player2Input").style.display = "flex";
                    document.getElementById("player3Input").style.display = "flex";
                    document.getElementById("player4Input").style.display = "flex";
                    document.getElementById("player5Input").style.display = "flex";
                    winOptions = [{value:'player1',text:"Player 1"}, {value:'player2',text:"Player 2"}, {value:'player3',text:"Player 3"}, {value:'player4',text:"Player 4"}, {value:'player5',text:"Player 5"}];
                    populateWinBox(winOptions);
                }
            }

            document.getElementById("submitButton").addEventListener("click", submitButtonClicked, false);
            function submitButtonClicked(){
                if (playernumber == "p3"){
                    deck1 = document.getElementById("deck1").value;
                    console.log(deck1);
                    player1 = document.getElementById("player1").value;
                    console.log(player1);
                    deck2 = document.getElementById("deck2").value;
                    console.log(deck2);
                    player2 = document.getElementById("player2").value;
                    console.log(player2);
                    deck3 = document.getElementById("deck3").value;
                    console.log(deck3);
                    player3 = document.getElementById("player3").value;
                    console.log(player3);
                    players = 3;
                    console.log(players);
                    winner = document.getElementById("winnerSelect").value;
                    console.log(winner);
                    fetch('/home', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            deck1: deck1,
                            player1: player1,
                            deck2: deck2,
                            player2: player2,
                            deck3: deck3,
                            player3: player3,
                            players: players,
                            winner: winner
                    })}))
                }
            }
        });
    </script>
    <script src="scripts.js"></script>`;
    res.send(renderPage("Home - Jacebase", content));
});

app.post("/home", (req, res) => {
  console.log("Received data:", req.body);
});

async function ensureDatabaseExists() {
  const targetDB = process.env.DB_NAME || "jacebase-db";
  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: (process.env.DB_HOST && process.env.DB_HOST != 'localhost') ? { ca: fs.readFileSync('global-bundle.pem').toString() } : false,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: "postgres" // Connect to the default database
  };

  const client = new Client(dbConfig);
  await client.connect();

  const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDB]);
  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${targetDB}"`);
    console.log(`Database "${targetDB}" created.`);
  } else {
    console.log(`Database "${targetDB}" already exists.`);
  }
  await client.end();
}

ensureDatabaseExists().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
}).catch(error => console.log("Error connecting to the database:", error));