(function () {
  const formElm = document.querySelector("form");
  const nameInputElm = document.querySelector(".product-name");
  const priceInputElm = document.querySelector(".product-price");
  const listGroupElm = document.querySelector(".list-group");
  const filterElm = document.querySelector("#filter");
  const addProductElm = document.querySelector(".add-product");

  //tracking item
  //temporary data store
  let products = [];

  //when we search an item in nav search bar =>fun* showAllItemsToUI
  function showAllItemsToUI(items) {
    listGroupElm.innerHTML = "";
    items.forEach((item) => {
      const listElm = `<li class="list-group-item item-${item.id} collection-item">
    <strong>${item.name}</strong>- <span class="price">$${item.price}</span>
    <i class="fas fa-pencil-alt edit-item float-right ml-2"></i>
    <i class="fa fa-trash delete-item float-right"></i>
    </li>`;

      listGroupElm.insertAdjacentHTML("afterbegin", listElm);
    });
  }

  function updateAfterRemove(products, id) {
    return products.filter((product) => product.id !== id);
  }
  //remove from (products = []) session storage
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
    //generate id for identify singal product
    const listElm = `<li class="list-group-item item-${id} collection-item">
            <strong>${name}</strong>- <span class="price">$${price}</span>
            <i class="fa fa-pencil-alt edit-item float-right ml-2 "></i>
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
    const name = nameInputElm.value;
    const price = priceInputElm.value;
    return {
      // nameInput:nameInput,
      // priceInput:priceInput
      name,
      price,
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
  //// item remove from local storage
  function removeProductFromLocalStorage(id) {
    //pick from local storage
    const products = JSON.parse(localStorage.getItem("storeProducts"));
    //filter
    const productsAfterRemove = updateAfterRemove(products, id);
    localStorage.setItem("storeProducts", JSON.stringify(productsAfterRemove));
  }

  function populateUIinEditeState(product) {
    nameInputElm.value = product.name;
    priceInputElm.value = product.price;
  }

  function showUpdateButton() {
    const elm = `<button type="button" class="btn mt-3 btn-block btn-warning update-product">Update</button>`;
    addProductElm.style.display = "none";
    formElm.insertAdjacentHTML("beforeend", elm);
  }

  //update local storage after edit and update item
  function updateProductToLOcalStorage() {
    if (localStorage.getItem("storeProducts")) {
      localStorage.setItem("storeProducts", JSON.stringify(products));
    }
  }

  function init() {
    let updatedItemId;
    formElm.addEventListener("submit", (evt) => {
      //prevent default action(browser reloading)
      evt.preventDefault();
      //receiving input
      const { name, price } = receiveInputs();

      //validate input
      const isError = validateInput(name, price);
      if (isError) {
        alert("please provide valid input");
        return;
      }

      //add item to data store
      //generate item
      const id = products.length;

      const product = {
        id,
        name,
        price,
      };

      products.push(product);
      //add item to the UI
      addItemToUI(id, name, price);

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
      //show Item to UI //when we search an item in nav search bar =>fun* showAllItemsToUI
      showAllItemsToUI(filteredArr);
    });

    //deleting item (event delegation)
    listGroupElm.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("delete-item")) {
        const id = getItemID(evt.target);
        //delete item from UI
        removeItemFromUI(id);
        //delet from session storage(products =[])
        removeItemFromDataStore(id);
        //delete item localStorage
        removeProductFromLocalStorage(id);
      } else if (evt.target.classList.contains("edit-item")) {
        //pick item id
        updatedItemId = getItemID(evt.target);

        //find the item from session storage(products=[])
        const foundProduct = products.find(
          (product) => product.id === updatedItemId
        );
        //populate the item in data
        populateUIinEditeState(foundProduct);
        //show update btn
        if (!document.querySelector(".update-product")) {
          showUpdateButton();
        }
      }
    });
    //for update item (event delegation)
    formElm.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("update-product")) {
        //pick data from the field
        const { name, price } = receiveInputs();
        //vali date input
        const isError = validateInput(name, price);
        if (isError) {
          alert("plese valid the input");
          return;
        }
        //update in local Data
        products = products.map((product) => {
          if (product.id === updatedItemId) {
            //item should be updated
            return {
              id: product.id,
              name,
              price,
            };
          } else {
            //no update
            return product;
          }
        });
        //reset input
        resetInput();

        //show submit btn after update complete
        addProductElm.style.display = "block";
        //update data to UI
        showAllItemsToUI(products);

        document.querySelector(".update-product").remove();
        //update in UI
        updateProductToLOcalStorage();
        //
      }
    });

    //refresh করলেও আইটেম গুলো থেকে যাবে যদি লোকাল স্ট্ররেজ এ প্রডাক্ট থাকে
    document.addEventListener("DOMContentLoaded", (e) => {
      //checking item into localstorage
      if (localStorage.getItem("storeProducts")) {
        products = JSON.parse(localStorage.getItem("storeProducts"));
        //show to ui from local storage(আগের এড্ড করা প্রডাক্ট গুলো লোকাল স্ট্ররেজ থেকে অটোমেটিক চলে আসবে)
        showAllItemsToUI(products);
      }
    });
  }

  init();
})();
