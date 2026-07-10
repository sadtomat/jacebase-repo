import { authenticator } from "~/services/auth.server";
import { redirect } from "react-router";
import { commitSession, getSession } from "~/services/session.server";

export async function loader(request) {
  const session = await getSession(request.headers.get("Cookie"));
  let user = await authenticator.authenticate("cognito-auth", request);
  if (!user) {
    session.flash("error", "There was an error authentic ating your request");
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("user", user);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}