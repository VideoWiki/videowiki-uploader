import React from 'react';
import {} from './Login'
import { loginAccount } from "../utils";

class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
  };

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = () => {
    const { email, password } = this.state;
    // Add your signup logic here
    console.log('Signup form submitted');
    console.log('Email:', email);
    console.log('Password:', password);
    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }
    loginAccount(email, password);
    // Reset form fields
    this.setState({
      email: '',
      password: '',
    });
    
  };
  // handleEmailSignupSubmit = async () => {
  //   console.log("handleEmailSignupSubmit called"); // Add this line
  //   const { email, password } = this.state;
  //   console.log(email, password, "tjtjtj"); // Print email and password to the console

  //   if (email === "" || password === "") {
  //     alert("Please enter a username and password.");
  //     return;
  //   }

  //   try {
  //     await registerAccount(email, password);
  //     console.log("Account registered successfully.");
  //     // Additional logic after successful registration, such as redirecting to a different page
  //   } catch (error) {
  //     console.error("Error registering account:", error);
  //     // Handle any errors that occur during the registration process
  //   }
  // };

  render() {
    const { email, password } = this.state;

    return (
      <div>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={this.handleEmailChange}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={this.handlePasswordChange}
        />
        <button onClick={this.handleSubmit}>Login</button>
      </div>
    );
  }
}

export default LoginForm;
