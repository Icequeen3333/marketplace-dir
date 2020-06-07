import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ShoppingList from "./components/ShoppingList";
import Toolbar from "./components/Toolbar";
import NewRecipeForm from "./components/NewRecipeForm";
import Products from "./components/Products";
import Footer from "./components/Footer";
import "./styles/App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [listIcon, setListIcon] = useState("shopping-list-icon.svg");
  const [shoppingList, setShoppingList] = useState([]);
  const [isNewRecipeForm, setIsNewRecipeForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: [],
    method: [],
    tableNumber: "",
    time: "",
    image: "",
    mealType: []
  });
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);

  function setInitialRecipes(r) {
    setRecipes(r);
    setAllRecipes(r);
    setFilteredRecipes(r);
    setSearchedRecipes(r);
    setSearchedProducts(r);
  }

  useEffect(() => {
    fetch("http://localhost:9000/recipes")
      .then(res => res.json())
      .then(res => setInitialRecipes(res))
      .catch(err => err);
  }, []);

  function toggleShoppingList() {
    !isListOpen ? setIsListOpen(true) : setIsListOpen(false);
    listIcon === "shopping-list-icon.svg"
      ? setListIcon("shopping-list-icon-invert.svg")
      : setListIcon("shopping-list-icon.svg");
  }

  let shoppingListCount = 0;

  shoppingList.forEach(item => {
    shoppingListCount += item.quantity;
  });

  function addToShoppingList(e) {
    let newItemName = "";
    if (typeof e === "string") {
      newItemName = e;
    } else {
      newItemName = e.target.value;
    }
    const newItem = { quantity: 1, name: newItemName };
    increaseQuantity(newItemName, newItem);
  }

  function increaseQuantity(newItemName, newItem) {
    const index = shoppingList.findIndex(item => item.name === newItemName);
    if (index >= 0) {
      !newItem
        ? (shoppingList[index].quantity += 1)
        : (shoppingList[index].quantity += newItem.quantity);
      setShoppingList(prevItems => [...prevItems]);
    } else {
      setShoppingList(prevItems => [newItem, ...prevItems]);
    }
  }

  function decreaseQuantity(newItemName, newItem) {
    const index = shoppingList.findIndex(item => item.name === newItemName);
    if (index >= 0) {
      shoppingList[index].quantity -= 1;
      if (shoppingList[index].quantity <= 0) {
        const start = shoppingList.slice(0, index);
        const end = shoppingList.slice(index + 1, shoppingListCount.length);
        setShoppingList([...start, ...end]);
      } else {
        setShoppingList(prevItems => [...prevItems]);
      }
    } else {
      setShoppingList(prevItems => [newItem, ...prevItems]);
    }
  }

  function activateNewRecipe() {
    setIsNewRecipeForm(true);
  }

  return (
    <div>
      <Header
        activateNewRecipe={activateNewRecipe}
        toggleShoppingList={toggleShoppingList}
        shoppingListCount={shoppingListCount}
        listIcon={listIcon}
      />
      {isListOpen && (
        <ShoppingList
          shoppingList={shoppingList}
          setShoppingList={setShoppingList}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
        />
      )}
      <Toolbar
        isNewRecipeForm={isNewRecipeForm}
        activateNewRecipe={activateNewRecipe}
        setRecipes={setRecipes}
        recipes={recipes}
        allRecipes={allRecipes}
        setIsNewRecipeForm={setIsNewRecipeForm}
        setNewRecipe={setNewRecipe}
        filteredRecipes={filteredRecipes}
        setFilteredRecipes={setFilteredRecipes}
        searchedRecipes={searchedRecipes}
        setSearchedRecipes={setSearchedRecipes}
        searchedProducts={searchedProducts}
        setSearchedProducts={setSearchedProducts}
      />
      {isNewRecipeForm && (
        <NewRecipeForm
          recipes={recipes}
          setRecipes={setRecipes}
          newRecipe={newRecipe}
          setNewRecipe={setNewRecipe}
          isNewRecipeForm={isNewRecipeForm}
          setIsNewRecipeForm={setIsNewRecipeForm}
        />
      )}
      <Products
        setShoppingList={setShoppingList}
        shoppingList={shoppingList}
        recipes={recipes}
        setRecipes={setRecipes}
        addToShoppingList={addToShoppingList}
        setIsNewRecipeForm={setIsNewRecipeForm}
        setNewRecipe={setNewRecipe}
      />
      <Footer />
    </div>
  );
}

export default App;
