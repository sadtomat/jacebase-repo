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



const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: (process.env.DB_HOST && process.env.DB_HOST != 'localhost') ? { ca: fs.readFileSync('global-bundle.pem').toString() } : false,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: "jacebase-db" // Connect to the default database
};

//const pool = mysql.createPool({
//    host: process.env.DB_HOST || "localhost",
//    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//    user: process.env.DB_USER || "postgres",
//    password: process.env.DB_PASS || "postgres",
//    database: "jacebase-db",
//    waitForConnections: true,
//    connectionLimit: 10,
//    queueLimit: 0
//});
function renderPage(title, content) {
  return /*html*/`
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
  const content = /*html*/`<div>
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

app.get("/api/player-instances", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT * FROM public."playerInstance"
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.end();
  }
});

app.get("/api/game-instances", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT * FROM public."gameTables"
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.end();
  }
});

app.get("/api/player-table", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT * FROM public."playertable"
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.end();
  }
});

app.get("/api/deck-table", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT * FROM public."decktable"
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.end();
  }
});

app.get("/charts", (req, res) => {
  const content = /*html*/`<div>
    <h1>Visualizer Page</h1>
    <div>
      <div style="gap: 20px;"  id="controlsBox">
        <p>Select Table:</p>
        <select name="Table Select" id="tableSelect">
          <option value="rawPlayer">Raw Player Instances</option>
          <option value="rawGame">Raw Game Instances</option>
        </select>
        <button id="loadDataButton">Load Data</button>
      </div>

      <table id="testTable" class="display" width="100%"></table>
    </div>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <link href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css" rel="stylesheet">
    <script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js"></script>
    <script>
    //const DataTable = require('datatables.net-dt');

    let playerTable;
    let gameTable;

    var mainTable = new Tabulator("#testTable", {autoColumns:true});

    document.addEventListener("DOMContentLoaded", function() {
        fetchData();
    });

    document.getElementById("loadDataButton").addEventListener("click", function() {
      mainTable.clearData();
      boxValue = document.getElementById("tableSelect").value;
      if (boxValue === "rawPlayer") {
        showRawPlayerInstances();
      } else if (boxValue === "rawGame") {
        showRawGameInstances();
      }
    });

    async function fetchData() {
      try {
        const response1 = await fetch("/api/player-instances");
        playerTable = await response1.json();
        const response2 = await fetch("/api/game-instances");
        gameTable = await response2.json();
      } finally {
        console.log("Data fetch attempt complete");
      }
    }

    function showRawGameInstances() {
      mainTable.setColumns([
        {title: "Game ID", field: "gameID"},
        {title: "Player Count", field: "PlayerCount"},
        {title: "Pentagram", field: "Pentagram"},
      ])
      for (game of gameTable) {
        console.log(game);
        mainTable.addData(game);
      }
    }

    function showRawPlayerInstances() {
      mainTable.setColumns([
        {title: "Instance ID", field: "instanceID"},
        {title: "Game ID", field: "gameID_gameTables"},
        {title: "Player Name", field: "PlayerName"},
        {title: "Deck Name", field: "DeckName"},
        {title: "Win", field: "Win"},
        {title: "Turn 1 Sol Ring", field: "T1Sol"},
        {title: "Turn Order Position", field: "TurnOrderPos"},
        {title: "Scoop", field: "Scoop"},
        {title: "Turbo'd/Out First", field: "Turbod"},
        {title: "Enemy Deck 1", field: "EnemyDeck1"},
        {title: "Enemy Deck 2", field: "EnemyDeck2"},
      ])
      for (player of playerTable) {
        console.log(player);
        mainTable.addData(player);
      }
    }

    function shoePlayerWinrates() {

    }

    </script>
  </div>`
  res.send(renderPage("Visualizer - Jacebase", content));
});

app.get("/home", (req, res) => {
    const content = /*html*/`    <h1>Jacebase</h1>
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

    <button type="button" id="visualizerButton">Visualizer</button>
    <button type="button" id="miscAddButton">Add Players or Decks</button>

    <div style="gap: 20px; display:none"  id="orderedBox">
        <p>Date(yyyy/mm/dd):</p>
        <input type="text" id="gameDate"></input>
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
        <div style="display:flex; gap: 10px">
            <p>Turn 1 Sol Ring:</p>
            <select name="sol ring box 1" id="p1solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Turbo'd/Out First:</p>
            <select name="turbo box 1" id="p1turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Scoop:</p>
            <select name="scoop box 1" id="p1scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
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
        <div style="display:flex; gap: 10px">
            <p>Turn 1 Sol Ring:</p>
            <select name="sol ring box 2" id="p2solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Turbo'd/Out First:</p>
            <select name="turbo box 2" id="p2turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Scoop:</p>
            <select name="scoop box 2" id="p2scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
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
        <div style="display:flex; gap: 10px">
            <p>Turn 1 Sol Ring:</p>
            <select name="sol ring box 3" id="p3solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Turbo'd/Out First:</p>
            <select name="turbo box 3" id="p3turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Scoop:</p>
            <select name="scoop box 3" id="p3scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
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
        <div style="display:flex; gap: 10px">
            <p>Turn 1 Sol Ring:</p>
            <select name="sol ring box 4" id="p4solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Turbo'd/Out First:</p>
            <select name="turbo box 4" id="p4turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Scoop:</p>
            <select name="scoop box 4" id="p4scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
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
        <div style="display:flex; gap: 10px">
            <p>Turn 1 Sol Ring:</p>
            <select name="sol ring box 5" id="p5solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Turbo'd/Out First:</p>
            <select name="turbo box 5" id="p5turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div style="display:flex; gap: 10px">
            <p>Scoop:</p>
            <select name="scoop box 5" id="p5scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
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

    <script>

        //$("#pnumber").bind('focusout', function() {
        //    console.log("testing")
        //    document.getElementById("tester").textContent = $(this).find('option:selected').text();
        //}); 
        document.addEventListener("DOMContentLoaded", function() {
            playernumber = "";
            winOptions = [];
            let playerTable;
            let deckTable;
            fetchData();

            async function fetchData() {
              try {
                const response1 = await fetch("/api/player-table");
                playerTable = await response1.json();
                const response2 = await fetch("/api/deck-table");
                deckTable = await response2.json();
              } finally {
                console.log("Data fetch attempt complete");
              }
            }

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

            document.getElementById("visualizerButton").addEventListener("click", function() {
                window.location.href = "/charts";
            });

            document.getElementById("miscAddButton").addEventListener("click", function() {
                window.location.href = "/misc-additions";
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
            
            function verifyAuthenticity(){
                if (playernumber === "p3") {
                  count = 3;
                }else if (playernumber === "p4") {
                  count = 4;
                }else if (playernumber === "p5") {
                  count = 5;
                }else{
                  return false;
                }
                dateInput = document.getElementById("gameDate").value;
                regex = new RegExp("^\\d{4}\\/\\d{2}\\/\\d{2}$");
                dateCorrect = regex.test(dateInput);
                deckPlayerCorrect = true;
                for (let i = 1; i < count+1; i++){
                  deckFinder = "deck"+i;
                  deck = document.getElementById(deckFinder);
                  deckFound = JSON.stringify(deckTable).includes(deck);
                  console.log("found deck: "+deck+" - "+deckFound);
                  playerFinder = "player"+i;
                  player = document.getElementById(playerFinder);
                  playerFound = JSON.stringify(playerTable).includes(player);
                  console.log("found player: "+player+" - "+playerFound);
                  if (deckFound === false || playerFound === false){
                    deckPlayerCorrect = false;
                  }
                }
                return false;
            }

            function createPlayerObject(playerCount, gameID){
                deck = "deck"+playerCount;
                player = "player"+playerCount;
                solBox = "p"+playerCount+"solring";
                winBool = null;
                if (document.getElementById("winnerSelect").value === "player"+playerCount){
                    winBool = true;
                }else{
                    winBool = false;   
                }
                if (document.getElementById(solBox).value === "yes"){
                    turn1SolRing = true;
                }else if (document.getElementById(solBox).value === "no"){
                    turn1SolRing = false;
                }else{
                    turn1SolRing = null;
                }
                turboBox = "p"+playerCount+"turbo";
                if (document.getElementById(turboBox).value === "yes"){
                    turbo = true;
                }else if (document.getElementById(turboBox).value === "no"){
                    turbo = false;
                }else{
                    turbo = null;
                }
                scoopBox = "p"+playerCount+"scoop";
                if (document.getElementById(scoopBox).value === "yes"){
                    scoop = true;
                }else if (document.getElementById(scoopBox).value === "no"){
                    scoop = false;
                }else{
                    scoop = null;
                }
                enemyDeck1 = "deck"+playerCount+"enemy1";
                enemyDeck2 = "deck"+playerCount+"enemy2";
                iID = Math.floor(Math.random() * 1000000)
                playerObject = {
                    instanceID: iID,
                    gameID_gameTables: gameID,
                    PlayerName: document.getElementById(player).value,
                    DeckName: document.getElementById(deck).value,
                    Win: winBool,
                    T1Sol: turn1SolRing,
                    TurnOrderPos: playerCount,
                    Scoop: scoop,
                    Turbod: turbo,
                    EnemyDeck1: document.getElementById(enemyDeck1).value || null,
                    EnemyDeck2: document.getElementById(enemyDeck2).value || null,
                }
                return playerObject;
            }
            
            document.getElementById("submitButton").addEventListener("click", submitButtonClicked, false);
            function submitButtonClicked(){
              if (verifyAuthenticity()){
                gameID = Math.floor(Math.random() * 1000000);
                if (playernumber != "p5") {
                  pentagram = null;
                }else{
                    if (document.getElementById("pentagramSelect").value === "yes") {
                        pentagram = true;
                    }else{
                        pentagram = false;
                    }
                }
                if (playernumber === "p3") {
                  deckObj1 = createPlayerObject(1, gameID);
                  deckObj2 = createPlayerObject(2, gameID);
                  deckObj3 = createPlayerObject(3, gameID);
                  returnBody = {
                    ID: gameID,
                    size: 3,
                    pentagramBool: pentagram,
                    players: {
                        player1: deckObj1,
                        player2: deckObj2,
                        player3: deckObj3
                    }
                  }
                }else if (playernumber === "p4") {
                  deckObj1 = createPlayerObject(1, gameID);
                  deckObj2 = createPlayerObject(2, gameID);
                  deckObj3 = createPlayerObject(3, gameID);
                  deckObj4 = createPlayerObject(4, gameID);
                  returnBody = {
                    ID: gameID,
                    size: 4,
                    pentagramBool: pentagram,
                    players: {
                        player1: deckObj1,
                        player2: deckObj2,
                        player3: deckObj3,
                        player4: deckObj4
                    }
                  }
                }else if (playernumber === "p5") {
                  deckObj1 = createPlayerObject(1, gameID);
                  deckObj2 = createPlayerObject(2, gameID);
                  deckObj3 = createPlayerObject(3, gameID);
                  deckObj4 = createPlayerObject(4, gameID);
                  deckObj5 = createPlayerObject(5, gameID);
                  returnBody = {
                    ID: gameID,
                    size: 5,
                    pentagramBool: pentagram,
                    players: {
                        player1: deckObj1,
                        player2: deckObj2,
                        player3: deckObj3,
                        player4: deckObj4,
                        player5: deckObj5
                    }
                  }
                }
                //testObj = createPlayerObject(1, 3)
                //console.log(JSON.stringify(testObj));
                fetch('/home', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(returnBody)
                })
              }
            }
      });
    </script>`;
    res.send(renderPage("Misc Additions - Jacebase", content));
});

app.post("/home", (req, res) => {
  console.log("Received data:", req.body);
  insertToDB(req.body);
});

app.get("/misc-additions", (req, res) => {
    const content = /*html*/`
    <h1>Jacebase</h1>
    <p id="para">Player/Deck Addition Page</p>
    <div style="gap: 20px; display:flex"  id="player1Input">
      <p>Player Name:</p>
      <input type="text" id="playerName"></input>
      <button id="playerSubmitButton">Submit</button>
    </div>
    <div id="deckBox" style="display:flex; gap: 10px">
      <p>Deck Name:</p>
      <input type="text" id="deckName"></input>
      <p>Deck Creator:</p>
      <input type="text" id="deckCreator"></input>
      <p>Primary Tag:</p>
      <input type="text" id="tagBox"></input>
      <p>Secondary Tags:</p>
      <input type="text" id="secTagBox1"></input>
      <input type="text" id="secTagBox2"></input>
      <button id="deckSubmitButton">Submit</button>
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        let playerTable
        let tagList =[
          "Aggro",
          "Control",
          "Combo",
          "Midrange",
          "Chaos",
          "Stax",
          "Hug",
          "Slug"
        ];
        
        fetchData();
        async function fetchData() {
          try {
            const response1 = await fetch("/api/player-table");
            playerTable = await response1.json();
          } finally {
            console.log("Data fetch attempt complete");
          }
        }
        
        document.getElementById("deckSubmitButton").addEventListener("click", function() {
          deckName = document.getElementById("deckName").value;
          tag1 = document.getElementById("tagBox").value;
          tag2 = document.getElementById("secTagBox1").value;
          tag3 = document.getElementById("secTagBox2").value;
          deckCreator = document.getElementById("deckCreator").value;

          playerExists = JSON.stringify(playerTable).includes(deckCreator);
          tagExists = tagList.includes(tag1);

          if (playerExists && tagExists) {
            player = playerTable.find(p => p.name === deckCreator);
            deckID = Math.floor(Math.random() * 1000000);
            returnBody = {
              id: deckID,
              deckName: deckName,
              creatorID: player.id,
              primaryTag: tag1,
              secondaryTag1: tag2,
              secondaryTag2: tag3
            }
            fetch('/misc-additions/deck', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(returnBody)
            })
          }
          
        });

        document.getElementById("playerSubmitButton").addEventListener("click", function() {
          playerName = document.getElementById("playerName").value;
          playerID = Math.floor(Math.random() * 1000000);
          returnBody = {
            id: playerID,
            name: playerName
          }
          fetch('/misc-additions/player', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(returnBody)
          })
        });
      });


    </script>
    `
    res.send(renderPage("Home - Jacebase", content));
});

app.post("/misc-additions/player", (req, res) => {
  console.log("Received player data:", req.body);
  addPlayerToDB(req.body);
});

app.post("/misc-additions/deck", (req, res) => {
  console.log("Received deck data:", req.body);
  addDeckToDB(req.body);
});

async function addDeckToDB(data) {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    playerAdditionQueryText = `INSERT INTO public."decktable" ("id","playerid","name","tag","subtag1","subtag2") VALUES ($1, $2, $3, $4, $5, $6)`;
    const result = await client.query(playerAdditionQueryText, [data.id, data.creatorID, data.deckName, data.primaryTag, data.secondaryTag1, data.secondaryTag2]);
    console.log("Deck data inserted successfully");
  } finally {
    await client.end();
  }
}

async function addPlayerToDB(data) {
  const client = new Client(dbConfig);
  await client.connect();
  try {
    playerAdditionQueryText = `INSERT INTO public."playertable" ("id","name") VALUES ($1, $2)`;
    const result = await client.query(playerAdditionQueryText, [data.id, data.name]);
    console.log("Player data inserted successfully");
  } finally {
    await client.end();
  }
}

async function insertToDB(data) {
  const client = new Client(dbConfig);
  await client.connect();
  try {
    
    gameCreationQueryText = `INSERT INTO public."gameTables" ("gameID","PlayerCount","Pentagram") VALUES ($1, $2, $3)`;
    gameCreationQueryValues = [data.ID, data.size, data.pentagramBool];
    const result = await client.query(gameCreationQueryText, gameCreationQueryValues);
    console.log("Data inserted successfully");
    //console.log(result.rows);

    console.log(Object.values(data.players));
    for (const playerInstance of Object.values(data.players)) {
      playerCreationQueryText = `INSERT INTO public."playerInstance" ("instanceID", "gameID_gameTables", "PlayerName", "DeckName", "Win", "T1Sol", "TurnOrderPos", "Scoop", "Turbod", "EnemyDeck1", "EnemyDeck2") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
      playerCreationQueryValues = [
        playerInstance.instanceID,
        playerInstance.gameID_gameTables,
        playerInstance.PlayerName,
        playerInstance.DeckName,
        playerInstance.Win,
        playerInstance.T1Sol,
        playerInstance.TurnOrderPos,
        playerInstance.Scoop,
        playerInstance.Turbod,
        playerInstance.EnemyDeck1,
        playerInstance.EnemyDeck2
      ];
      const result = await client.query(playerCreationQueryText, playerCreationQueryValues);
      console.log("Player data inserted successfully for", playerInstance.PlayerName);
    }
    //const queryResult = await client.query(`SELECT * FROM public."gameTables"`);
    //console.log("Query result:", queryResult);
  } finally {
    await client.end();
  }
}

async function ensureDatabaseExists() {
  const targetDB = process.env.DB_NAME || "jacebase-db";

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