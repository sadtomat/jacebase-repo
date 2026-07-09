import '../css/Login.css'

export function Login() {
    return (
        <>
            <div className="bigbox">
                <img className="imgbox" src={`https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/Jacebase-login.jpg`}/>
                <div className="smallbox">
                    <p className="entertext">Enter username and password</p>
                    <form className="upform">
                        <label>Username:</label>
                        <input></input>
                    </form>
                    <form className="upform">
                        <label>Password:</label>
                        <input></input>
                    </form>
                    <div>
                        <button className="exitbutton">Submit</button>
                        <button className="exitbutton">Login as Guest</button>
                    </div>
                </div>
            </div>
        </>
    )
}