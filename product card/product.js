const MyProduct = {
  body: document.querySelector("window"),
  container: document.querySelector("#main"),
  firstDiv: null,
  productData: null,
  addonsData: [],
  secondDiv: null,
  addonsOmgId: [],
  master: "sienna",
  addons: {
    color_box: ["purar-air-mask-classic", "sienna", "ayesha-curry-adult-aprons"],
    sienna: ["color_box", "ayesha-curry-adult-aprons"],
    short_video_product: ["purar-air-mask-classic", "sienna"],
  },
  createElement: (element, innerHTML, attributes) => {
    let newElement = document.createElement(element);
    newElement.innerHTML = innerHTML;
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      newElement.setAttribute(attrName, attrValue);
    }
    return newElement;
  },
  bindEvent: (target, type, callBackFunc) => {
    target.addEventListener(type, callBackFunc);
  },

  globalFetch: async function (url) {
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  displayProducts() {
    // if (MyProduct.master === "short_video_product") {
    //   import myFunction from "./product2";
    //   myFunction();
    // }

    const featureImage = this.productData.product.images.map((photo) => photo.src);
    const imgDiv = this.createElement("div", "", { id: "Image-div" });
    this.firstDiv.appendChild(imgDiv);
    featureImage.forEach((imgUrl) => {
      const productImgDiv = this.createElement("img", "", {
        src: `${imgUrl}`,
        id: "product-images",
        style: "width: 250px; height: 250px; object-fit: contain",
      });
      imgDiv.appendChild(productImgDiv);
    });
  },

  myFunction() {
    console.log("hello");
  },
  displayProductDetails() {
    const addonProductVariant = this.productData.product.variants.map((addValue) => addValue.title);
    const imgId = this.productData.product.variants.map((id) => id.image_id);
    const addonImages = this.productData.product.images.map((image) => image.src); // Store image URLs
    const addonIds = this.productData.product.images.map((addValue) => addValue.id); // Store addon IDs
    const addonPrice = this.productData.product.variants.map((addonPrice) => addonPrice.price);
    const nullImage = this.productData.product.image.src;
    // Create an array to store addon data
    const addonDataArray = [];
    for (let i = 0; i < addonImages.length; i++) {
      addonDataArray.push({
        id: addonIds[i],
        src: addonImages[i],
        price: addonPrice[i],
      });
    }
    //create an array to store variants image_id and their price
    const addonPriceArray = [];
    for (let i = 0; i < addonProductVariant.length; i++) {
      addonPriceArray.push({
        id: imgId[i],
        price: addonPrice[i],
      });
    }
    const details = this.createElement(
      "div",
      `<h1>${this.productData.product.title}</h1>${this.productData.product.body_html} <p id = 'product_price'> Price: ₹ ${this.productData.product.variants[0].price}</p> `,
      { id: "detail-div" }
    );
    this.firstDiv.appendChild(details);
    const productSelect = this.createElement("select", "", { name: "color-variants", id: "variants" });
    addonProductVariant.forEach((item, index) => {
      const option = this.createElement("option", `${item}`, { value: `${item}`, "data-addon-id": imgId[index] });
      productSelect.appendChild(option);
    });
    details.appendChild(productSelect);
    this.bindEvent(productSelect, "click", (event) => {
      const productPrice = document.querySelector("#product_price");
      const selectedOption = event.target.selectedOptions[0];
      const selectedImgId = selectedOption.getAttribute("data-addon-id");
      const productImage = document.querySelector("#product-images");
      if (selectedImgId) {
        const selectedAddonData = addonDataArray.find((addonData) => addonData.id == selectedImgId);
        console.log("selected addon Data", selectedAddonData);
        if (selectedAddonData) {
          productImage.src = selectedAddonData.src;
        }
        const findPrice = addonPriceArray.find((addon) => addon.id == selectedImgId);
        console.log("find Price", findPrice);
        if (findPrice) {
          productPrice.innerHTML = `Price: ₹ ${findPrice.price}`;
        } else {
          productImage.src = nullImage;
          const nullPrice = this.productData.product.variants.find((value) => value.image_id == null);
          console.log("null Price", nullPrice.price);
          if (nullPrice) {
            productPrice.innerHTML = `Price: ₹ ${nullPrice.price}`;
          }
        }
      }
    });
    //default Variant image
  },
  addonsDataDisplay() {
    const addonProductVariant = this.addonsData.product.variants.map((addValue) => addValue.title);
    const imgId = this.addonsData.product.variants.map((id) => id.image_id);
    const addonImages = this.addonsData.product.images.map((image) => image.src);
    const addonIds = this.addonsData.product.images.map((addValue) => addValue.id);
    const addonPrice = this.addonsData.product.variants.map((addonPrice) => addonPrice.price);
    const nullVh = this.addonsData.product.image.src;
    // Create an array to store image src & image id
    const addonDataArray = [];
    for (let i = 0; i < addonImages.length; i++) {
      addonDataArray.push({
        id: addonIds[i],
        src: addonImages[i],
      });
    }
    // console.log("addon Data Array", addonDataArray);
    //create an array to store variants image_id and their price
    const addonPriceArray = [];
    for (let i = 0; i < addonProductVariant.length; i++) {
      addonPriceArray.push({
        id: imgId[i],
        price: addonPrice[i],
      });
    }
    // Product Title
    const addonDiv = this.createElement("div", `<h3>${this.addonsData.product.title}</h3>`, {
      id: `addon-data-${this.addonsData.product.title}`,
    });
    this.secondDiv.appendChild(addonDiv);
    // Product Price
    const displayAddonPrice = this.createElement("p", `Price: ₹ ${this.addonsData.product.variants[0].price}`, {});
    addonDiv.appendChild(displayAddonPrice);
    // Image Div
    const addonImgDiv = this.createElement("div", "", {
      id: `${this.addonsData.product.title}`,
      style: "width: 150px",
    });
    addonDiv.appendChild(addonImgDiv);
    // Product dropDown
    const addonSelect = this.createElement("select", "", {
      id: `addon-product-${this.addonsData.product.title}`,
      class: "check",
    });
    addonProductVariant.forEach((option, index) => {
      const addonOption = this.createElement("option", `${option}`, {
        value: `${option}`,
        "data-addon-id": imgId[index],
      });
      addonSelect.appendChild(addonOption);
    });
    addonDiv.appendChild(addonSelect);
    // Product Image Display
    const addonDisplayImage = this.createElement("img", "", {
      src: nullVh,
      style: "width: 150px",
      id: "addon-image",
    });
    addonImgDiv.appendChild(addonDisplayImage);
    // Add an event listener to the select element to update the addonImage
    this.bindEvent(addonSelect, "click", (event) => {
      const selectedOption = event.target.selectedOptions[0];
      const selectedImgId = selectedOption.getAttribute("data-addon-id");
      console.log("selected image id", selectedImgId);
      // find method for display images
      if (selectedImgId) {
        const selectedAddonData = addonDataArray.find((addonData) => addonData.id == selectedImgId);
        console.log("selected addon Data", selectedAddonData);
        if (selectedAddonData) {
          addonDisplayImage.src = selectedAddonData.src;
          const findPrice = addonPriceArray.find((addon) => addon.id == selectedImgId);
          if (findPrice) displayAddonPrice.innerHTML = `Price: ₹ ${findPrice.price}`;
        } else {
          addonDisplayImage.src = nullVh;
          const nullAddonPrice = this.addonsData.product.variants.find((nullId) => nullId.image_id == null);
          console.log("done");
          if (nullAddonPrice) {
            displayAddonPrice.innerHTML = `Price: ₹ ${nullAddonPrice.price}`;
            console.log("check");
          }
        }
      }
    });
  },
};
MyProduct.init = async () => {
  const firstDiv = MyProduct.createElement("div", "", {
    id: "master-div",
    style: "width: 55rem; display: flex",
  });
  MyProduct.firstDiv = firstDiv;
  MyProduct.container.appendChild(firstDiv);
  const secondDiv = MyProduct.createElement("div", "", {
    id: "children-div",
  });
  MyProduct.secondDiv = secondDiv;
  MyProduct.container.appendChild(secondDiv);
  const addonForMaster = MyProduct.addons[MyProduct.master];
  let masterAPIUrl = "";
  if (MyProduct.master === "short_video_product") {
    masterAPIUrl = `https://afzal-test-shop.myshopify.com/products/${MyProduct.master}.js`;
  } else {
    masterAPIUrl = `https://afzal-test-shop.myshopify.com/products/${MyProduct.master}.json`;
  }

  try {
    const productPromises = [fetch(masterAPIUrl)];
    console.time("all");
    for (const addon of addonForMaster) {
      const addonAPIUrl = `https://afzal-test-shop.myshopify.com/products/${addon}.json`;
      productPromises.push(fetch(addonAPIUrl));
    }
    console.log(productPromises);
    const productResponses = await Promise.all(productPromises);
    console.timeEnd("all");
    for (const response of productResponses) {
      if (!response.ok) {
        throw new Error(`Error Due to ${response.status}`);
      }
    }

    const productDataArray = await Promise.all(productResponses.map((response) => response.json()));
    console.log("productArray", productDataArray);
    MyProduct.productData = productDataArray[0];
    MyProduct.displayProducts();
    MyProduct.displayProductDetails();
    for (let i = 1; i < productDataArray.length; i++) {
      MyProduct.addonsData = productDataArray[i];
      MyProduct.addonsDataDisplay();
    }
  } catch (error) {
    console.log(error);
  }
};
(function () {
  MyProduct.init();
})();
