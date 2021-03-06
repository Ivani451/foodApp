import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { fetchInfo } from "../actions";

// Here we take in the passed in props from the FoodList component and render
// the dishes for the inputted ingredients

class Recipe extends Component {
  renderFood(food) {
    return (
      <div className="food-container">
        {food.map((recipe) => {
          return (
            <div>
              <Link to={"/recipe/" + recipe.id}>
                <div
                  className="indiv-recipe"
                  key={recipe.id}
                  style={{
                    backgroundImage: "url(" + recipe.image + ")",
                  }}
                  onClick={() => this.props.fetchInfo(recipe.id)}
                >
                  <div id="recipe-title"> {recipe.title}</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }

  // 'this' is added as a second argument to map to bind it with the fetchInfo action creator
  // used in the function call
  render() {
    return (
      <div>
        <h1>{this.props.foods.map(this.renderFood, this)}</h1>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchInfo }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps
)(Recipe);
