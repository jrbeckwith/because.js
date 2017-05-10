import React, { Component } from "react";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';


// Canonical capitalizations for UI
var pretty_provider_names = {
    "planet": "Planet",
    "mapbox": "Mapbox",
    "mapzen": "Mapzen",
    "boundless": "Boundless",
    "digitalglobe": "Digital Globe",
};

function renderBasemap(basemap, key) {
    if (!basemap) {
        return undefined;
    }
    return (
        <ListItem
            disabled={true}
            primaryText={
                <span>{basemap.title}</span>
            }
            secondaryText={
                <div>
                    <span>
                        {basemap.description}
                    </span>
                    <br/>
                    <span>({basemap.standard}, {basemap.tile_format}, {basemap.endpoint})
                    </span>
                </div>
            }
            secondaryTextLines={2}
            key={key}
            className="basemap"
        />
    );
}


export class Basemap extends Component {
    constructor (props) {
        super(props);
        this.state = {
            errors: {
            },
            state: "waiting",
            providers: {},
            provider: "all",
            basemaps: [],
        };
        this.handleProviderChange = this.handleProviderChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleProviderChange(event, bleh, blargh) {
        var provider = event.target.value || blargh;
        this.setState({
            provider: provider
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
            let promise = bcs.basemaps.basemaps();
            this.setState({
                state: "started",
            });
            promise.then((basemaps) => {
                console.log("basemaps: success", basemaps);
                this.setState({
                    state: "done",
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
            providers["all"] = "all";

            let provider_options = Object.keys(providers).map((key) => {
                let value = providers[key];
                let pretty = pretty_provider_names[value] || value;
                // let item = <option key={key} value={key}>{value}</option>;
                return <MenuItem
                    key={key}
                    value={key}
                    primaryText={pretty}
                />;
            });
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

        return (
            <div style={{
                display: "flex",
                flexDirection: "row",
            }}>

                <form onSubmit={this.handleSubmit} style={{
                    display: "flex",
                    flexDirection: "column",
                }}>

                    {this.props.message && 
                        <div className="message">
                           {this.props.message}
                        </div>
                    }

                    <RaisedButton 
                        primary={true}
                        type="submit"
                        label="List Basemaps"
                    />
                </form>

                <Snackbar
                    open={this.state.state === "started"}
                    message={"Finding basemaps..."}
                    autoHideDuration={4000}
                />

                <Snackbar
                    open={this.state.state === "done"}
                    message={`Found ${this.state.basemaps.length} basemaps`}
                    autoHideDuration={4000}
                />

                <div className="basemaps">
                    <span>
                        {this.state.basemaps.length > 0 &&
                                <Subheader style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}>
                                    <div style={{
                                        marginTop: "1.1em",
                                    }}>
                                    Basemaps from provider:&nbsp;
                                    </div>
                                    <SelectField
                                        style={{
                                            marginTop: "1.1em",
                                            fontSize: "14px",
                                        }}
                                        value={this.state.provider}
                                        onChange={this.handleProviderChange}
                                    >
                                        {providerItems}
                                    </SelectField>
                                </Subheader>
                        }
                    </span>
                    <List>
                        {basemaps.map(renderBasemap)}
                    </List>
                </div>
            </div>
        );
    }
}
