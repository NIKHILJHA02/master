const MyProduct = {
  body: document.querySelector("window"),
  container: document.querySelector("#main"),
  firstDiv: null,
  productData: null,
  addonsData: [],
  secondDiv: null,
  addonsOmgId: [],
  master: "short_video_product",
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
    const featureImage = this.productData.images.map((photo) => photo);
    const imgDiv = this.createElement("div", "", { id: "Image-div" });
    this.firstDiv.appendChild(imgDiv);
    featureImage.forEach((imgUrl) => {
      const productImgDiv = this.createElement("img", "", {
        src: `http:${imgUrl}`,
        id: "product-images",
        style: "width: 250px; height: 250px; object-fit: contain",
      });
      imgDiv.appendChild(productImgDiv);
    });
  },

  displayProductDetails() {
    const addonProductVariant = this.productData.variants.map((addValue) => addValue.title);
    const imgId = this.productData.variants.map((id) => id.id);
    const addonImages = this.productData.variants.map((image) => image.featured_image.src); // Store image URLs
    console.log("addonImages", addonImages);
    const addonIds = this.productData.variants.map((addValue) => addValue.id); // Store addon IDs
    const addonPrice = this.productData.variants.map((addonPrice) => addonPrice.price);
    // const nullImage = this.productData.image.src;
    // Create an array to store addon data\

    const addonDataArray = [];
    for (let i = 0; i < addonImages.length; i++) {
      addonDataArray.push({
        id: addonIds[i],
        src: addonImages[i],
        price: addonPrice[i],
      });
    }

    console.log("addon Data Array", addonDataArray);
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
      `<h1>${this.productData.title}</h1>${this.productData.description} <p id = 'product_price'> Price: ₹ ${this.productData.variants[0].price}</p> `,
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
          productImage.src = `https:${selectedAddonData.src}`;
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
      // MyProduct.addonsDataDisplay();
    }
  } catch (error) {
    console.log(error);
  }
};
(function () {
  MyProduct.init();
})();
