import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Header from "./Components/Header";
import { app } from "./Components/Firebase";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logInSuccess } from "./Components/Slices/userSlice";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import axios from "axios";
import Footer from "./Components/Footer";
import Protect from "./pages/Protect";
const App = () => {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const notify = (status, message) => {
    if (status === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);

      if (resultFromGoogle) {
        const res = await axios.post(
          "http://localhost:4000/auth",
          {
            email: resultFromGoogle.user.email,
            username: resultFromGoogle.user.displayName,
            profile: resultFromGoogle.user.photoURL,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (res.status !== 200) {
          notify("error", "Fail To Login");
        }

        notify("success", "Success Login");
        dispatch(logInSuccess(res.data.user));
      } else {
        toast.error("Account Error");
      }
    } catch (error) {}
  };

  return (
    <div className=" w-full md:max-w-6xl mx-auto">
      <Header signInWithGoogle={signInWithGoogle} />
      <Routes>
        <Route
          path="/"
          element={<Home signInWithGoogle={signInWithGoogle} />}
        />
        <Route element={<Protect />}>
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
