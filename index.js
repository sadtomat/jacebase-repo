require('dotenv').config(); // Load environment variables from .env
require("reflect-metadata");
const express = require("express");
const session = require("express-session");
//const { DataSource, EntitySchema } = require("typeorm");
const { Client } = require("pg");
const fs = require("fs");
//const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let admin = false;

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: (process.env.DB_HOST && process.env.DB_HOST != 'localhost') ? { ca: fs.readFileSync('global-bundle.pem').toString() } : false,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: "jacebase-db" // Connect to the default database
};

app.use(session({
  //secret: process.env.SESSION_SECRET,
  secret: "12312312",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/api/set-login', async (req, res) => {
  const {username, password} = req.body;
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT * FROM public."logins"
    `;
    const result = await client.query(query);
    isLogin = (result.rows).find(obj => obj.username === username)
    if (isLogin){
      if (isLogin.password === password){
        req.session.admin = true;
        res.json([{login: true}]);
        return;
      }
    }
    res.json({login: false});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.end();
  }
});

app.get('/api/is-login', (req, res) => {
  if (!req.session.admin){
    res.json([{
      admin: false
    }])
  }else{
    res.json([{
      admin: true
    }])
  }
})

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
    </head>
    <body>
      <div class="topnav">
        <img src="" id="logo" alt="Dynamically loaded image"></img>
        <button id="toLogin">Login</button>
        <button id="toHome">Add Games</button>
        <button id="toMisc">Add Decks/Players</button>
        <button id="toCharts">Visualizer</button>
        <h1>J a c e b a s e</h1>
      </div>

      <div class="container" src="" id="container">
        ${content}
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      <script>
        
        document.addEventListener("DOMContentLoaded", function() {
          const jacebaseLogoUrl = "https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/Jacebase-logo.jpg";
          const imageElement1 = document.getElementById("logo");
          imageElement1.src = jacebaseLogoUrl;
          document.getElementById("toLogin").addEventListener("click", function(){
            setTimeout(function(){window.location.href = "/"}, 1000);
          });
          document.getElementById("toHome").addEventListener("click", function(){
            setTimeout(function(){window.location.href = "/home"}, 1000);
          });
          document.getElementById("toMisc").addEventListener("click", function(){
            setTimeout(function(){window.location.href = "/misc-additions"}, 1000);
          });
          document.getElementById("toCharts").addEventListener("click", function(){
            setTimeout(function(){window.location.href = "/charts"}, 1000);
          });

          


        });
      </script>
      <style>
        body {
          background-image: url('https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/background1.jpeg')
        }
        .container {
          padding: 40px;
          background-image: url('https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/background2.jpg')
        }
        .topnav {
          overflow: hidden;
          background-color: #333;
          padding: 20px;
          gap: 10px;
          display: flex;
        }
        .topnav button{
          float: left;
          color: #f2f2f2;
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
          font-size: 17px;
          background-color: #000099
        }
        .topnav button:hover{
          background-color: #0066ff;
          color:white;
        }
        .topnav button.active{
          background-color: #006666;
          color:white;
        }
        .topnav img{
          height: 60px;
          width: 60px;
        }
        .topnav h1{
          font-family: Times;
          font-weight: bold;
          color: #99ccff;
          font-size: 300%;
          text-shadow: 5px 5px 10px black;
          outline: 10px white;
          width: 350px;
          padding-left: 50px;

        }
      </style>
    </body>
  </html>
  `;
}

app.get("/", (req, res) => {
  console.log("poop butt");
  const content = /*html*/`<div>
    <h1 class="loginpage">Login Page</h1>
    <div class="bigbox">
      <img class="bigjace" id="bigjace" src=""></img>
      <div class="smallbox">
        <p class="entertext">Enter username and password</p>
        <form id="upformm">
          <label class="username" for="fname">Username:</label>
          <input type="text" id="uname" name="uname"><br><br>
          <label class="password" for="pword">Password:</label>
          <input class="inputpassword" type="password" id="pword" name="pword"><br><br>
          <button class="exitbutton" type="submit">Submit</button>
        </form>
        <button class="exitbutton" id="guest" type="submit">Login as Guest</button>
        <p id="answer"></p>
      </div>
    </div>
    <script>
    let passwordTable;
    document.addEventListener("DOMContentLoaded", function() {
      const jacebaseLogoUrl = "https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/Jacebase-login.jpg";
      const imageElement = document.getElementById("bigjace");
      imageElement.src = jacebaseLogoUrl;
      fetchData();
    });
    async function fetchData(){
      const response1 = await fetch("/api/login-info");
      passwordTable = await response1.json();
    }

    document.getElementById("upformm").addEventListener("submit", async function(event){
      event.preventDefault();
      username = document.getElementById("uname").value;
      password = document.getElementById("pword").value;
      const response = await fetch('/api/set-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      const data = await response.json();
      console.log(data)
      if (data[0].login){
        document.getElementById("answer").innerHTML = "Welcome, Admin!";
        setTimeout(function(){window.location.href = "/home"}, 2000);
      }else {
        document.getElementById("answer").innerHTML = "Incorrect username or password.";
      }
    });

    document.getElementById("guest").addEventListener("submit", function(event){
      document.getElementById("answer").innerHTML = "Welcome, Guest!";
      setTimeout(function(){window.location.href = "/charts"}, 2000);
    });

    </script>
    <style>
      .bigjace {
        height: 700px;
        width: 500px;
      }
      .bigbox {
        display: inline-flex;
      }
      .smallbox {
        padding-left: 35px;
      }
      .loginpage {
        font-weight: bold;
        color: black;
        font-size: 400%;
        text-shadow: -2px -2px 0 #3399ff, -2px 2px 0 #3399ff, 2px -2px 0 #3399ff, 2px 2px 0 #3399ff;
        outline: 10px white;
        width: 1000px;
        text-align;
      }
      .entertext {
        font-size: 200%;
        font-weight: bold;
        text-shadow: -1px -1px 0 #3399ff, -1px 1px 0 #3399ff, 1px -1px 0 #3399ff, 1px 1px 0 #3399ff;
      }
      .username {
        font-size: 150%;
        font-weight: bold;
      }
      .password {
        font-size: 150%;
        font-weight: bold;
      }
      .exitbutton {
        float: left;
        color: #f2f2f2;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 17px;
        background-color: #000099;
        margin-right: 30px;
      }
      .exitbutton:hover{
        background-color: #0066ff;
        color:white;
      }

    </style>
  </div>`;
  res.send(renderPage("Zachariah Friesen Test Website", content));
});

app.get("/api/login-info", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    const query = `
      SELECT * FROM public."logins"
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

app.get("/api/:id/game-opponents", async (req, res) => {
  const client = new Client(dbConfig);
  await client.connect();
  const id = req.params.id
   // playerAdditionQueryText = `INSERT INTO public."decktable" ("id","playerid","name","tag","subtag1","subtag2") VALUES ($1, $2, $3, $4, $5, $6)`;
   // const result = await client.query(playerAdditionQueryText, [data.id, data.creatorID, data.deckName, data.primaryTag, data.secondaryTag1, data.secondaryTag2]);
   // console.log("Deck data inserted successfully");
  try {
    const query = `
    SELECT * FROM public."playerInstance"
    WHERE "playerInstance"."gameID_gameTables" = (
      SELECT "playerInstance"."gameID_gameTables" FROM public."playerInstance" WHERE "playerInstance"."instanceID" = $1
    )
    AND "playerInstance"."instanceID" != $1
    `;
    const result = await client.query(query, [id]);
    res.json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }finally {
    await client.end();
  }
});

app.get("/charts", (req, res) => {
  const content = /*html*/`<div>
    <h1 class="visualizerpage">Visualizer</h1>
    <div>
      <div class="tablebox" id="controlsBox">
        <p class="tableselecttext">Select Table:</p>
        <select class="tableselect" name="Table Select" id="tableSelect">
          <option value="rawPlayer">Raw Player Instances</option>
          <option value="rawGame">Raw Game Instances</option>
          <option value="rawDeck">Raw Deck Instances</option>
          <option value="rawInstances">Raw Instances of Games</option>
          <option value="playerStats">Player Stats</option>
          <option value="deckStats">Deck Stats</option>
          <option value="archStats">Archetype Stats</option>
          <option value="posStats">Positional Stats</option>
          <option value="indvPlayerStats">Individual Player Stats</option>
          <option value="indvDeckStats">Individual Deck Stats</option>
        </select>
        <div class="tableselect" style="display: none" id="secondaryChooseBox">
          <select id="secondaryChoose">
            <option value="N/A">Select</option>
          </select>
        </div>
        <button id="loadDataButton">Load Data</button>
      </div>

      <table id="testTable" class="display" width="100%"></table>
    </div>

    <style>
      .tablebox {
        gap: 20px;
        display: inline-flex;
      }
      .tableselecttext{
        align-self: center;
        font-size: 150%;
        font-weight: bold;
      }
      .tableselect {
        align-self: center;
        font-size: 150%;
      }
      .visualizerpage {
        font-weight: bold;
        color: black;
        font-size: 400%;
        text-shadow: -2px -2px 0 #3399ff, -2px 2px 0 #3399ff, 2px -2px 0 #3399ff, 2px 2px 0 #3399ff;
        outline: 10px white;
        width: 1000px;
        text-align;
      }
    </style>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <link href="https://unpkg.com/tabulator-tables@6.3.1/dist/css/tabulator.min.css" rel="stylesheet">
    <script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.3.1/dist/js/tabulator.min.js"></script>
    <script>
    //const DataTable = require('datatables.net-dt');
    //temporary elo values. will be removed when database is big enough
    //or when all decks are eventually added
    const rawDeckElo = [
        {name: "Dragons", elo: 7.6},      //gabe
        {name: "Samurai", elo: 6.2},
        {name: "RoboRacers", elo: 5.4},
        {name: "Cats", elo: 5.8},
        {name: "Dungeater", elo: 7},
        {name: "Outlaws", elo: 4.6},
        {name: "Alliance", elo: 5.8},
        {name: "Jumpscare", elo: 5.3},
        {name: "Titanic", elo: 6.1},
        {name: "Ghouls", elo: 4.9},
        {name: "Attractions", elo: 4.3},
        {name: "Demons", elo: 7.4},       //zach
        {name: "Bats", elo: 6.4},
        {name: "Akuma", elo: 7.3},
        {name: "Discard", elo: 2},
        {name: "Cats/Dogs", elo: 4.3},
        {name: "Bears", elo: 6},
        {name: "JohnMarston", elo: 6.1},
        {name: "Diddy", elo: 6.2},
        {name: "Elementals", elo: 4.3},                         //default
        {name: "Dune", elo: 5.5},         //simon
        {name: "Coinflip", elo: 6.4},
        {name: "Ice Queen", elo: 5.6},
        {name: "Clue", elo: 5.1},
        {name: "Eggman", elo: 4.8},
        {name: "Squirells", elo: 6.8},
        {name: "Roku", elo: 4.3},                               //default
        {name: "Swords", elo: 6.4},      //ian
        {name: "Marchessa", elo: 6.7},
        {name: "Guff", elo: 6.6},
        {name: "Miku Slugger", elo: 4.2},
        {name: "Merfolk", elo: 5.5},      //adam
        {name: "Humans", elo: 5},
        {name: "Black Wizards", elo: 4.2},
        {name: "Vampires", elo: 6.4},
        {name: "Deathtouch", elo: 4.8},
        {name: "Wolves", elo: 5.6},
        {name: "Cat Girl", elo: 5.7},       //jesse
        {name: "Energy", elo: 4.3},
        {name: "Three Dog", elo: 7.1},        //shayne
        {name: "Goblins", elo: 9.7},
        {name: "Angels", elo: 7.3},
        {name: "Pirates", elo: 6},
        {name: "Monkeys", elo: 5.6},
        {name: "Green Goblin", elo: 7.4},
        {name: "Ninjas", elo: 6},
        {name: "Treebeard", elo: 9},
        {name: "Tyranids", elo: 7.2},
        {name: "Attractions", elo: 6.9},
        {name: "Wizards", elo: 9.6},
        {name: "Mana Dorks", elo: 7.2},
        {name: "Illusions", elo: 8},
        {name: "Counters", elo: 4.8},        //david
        {name: "Painbow", elo: 1.3},
        {name: "Captain America", elo: 7.3},        //ethan
        {name: "Toph", elo: 6},
        {name: "Eldrazi", elo: 6.7},
        {name: "Dragon Engine", elo: 7},
        {name: "Slivers", elo: 6.5},
        {name: "Lifegain", elo: 8.5},
        {name: "Miku", elo: 6.1},
        {name: "Venom", elo: 6.1},
        {name: "Bombadill", elo: 5.8},
        {name: "Assassins", elo: 5.9},
        {name: "Defenders", elo: 5.7},
        {name: "Giants", elo: 4.3},                             //default
        {name: "Rats", elo: 5.1},          //tennant
        {name: "Droids", elo: 6.8},
        {name: "Drawtodeath", elo: 6.2},
        {name: "Necrons", elo: 5.9},
        {name: "Evil Valgavoth", elo: 6.4},
        {name: "Dungeons", elo: 8},
        {name: "Mothman", elo: 6.4},
        {name: "Tyranids", elo: 4.9},          //precons
        {name: "Knights", elo: 5},
        {name: "Lorehold", elo: 5.2},
        {name: "Miracles", elo: 2},
        {name: "Worldshaper", elo: 5.2},
        {name: "Valgavoth", elo: 5.1},
        {name: "CounterIntelligence", elo: 2.4},
        {name: "20 Ways", elo: 3.2},
        {name: "Caesar", elo: 5},
        {name: "Tricky Terrain", elo: 6.3},
        {name: "Timeywimey", elo: 3.1},
        {name: "Eternal Might", elo: 2.1},
        {name: "Riders of Rohan", elo: 4.1},
        {name: "Breeders", elo: 4.6},
    ]

    let instanceTable;
    let gameTable;
    let playerTable;
    let deckTable;

    var mainTable = new Tabulator("#testTable", {autoColumns:true});

    document.addEventListener("DOMContentLoaded", function() {
        fetchData();
    });

    document.getElementById("loadDataButton").addEventListener("click", function() {
      mainTable.clearData();
      boxValue = document.getElementById("tableSelect").value;
      if (boxValue === "rawPlayer") {
        showRawPlayerTable();
      } else if (boxValue === "rawGame") {
        showRawGameInstances();
      } else if (boxValue === "rawDeck") {
        showRawDeckTable();
      } else if (boxValue === "rawInstances") {
        showRawPlayerInstances();
      } else if (boxValue === "playerStats"){
        showPlayerStats();
      } else if (boxValue === "deckStats"){
        showDeckStats();
      } else if (boxValue === "archStats"){
        showArcetypeStats();
      } else if (boxValue === "posStats"){
        positionalWinrate();
      } else if (boxValue === "indvPlayerStats"){
        playerValue = document.getElementById("secondaryChoose").value;
        if (playerValue === "N/A"){
          console.log("select player");
        }else{
          showIndividualPlayerStats(playerValue);
        }
      }else if (boxValue === "indvDeckStats"){
        deckValue = document.getElementById("secondaryChoose").value;
        if (deckValue === "N/A"){
          console.log("select deck");
        }else{
          showIndividualDeckStats(deckValue);
        }
      }
    });

    document.getElementById("tableSelect").addEventListener("change", function() {
      boxValue = document.getElementById("tableSelect").value;
      if (boxValue === "indvPlayerStats"){
        var playerBox = document.getElementById("secondaryChoose");
        playerBox.options.length = 0;
        for (player of playerTable) {
          let option = document.createElement("option");
          option.value = player.name;
          option.text = player.name;
          playerBox.add(option);
        }
        document.getElementById("secondaryChooseBox").style.display = "flex";
      }else if (boxValue === "indvDeckStats"){
        var deckBox = document.getElementById("secondaryChoose");
        deckBox.options.length = 0;
        for (deck of deckTable){
          let option = document.createElement("option");
          option.value = deck.name;
          option.text = deck.name;
          deckBox.add(option);
        }
        document.getElementById("secondaryChooseBox").style.display = "flex";
      }else{
        document.getElementById("secondaryChooseBox").style.display = "none";
      }
    });

    async function fetchData() {
      try {
        const response1 = await fetch("/api/player-instances");
        instanceTable = await response1.json();
        const response2 = await fetch("/api/game-instances");
        gameTable = await response2.json();
        const response3 = await fetch("/api/player-table");
        playerTable = await response3.json();
        const response4 = await fetch("/api/deck-table");
        deckTable = await response4.json();
      } finally {
        console.log("Data fetch attempt complete");
      }
    }

    function showRawGameInstances() {
      mainTable.setColumns([
        {title: "Game ID", field: "gameID"},
        {title: "Player Count", field: "PlayerCount"},
        {title: "Pentagram", field: "Pentagram"},
        {title: "Date", field: "date"},
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
      for (instance of instanceTable) {
        console.log(instance);
        mainTable.addData(instance);
      }
    }
    //playerAdditionQueryText = INSERT INTO public."playertable" ("id","name") VALUES ($1, $2);
    //playerAdditionQueryText = INSERT INTO public."decktable" ("id","playerid","name","tag","subtag1","subtag2") VALUES ($1, $2, $3, $4, $5, $6);

    function showRawPlayerTable() {
      mainTable.setColumns([
        {title: "ID", field: "id"},
        {title: "Name", field: "name"},
      ])
      for (player of playerTable){
        console.log(player);
        mainTable.addData(player);
      }
    }

    function showRawDeckTable() {
      mainTable.setColumns([
        {title: "ID", field: "id"},
        {title: "Player ID", field: "playerid"},
        {title: "Deck Name", field: "name"},
        {title: "Main Tag", field: "tag"},
        {title: "Secondary Tag 1", field: "subtag1"},
        {title: "Secondary Tag 2", field: "subtag2"},
      ])
      for (deck of deckTable){
        console.log(deck);
        mainTable.addData(deck);
      }
    }

    function showPlayerStats(){
      mainTable.setColumns([
        {title: "Name", field: "name"},
        {title: "Number of Games", field: "gameNumber"},
        {title: "Number of Decks", field: "deckNumber"},
        {title: "Win Rate", field: "winrate"},
        {title: "Scoops", field: "scoops"},
        {title: "Turn 1 Sol Rings", field: "t1Sol"},
        {title: "Turbo'd/Out First", field: "turbod"}
      ])
      for (player of playerTable){
        playersDecks = deckTable.filter(obj => obj.playerid === player.id);
        console.log(playersDecks);
        deckNumber = playersDecks.length;
        playingInstances = instanceTable.filter(obj => obj.PlayerName === player.name);
        console.log(playingInstances);
        gameNumber = playingInstances.length;
        winNumber = 0;
        turn1SolRings = 0;
        scoopCount = 0;
        turbodCount = 0;
        for (instance of playingInstances){
          if (instance.Win === true){
            winNumber++;
          }
          if (instance.T1Sol === true){
            turn1SolRings++;
          }
          if (instance.Scoop === true){
            scoopCount++;
          }
          if (instance.Turbod === true){
            turbodCount++;
          }
        }
        winRate = (winNumber / gameNumber) * 100;
        mainTable.addData({
          name: player.name,
          gameNumber: gameNumber,
          deckNumber: deckNumber,
          winrate: winRate,
          scoops: scoopCount,
          t1Sol: turn1SolRings,
          turbod: turbodCount
        })
      }
    }

    async function pullGameOpponents(id){
      try {
        const response1 = await fetch("/api/"+id+"/game-opponents");
        return await response1.json();
      } catch (err) {
        console.error(err);
      } finally {
        console.log("Data fetch attempt complete");
      }
    }

    async function showDeckStats() {
      //temporary elo values. will be removed when database is big enough
      //or when all decks are eventually added
      mainTable.setColumns([
        {title: "Name", field: "name"},
        {title: "Games Played", field: "gameNumber"},
        {title: "Deck Creator", field: "deckCreator"},
        {title: "Win rate", field: "winrate"},
        {title: "Raw Elo", field: "rawElo"},
        {title: "Elo", field: "elo"},
        {title: "Turn 1 Sol Rings", field: "sol"},
        {title: "Turbo'd/Out First", field: "turbod"},
      ])

      for (deck of deckTable){
        
        let deckElo = 0;
        let winCount = 0;
        let solCount = 0;
        let turboCount = 0;
        playingInstances = instanceTable.filter(obj => obj.DeckName === deck.name)
        for (instance of playingInstances) {
          if (instance.T1Sol){
            solCount++;
          }
          if (instance.Turbod){
            turboCount++;
          }
          if (instance.Win){
            winCount++;
            const gameOpponents = await pullGameOpponents(instance.instanceID);
            eloGain = 10;
            for (opponents of gameOpponents) {
              eloFetch = rawDeckElo.find(obj => obj.name === opponents.DeckName);
              if (eloFetch){
                let eloVal = eloFetch.elo;
                eloGain = eloGain + eloVal;
              }else{
                console.log("Missing deck in ELO listing: "+opponents.DeckName);
              }
            }
            deckElo = deckElo + eloGain
          }
        }
        deckElo = deckElo/playingInstances.length;
        creator = playerTable.find(obj => obj.id === deck.playerid);
        winRate = (winCount / playingInstances.length) * 100;
        rawElo = rawDeckElo.find(obj => obj.name === deck.name);
        if (!rawElo){
          rawElo = {name: "", elo: 4.3};
          console.log("Missing deck in ELO listing: "+deck.name);
        }

        mainTable.addData({
          name: deck.name,
          gameNumber: playingInstances.length,
          deckCreator: creator.name,
          winrate: winRate,
          rawElo: rawElo.elo,
          elo: deckElo,
          sol: solCount,
          turbod: turboCount,
        })

      }
    }

    function showArcetypeStats() {
      mainTable.setColumns([
        {title: "Archetype Name", field: "name"},
        {title: "Number of Decks", field: "deckNum"},
        {title: "Play Rate", field: "playPercent"},
        {title: "Win Rate", field: "winPercent"},
        {title: "Turbo'd Rate", field: "turbodPercent"},

      ])

      let tagList =[
          {name: "Aggro", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Control", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Combo", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Midrange", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Chaos", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Stax", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Hug", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
          {name: "Slug", deckNum: 0, playNum: 0, winNum: 0, turbodNum: 0},
      ];
      for (instance of instanceTable){
        deckItem = deckTable.find(obj => obj.name === instance.DeckName);
        tagListing = tagList.find(obj => obj.name === deckItem.tag);
        tagListing.playNum++;
        if (instance.Win){
          tagListing.winNum++;
        }
        if (instance.Turbod){
          tagListing.turbodNum++;
        }
      }

      for (deck of deckTable){
        tagListing = tagList.find(obj => obj.name === deck.tag);
        tagListing.deckNum++;
      }

      for (tag of tagList){
        winrate = (tag.winNum / tag.playNum) * 100
        playrate = (tag.playNum / instanceTable.length) * 100
        turborate = (tag.turbodNum / tag.playNum) * 100
        mainTable.addData({
          name: tag.name,
          deckNum: tag.deckNum,
          playPercent: playrate,
          winPercent: winrate,
          turbodPercent: turborate,
        })
      }
    }

    function positionalWinrate() {
      mainTable.setColumns([
        {title: "Position, by Game Size", field: "name"},
        {title: "Number of Games", field: "games"},
        {title: "Winrate", field: "winrate"},
        {title: "Games with a T1 Sol", field: "t1solgames"},
        {title: "Winrate with T1 Sol", field: "winrateSol"},
      ])

      let posList =[
          {name: "1/3", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "2/3", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "3/3", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "1/4", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "2/4", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "3/4", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "4/4", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "1/5", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "2/5", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "3/5", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "4/5", wins: 0, games: 0, sol: 0, solWins: 0},
          {name: "5/5", wins: 0, games: 0, sol: 0, solWins: 0},
      ];

      for (instance of instanceTable){
        gameInstance = gameTable.find(obj => obj.gameID === instance.gameID_gameTables);
        key = String(instance.TurnOrderPos)+"/"+String(gameInstance.PlayerCount);
        posListing = posList.find(obj => obj.name === key);
        posListing.games++;
        if (instance.T1Sol){
          posListing.sol++;
          if (instance.Win){
            posListing.solWins++;
            posListing.wins++;
          }
        }else{
          if (instance.Win){
            posListing.wins++;
          }
        }
      }

      for (pos of posList){
        
        winrate = (pos.wins/pos.games) * 100
        if (pos.sol === 0){
          winrateSol = 0;
        }else {
          winrateSol = (pos.solWins/pos.sol) * 100
        }

        mainTable.addData({
          name: pos.name,
          games: pos.games,
          winrate: winrate,
          t1solgames: pos.sol,
          winrateSol: winrateSol,
        })
      }
    }
    //public."playertable" ("id","name");
    //public."decktable" ("id","playerid","name","tag","subtag1","subtag2");
    //public."playerInstance" ("instanceID", "gameID_gameTables", "PlayerName", "DeckName", "Win", "T1Sol", "TurnOrderPos", "Scoop", "Turbod", "EnemyDeck1", "EnemyDeck2");
    //public."gameTables" ("gameID","PlayerCount","Pentagram","date");
    async function showIndividualPlayerStats(playerName) {
      mainTable.setColumns([
        {title: "Opponent", field: "name"},
        {title: "Number of Games Against", field: "games"},
        {title: "Your Winrate", field: "yourWinrate"},
        {title: "Their Winrate", field: "theirWinrate"},
      ])
      
      let statsTracker = [];
      for (player of playerTable){
        if (player.name === playerName){
          continue;
        }
        object = {
          name: player.name,
          games: 0,
          wins: 0,
          theyWon: 0,
        }
        statsTracker.push(object)
      }
      playedInstances = instanceTable.filter(obj => obj.PlayerName === playerName)
      if (playedInstances === undefined){
        console.log("name: "+playerName+" has no games logged");
        return;
      }
      for (instance of playedInstances){
        const gameOpponents = await pullGameOpponents(instance.instanceID);
        iWon = false;
        if (instance.Win){
          iWon = true;
        }
        for (opponents of gameOpponents){
          tracker = statsTracker.find(obj => obj.name === opponents.PlayerName);
          tracker.games++;
          if (opponents.Win){
            tracker.theyWon++;
          }
          if (iWon){
            tracker.wins++;
          }
        }
      }
      for (stats of statsTracker){
        if (stats.games === 0){
          yWinrate = 0;
          tWinrate = 0;
        }else {
          yWinrate = (stats.wins/stats.games)*100
          tWinrate = (stats.theyWon/stats.games)*100
        }
        mainTable.addData({
          name: stats.name,
          games: stats.games,
          yourWinrate: yWinrate,
          theirWinrate: tWinrate,
        })
      }
    }

    async function showIndividualDeckStats(deckName){
      mainTable.setColumns([
        {title: "Enemy Deck", field: "name"},
        {title: "Number of Games Against", field: "games"},
        {title: "Your Winrate", field: "yourWinrate"},
        {title: "Their Winrate", field: "theirWinrate"},
      ])
      
      let statsTracker = [];
      for (deck of deckTable){
        if (deck.name === deckName){
          continue;
        }
        object = {
          name: deck.name,
          games: 0,
          wins: 0,
          theyWon: 0,
        }
        statsTracker.push(object)
      }
      playedInstances = instanceTable.filter(obj => obj.DeckName === deckName)
      if (playedInstances === undefined){
        console.log("name: "+deckGame+" has no games logged");
        return;
      }
      for (instance of playedInstances){
        const gameOpponents = await pullGameOpponents(instance.instanceID);
        iWon = false;
        if (instance.Win){
          iWon = true;
        }
        for (opponents of gameOpponents){
          tracker = statsTracker.find(obj => obj.name === opponents.DeckName);
          tracker.games++;
          if (opponents.Win){
            tracker.theyWon++;
          }
          if (iWon){
            tracker.wins++;
          }
        }
      }
      for (stats of statsTracker){
        if (stats.games === 0){
          yWinrate = 0;
          tWinrate = 0;
        }else {
          yWinrate = (stats.wins/stats.games)*100
          tWinrate = (stats.theyWon/stats.games)*100
        }
        mainTable.addData({
          name: stats.name,
          games: stats.games,
          yourWinrate: yWinrate,
          theirWinrate: tWinrate,
        })
      }
    };

    </script>
  </div>`
  res.send(renderPage("Visualizer - Jacebase", content));
});

app.get("/home", (req, res) => {
    const content = /*html*/`    
    <style>
      .addtext {
        font-weight: bold;
        color: black;
        font-size: 400%;
        text-shadow: -2px -2px 0 #3399ff, -2px 2px 0 #3399ff, 2px -2px 0 #3399ff, 2px 2px 0 #3399ff;
        outline: 10px white;
        width: 1000px;
        text-align;
      }
      .entertext {
        margin-top: 25px;
        font-size: 150%;
        font-weight: bold;
      }
      .playernumbox {
        display: inline-flex;
        gap: 40px
      }
      .pnumber {
        font-size: 100%;
        font-weight: bold;
        height: 40px;
        margin-top: 26px;
        border: 4px inset;
      }
      .errortext{
        font-size: 150%;
        font-weight: bold;
      }
      .date-miscbox {
        gap: 20px;
        display: none;
      }
      .datetext {
        width: 150px;
        font-weight: bold;
        margin-top: 12px;
      }
      .orderedtext {
        width: 85px;
        font-weight: bold;
        margin-top: 12px;
      }
      .postext {
        width: 230px;
        font-weight: bold;
        margin-top: 12px;
      }
      .datebox {
        height: 40px;
        margin-top: 5px;
        border: 4px outset;
        width: 200px;
      }
      .datebox:hover {
        background: #f2f2f2;
      }
      .orderedbox {
        border: 4px inset;
        height: 40px;
        margin-top: 5px;
      }
      .playerbox{
        display: none;
        gap: 10px;
        align-items: center;
        margin-top: 7px;
        margin-bottom: 7px;
        background: #f6fefe;
        border: 4px groove;
        padding-left: 13px;
      }
      .playerbox p{
        font-weight: bold;
      }
      .textboxes{
        width: 70px;
        margin-top: 20px;
      }
      .playerbox div{
        display: flex;
        gap: 5px;
      }
      .playerbox input{
        height: 40px;
        margin-top: 25px;
        border: 4px outset;
        width: 150px;
      }
      
      .playerbox input:hover{
        background: #f2f2f2;
      }

      .playerbox select {
        border: 4px inset;
        margin-top: 25px;
        height: 40px;
      }
      .date-mixbox{
        display: inline;
        gap: 20px;
      }
      .deck {
        width: 65px;
        margin-top: 30px;
      }
      .scooptext {
        width: 55px;
        margin-top: 30px;
      }
      .enemybox {
        margin-bottom: 30px;
      }
      .enemytextbox {
        width: 70px;
        margin-top: 30px;
        margin-right: 5px;
      }
      .winnertext {
        font-weight: bold;
        margin-top: 10px;
      }
      .winnerselect {
        border: 4px inset;
      }
      .submitbutton {
        margin-left: 799px;
        background: #ccccff;
        height: 50px;
        width: 80px;
        font-weight: bold;
        display: none;
      }
      .submitbutton:hover {
        background: #b3b3ff;
      }
    </style>
    
    <h1 class="addtext">Add Games</h1>
    <div class="playernumbox">
      <p class="entertext">Select number of players</p>
      <select name="Number of Players" id="pnumber" class="pnumber">
          <option value="p0">select</option>
          <option value="p3">3</option>
          <option value="p4">4</option>
          <option value="p5">5</option>
      </select>
    </div>

    <p id="errorMessage" class="errortext"></p>

    <div class="date-miscbox" style="gap: 20px; display:none"  id="orderedBox">
        <p class="datetext">Date(yyyy/mm/dd):</p>
        <input type="text" id="gameDate" class="datebox"></input>
        <p class="orderedtext">Ordered?:</p>
        <select name="Ordered" id="orderedSelect" class="orderedbox">
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>
        <div style="gap: 20px; display:none"  id="pentagramBox">
            <p class="orderedtext">Pentagram?:</p>
            <select name="Pentagram" id="pentagramSelect" class="orderedbox">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <p class="postext">Are enemy positions known?:</p>
            <select name="knownp" id="knownPentagram" class="orderedbox">
              <option value="no">No</option>  
              <option value="yes">Yes</option>
            </select>
        </div>
    </div>

    <div class="playerbox" id="player1Input">
      <div style="display: flex; gap: 20px;">
        <div>
            <p class="deck">Deck 1:</p>
            <input type="text" id="deck1"></input>
        </div>
        <div>
            <p class="deck">Player 1:</p>
            <input type="text" id="player1"></input>
        </div>
        <div>
            <p class="textboxes">Turn 1 Sol Ring:</p>
            <select class="solturbo" name="sol ring box 1" id="p1solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="textboxes">Turbo'd / Out First:</p>
            <select class="solturbo" name="turbo box 1" id="p1turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="scooptext">Scoop:</p>
            <select class="scoop" name="scoop box 1" id="p1scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
      </div>
      <div id="player1Enemies" style="display: none; gap: 20px;">
        <div>
            <p class="enemytextbox">Enemy 1:</p>
            <input type="text" id="deck1enemy1" class="enemybox"></input>
        </div>
        <div>
            <p class="enemytextbox">Enemy 2:</p>
            <input type="text" id="deck1enemy2" class="enemybox"></input>
        </div>
      </div>
    </div>

    <div class="playerbox" id="player2Input">
      <div style="display: flex; gap: 20px;">
        <div>
            <p class="deck">Deck 2:</p>
            <input type="text" id="deck2"></input>
        </div>
        <div>
            <p class="deck">Player 2:</p>
            <input type="text" id="player2"></input>
        </div>
        <div>
            <p class="textboxes">Turn 1 Sol Ring:</p>
            <select class="solturbo" name="sol ring box 2" id="p2solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="textboxes">Turbo'd / Out First:</p>
            <select class="solturbo" name="turbo box 2" id="p2turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="scooptext">Scoop:</p>
            <select class="scoop" name="scoop box 2" id="p2scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
      </div>
      <div id="player2Enemies" style="display: none; gap: 20px;">
          <div>
            <p class="enemytextbox">Enemy 1:</p>
            <input type="text" id="deck2enemy1" class="enemybox"></input>
          </div>
          <div>
            <p class="enemytextbox">Enemy 2:</p>
            <input type="text" id="deck2enemy2" class="enemybox"></input>
          </div>
      </div>
    </div>

    <div class="playerbox" id="player3Input">
      <div style="display: flex; gap: 20px;">
        <div>
            <p class="deck">Deck 3:</p>
            <input type="text" id="deck3"></input>
        </div>
        <div>
            <p class="deck">Player 3:</p>
            <input type="text" id="player3"></input>
        </div>
        <div>
            <p class="textboxes">Turn 1 Sol Ring:</p>
            <select class="solturbo" name="sol ring box 3" id="p3solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="textboxes">Turbo'd / Out First:</p>
            <select class="solturbo" name="turbo box 3" id="p3turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="scooptext">Scoop:</p>
            <select class="scoop" name="scoop box 3" id="p3scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
      </div>
      <div id="player3Enemies" style="display: none; gap: 20px;">
          <div>
            <p class="enemytextbox">Enemy 1:</p>
            <input type="text" id="deck3enemy1" class="enemybox"></input>
          </div>
          <div>
            <p class="enemytextbox">Enemy 2:</p>
            <input type="text" id="deck3enemy2" class="enemybox"></input>
          </div>
      </div>
    </div>

    <div class="playerbox" id="player4Input">
      <div style="display: flex; gap: 20px;">
        <div>
            <p class="deck">Deck 4:</p>
            <input type="text" id="deck4"></input>
        </div>
        <div>
            <p class="deck">Player 4:</p>
            <input type="text" id="player4"></input>
        </div>
        <div>
            <p class="textboxes">Turn 1 Sol Ring:</p>
            <select class="solturbo" name="sol ring box 4" id="p4solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="textboxes">Turbo'd / Out First:</p>
            <select class="solturbo" name="turbo box 4" id="p4turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="scooptext">Scoop:</p>
            <select class="scoop" name="scoop box 4" id="p4scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
      </div>
      <div id="player4Enemies" style="display: none; gap: 20px;">
          <div>
            <p class="enemytextbox">Enemy 1:</p>
            <input type="text" id="deck4enemy1" class="enemybox"></input>
          </div>
          <div>
            <p class="enemytextbox">Enemy 2:</p>
            <input type="text" id="deck4enemy2" class="enemybox"></input>
          </div>
      </div>
    </div>

    <div class="playerbox" id="player5Input">
      <div style="display: flex; gap: 20px;">
        <div>
            <p class="deck">Deck 5:</p>
            <input type="text" id="deck5"></input>
        </div>
        <div>
            <p class="deck">Player 5:</p>
            <input type="text" id="player5"></input>
        </div>
        <div>
            <p class="textboxes">Turn 1 Sol Ring:</p>
            <select class="solturbo" name="sol ring box 5" id="p5solring">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="textboxes">Turbo'd / Out First:</p>
            <select class="solturbo" name="turbo box 5" id="p5turbo">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
        <div>
            <p class="scooptext">Scoop:</p>
            <select class="scoop" name="scoop box 5" id="p5scoop">
                <option value="null">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
      </div>
      <div id="player5Enemies" style="display: none; gap: 20px;">
          <div>
            <p class="enemytextbox">Enemy 1:</p>
            <input type="text" id="deck5enemy1" class="enemybox"></input>
          </div>
          <div>
            <p class="enemytextbox">Enemy 2:</p>
            <input type="text" id="deck5enemy2" class="enemybox"></input>
          </div>
      </div>
    </div>

    <div style="gap: 20px; display:flex"  id="winnerBox">
        <p class="winnertext">Winner:</p>
        <select name="Winner" id="winnerSelect" class="winnerselect">
            <option value="N/A">Select Player Count</option>
        </select>
        <button id="submitButton" class="submitbutton">Submit</button>
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
            let isLogin

            async function fetchData() {
              try {
                const response1 = await fetch("/api/player-table");
                playerTable = await response1.json();
                const response2 = await fetch("/api/deck-table");
                deckTable = await response2.json();
                const response3 = await fetch("/api/is-login");
                isLogin = await response3.json();
              } finally {
                console.log("Data fetch attempt complete");
              }
            }

            document.getElementById("pnumber").addEventListener("change", function() {
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
                    document.getElementById("submitButton").style.display = "block";
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
                    document.getElementById("submitButton").style.display = "block";
                    hidePentagramBoxes();
                    winOptions = [{value:'player1',text:"Player 1"}, {value:'player2',text:"Player 2"}, {value:'player3',text:"Player 3"}, {value:'player4',text:"Player 4"}];
                    populateWinBox(winOptions);
                }else if (playernumber === "p5") {
                    document.getElementById("orderedBox").style.display = "flex";
                    document.getElementById("pentagramBox").style.display = "flex";
                    document.getElementById("player1Input").style.display = "grid";
                    document.getElementById("player2Input").style.display = "grid";
                    document.getElementById("player3Input").style.display = "grid";
                    document.getElementById("player4Input").style.display = "grid";
                    document.getElementById("player5Input").style.display = "grid";
                    document.getElementById("submitButton").style.display = "block";
                    winOptions = [{value:'player1',text:"Player 1"}, {value:'player2',text:"Player 2"}, {value:'player3',text:"Player 3"}, {value:'player4',text:"Player 4"}, {value:'player5',text:"Player 5"}];
                    populateWinBox(winOptions);
                }
            }
            
            function verifyAuthenticity(){
                console.log(isLogin);
                if (isLogin[0].admin === false){
                  document.getElementById("errorMessage").innerHTML = "You are not logged in as admin. You cannot add to database";
                  return false;
                }
                if (playernumber === "p3") {
                  count = 3;
                }else if (playernumber === "p4") {
                  count = 4;
                }else if (playernumber === "p5") {
                  count = 5;
                }else{
                  document.getElementById("errorMessage").innerHTML = "Select player count";
                  return false;
                }
                dateInput = String(document.getElementById("gameDate").value);
                regex = new RegExp("^\\\\d{4}\\\\/\\\\d{2}\\\\/\\\\d{2}$");
                dateCorrect = regex.test(String(dateInput).trim());
                deckPlayerCorrect = true;
                for (let i = 1; i < count+1; i++){
                  deckFinder = "deck"+i;
                  deck = document.getElementById(deckFinder).value;
                  deckFound = JSON.stringify(deckTable).includes(deck);
                  console.log("found deck: "+deck+" - "+deckFound);
                  playerFinder = "player"+i;
                  player = document.getElementById(playerFinder).value;
                  playerFound = JSON.stringify(playerTable).includes(player);
                  console.log("found player: "+player+" - "+playerFound);
                  if (deckFound === false || playerFound === false){
                    deckPlayerCorrect = false;
                  }
                }
                console.log(regex);
                if (dateCorrect === true && deckPlayerCorrect === true){
                  return true;
                }else{ 
                  document.getElementById("errorMessage").innerHTML = "Date format is incorrect, or you entered a player/deck that is not in the database";
                  return false;
                }
            }

            function createPlayerObject(playerCount, gameID, ordered, pentagram){
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
                if (ordered === true){
                    playerNumber = playerCount;
                }else{
                    playerNumber = null;
                }
                if (pentagram === false){
                  enemyDeck1 = null;
                  enemyDeck2 = null;
                }else if (ordered === true){
                  enemyDeck1Finder = "deck"+((playerCount+2)%5);
                  if (enemyDeck1Finder === "deck0"){
                    enemyDeck1Finder = "deck5";
                  }  
                  enemyDeck2Finder = "deck"+((playerCount+3)%5);
                  if (enemyDeck2Finder === "deck0"){
                    enemyDeck2Finder = "deck5";
                  }
                  console.log("enemyDeck1Finder: "+enemyDeck1Finder);
                  console.log("enemyDeck2Finder: "+enemyDeck2Finder);
                  enemyDeck1 = document.getElementById(enemyDeck1Finder).value;
                  enemyDeck2 = document.getElementById(enemyDeck2Finder).value;
                }else{
                  enemyDeck1Finder = "deck"+playerCount+"enemy1";
                  enemyDeck2Finder = "deck"+playerCount+"enemy2";
                  enemyDeck1 = document.getElementById(enemyDeck1Finder).value;
                  enemyDeck2 = document.getElementById(enemyDeck2Finder).value;
                }
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
                    EnemyDeck1: enemyDeck1,
                    EnemyDeck2: enemyDeck2,
                }
                return playerObject;
            }
            
            document.getElementById("submitButton").addEventListener("click", submitButtonClicked, false);
            function submitButtonClicked(){
              if (document.getElementById("orderedSelect").value === "yes"){
                orderedBool = true;
              }else{
                orderedBool = false;
              }
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
                  deckObj1 = createPlayerObject(1, gameID, orderedBool, false);
                  deckObj2 = createPlayerObject(2, gameID, orderedBool, false);
                  deckObj3 = createPlayerObject(3, gameID, orderedBool, false);
                  returnBody = {
                    ID: gameID,
                    size: 3,
                    pentagramBool: pentagram,
                    dateText: document.getElementById("gameDate").value,
                    players: {
                        player1: deckObj1,
                        player2: deckObj2,
                        player3: deckObj3
                    }
                  }
                }else if (playernumber === "p4") {
                  deckObj1 = createPlayerObject(1, gameID, orderedBool, false);
                  deckObj2 = createPlayerObject(2, gameID, orderedBool, false);
                  deckObj3 = createPlayerObject(3, gameID, orderedBool, false);
                  deckObj4 = createPlayerObject(4, gameID, orderedBool, false);
                  returnBody = {
                    ID: gameID,
                    size: 4,
                    pentagramBool: pentagram,
                    dateText: document.getElementById("gameDate").value,
                    players: {
                        player1: deckObj1,
                        player2: deckObj2,
                        player3: deckObj3,
                        player4: deckObj4
                    }
                  }
                }else if (playernumber === "p5") {
                  if (pentagram === false) {
                    deckObj1 = createPlayerObject(1, gameID, orderedBool, false);
                    deckObj2 = createPlayerObject(2, gameID, orderedBool, false);
                    deckObj3 = createPlayerObject(3, gameID, orderedBool, false);
                    deckObj4 = createPlayerObject(4, gameID, orderedBool, false);
                    deckObj5 = createPlayerObject(5, gameID, orderedBool, false);
                    returnBody = {
                      ID: gameID,
                      size: 5,
                      pentagramBool: pentagram,
                      dateText: document.getElementById("gameDate").value,
                      players: {
                          player1: deckObj1,
                          player2: deckObj2,
                          player3: deckObj3,
                          player4: deckObj4,
                          player5: deckObj5
                      }
                    }
                  }else{
                    deckObj1 = createPlayerObject(1, gameID, orderedBool, true);
                    deckObj2 = createPlayerObject(2, gameID, orderedBool, true);
                    deckObj3 = createPlayerObject(3, gameID, orderedBool, true);
                    deckObj4 = createPlayerObject(4, gameID, orderedBool, true);
                    deckObj5 = createPlayerObject(5, gameID, orderedBool, true);
                    returnBody = {
                      ID: gameID,
                      size: 5,
                      pentagramBool: pentagram,
                      dateText: document.getElementById("gameDate").value,
                      players: {
                          player1: deckObj1,
                          player2: deckObj2,
                          player3: deckObj3,
                          player4: deckObj4,
                          player5: deckObj5
                      }
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
                console.log(returnBody);
              }else {
                console.log("Data verification failed");
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
    <style>
      .miscpage {
        font-weight: bold;
        color: black;
        font-size: 400%;
        text-shadow: -2px -2px 0 #3399ff, -2px 2px 0 #3399ff, 2px -2px 0 #3399ff, 2px 2px 0 #3399ff;
        outline: 10px white;
        width: 1000px;
        text-align;
      }
      .entertext {
        margin-top: 25px;
        font-size: 150%;
        font-weight: bold;
      }
      .playertext {
        font-weight: bold;
        margin-top: 10px;
      }
      .playerbox {
        display: inline-flex;
        margin-top: 5px;
        border: 4px outset;
        align-items: center;
        margin-top: 7px;
        margin-bottom: 7px;
        background: #f6fefe;
        border: 4px groove;
        padding-left: 13px;
        gap:30px;
        width:350px;
      }
      .outerdeckbox {
        margin-top: 5px;
        border: 4px outset;
        align-items: center;
        margin-top: 7px;
        margin-bottom: 7px;
        background: #f6fefe;
        border: 4px groove;
        padding-left: 13px;
        display: grid;
        gap: 20px;
      }
      .innerdeckbox {
        display: flex;
        gap: 20px;
      }
      .playerinput {
        height: 40px;
        border: 4px outset;
        width: 150px;
        margin-left: -15px
      }
      .playersubmit {
        color: #f2f2f2;
        text-align: center;
        text-decoration: none;
        background-color: #000099;
        padding: 14px 16px;
      }
      .outperplayerbox {
        display: flex;
      }
      
    </style>
    <h1 class="miscpage">Misc Additions</h1>
    <p class="entertext" id="para">Add Players</p>
    <p id="errorMessage"></p>
    <div class="outerplayerbox">
      <div class="playerbox" id="player1Input">
        <p class="playertext">Player Name:</p>
        <input type="text" id="playerName" class="playerinput"></input>
      </div>
      <button id="playerSubmitButton" class="playersubmit">Submit</button>
    </div>
    <p class="entertext" id="para">Add Decks</p>
    <div id="deckBox" class="outerdeckbox">
      <div class="innerdeckbox">
        <p>Deck Name:</p>
        <input type="text" id="deckName"></input>
        <p>Deck Creator:</p>
        <input type="text" id="deckCreator"></input>
      </div>
      <div class="innerdeckbox">
        <p>Primary Tag:</p>
        <input type="text" id="tagBox"></input>
        <p>Secondary Tags:</p>
        <input type="text" id="secTagBox1"></input>
        <input type="text" id="secTagBox2"></input>
      </div>
      <button id="deckSubmitButton">Submit</button>
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        let playerTable
        let isLogin
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
            const response3 = await fetch("/api/is-login");
            isLogin = await response3.json();
          } finally {
            console.log("Data fetch attempt complete");
          }
        }

        document.getElementById("toHome").addEventListener("click", function() {
          setTimeout(function(){window.location.href = "/home"}, 1000);
        });

        document.getElementById("toCharts").addEventListener("click", function() {
          setTimeout(function(){window.location.href = "/charts"}, 1000);
        });
        
        document.getElementById("deckSubmitButton").addEventListener("click", function() {
          deckName = document.getElementById("deckName").value;
          tag1 = document.getElementById("tagBox").value;
          tag2 = document.getElementById("secTagBox1").value;
          tag3 = document.getElementById("secTagBox2").value;
          deckCreator = document.getElementById("deckCreator").value;

          playerExists = JSON.stringify(playerTable).includes(deckCreator);
          tagExists = tagList.includes(tag1);

          if (isLogin[0].admin === false){
            document.getElementById("errorMessage").innerHTML = "You are not logged in as admin. You cannot add to database";
            return;
          }

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
          }else {
            document.getElementById("errorMessage").innerHTML = "Either a player you are entering doesn't exist, or a tag you are entering doesnt exist";
          }
          console.log(returnBody);
          
        });

        document.getElementById("playerSubmitButton").addEventListener("click", function() {
          if (isLogin[0].admin === false){
            document.getElementById("errorMessage").innerHTML = "You are not logged in as admin. You cannot add to database";
            return;
          }
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
          console.log(returnBody);
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
    
    gameCreationQueryText = `INSERT INTO public."gameTables" ("gameID","PlayerCount","Pentagram","date") VALUES ($1, $2, $3, $4)`;
    gameCreationQueryValues = [data.ID, data.size, data.pentagramBool, data.dateText];
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