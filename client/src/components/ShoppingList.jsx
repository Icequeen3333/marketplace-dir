import React, { useState } from "react";

function ShoppingList(props) {
  const [newItem, setNewItem] = useState({ quantity: 1, name: "" });

  function newItemName(e) {
    const input = e.target.value;
    setNewItem(prevValues => ({
      ...prevValues,
      name: input
    }));
  }

  function newItemQuantity(e) {
    const input = parseInt(e.target.value);
    setNewItem(prevValues => ({
      ...prevValues,
      quantity: input
    }));
  }

  function submitNewItem(e) {
    e.preventDefault();
    if (newItem.name !== "") {
      props.increaseQuantity(newItem.name, newItem);
      setNewItem({ quantity: 1, name: "" });
    }
    // document.getElementById("new-item").focus();
  }

  function increaseQuantity(e) {
    const index = e.target.value;
    props.increaseQuantity(props.shoppingList[index].name);
  }

  function decreaseQuantity(e) {
    const index = e.target.value;
    props.decreaseQuantity(props.shoppingList[index].name);
  }

  function deleteAll() {
    props.setShoppingList([]);
  }

  function checkItem(e) {
    e.target
      .closest(".shopping-list__item")
      .classList.toggle("shopping-list__item--checked");
  }

  return (
    <div className="shopping-list__container">
      <div className="shopping-list__header">
        <h3>Shopping List</h3>
        {props.shoppingList.length > 0 && (
          <button className="shopping-list__delete-all" onClick={deleteAll}>
            Delete all
          </button>
        )}
      </div>
      <form onSubmit={submitNewItem} className="shopping-list__new-item">
        <input
          type="number"
          name="new-item-quantity"
          id="new-item-quantity"
          value={newItem.quantity}
          min="1"
          className="shopping-list__quantity"
          onChange={newItemQuantity}
        />
        <input
          type="text"
          name="new-item"
          id="new-item"
          placeholder="Add item..."
          value={newItem.name}
          onChange={newItemName}
          autoComplete="off"
          autoFocus={true}
        />
        <button type="submit">+</button>
      </form>
      <ul className="shopping-list">
        {props.shoppingList.map((item, index) => (
          <div key={index}>
            <li className="shopping-list__item">
              <div className="shopping-list__edit-quantity">
                <button
                  onClick={increaseQuantity}
                  value={index}
                  className="shopping-list__plus-minus"
                >
                  +
                </button>
                <button
                  onClick={decreaseQuantity}
                  value={index}
                  className="shopping-list__plus-minus"
                >
                  -
                </button>
              </div>
              <div className="shopping-list__quantity">{item.quantity}</div>
              <div className="shopping-list__name" onClick={checkItem}>
                <span>{item.name}</span>
              </div>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
