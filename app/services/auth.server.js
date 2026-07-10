import { Authenticator } from "remix-auth";
import { OAuth2Strategy, CodeChallengeMethod } from "remix-auth-oauth2";
import jwt from "jsonwebtoken";
 
export const authenticator = new Authenticator();
 
authenticator.use(
  new OAuth2Strategy(
    {
      cookie: "oauth2", // Optional, can also be an object with more options
 
      clientId: process.env.REACT_APP_COGNITO_CLIENT_ID || "",
      clientSecret: process.env.REACT_APP_COGNITO_CLIENT_SECRET || "",
 
      authorizationEndpoint: `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/authorize`,
      tokenEndpoint: `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/token`,
      redirectURI: "http://localhost:5173/auth/callback",
      tokenRevocationEndpoint: `${process.env.REACT_APP_COGNITO_DOMAIN}/revoke`, // optional
 
      scopes: ["openid", "email", "profile"],
      codeChallengeMethod: CodeChallengeMethod.S256, // optional
    },
    async ({ tokens, request }) => {
      // here you can use the params above to get the user and return it
      // what you do inside this and how you find the user is up to you
      return await getUser(tokens, request);
    },
  ),
  // this is optional, but if you setup more than one OAuth2 instance you will
  // need to set a custom name to each one
  "cognito-auth",
);
 
async function getUser(tokens, request) {
  const idToken = tokens.idToken();
  const decoded = jwt.decode(idToken);
  // can make a call to database to get other user properties like if user is admin
  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    admin: true,
  };
}
