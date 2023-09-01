import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };
  return (
    <nav>
      <div
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        <img src="logo.svg" alt="VideoWiki logo" />
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
