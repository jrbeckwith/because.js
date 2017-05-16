import React, { Component } from "react";
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { textFieldStyle } from './styles';


function renderResult(result, key) {
    if (!result) {
        return undefined;
    }

    return (
        <ListItem
            disabled={true}
            primaryText={
                <a
                    href={result.url}
                    style={{
                        color: "#f68c4f",
                    }}
                >{result.title}
                    </a>
            }
            secondaryText={
                <div>
                    <span>
                        {result.description}
                    </span>
                    <br/>
                    <span>Category: {result.category}</span>
                    <span>Role: {result.role}</span>
                </div>
            }
            secondaryTextLines={2}
            key={key}
            className="result"
        >
        </ListItem>
    );
}


export default class Search extends Component {
    constructor (props) {
        super(props);
        this.state = {
	    errors: {
                text: "",
            },
            query: undefined,
            state: "waiting",
            category: "ALL",
            categories: {
                "ALL": "Any",
            },
            text: "geoserver",
            results: [],
        };
        // Ensure handle* methods have the right `this`
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCategories = this.updateCategories.bind(this);
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    handleCategoryChange(event, index, selected) {
        this.setState({
            category: selected
        });
    }

    handleSubmit(event) {
        // Don't cause whole page refresh on errors.
        event.preventDefault();

        console.log("search: handleSubmit", this.state, this.props);
        let bcs = this.props.bcs;
        let category = this.state.category;
        let text = this.state.text;

        if (!bcs) {
            this.setState({
                state: "error",
                message: "ensure the bcs prop is passed to this component."
            });
        }
        // This is not required for now, but may be in the future.
        // else if (!bcs.jwt) {
        //     this.setState({message: "log in first."});
        // }
        //}
        else {
            let promise = bcs.search.search(text, [category]);
            this.setState({
                state: "started",
                query: {
                    "category": category,
                    "text": text,
                }
            });
            promise.then((results) => {
                console.log("search: success", results);
                this.setState({
                    state: "done",
                    message: (
                        `successfully retrieved ${results.length} result(s).` 
                    ),
                    results: results,
                });

                // Just for playing around in the console, not for real apps
                window.results = results;
            })
            .catch((error) => {
                console.log("search: failure", error);
                this.setState({message: `search error: ${error}.`});
            });
        }

    }

    updateCategories() {
        let bcs = this.props.bcs;
        let promise = bcs.search.get_categories();
        promise.then((result) => {
            const one = {};
            for (let record of result) {
                // The text for ALL is wonky
                if (record.key !== "ALL") {
                    one[record.key] = record.description;
                }
            }
            one["ALL"] = "Any";
            this.setState({
                categories: one,
            });
        });
    }

    render() {
        var query_repr = "";
        if (this.state.query && this.state.results.length > 0) {
            let category = this.state.categories[this.state.query.category];
            query_repr = `"${this.state.query.text}" in category ${category}`;
        }             
        function createCategoryItems(categories) {
            let category_options = [];
            let category_keys = Object.keys(categories);
            for (let key of category_keys) {
                let value = categories[key];
                let item = (
                    <MenuItem
                        key={key}
                        value={key}
                        primaryText={value} />
                );
                category_options.push(item);
            }
            return category_options;
        }
        let categoryItems = createCategoryItems(this.state.categories);

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

                    <label>
                        <TextField
                            type="text"
                            name="address"
                            style={textFieldStyle}
                            errorText={this.state.errors.text}
                            floatingLabelText="Text"
                            floatingLabelFixed={true}
                            hintText="Text"
                            value={this.state.text}
                            onChange={this.handleTextChange}
                        />
                    </label>

                    <br/>

                    <label>
                        <SelectField
                            floatingLabelText="Category"
                            value={this.state.category}
                            onChange={this.handleCategoryChange}
                        >
			    {categoryItems}
                        </SelectField>
                    </label>

                    <br/>

                    <RaisedButton
                        primary={true}
                        type="submit" label="Search"
                    />

                    <RaisedButton
                        style={{
                            marginTop: "1em",
                        }}
                        primary={true}
                        onClick={this.updateCategories}
                        label="Update Categories"
                    />
                </form>

                <Snackbar
                    open={this.state.state === "started"}
                    message={"Searching..."}
                    autoHideDuration={4000}
                />
                <Snackbar
                    open={this.state.state === "done"}
                    message={`Retrieved ${this.state.results.length} search results`}
                    autoHideDuration={4000}
                />
         
                <div className="results">
                    {query_repr && 
                            <Subheader>
                                Search results for {query_repr}
                            </Subheader>
                    }		
                    <List>
                        {this.state.results.map(renderResult)}
                    </List>
                </div>
            </div>
        );
    }
}
