import React, { Component } from "react";


function render_result(result, key) {
    if (!result) {
        return undefined;
    }

    return (<li key={key} className="result">
        <a href="{result.url}">{result.title}</a>
        <div>
            <span>
                {result.description}
            </span>
        </div>
        <div className="attributes">
            <div className="attribute category">
                <span className="key">category</span>
                <span className="value">{result.category}</span>
            </div>
            <div className="attribute role">
                <span className="key">role</span>
                <span className="value">{result.role}</span>
            </div>
        </div>
    </li>);
}


class Search extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: "let's search!",
            text: "geoserver",
            results: [],
        };
        // Ensure handle* methods have the right `this`
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    handleSubmit(event) {
        // Don't cause whole page refresh on errors.
        event.preventDefault();

        console.log("search: handleSubmit", this.state, this.props);
        let bcs = this.props.bcs;
        let text = this.state.text;
        let provider = this.state.provider;

        if (!bcs) {
            this.setState({
                message: "ensure the bcs prop is passed to this component."
            });
        }
        else if (!bcs.jwt) {
            this.setState({message: "log in first."});
        }
        else if (!text) {
            this.setState({message: "submit some text to search for."});
        }
        else {
            this.setState({message: "searching..."});
            let promise = bcs.search.search(text, provider);
            promise.then((results) => {
                console.log("search: success", results);
                this.setState({
                    message: (
                        `successfully retrieved ${results.length} result(s).` 
                    ),
                    results: results
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

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <div className="inputLabel">
                            <span>Text</span>
                        </div>
                        <input className="text" type="text"
                            value={this.state.text}
                            onChange={this.handleTextChange}
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <div className="status">
                    Status: {this.state.message}
                </div>
                <div className="results">
                    <ul>
                        {this.state.results.map(render_result)}
                    </ul>
                </div>
            </div>
       );
    }
}


export default Search;
