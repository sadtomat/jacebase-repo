import { Navbar } from "../js/Navbar"
import { Outlet } from "react-router"
import "../css/Layout.css"

export default function Layout() {
    console.log("layout");
    let backgrndImage1 = `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_S3_REGION}.amazonaws.com/background1.jpeg`
    let backgrndImage2 = `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_S3_REGION}.amazonaws.com/background2.jpg`
    console.log(backgrndImage1);
    console.log(backgrndImage2);    
    const layeredBackground = {
        padding: '2vw',
        backgroundSize: 'cover',
        backgroundImage:  `url(${backgrndImage2})`,
    }
    const mainBackground = {
        backgroundSize: 'cover',
        backgroundImage: `url(${backgrndImage1})`,
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