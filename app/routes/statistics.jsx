import { data, redirect } from "react-router";
import { getSession } from "../services/session.server.js";

export async function loader(request){
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    if (!user) {
        console.log("no login");
    }else{
        console.log("yes login");
    }
    return data({user});
}

export function Statistics() {

    return (
        <>
            <h1>This is Statistics Page</h1>
        </>
    )
}