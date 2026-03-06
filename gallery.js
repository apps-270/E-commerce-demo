
const products = [
{
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    image: "https://images.unsplash.com/photo-1518441902112-1b6b7bcb1d32?w=500"
},
{
    id: 2,
    name: "Smart Watch",
    price: 3999,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500"
},
{
    id: 3,
    name: "Gaming Mouse",
    price: 1299,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500"
},
{
    id: 4,
    name: "Laptop",
    price: 59999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
},
{
    id: 5,
    name: "Sneakers",
    price: 1999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
}
];


function loadProducts() {

const container = document.getElementById("products");

container.innerHTML = "";

products.forEach(product => {

container.innerHTML += `

<div class="col-lg-3 col-md-4 col-sm-6">

<div class="card shadow-sm h-100">

<img src="${product.image}" class="card-img-top" alt="${product.name}">

<div class="card-body text-center">

<h5>${product.name}</h5>

<p class="text-success fw-bold">₹${product.price}</p>

<button class="btn btn-primary w-100" onclick="buyProduct(${product.id})">
Buy Now
</button>

</div>

</div>

</div>

`;

});

}


function buyProduct(id){

const product = products.find(p => p.id === id);

alert(product.name + " purchased successfully!");

}


window.onload = loadProducts;
