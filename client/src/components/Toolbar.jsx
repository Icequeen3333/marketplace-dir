import React, { useState } from "react";

function Toolbar(props) {
  const [currentFilter, setCurrentFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");
  const allRecipes = [...props.allRecipes];

  function filterMealType(e) {
    const filter = e.target.name;
    filter === currentFilter ? clearFilter() : applyFilter();
    function applyFilter() {
      let filterButtons = document.querySelectorAll(".toolbar__filter");
      filterButtons.forEach((button) => {
        button.classList.remove("filter-active");
      });
      e.target.classList.add("filter-active");
      setCurrentFilter(filter);
      const filtered = props.searchedRecipes.filter((recipe) => {
        return recipe.mealType.indexOf(filter) >= 0 ? true : false;
      });
      props.setFilteredRecipes(filtered);
      props.setRecipes(filtered);
    }
    function clearFilter() {
      if (searchTerm) {
        props.setFilteredRecipes(allRecipes);
        refreshSearch();
      } else {
        props.setFilteredRecipes(allRecipes);
        props.setRecipes(allRecipes);
      }
      e.target.classList.remove("filter-active");
      setCurrentFilter("");
    }
    function refreshSearch() {
      const searched = allRecipes.filter((recipe) => {
        return recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
          ? true
          : false;
      });
      props.setSearchedRecipes(searched);
      props.setRecipes(searched);
    }
  }

  const recipesByTime = allRecipes.sort((a, b) => {
    return a.time < b.time ? 1 : -1;
  });
  const inputElement = document.getElementById("filter-time");
  let recipesFilteredByTime;

  function filterByTime(e) {
    setFilterRange(e.target.value);
    const maxTime = recipesByTime[0].time + 10;
    inputElement.setAttribute("max", maxTime);
    if (searchTerm === "") {
      recipesFilteredByTime = props.filteredRecipes.filter((recipe) => {
        return recipe.time <= e.target.value ? true : false;
      });
      props.setRecipes(recipesFilteredByTime);
    } else {
      recipesFilteredByTime = props.searchedRecipes.filter((recipe) => {
        return recipe.time <= e.target.value ? true : false;
      });
      props.setRecipes(recipesFilteredByTime);
    }
  }

  function handleSearchInput(e) {
    const input = e.target.value;
    setSearchTerm(input);
    if (input === "") {
      props.setSearchedRecipes(props.filteredRecipes);
      props.setRecipes(props.filteredRecipes);
    } else {
      const searched = props.filteredRecipes.filter((recipe) => {
        return recipe.title.toLowerCase().includes(input.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.includes(input.toLowerCase())
          )
          ? true
          : false;
      });
      props.setSearchedRecipes(searched);
      props.setRecipes(searched);
    }
  }

  function searchRecipes(e) {
    if (e) {
      e.preventDefault();
    } else {
      if (searchTerm === "") {
        props.setRecipes(props.filteredRecipes);
      } else {
        const searched = props.filteredRecipes.filter((recipe) => {
          return (
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.includes(searchTerm.toLowerCase())
            )
          );
        });
        props.setSearchedRecipes(searched);
        props.setRecipes(searched);
      }
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar__filters">
        <p>Filter meal type</p>
        <button
          name="Breakfast"
          className="toolbar__filter"
          onClick={filterMealType}
        >
          Breakfast
        </button>
        <button
          name="Lunch"
          className="toolbar__filter"
          onClick={filterMealType}
        >
          Lunch
        </button>
        <button
          name="Dinner"
          className="toolbar__filter"
          onClick={filterMealType}
        >
          Dinner
        </button>
      </div>
      <div className="toolbar__filters">
        <label htmlFor="filter-time">Cooking time</label>
        <input
          type="range"
          name="filter-time"
          id="filter-time"
          min="5"
          max="1000"
          step="5"
          value={filterRange}
          onChange={filterByTime}
        />
        <p>{filterRange === "all" ? "All" : `${filterRange} minutes`}</p>
      </div>
      <form onSubmit={searchRecipes} action="">
        <label htmlFor="search-recipes">Search recipes</label>
        <input
          onChange={handleSearchInput}
          type="text"
          name="search-recipes"
          id="search-recipes"
          autoComplete="off"
          value={searchTerm}
        />
      </form>
    </div>
  );
}

export default Toolbar;
