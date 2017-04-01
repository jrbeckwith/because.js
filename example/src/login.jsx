import React, { Component } from "react";


class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: "not logged in.",
            username: "",
            password: "",
        };
        // Ensure handle* methods have the right `this`
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {
        let username = event.target.value;
        this.setState({username: username});
    }

    handlePasswordChange(event) {
        let password = event.target.value;
        this.setState({password: password});
    }

    handleSubmit(event) {
        // Don't cause whole page refresh on errors.
        event.preventDefault();

        console.log("login: handleSubmit", this.state);

        let username = this.state.username;
        let password = this.state.password;
        if (!username || !password) {
            this.setState({message: "submit valid username and password."});
        }
        else {
            this.setState({message: "logging in..."});
            let bcs = this.props.bcs;
            let promise = bcs.login(username, password);
            promise
            .then((jwt) => {
                this.setState({message: `logged in as ${jwt.email}.`});
                console.log("login: success", jwt);

                // This is only for playing around in the console.
                window.jwt = jwt;
            })
            .catch((error) => {
                this.setState({message: `login error: ${error}.`});
                console.log("login: failure", error);
            });
        }

        // TODO: 
        // when entering bad credentials:
        // XML Parsing Error: no root element found
        // Location: https://api.test.boundlessgeo.io/v1/token/?username=fasufis&password=asufdi
        // Line Number 1, Column 1:
        // At minimum, this error should be caught earlier e.g. in status
        // and raised not as an XML parsing error!
    }

    render() {
        let bcs = this.props.bcs;
        let roles = bcs.jwt ? bcs.jwt.roles : [];
        let roleList = roles.map((role) => <li key={role}>{role}</li>);
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <div className="inputLabel">
                            <span>Username</span>
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                        />
                    </label>
                    <br/>
                    <label>
                        <div className="inputLabel">
                            <span>Password</span>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <div className="status">
                    Status: {this.state.message}
                </div>
                <div className="roles">
                    {roleList.length > 0 &&
                        <div>
                            <span>Roles:</span>
                            <ul>
                                {roleList}
                            </ul>
                        </div>
                    }
                </div>
            </div>
       );
    }
}


export default Login;
