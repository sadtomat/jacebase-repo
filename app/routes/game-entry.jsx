import { data, redirect } from "react-router";
import { getSession } from "../services/session.server.js";
import { fetchPlayerData } from "../js/db-fetch.jsx"; 

export async function loader(request){
    //const session = await getSession(request.headers.get("Cookie"));
    const playerData = await fetchPlayerData();
    return data({ playerData });
    // const user = session.get("user");
    // if (!user) {
    //     console.log("no login");
    // }else{
    //     console.log("yes login");
    // }
    // return data({user});
}

export function GameEntry() {
    const {playerData} = loaderData;

    return (
        <>
            <h1>This is Game Entry Page</h1>
        </>
    )
}