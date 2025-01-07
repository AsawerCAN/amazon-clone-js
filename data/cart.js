export function updateCartQuantity() {
  let cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const cartQuantityElement = document.querySelectorAll(".js-cart-quantity");
  cartQuantityElement.forEach((element) => {
    element.innerHTML = cartQuantity > 0 ? cartQuantity : "0";
  });
}

export function addToCart(productId, quantity) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  saveToStorage();
  updateCartQuantity();
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToStorage();
  updateCartQuantity();
}
