import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };
  const redirect = () => {
    if (localStorage["user"] && localStorage["accessToken"]) {
      return;
    }
    navigate("/");
  };
  return (
    <nav>
      <div className="logo" onClick={redirect}>
        <img src="vw-new-logo.svg" alt="VideoWiki logo" />
        <span>VideoWiki</span>
      </div>
      {localStorage.getItem("accessToken") ? (
        <button className="" onClick={signOut}>
          Sign-out
        </button>
      ) : null}
    </nav>
  );
};

export default Navbar;
