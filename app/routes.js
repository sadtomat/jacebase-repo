import {route, index, layout} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.jsx", [
    index("/", "./routes/login.jsx"),
    route("deck-entry", "./routes/deck-entry.jsx"),
    route("game-entry", "./routes/game-entry.jsx"),
    route("statistics", "./routes/statistics.jsx"),
  ]),

  route("auth/callback", "./routes/callback.js"),
  route("logout", "./routes/logout.js"),
]