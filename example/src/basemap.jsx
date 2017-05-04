import React, { Component } from "react";


function renderBasemap(basemap, key) {
    if (!basemap) {
        return undefined;
    }
    return (<li key={key} className="basemap">
        <h3>{basemap.title}</h3>
        {basemap.description}
        <br/>
        ({basemap.standard}, {basemap.tile_format}, {basemap.endpoint})
    </li>);
}


export class Basemap extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: "let's basemap!",
            providers: {},
            provider: "all",
            basemaps: [],
        };
        this.handleProviderChange = this.handleProviderChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleProviderChange(event) {
        this.setState({
            provider: event.target.value
        });
    }

    handleSubmit(event) {
        // Don't cause whole page refresh on errors.
        event.preventDefault();

        console.log("basemap: handleSubmit", this.state, this.props);

        let bcs = this.props.bcs;

        if (!bcs) {
            this.setState({
                message: "ensure the bcs prop is passed to this component."
            });
        }
        // else if (!bcs.jwt) {
        //     this.setState({message: "log in first."});
        // }
        else {
            this.setState({message: "basemapping..."});
            let promise = bcs.basemaps.basemaps();
            promise.then((basemaps) => {
                console.log("basemaps: success", basemaps);
                this.setState({
                    message: (
                        `successfully retrieved ${basemaps.length} basemap(s).` 
                    ),
                    basemaps: basemaps
                });

                let providers = {};
                basemaps.forEach((basemap) => {
                    providers[basemap.provider] = basemap.provider;
                });
                this.setState({
                    providers: providers
                });


                // Just for playing around in the console, not for real apps
                window.basemaps = basemaps;
            })
            .catch((error) => {
                console.log("basemap: failure", error);
                this.setState({message: `basemap error: ${error}.`});
            })
            ;
        }

    }

    render() {

        function createProviderItems(providers) {
            let provider_options = [
                <option key="all" value="All">All</option>
            ];
            let provider_keys = Object.keys(providers);
            for (let key of provider_keys) {
                let value = providers[key];
                let item = <option key={key} value={key}>{value}</option>;
                provider_options.push(item);
            }
            console.log("provider_options", provider_options);
            return provider_options;
        }

        let providerItems = createProviderItems(this.state.providers);

        function currentFilter(basemap) {

            if (this.state.provider === "all") {
                return true;
            }

            if (!(this.state.provider && this.state.provider === basemap.provider)) {
                return false;
            }

            return true;
        }
        let basemaps = this.state.basemaps.filter(currentFilter.bind(this));
        let basemapItems = basemaps.map(renderBasemap);

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="submit" value="Submit" />
                </form>
                <div className="status">
                    Status: {this.state.message}
                </div>
                <div className="basemapFilter">
                    <label>
                        <div className="inputLabel">
                            <span>Provider</span>
                        </div>
                        <select
                            value={this.state.provider}
                            onChange={this.handleProviderChange}
                        >
                            {providerItems}
                        </select>
                    </label>
                </div>
                <div className="basemaps">
                    <ul>{basemapItems}
                    </ul>
                </div>
            </div>
        );
    }
}
