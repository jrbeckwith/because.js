import React, { Component } from "react";


function render_geocode(geocode, key) {
    if (!geocode) {
        return undefined;
    }

    return (<li key={key} className="geocode">
        <div className="location">
            ({geocode.x}, {geocode.y}) {geocode.address}
        </div>
        <div className="attributes">
            <div className="attribute score">
                <span className="key">score</span>
                <span className="value">{geocode.score}</span>
            </div>
        </div>
    </li>);
}


class Geocoding extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: "let's geocode!",
            provider: "mapbox",
            address: "1600 pennsylvania ave., washington, dc",
            geocodes: [],
        };
        // Ensure handle* methods have the right `this`
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleAddressChange(event) {
        this.setState({address: event.target.value});
    }

    handleSubmit(event) {
        // Don't cause whole page refresh on errors.
        event.preventDefault();

        console.log("geocoding: handleSubmit", this.state, this.props);
        let bcs = this.props.bcs;
        let address = this.state.address;
        let provider = this.state.provider;

        // TODO pulldown for provider

        if (!bcs) {
            this.setState({
                message: "ensure the bcs prop is passed to this component."
            });
        }
        else if (!bcs.jwt) {
            this.setState({message: "log in first."});
        }
        else if (!address) {
            this.setState({message: "submit valid address."});
        }
        else {
            this.setState({message: "geocoding..."});
            let promise = bcs.geocoding.geocode(address, provider);
            promise.then((geocodes) => {
                console.log("geocoding: success", geocodes);
                this.setState({
                    message: (
                        `successfully retrieved ${geocodes.length} geocode(s).` 
                    ),
                    geocodes: geocodes
                });
            })
            .catch((error) => {
                console.log("geocoding: failure", error);
                this.setState({message: `geocoding error: ${error}.`});
            });
        }

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>

                    <label>
                        <div className="inputLabel">
                            <span>Provider</span>
                        </div>
                        <select
                            value={this.state.provider}
                            onChange={this.handleProviderChange}
                        >
                            <option value="mapbox">Mapbox</option>
                            <option value="mapzen">Mapzen</option>
                        </select>
                    </label>
                    <br/>
                    <label>
                        <div className="inputLabel">
                            <span>Address</span>
                        </div>
                        <input className="address" type="text"
                            value={this.state.address}
                            onChange={this.handleAddressChange}
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <div className="status">
                    Status: {this.state.message}
                </div>
                <div className="geocodes">
                    <ul>
                        {this.state.geocodes.map(render_geocode)}
                    </ul>
                </div>
            </div>
       );
    }
}


export default Geocoding;
