import { createCookieSessionStorage } from "react-router";
 
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.REACT_APP_APP_SECRET || ""],
      secure: process.env.REACT_APP_NODE_ENV === "production",
    },
  });
 
export { getSession, commitSession, destroySession };
 
