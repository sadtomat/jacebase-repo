export function Login() {
    return (
        <>
            <div>
                <img src={`https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/Jacebase-login.jpg`}/>
                <div>
                    <p>Enter username and password</p>
                    <form>
                        <label>Username:</label>
                        <input></input>
                        <label>Password:</label>
                        <input></input>
                        <button>Submit</button>
                    </form>
                    <button>Login as Guest</button>
                </div>
            </div>
        </>
    )
}