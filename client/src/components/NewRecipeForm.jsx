import React, { useState } from "react";

function NewRecipeForm(props) {
  const [isIncomplete, setIsComplete] = useState(false);

  function handleInput(e) {
    const { value: inputText, name: inputName } = e.target;
    if (
      inputName === "Breakfast" ||
      inputName === "Lunch" ||
      inputName === "Dinner"
    ) {
      let mealType = [...props.newRecipe.mealType];
      let index = mealType.indexOf(inputName);
      if (index >= 0) {
        if (mealType.length > 1) {
          const start = mealType.slice(0, index);
          const end = mealType.slice(index + 1, mealType.length);
          if (start.length > 0 && end.length > 0) {
            mealType = [...start, ...end];
          } else if (start.length > 0) {
            mealType = [...start];
          } else {
            mealType = [...end];
          }
          props.setNewRecipe(prevValue => ({
            ...prevValue,
            mealType: [...mealType]
          }));
        } else {
          props.setNewRecipe(prevValue => ({
            ...prevValue,
            mealType: []
          }));
        }
      } else {
        mealType.push(inputName);
        props.setNewRecipe(prevValue => ({
          ...prevValue,
          mealType: [...mealType]
        }));
      }
    } else {
      switch (inputName) {
        case "ingredients":
          props.setNewRecipe(prevValue => ({
            ...prevValue,
            ingredients: inputText.split("\n")
          }));
          break;
        case "method":
          props.setNewRecipe(prevValue => ({
            ...prevValue,
            method: inputText.split("\n")
          }));
          break;
        default:
          props.setNewRecipe(prevValue => ({
            ...prevValue,
            [inputName]: inputText
          }));
          break;
      }
    }
  }

  function submitRecipe(e) {
    e.preventDefault();
    if (!props.newRecipe.title) {
      setIsComplete(true);
    } else if (props.newRecipe.ingredients.length === 0) {
      setIsComplete(true);
    } else if (props.newRecipe.method.length === 0) {
      setIsComplete(true);
    } else {
      props.setRecipes(prevValue => [props.newRecipe, ...prevValue]);
      fetch("http://localhost:9000/recipes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props.newRecipe)
      })
        .then(res => res.json())
        .catch(error => {
          console.error("Error:", error);
        });
      props.setIsNewRecipeForm(false);
      props.setNewRecipe({
        title: "",
        ingredients: [],
        method: [],
        serves: "",
        time: "",
        image: ""
      });
    }
  }

  const currentIngredients = props.newRecipe.ingredients.join("\n");
  const currentMethod = props.newRecipe.method.join("\n");

  function closeForm(e) {
    e.preventDefault();
    props.setIsNewRecipeForm(false);
  }

  function closeWarning() {
    props.setIsComplete(false);
  }

  return (
    <div>
      <div className="new-recipe-form-container">
        <form className="new-recipe-form">
          <div className="new-recipe-form__header">
            <h4 className="new-recipe-form__title">New Recipe</h4>
            <button className="new-recipe-form__btn--close" onClick={closeForm}>
              X
            </button>
          </div>
          <input
            type="text"
            name="title"
            id="recipe-title"
            value={props.newRecipe.title}
            onChange={handleInput}
            autoFocus
            placeholder="Title"
            autoComplete="off"
          />
          <div className="new-recipe-form__meal-type-container">
            <div className="new-recipe-form__checkbox-container">
              <input
                type="checkbox"
                name="Breakfast"
                id="checkbox-breakfast"
                onChange={handleInput}
              />
              <label htmlFor="checkbox-breakfast">Breakfast</label>
            </div>
            <div className="new-recipe-form__checkbox-container">
              <input
                type="checkbox"
                name="Lunch"
                id="checkbox-lunch"
                onChange={handleInput}
              />
              <label htmlFor="checkbox-lunch">Lunch</label>
            </div>
            <div className="new-recipe-form__checkbox-container">
              <input
                type="checkbox"
                name="Dinner"
                id="checkbox-dinner"
                onChange={handleInput}
              />
              <label htmlFor="checkbox-dinner">Dinner</label>
            </div>
          </div>
          <div className="new-recipe-form__small-inputs">
            <input
              type="number"
              name="serves"
              id="recipe-serves"
              value={props.newRecipe.serves}
              onChange={handleInput}
              placeholder="Serves"
              autoComplete="off"
              min="0"
            />
            <input
              type="number"
              name="time"
              id="recipe-time"
              value={props.newRecipe.time}
              onChange={handleInput}
              placeholder="Time (minutes)"
              autoComplete="off"
              step="5"
              min="0"
            />
          </div>
          <textarea
            name="ingredients"
            id="recipe-ingredients"
            cols="30"
            rows="5"
            value={currentIngredients}
            onChange={handleInput}
            placeholder="Ingredients (Add each on a separate line)"
            autoComplete="off"
          ></textarea>
          <textarea
            name="method"
            id="recipe-method"
            cols="30"
            rows="5"
            value={currentMethod}
            onChange={handleInput}
            placeholder="Method (Add each on a separate line)"
            autoComplete="off"
          ></textarea>
          <input
            type="url"
            name="image"
            id="recipe-image"
            value={props.newRecipe.image}
            onChange={handleInput}
            placeholder="Image URL"
            autoComplete="off"
          />
          <button
            className="new-recipe-form__btn--submit"
            type="submit"
            onClick={submitRecipe}
          >
            Submit
          </button>
        </form>
        {isIncomplete && (
          <div className="new-recipe-form__warning">
            <p>Recipe must have a title, ingredients and a method</p>
            <button onClick={closeWarning}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewRecipeForm;