import { Navbar } from "../js/Navbar"
import { Outlet } from "react-router"
import "../css/Layout.css"

export default function Layout() {
    console.log("layout");
    let jpgimage = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/background1.jpeg`
    const layeredBackground = {
        padding: '2vw',
        backgroundSize: 'cover',
        backgroundImage:  `url('https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/background2.jpg')`,
    }
    const mainBackground = {
        backgroundSize: 'cover',
        backgroundImage: `url(${jpgimage})`,
        objectFit: 'cover',
        boxSizing: 'border-box',
        paddingLeft: '15vw',
        paddingRight: '15vw',
    };
    return (
        <>
            <Navbar/>
            <div style={mainBackground}>
                <main style={layeredBackground}>
                    <Outlet/>
                </main>
            </div>
        </>
    )
}