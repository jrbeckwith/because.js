import React, { Component } from "react";


function renderResult(result, key) {
    if (!result) {
        return undefined;
    }

    return (<li key={key} className="result">
        <a href={result.url}>{result.title}</a>
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


export class Search extends Component {
    constructor (props) {
        super(props);
        this.state = {
            message: "let's search!",
            category: "ALL",
            categories: {
                "ALL": "Any Category",
            },
            text: "geoserver",
            results: [],
        };
        // Ensure handle* methods have the right `this`
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.refreshCategories = this.refreshCategories.bind(this);
    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    handleCategoryChange(event) {
        this.setState({category: event.target.value});
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
                message: "ensure the bcs prop is passed to this component."
            });
        }
        // This is not required for now, but may be in the future.
        // else if (!bcs.jwt) {
        //     this.setState({message: "log in first."});
        // }
        else if (!text) {
            this.setState({message: "submit some text to search for."});
        }
        else {
            this.setState({message: "searching..."});
            let promise = bcs.search.search(text, [category]);
            promise.then((results) => {
                console.log("search: success", results);
                this.setState({
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

    refreshCategories() {
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
            one["ALL"] = "Any Category";
            this.setState({
                category: "ALL",
                categories: one,
            });
        });
    }

    render() {

        function createCategoryItems(categories) {
            let category_options = [];
            let category_keys = Object.keys(categories);
            for (let key of category_keys) {
                let value = categories[key];
                let item = <option key={key} value={key}>{value}</option>;
                category_options.push(item);
            }
            console.log("category_options", category_options);
            return category_options;
        }
        let categoryItems = createCategoryItems(this.state.categories);

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
                    <label>
                        <div className="inputLabel">
                            <span>Category</span>
                        </div>
                        <select
                            value={this.state.category}
                            onChange={this.handleCategoryChange}
                        >
                            {categoryItems}
                        </select>
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={this.refreshCategories}>
                    Refresh Categories
                </button>
                <div className="status">
                    Status: {this.state.message}
                </div>
                <div className="results">
                    <ul>
                        {this.state.results.map(renderResult)}
                    </ul>
                </div>
            </div>
       );
    }
}
