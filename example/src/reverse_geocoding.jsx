import React, { Component } from "react";


function render_geocode(geocode, key) {
    if (!geocode) {
        return undefined;
    }

    return (<li key={key} className="geocode">
        <div className="location">
            {geocode.address} ({geocode.x}, {geocode.y})
        </div>
        <div className="attributes">
            <div className="attribute score">
                <span className="key">score</span>
                <span className="value">{geocode.score}</span>
            </div>
        </div>
    </li>);
}


class ReverseGeocoding extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: "let's geocode! in reverse!",
            lat: "",
            lon: "",
            provider: "mapbox",
            geocodes: [],
        };
        // Ensure handle* methods have the right `this`
        this.handleProviderChange = this.handleProviderChange.bind(this);
        this.handleLatChange = this.handleLatChange.bind(this);
        this.handleLonChange = this.handleLonChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleProviderChange(event) {
        this.setState({provider: event.target.value});
    }

    handleLatChange(event) {
        this.setState({lat: event.target.value});
    }

    handleLonChange(event) {
        this.setState({lon: event.target.value});
    }

    handleSubmit(event) {
        // Don't cause whole page refresh on errors.
        event.preventDefault();

        console.log("reverse geocoding: handleSubmit", this.state, this.props);
        let bcs = this.props.bcs;
        let lat = this.state.lat;
        let lon = this.state.lon;
        let provider = this.state.provider;

        if (!bcs) {
            this.setState({
                message: "ensure the bcs prop is passed to this component."
            });
        }
        else if (!bcs.jwt) {
            this.setState({message: "log in first."});
        }
        else {
            this.setState({message: "geocoding..."});
            let promise = bcs.geocoding.reverse_geocode([lat, lon], provider);
            console.log("promise", promise);
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
                        <div className="input_label_div">
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
                        <div className="input_label_div">
                            <span>Latitude</span>
                        </div>
                        <input type="text" className="decimal"
                            value={this.state.lat}
                            onChange={this.handleLatChange}
                        />
                    </label>
                    <br/>
                    <label>
                        <div className="input_label_div">
                            <span>Longitude</span>
                        </div>
                        <input type="text" className="decimal"
                            value={this.state.lon}
                            onChange={this.handleLonChange}
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <div>
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


export default ReverseGeocoding;
