import { destroySession, getSession } from "src/services/session.server";
import { redirect } from "react-router";
 
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
