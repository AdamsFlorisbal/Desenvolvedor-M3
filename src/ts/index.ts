import { Product } from "./Product";
const nameProduct = document.querySelector("#product");
const colorProduct = document.querySelector(".filter-color");
const sizeProduct = document.querySelector(".filter-size");
const listenerBtnMore = document.querySelector(".btn-more");
var limitProduct = 9;
var indexProduct = 0;

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
  seeMore(data);
  renderProducts(data);
  renderFilters(data);
}

//Renderiza produtos
function renderProducts(data: Product[]) {
  if (data) {
    for (indexProduct; indexProduct < limitProduct; indexProduct++) {
      nameProduct.innerHTML += `
        <div class="product-list">
        <img src="${data[indexProduct].image}"/>
        <h1 class="product-name">${data[indexProduct].name}</h1>
        <h2 class="product-price">R$ ${data[indexProduct].price.toFixed(2)}</h2>
        <h3 class="product-installment">até ${
          data[indexProduct].parcelamento[0]
        }x de R$${data[indexProduct].parcelamento[1].toFixed(2)}</h3>
        <button class="btn-comprar">COMPRAR</button>
        </div>
        `;
    }
  }
}
// Mostra mais produtos
function seeMore(data: Product[]) {
  listenerBtnMore.addEventListener("click", () => {
    indexProduct = indexProduct;
    limitProduct += 3;
    renderProducts(data);
  });
}
// Renderiza todas os filtros possiveis
function renderFilters(data: Product[]) {
  //pega todas as cores
  var color: any[] | string = [];
  data.forEach((item) => {
    color.push(item.color);
  });
  //remove cores repetidas
  const arrayColor = color.filter(
    (item, index, arr) => arr.indexOf(item) == index
  );

  //renderiza filtros por cor

  for (let i = 0; i < arrayColor.length; i++) {
    console.log(arrayColor[i]);
    colorProduct.innerHTML += `
    <div>  
    <input 
      type="radio"
      name="color"
      onclick=""      
      id="${arrayColor[i]}"      
      value="${arrayColor[i].toLowerCase()}"    
      class="input-filter-color"      
       />
       <h1 class="teste">${arrayColor[i]}</h1>
       </div>          
  `;
  }
  //captura os cliques de cor
  var filterColor = document.querySelectorAll(".input-filter-color");
  filterColor.forEach((input) =>
    input.addEventListener("click", (event) => {
      console.log(event.currentTarget.value);
    })
  );

  //renderiza filtros de tamanhos
  var size: any[] | string = [];
  //Pega a matriz de tamanhos
  data.forEach((item) => {
    size.push(item.size);
  });
  // Converte em um unico array
  var arraySize = size.reduce((item, sub) => item.concat(sub), []);
  // Remove tamanhos repetidos
  const arraySizeFilter = arraySize.filter(
    (item: String, index: Number, arr: any[]) => arr.indexOf(item) == index
  );
  //renderiza tamanhos
  arraySizeFilter.forEach((size: String) => {
    sizeProduct.innerHTML += `
    <button id="button-size" type="button">${size}</button>
    `;
  });
  //captura os cliques de tamanhos
  const buttonSize = document.querySelectorAll("#button-size");
  buttonSize.forEach((button) =>
  button.addEventListener("click", (event) => {
    console.log(event.currentTarget.innerText);
  })
  
}

document.addEventListener("DOMContentLoaded", handleData);
