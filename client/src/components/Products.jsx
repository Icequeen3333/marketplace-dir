import React, { useState } from "react";
import ProductDetails from "./ProductDetails";

function Products(props) {
  const [productDetails, setProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function showDetails(e) {
    const recipe = e.target;
    const recipeId = recipe.closest(".recipes-card").getAttribute("id");
    setSelectedProduct(props.recipes[recipeId]);
    setProductDetails(true);
  }

  function deleteAll() {
    fetch("http://localhost:9000/recipes/delete-all", {})
      .then(res => res.json())
      .then(res => props.setRecipes(res))
      .catch(error => {
        console.error("Error:", error);
      });
    props.setIsNewRecipeForm(false);
    props.setNewRecipe({
      title: "",
      ingredients: [],
      method: [],
      tableNumber: "",
      time: "",
      image: "",
      mealType: []
    });
  }

  return (
    <div className="recipes__container">
      <h1 className="recipes__header">Tables</h1>
      <div className="recipes__cards-section">
        {props.recipes.length === 0 && <h3>No tables carrying that product found.</h3>}
        {props.recipes.length > 0 &&
          props.recipes
            .sort((a, b) => {
              return b.dateAdded < a.dateAdded ? -1 : 1;
            })
            .map((recipe, index) => {
              return (
                <div
                  className="recipes-card"
                  id={index}
                  key={index}
                  onClick={showDetails}
                >
                  <div className="recipes-card__title-container">
                    <h3 className="recipes-card__title">{recipe.title}</h3>
                    <div className="recipes-card__detail-container">
                      {recipe.time && (
                        <p className="recipes-card__time">${recipe.time}</p>
                      )}
                      {recipe.mealType &&
                        recipe.mealType.map((item, index) => {
                          return (
                            <p key={index} className="recipes-card__meal-type">
                              {item}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                  <img
                    className="recipes-card__image"
                    src={recipe.image}
                    alt={recipe.title}
                  />
                </div>
              );
            })}
      </div>
      <button className="button--delete" onClick={deleteAll}>
        Delete All
      </button>
      {productDetails && (
        <ProductDetails
          addToShoppingList={props.addToShoppingList}
          recipe={selectedProduct}
          setRecipes={props.setRecipes}
          showRecipe={setProductDetails}
        />
      )}
    </div>
  );
}

export default Products;
