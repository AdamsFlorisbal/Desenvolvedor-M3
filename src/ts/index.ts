import { Product } from "./Product";
//import fetchData from "./fetchData.js";

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
  const nameProduct = document.querySelector("#product")
  if (data) {
    var limit = 9
      for(var i = 0; i < limit; i++) {      
        nameProduct.innerHTML +=`
        <div class="product-list">
        <img src="${data[i].image}"/>
        <h1 class="product-name">${data[i].name}</h1>
        <h2 class="product-price">R$ ${data[i].price.toFixed(2)}</h2>
        <h3 class="product-installment">até ${data[i].parcelamento[0]}x de R$${data[i].parcelamento[1].toFixed(2)}</h3>
        <button class="btn-comprar">COMPRAR</button>
        </div>
        `      
    }   
    
    }
    for(var i = 0; i < data.length; i++){
      console.log(data[i].color)
    }
}
 
 

document.addEventListener("DOMContentLoaded", handleData);

