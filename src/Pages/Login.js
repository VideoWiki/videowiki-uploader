import React from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

class LoginSignupOptions extends React.Component {
  state = {
    isSignup: false,
    isLogin: false,
    showEmailPasswordForm: false,
    email: "",
    password: "",
  };

  handleLogin = () => {
    this.setState({ isLogin: true });
  };

  handleSignup = () => {
    this.setState({ isSignup: true });
  };

  handleGoBack = () => {
    this.setState({
      isSignup: false,
      isLogin: false,
      showEmailPasswordForm: false,
      email: "",
      password: "",
    });
  };

  handleEmailSignup = () => {
    this.setState({
      showEmailPasswordForm: true,
    });
  };

  handleEmailLogin = () => {
    this.setState({
      showEmailPasswordForm: true,
    });
  };

  

  // handleEmailChange = (event) => {
  //   this.setState({ email: event.target.value });
  // };

  // handlePasswordChange = (event) => {
  //   this.setState({ password: event.target.value });
  // };
  handleEmailChange = (event) => {
    console.log("handleEmailChange called");
    console.log("New email value:", event.target.value);
    this.setState({ email: event.target.value });
  };
  
  handlePasswordChange = (event) => {
    console.log("handlePasswordChange called");
    console.log("New password value:", event.target.value);
    this.setState({ password: event.target.value });
  };

  render() {
    console.log(
      "isSignup:", this.state.isSignup,
      "isLogin:", this.state.isLogin,
      "showEmailPasswordForm:", this.state.showEmailPasswordForm
    );
    const { isSignup, isLogin, showEmailPasswordForm } = this.state;

    return (
      <div>
        {!isSignup && !isLogin ? (
          <div>
            <button onClick={this.handleLogin}>Login</button>
            <button onClick={this.handleSignup}>Signup</button>
          </div>
        ) : isSignup ? (
          <div>
            <p>Signup using:</p>
            <button onClick={this.handleEmailSignup}>Email/Password</button>
            <button onClick={this.handleGoBack}>Go Back</button>
            {showEmailPasswordForm && (
              <div>
                <SignupForm
                  email={this.state.email}
                  password={this.state.password}
                  onEmailChange={this.handleEmailChange}
                  onPasswordChange={this.handlePasswordChange}
                />
              </div>
            )}
          </div>
        ) : isLogin ? (
          <div>
            <p>Login using:</p>
            <button>Metamask</button>
            <button onClick={this.handleEmailLogin}>Email/Password</button>
            <button onClick={this.handleGoBack}>Go Back</button>
            {showEmailPasswordForm && (
              <div>
                <LoginForm
                  email={this.state.email}
                  password={this.state.password}
                  onEmailChange={this.handleEmailChange}
                  onPasswordChange={this.handlePasswordChange}
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default LoginSignupOptions;
