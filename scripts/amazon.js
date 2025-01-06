import { products } from "../data/products.js";

const TIMEOUT_DURATION = 2000;
const DEFAULT_QUANTITY = 1;
const MAX_QUANTITY = 10;

const formatPrice = (priceCents) => `$${(priceCents / 100).toFixed(2)}`;

const createQuantityOptions = (maxQty = MAX_QUANTITY) =>
  Array.from({ length: maxQty }, (_, i) => i + 1)
    .map(
      (num) =>
        `<option value="${num}"${num === 1 ? " selected" : ""}>${num}</option>`
    )
    .join("");

class CartManager {
  constructor() {
    this.cart = new Map();
    this.messageTimeouts = new Map();
  }

  updateCartQuantity() {
    const totalQuantity = Array.from(this.cart.values()).reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    document.querySelector(".js-cart-quantity").textContent = totalQuantity;
  }

  addToCart(productId, quantity) {
    const existingItem = this.cart.get(productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cart.set(productId, existingItem);
    } else {
      this.cart.set(productId, { productId, quantity });
    }

    this.updateCartQuantity();
    this.showAddedMessage(productId);
  }

  showAddedMessage(productId) {
    const addedMessage = document.querySelector(
      `.js-added-to-cart-selector-${productId}`
    );
    if (!addedMessage) return;

    addedMessage.classList.add("added-to-cart-visible");

    const existingTimeout = this.messageTimeouts.get(productId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove("added-to-cart-visible");
      this.messageTimeouts.delete(productId);
    }, TIMEOUT_DURATION);

    this.messageTimeouts.set(productId, timeoutId);
  }
}

class ProductGrid {
  constructor(products, cartManager) {
    this.products = products;
    this.cartManager = cartManager;
    this.gridElement = document.querySelector(".js-products-grid");
  }

  createProductHTML(product) {
    const { id, image, name, rating, priceCents } = product;

    return `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${image}" alt="${name}" loading="lazy" />
        </div>
        
        <div class="product-name limit-text-to-2-lines">
          ${name}
        </div>
        
        <div class="product-rating-container">
          <img 
            class="product-rating-stars" 
            src="images/ratings/rating-${rating.stars * 10}.png" 
            alt="${rating.stars} stars"
          />
          <div class="product-rating-count link-primary">
            ${rating.count}
          </div>
        </div>
        
        <div class="product-price">
          ${formatPrice(priceCents)}
        </div>
        
        <div class="product-quantity-container">
          <select class="js-quantity-selector-${id}">
            ${createQuantityOptions()}
          </select>
        </div>
        
        <div class="product-spacer"></div>
        
        <div class="added-to-cart js-added-to-cart-selector-${id}">
          <img src="images/icons/checkmark.png" alt="Added to cart" />
          Added
        </div>
        
        <button 
          class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${id}"
        >
          Add to Cart
        </button>
      </div>
    `;
  }

  render() {
    const productsHTML = this.products
      .map((product) => this.createProductHTML(product))
      .join("");

    this.gridElement.innerHTML = productsHTML;
    this.attachEventListeners();
  }

  attachEventListeners() {
    const addToCartButtons =
      this.gridElement.querySelectorAll(".js-add-to-cart");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        const quantitySelector = document.querySelector(
          `.js-quantity-selector-${productId}`
        );
        const quantity = Number(quantitySelector.value);

        this.cartManager.addToCart(productId, quantity);
      });
    });
  }
}

const cartManager = new CartManager();
const productGrid = new ProductGrid(products, cartManager);
productGrid.render();

export { cartManager, productGrid };
