import React, { Component } from "react";
import axios from "axios";

import PortfolioSidebarList from "../portfolio/portfolio-sidebar-list";
import PortfolioForm from "../portfolio/portfolio-form";

export default class PortfolioManager extends Component {
    constructor() {
        super();

        this.state = {
            portfolioItems: [],
            porfolioToEdit : {}
        }

        this.handleSuccessfulFormSubmission = this.handleSuccessfulFormSubmission.bind(this);
        this.handleSuccessfulFormSubmissionError = this.handleSuccessfulFormSubmissionError.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.hanleEditClick = this.hanleEditClick.bind(this);
        this.clearPortfolioToEdit = this.clearPortfolioToEdit.bind(this);
    }

    clearPortfolioToEdit() {
        this.setState({
            porfolioToEdit: {}
        });
    }

    hanleEditClick(portfolioItem) {
        this.setState({
            porfolioToEdit: portfolioItem
        });
    }

    handleDeleteClick(portfolioItem) {
        axios.delete(
            `https://api.devcamp.space/portfolio/portfolio_items/${portfolioItem.id}`, 
            { withCredentials: true }
        )
        .then(response => {
            this.setState({
                portfolioItems: this.state.portfolioItems.filter(item => {
                    return item.id !== portfolioItem.id;
                })
            })

            return response.data;
        })
        .catch(error => {
            console.log("handleDeleteClick error", error);
        });
    }

    handleSuccessfulFormSubmission(portfolioItem) {
        this.setState({
            portfolioItem: [portfolioItem].concat(this.state.portfolioItems)
        });
    }

    handleSuccessfulFormSubmissionError(error) {
        console.log("handleSuccessfulFormSubmissionError error", error);
    }

    getPortfolioItems() {
        axios
        .get("https://rileydixon.devcamp.space/portfolio/portfolio_items", { 
            withCredentials: true 
        }).then(response => {
            this.setState({
                portfolioItems: [...response.data.portfolio_items]
            });
        })
        .catch(error => {
            console.log("error in getPortfolioItems", error);
        });
    }

    componentDidMount() {
        this.getPortfolioItems();
    }

    render() {
        return (
            <div className="portfolio-manager-wrapper">
                <div className="left-column">
                <PortfolioForm 
                    handleSuccessfulFormSubmission={this.handleSuccessfulFormSubmission}
                    handleSuccessfulFormSubmissionError={this.handleSuccessfulFormSubmissionError}
                    clearPortfolioToEdit={this.clearPortfolioToEdit}
                    portfolioToEdit={this.state.portfolioToEdit}
                />
                </div>

                <div className="right-column">
                <PortfolioSidebarList 
                handleDeleteClick={this.handleDeleteClick}
                data={this.state.portfolioItems}
                hanleEditClick={this.hanleEditClick}
                />
                </div>
            </div>
        );
    }
}