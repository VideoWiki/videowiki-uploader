import React from 'react';
import {} from './Login'
import { registerAccount } from "../utils.ts";

class SignupForm extends React.Component<RouteComponentProps> {
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

  handleSubmit = async () => {
    const { email, password } = this.state;
    const localEmail = email;
    // Add your signup logic here
    console.log('Signup form submitted');
    console.log('Email:', email);
    console.log('Password:', password);
    if (email === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }
    // registerAccount(email, password);
    await registerAccount(localEmail, password)
      console.log(email, "aaakaakakakkakakak")
      console.log(this.props.history, "aaakaakakakkakakak")
      // this.props.history.push('/signup-success'); // Redirect to the success page
    ;
    // Reset form fields
    this.setState({
      email: '',
      password: '',
    });
  };

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
        <button onClick={this.handleSubmit}>Signup</button>
      </div>
    );
  }
}

export default SignupForm;