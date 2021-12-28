(function () {
  const formElm = document.querySelector("form");
  const nameInputElm = document.querySelector(".product-name");
  const priceInputElm = document.querySelector(".product-price");
  const listGroupElm = document.querySelector(".list-group");
  const filterElm = document.querySelector("#filter");

  //tracking item
  let products = [];

  function showAllItemsToUI(items) {
    listGroupElm.innerHTML = "";
    items.forEach((item) => {
      const listElm = `<li class="list-group-item item-${item.id} collection-item">
    <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
    <i class="fa fa-trash delete-item float-right"></i>
    </li>`;

      listGroupElm.insertAdjacentHTML("afterbegin", listElm);
    });
  }

  function updateAfterRemove(products, id) {
    return products.filter((product) => product.id !== id);
  }
  function removeItemFromDataStore(id) {
    let productsAfterDelete = updateAfterRemove(products, id);
    products = productsAfterDelete;
  }

  function removeItemFromUI(id) {
    document.querySelector(`.item-${id}`).remove();
  }

  function getItemID(elm) {
    const liElm = elm.parentElement;
    return Number(liElm.classList[1].split("-")[1]);
  }

  function resetInput() {
    nameInputElm.value = "";
    priceInputElm.value = "";
  }

  function addItemToUI(id, name, price) {
    //generate id
    const listElm = `<li class="list-group-item item-${id} collection-item">
            <strong>${name}</strong>- <span class="price">$${price}</span>
            <i class="fa fa-trash delete-item float-right"></i>
          </li>`;

    listGroupElm.insertAdjacentHTML("afterbegin", listElm);
  }

  function validateInput(name, price) {
    let isError = false;
    if (!name || name.length < 4) {
      isError = true;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      isError = true;
    }
    return isError;
  }

  function receiveInputs() {
    const nameInput = nameInputElm.value;
    const priceInput = priceInputElm.value;
    return {
      nameInput,
      priceInput,
    };
  }
  //local storage add function
  function addItemToLocalStorage(product) {
    let products;
    if (localStorage.getItem("storeProducts")) {
      products = JSON.parse(localStorage.getItem("storeProducts"));
      products.push(product);
      localStorage.setItem("storeProducts", JSON.stringify(products));
    } else {
      products = [];
      products.push(product);
      localStorage.setItem("storeProducts", JSON.stringify(products));
    }
  }
  ////
  function removeProductFromLocalStorage(id) {
    //pick from local storage
    const products = JSON.parse(localStorage.getItem("storeProducts"));
    //filter
    const productsAfterRemove = updateAfterRemove(products, id);
    localStorage.setItem("storeProducts", JSON.stringify(productsAfterRemove));
  }

  function init() {
    formElm.addEventListener("submit", (evt) => {
      //prevent default action(browser reloading)
      evt.preventDefault();
      //receiving input
      const { nameInput, priceInput } = receiveInputs();

      //validate input
      const isError = validateInput(nameInput, priceInput);
      if (isError) {
        alert("please provide valid input");
        return;
      }

      //add item to data store
      //generate item
      const id = products.length;

      const product = {
        id: id,
        name: nameInput,
        price: priceInput,
      };

      products.push(product);
      //add item to the UI
      addItemToUI(id, nameInput, priceInput);

      //add item to localStorage
      addItemToLocalStorage(product);
      //reset the input
      resetInput();
    });

    filterElm.addEventListener("keyup", (evt) => {
      //filter depend on this value
      const filterValue = evt.target.value;
      const filteredArr = products.filter((product) =>
        product.name.includes(filterValue)
      );
      showAllItemsToUI(filteredArr);
      //show Item to UI
    });

    //deleting item (event delegation)
    listGroupElm.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("delete-item")) {
        const id = getItemID(evt.target);
        //delete item from UI
        removeItemFromUI(id);
        removeItemFromDataStore(id);
        //delete item localStorage
        removeProductFromLocalStorage(id);
      }
    });
    document.addEventListener("DOMContentLoaded", (e) => {
      //checking item into localstorage
      if (localStorage.getItem("storeProducts")) {
        const products = JSON.parse(localStorage.getItem("storeProducts"));
        //show to ui from local storage(আগের এড্ড করা প্রডাক্ট গুলো লোকাল স্ট্ররেজ থেকে অটোমেটিক চলে আসবে)
        showAllItemsToUI(products);
      }
    });
  }

  init();
})();
