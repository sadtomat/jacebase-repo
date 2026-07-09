import '../css/Login.css'
import {LoginForm} from './LoginForm'

export function Login() {
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