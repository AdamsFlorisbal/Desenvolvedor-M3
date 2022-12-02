import { Product } from "./Product";
//import fetchData from "./fetchData.js";
const nameProduct = document.querySelector("#product");
const colorProduct = document.querySelector(".filter-color");
const sizeProduct = document.querySelector(".filter-size");
const inputColor = document.querySelector(".filter-color");

async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro: " + response.status);
    const json = await response.json();
    return json;
  } catch (error) {
    if (error instanceof Error) console.error("fetchData: " + error.message);
    return null;
  }
}

async function handleData() {
  const data = await fetchData<Product[]>("http://localhost:5000/products");
  renderProducts(data);
  renderFilters(data);
}

function renderProducts(data: Product[]) {
  if (data) {
    var limit = 9;
    for (var i = 0; i < limit; i++) {
      nameProduct.innerHTML += `
        <div class="product-list">
        <img src="${data[i].image}"/>
        <h1 class="product-name">${data[i].name}</h1>
        <h2 class="product-price">R$ ${data[i].price.toFixed(2)}</h2>
        <h3 class="product-installment">até ${
          data[i].parcelamento[0]
        }x de R$${data[i].parcelamento[1].toFixed(2)}</h3>
        <button class="btn-comprar">COMPRAR</button>
        </div>
        `;
    }
  }
}

function renderFilters(data: Product[]) {
  var color: any[] | string = [];
  data.forEach((item) => {
    color.push(item.color);
  });

  const arrayColor = color.filter(
    (item, index, arr) => arr.indexOf(item) == index
  );
  
  //renderiza filtros por cor
  arrayColor.forEach((color) => {
    colorProduct.innerHTML += `
  <div>
    <input 
      type="radio"
      name="color"
      value="${color}"
      class="filter-color"
      id="${color.toLowerCase()}" 
      value="${color}" />
    <label for="${color}">${color}</label>
  </div>    `;
  });
 

  //renderiza filtros de tamanhos
  for (var i = 0; i < data.length; i++) {
    var size = data[i].size;
    sizeProduct.innerHTML += `
    <button id="button-size" type="button">${size}</button>
    `;
  }
}

console.log(inputColor);

document.addEventListener("DOMContentLoaded", handleData);
