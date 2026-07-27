import '../css/Login.css'
import {LoginForm} from '../js/LoginForm'
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

export default function Login() {
    return (
        <>
            <div className="bigbox">
                <img className="imgbox" src={`https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/Jacebase-login.jpg`}/>
                <div className="smallbox">
                    <p className="entertext">Enter username and password</p>
                    <LoginForm/>
                    <div>
                        <button className="exitbutton">Submit</button>
                        <button className="exitbutton">Login as Guest</button>
                    </div>
                </div>
            </div>
        </>
    )
}