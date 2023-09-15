const container = document.querySelector("#main");
const createElement = function (element, innerHTML, attributes) {
  let newElement = document.createElement(element);
  newElement.innerHTML = innerHTML;
  for (const [attrName, attrValue] of Object.entries(attributes)) {
    newElement.setAttribute(attrName, attrValue);
  }
  return newElement;
};

let master = "color_box";

let addons = {
  color_box: ["purar-air-mask-classic", "sienna", "ayesha-curry-adult-aprons"],
  sienna: ["color_box", "ayesha-curry-adult-aprons"],
};

const fetchProduct = async () => {
  try {
    const response = await fetch(`https://afzal-test-shop.myshopify.com/products/${master}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch due to ${response.status}`);
    }
    const productData = await response.json();
    console.log(productData);

    // const images = document.createElement('DIV',)
  } catch (error) {
    console.log(error);
  }
};

fetchProduct();
//  let elm = document.get
