import React from "react";

function Header(props) {
  function flash() {
    console.log("Changed");
  }

  return (
    <header>
      <p>Marketplace</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <button
            style={{ margin: "0 2rem 0 1rem" }}
            onClick={props.activateNewRecipe}
          >
            Add Another Table
          </button>
        </div>
        <div className="shopping-list-container">
          <img
            onClick={props.toggleShoppingList}
            src={props.listIcon}
            alt="ICON"
          />
          <div onChange={flash} className="shopping-list-count">
            {props.shoppingListCount}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
