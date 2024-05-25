import React from "react";
import Button from "@mui/material/Button";
import Benefit from "../Components/Benefit";
import Footer from '../Components/Footer'
const Home = ({signInWithGoogle}) => {
 
  return (
    <div className=" w-full h-auto">
      <div className="flex mt-10 flex-col md:flex-row p-6 md:p-2">
        <div className="w-full md:w-1/2 text-center md:text-left flex flex-col  justify-center md:p-8">
          <h1
            className=" text-3xl md:text-4xl font-semibold "
            style={{ lineHeight: 1, letterSpacing: ".02em" }}
          >
            Let's connect with your{" "}
            <span className=" text-yellow-400">friends</span> in real time
          </h1>
          <p
            className="mt-8 text-gray-400"
            style={{
              fontSize: "16px",
              lineHeight: 1.5,
              letterSpacing: ".02em",
            }}
          >
            Welcome to a new era of seamless communication. Say hello to Kei Chat App your all-in-one platform for staying connected with
            friends, family, and colleagues, wherever you are.
          </p>
          <div className="mt-8">
            <Button variant="outlined" onClick={signInWithGoogle}>
              <span className="text-md text-white py-1 px-2">Try Now</span>
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="/bg2.png"
            alt="not found"
            className=""
            style={{ width: "550px" }}
          />
        </div>
      </div>

      <Benefit />
      <Footer/>
    </div>
  );
};

export default Home;
