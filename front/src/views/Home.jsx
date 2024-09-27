import React from "react";
import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import StickyNavbar from "../components/navbar/StickyNavbar";

const Home = () => {

    return (
        <>
            <StickyNavbar />
            <Header />  
            <Footer />
        </> 
    )

}

export default Home;