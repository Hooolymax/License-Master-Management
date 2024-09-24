
const products = [
    { id: 1, title: "Windows 11 Home", price: 50 },
    { id: 2, title: "Windows 11 Entreprise", price: 50 },
    { id: 3, title: "Windows 10 Pro", price: 50 },
    { id: 4, title: "Microsoft Office Professional Plus 2021", price: 50 },
    { id: 5, title: "Kaspersky Internet Security", price: 50 }
];

// add a product to the cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    alert(`${product.title} added to cart`);
}

// get cart items
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}




document.addEventListener('DOMContentLoaded', () => {
    const cartItems = getCartItems();
    const cartContainer = document.getElementById('cartItem');
    let cartHTML = '';

    if (cartItems.length === 0) {
        cartHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItems.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <p>${item.title}</p>
                    <h2>$${item.price}</h2>
                    <!-- Add a remove button if needed -->
                </div>
            `;
        });
    }

    cartContainer.innerHTML = cartHTML;
});