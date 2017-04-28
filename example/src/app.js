import { Because } from "because";
import React, { Component } from "react";
import "./app.css";

import Login from "./login";
import Routing from "./routing";
import Geocoding from "./geocoding";
import ReverseGeocoding from "./reverse_geocoding";


class App extends Component {
  constructor (props) {
        super(props);
        this.state = {
            bcs: new Because("test", true)  // env="test", debug=true
        };
  }

  render() {
    return (
      <div className="App">
      <h1>because.js demo</h1>

        <h2>Login</h2>
        <Login bcs={this.state.bcs} />

        <h2>Routing</h2>
        <Routing bcs={this.state.bcs} />

        <h2>Geocoding</h2>
        <Geocoding bcs={this.state.bcs} />

        <h2>Reverse Geocoding</h2>
        <ReverseGeocoding bcs={this.state.bcs} />

      </div>
    );
  }
}

export default App;
