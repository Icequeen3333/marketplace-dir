import React from "react";

function ProductDetails(props) {
  function closeRecipe() {
    props.showRecipe(false);
  }

  function addAllToShoppingList() {
    let allIngredients = props.recipe.ingredients;

    for (let i = 0; i < allIngredients.length; i++) {
      props.addToShoppingList(allIngredients[i]);
    }
  }

  function deleteRecipe() {
    const recipeId = props.recipe._id;
    fetch(`http://localhost:9000/recipes/delete/${recipeId}`, {})
      .then(res => res.json())
      .then(res => {
        props.setRecipes(prevValue => [res, ...prevValue]);
      })
      .catch(error => {
        console.error("Error:", error);
      });
    fetch("http://localhost:9000/recipes")
      .then(res => res.json())
      .then(res => props.setRecipes(res))
      .catch(err => err);

    props.showRecipe(false);
  }

  return (
    <div className="selected-recipe-container">
      <div className="selected-recipe">
        <div className="selected-recipe__header">
          <h3 className="selected-recipe__title">{props.recipe.title}</h3>
          <button className="selected-recipe__btn--close" onClick={closeRecipe}>
            X
          </button>
        </div>
        <div className="selected-recipe__meal-type-container">
          {props.recipe.mealType &&
            props.recipe.mealType.map((item, index) => {
              return (
                <p key={index} className="selected-recipe__meal-type">
                  {item}
                </p>
              );
            })}
        </div>
        <div className="selected-recipe__tableNumber-time">
          {props.recipe.tableNumber && <p>Table number {props.recipe.tableNumber}</p>}
          {props.recipe.time && <p>Max price:${props.recipe.time}</p>}
        </div>
        <img
          className="selected-recipe__image"
          src={props.recipe.image}
          alt="recipe"
        />
        <div className="selected-recipe__ingredients">
          <h4 className="selected-recipe__subheading">Products</h4>
          <button
            onClick={addAllToShoppingList}
            className="selected-recipe__add-button--all"
          >
            Add all to shopping list
          </button>
          <ul>
            {props.recipe.ingredients.map((item, index) => (
              <div className="selected-recipe__ingredients-item" key={index}>
                <button
                  onClick={props.addToShoppingList}
                  className="selected-recipe__add-button"
                  value={item}
                >
                  +
                </button>
                <li>{item}</li>
              </div>
            ))}
          </ul>
        </div>
        <div className="selected-recipe__method">
          <h4 className="selected-recipe__subheading">Product pricing and location</h4>
          <ol>
            {props.recipe.method.map((item, index) => (
              <li className="selected-recipe__method-item" key={index}>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <button>Edit table</button>
        <button className="button--delete" onClick={deleteRecipe}>
          Delete table
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
