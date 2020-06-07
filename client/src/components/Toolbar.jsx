import React, { useState } from "react";

function Toolbar(props) {
  const [currentFilter, setCurrentFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
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

  const productsByPrice = allRecipes.sort((a, b) => {
    return a.time < b.time ? 1 : -1;
  });
  const inputElement = document.getElementById("filter-time");
  let recipesFilteredByTime;

  function filterByTime(e) {
    setFilterRange(e.target.value);
    const maxTime = productsByPrice[0].time ;
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

  function handleSearchTableInput(e) {
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
  function handleSearchProductInput(e) {
    const input = e.target.value;
    setSearchProduct(input);
    if (input === "") {
      props.setSearchedProducts(props.filteredRecipes);
      props.setRecipes(props.filteredRecipes);
    } else {
      const searched = props.filteredRecipes.filter((recipe) => {
        var lowerCaseNames = recipe.ingredients.map(function(value) {
          return value.toLowerCase();
        });

        return lowerCaseNames.indexOf(input.toLowerCase()) >= 0 ||
        lowerCaseNames.some((ingredients) =>
          ingredients.includes(input.toLowerCase())
          )
          ? true
          : false;
      });
      props.setSearchedProducts(searched);
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
  function searchProducts(e) {
    if (e) {
      e.preventDefault();
    } else {
      if (searchProduct === "") {
        props.setRecipes(props.filteredRecipes);
      } else {
        const searched = props.filteredRecipes.filter((recipe) => {
          return (
            recipe.title.toLowerCase().includes(searchProduct.toLowerCase()) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.includes(searchProduct.toLowerCase())
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
        <p>Filter product type</p>
        <button
          name="Food"
          className="toolbar__filter"
          onClick={filterMealType}
        >
          Food
        </button>
        <button
          name="Toys"
          className="toolbar__filter"
          onClick={filterMealType}
        >
          Toys
        </button>
        <button
          name="Extras"
          className="toolbar__filter"
          onClick={filterMealType}
        >
          Extras
        </button>
      </div>
      <div className="toolbar__filters">
        <label htmlFor="filter-time">Max Price</label>
        <input
          type="range"
          name="filter-time"
          id="filter-time"
          min="0"
          max="10"
          step=".5"
          value={filterRange}
          onChange={filterByTime}
        />
        <p>{filterRange === "all" ? "All" : `$${filterRange}`}</p>
      </div>
      <form onSubmit={searchRecipes} action="">
        <label htmlFor="search-table">Search table</label>
        <input
          onChange={handleSearchTableInput}
          type="text"
          name="search-table"
          id="search-table"
          autoComplete="off"
          value={searchTerm}
        />
      </form>
      <form onSubmit={searchProducts} action="">
        <label htmlFor="search-products">Search products</label>
        <input
          onChange={handleSearchProductInput}
          type="text"
          name="search-products"
          id="search-products"
          autoComplete="off"
          value={searchProduct}
        />
      </form>
    </div>
  );
}

export default Toolbar;
