require('dotenv').config(); // Load environment variables from .env

require("reflect-metadata");
const express = require("express");
const { DataSource, EntitySchema } = require("typeorm");
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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
    </script>
  </div>`;
  res.send(renderPage("Zachariah Friesen Test Website", content));
});

app.get("/home", (req, res) => {
    const content = `    <h1>Jacebase</h1>
    <p id="para">Welcome</p>
    <script src="scripts.js"></script>`;
    res.send(renderPage("Home - Jacebase", content));
});



app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});