import { Product } from "./Product";
import { Size } from "./Size";
const nameProduct = document.querySelector("#product");
const nameProductFilter = document.querySelector("#product-filter");
const colorProduct = document.querySelector(".filter-color");
const sizeProduct = document.querySelector(".filter-size");
const listenerBtnMore = document.querySelector(".btn-more");

var count = 0;
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
  renderProducts(data);
  renderFilters(data); 
  resposiveFilter();
}

//ordena os produtos

const lowerPrice = document.querySelector(".lower-price")
lowerPrice.addEventListener("click", () =>{
  orderByPriceLow();
})

const higherPrice = document.querySelector(".higher-price")
higherPrice.addEventListener("click", () =>{
  orderByPriceHigh();
})

const lowerPriceDesk = document.querySelector(".lower-price-desk")
lowerPriceDesk.addEventListener("click", () =>{
  orderByPriceLow();
})

const higherPriceDesk = document.querySelector(".higher-price-desk")
higherPriceDesk.addEventListener("click", () =>{
  orderByPriceHigh();
})


function orderByPriceLow() {
  const price = document.querySelectorAll("#product .product-list");
  let product = [].map.call(price, function (element: Element) {
    return element;
  });  
  product.sort(function (a: number, b: number) {
    var ca = parseInt(a.id);
    var cb = parseInt(b.id);
    return  cb - ca;    // usar if para trocar o
  });  
  let orderProduct = document.querySelector("#product");
  for (var i = 0; i < product.length; i++) {
    orderProduct.appendChild(product[i]);    
  }
}
function orderByPriceHigh() {
  const price = document.querySelectorAll("#product .product-list");
  let product = [].map.call(price, function (element: Element) {
    return element;
  });  
  product.sort(function (a: number, b: number) {
    var ca = parseInt(a.id);
    var cb = parseInt(b.id);
    return  ca - cb;    // usar if para trocar o
  });  
  let orderProduct = document.querySelector("#product");
  for (var i = 0; i < product.length; i++) {
    orderProduct.appendChild(product[i]);    
  }
}

//Renderiza produtos
function renderProductsList(data: Product[]) {
  nameProduct.innerHTML += `
        <div id="${data[indexProduct].price}" class="product-list">
        <img src="${data[indexProduct].image}"/>
        <h1 class="product-name">${data[indexProduct].name}</h1>
        <div  class="product-price">R$ ${data[indexProduct].price.toFixed(2)}</div>
        <h3 class="product-installment">até ${
          data[indexProduct].parcelamento[0]
        }x de R$${data[indexProduct].parcelamento[1].toFixed(2)}</h3>
        <button class="btn-buy">COMPRAR</button>
        </div>
        `;
}

function renderProducts(data: Product[]) {
  if (data) {
    for (indexProduct; indexProduct < limitProduct; indexProduct++) {
      renderProductsList(data);
      const btnBuy = document.querySelectorAll(".btn-buy");
      btnBuy.forEach((btn) => {
        btn.addEventListener("click", () => {
          count++;
          let contadorText = document.querySelector("#count");
          contadorText.classList.add("count");
          contadorText.innerHTML = `${count}`;
        });
      });
    }
    seeMore(data);
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
  var color: Size | Product[] = [];
  data.forEach((item) => {
    color.push(item.color);
  });
  //remove cores repetidas
  const arrayColor = color.filter(
    (item, index, arr) => arr.indexOf(item) == index
  );

  //renderiza filtros por cor

  for (let i = 0; i < arrayColor.length; i++) {
    colorProduct.innerHTML += `
    <div class="content-input-filter-color">  
    <input 
      type="checkbox"
      name="color"      
      id="${arrayColor[i]}"      
      value="${arrayColor[i].toLowerCase()}"    
      class="input-filter-color"      
       />
       <h1>${arrayColor[i]}</h1>
       </div>          
  `;
  }

  //captura os cliques de cor e renderiza produtos filtrados
  const filterColor = document.querySelectorAll(".input-filter-color");
  filterColor.forEach((input) => {
    input.addEventListener("click", (event: any) => {
      nameProduct.classList.add("hide");
      var valueFilteColor = event.currentTarget.value;
      data.forEach((item) => {
        if (valueFilteColor === item.color.toLocaleLowerCase()) {
          nameProductFilter.innerHTML += ` 
        <div class="product-list-filter">
        <img src="${item.image}"/>
        <h1 class="product-name">${item.name}</h1>
        <h2 class="product-price">R$ ${item.price.toFixed(2)}</h2>
        <h3 class="product-installment">até ${
          data[indexProduct].parcelamento[0]
        }x de R$${data[indexProduct].parcelamento[1].toFixed(2)}</h3>
        <button class="btn-buy">COMPRAR</button>
        </div>
        `;
          const btnBuy = document.querySelectorAll(".btn-buy");
          btnBuy.forEach((btn) => {
            btn.addEventListener("click", () => {
              count++;
              let contadorText = document.querySelector("#count");
              contadorText.classList.add("count");
              contadorText.innerHTML = `${count}`;
            });
          });
        }
      });
    });
  });

  //renderiza filtros de tamanhos
  var size: Size | string[] = [];
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
    <div class="content-input-filter-size">
    <button class="input-filter-size" id="button-size" type="button">${size}</button>
    </div>
    
    `;
  });
  //captura os cliques de tamanhos
  const buttonSize = document.querySelectorAll("#button-size");

  buttonSize.forEach((button) => {
    button.addEventListener("click", (event: any) => {
      nameProduct.classList.add("hide");
      var valueFilteSize = event.currentTarget.innerText;
      data.map((item) => {
        item.size.map(() => {});
        for (let i = 0; i < item.size.length; i++) {
          if (valueFilteSize == item.size[i]) {
            nameProductFilter.innerHTML += `
      <div class="product-list">
      <img src="${item.image}"/>
      <h1 class="product-name">${item.name}</h1>
      <h2 class="product-price">R$ ${item.price.toFixed(2)}</h2>
      <h3 class="product-installment">até ${
        data[indexProduct].parcelamento[0]
      }x de R$${data[indexProduct].parcelamento[1].toFixed(2)}</h3>
      <button class="btn-buy">COMPRAR</button>
      </div>
      `;
            const btnBuy = document.querySelectorAll(".btn-buy");
            btnBuy.forEach((btn) => {
              btn.addEventListener("click", () => {
                count++;
                let contadorText = document.querySelector("#count");
                contadorText.classList.add("count");
                contadorText.innerHTML = `${count}`;
              });
            });
          }
        }
      });
    });
  });
  //renderiza filtros de preço
  const inputPrecos = document.querySelectorAll('input[name="precos"]');
  inputPrecos.forEach((element: any) => {
    element.addEventListener("click", () => {
      let value: number = element.value;
      let prices: number = data[indexProduct].price;
      console.log(Number(element.value));
      console.log(Number(prices));
      if (value == 50 && prices <= 100) {
        console.log(Number(prices));
        renderProducts(data);
      } else if (value == 150 && prices <= 150 && prices > 50) {
        renderProducts(data);
      } else if (value == 300 && prices <= 300 && prices > 150) {
        renderProducts(data);
      } else if (value == 500 && prices <= 500 && prices > 300) {
        renderProducts(data);
      } else if (value == 501 && prices > 500) {
        renderProducts(data);
      }
    });
  });
}

//Abre e fecha menus quando está com tela menor que 780px
function resposiveFilter() {
  const btnOrder: Element = document.querySelector(".responsive-order");
  const nav: Element = document.querySelector("#nav");
  const btnNav: Element = document.querySelector("#btn-mobile");
  btnNav.addEventListener("click", () => {
    nav.classList.remove("nav");
  });
  btnOrder.addEventListener("click", () => {
    nav.classList.add("nav");
  });
  const btnFilter: Element = document.querySelector(".responsive-filter");
  const filterShow: Element = document.querySelector(".container-filter");
  const btnFilterShow: Element = document.querySelector("#btn-mobile-filter");
  btnFilterShow.addEventListener("click", () => {
    filterShow.classList.remove("container-filter-show");
  });
  btnFilter.addEventListener("click", () => {
    filterShow.classList.add("container-filter-show");
  });
}

const btnNav = document.querySelector("#btn-desk");
const ulNav = document.querySelector("#menu-desk");
btnNav.addEventListener("click", () => {
  ulNav.classList.toggle("nav-ul");
});

const color = document.querySelector(".color");
const colorNone = document.querySelector(".filter-color");
const sizeNone = document.querySelector(".container-filter-size");
const colorPrice = document.querySelector(".filter-price");
color.addEventListener("click", () => {
  colorNone.classList.toggle("nav-ul");
});
const size = document.querySelector(".size");

size.addEventListener("click", () => {
  sizeNone.classList.toggle("nav-ul");
});
const price = document.querySelector(".price");

price.addEventListener("click", () => {
  colorPrice.classList.toggle("nav-ul");
});

document.addEventListener("DOMContentLoaded", handleData);
