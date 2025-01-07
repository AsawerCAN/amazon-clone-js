import { cart, removeFromCart, updateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

function renderCheckout() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) return;

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">Delivery date: Tuesday, June 21</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${formatCurrency(
              product.priceCents
            )}</div>
            <div class="product-quantity js-product-quantity-${product.id}">
              <span>
                Quantity: 
                <span class="quantity-label js-quantity-label-${product.id}">
                  ${cartItem.quantity}
                </span>
              </span>
              <span 
                class="update-quantity-link link-primary js-update-link" 
                data-product-id="${product.id}">
                Update
              </span>
              <span 
                class="delete-quantity-link link-primary js-delete-link" 
                data-product-id="${product.id}">
                Delete
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      updateCartQuantity();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const quantityContainer = document.querySelector(
        `.js-product-quantity-${productId}`
      );

      const currentQuantity = parseInt(
        document.querySelector(`.js-quantity-label-${productId}`).textContent,
        10
      );

      quantityContainer.innerHTML = `
        <input 
          type="number" 
          class="quantity-input js-quantity-input-${productId}" 
          value="${currentQuantity}" 
          min="1"
        />
        <button class="save-quantity-button js-save-button" data-product-id="${productId}">
          Save
        </button>
      `;

      document
        .querySelector(`.js-save-button[data-product-id="${productId}"]`)
        .addEventListener("click", () => {
          const input = document.querySelector(
            `.js-quantity-input-${productId}`
          );
          const newQuantity = parseInt(input.value, 10);

          if (!isNaN(newQuantity) && newQuantity > 0) {
            const cartItem = cart.find((item) => item.productId === productId);
            if (cartItem) {
              cartItem.quantity = newQuantity;
              localStorage.setItem("cart", JSON.stringify(cart));

              quantityContainer.innerHTML = `
                <span>
                  Quantity: 
                  <span class="quantity-label js-quantity-label-${productId}">
                    ${newQuantity}
                  </span>
                </span>
                <span 
                  class="update-quantity-link link-primary js-update-link" 
                  data-product-id="${productId}">
                  Update
                </span>
                <span 
                  class="delete-quantity-link link-primary js-delete-link" 
                  data-product-id="${productId}">
                  Delete
                </span>
              `;

              renderCheckout();
              updateCartQuantity();
            }
          } else {
            alert("Please enter a valid quantity greater than 0.");
          }
        });
    });
  });
}

renderCheckout();
updateCartQuantity();
