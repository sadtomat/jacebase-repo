import '../css/Login.css'
import {LoginForm} from '../js/LoginForm'
import { getSession } from "../services/session.server.js";
import { authenticator } from "../services/auth.server";

export async function loader({request}){
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    if (!user) {
        console.log("no login");
    }else{
        console.log("yes login");
    }
    return user;
}

export async function action({request}){
    return await authenticator.authenticate("cognito-auth", request);
}

export default function Login(loaderData) {
    console.log(loaderData);
    return (
        <>
            <div className="bigbox">
                <img className="imgbox" src={`https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/Jacebase-login.jpg`}/>
                <div className="smallbox">
                    <p className="entertext">Enter username and password</p>
                    <LoginForm/>
                    <div>
                        <button type="submit">Submit</button>
                        <button className="exitbutton">Login as Guest</button>
                    </div>
                </div>
            </div>
        </>
    )
}