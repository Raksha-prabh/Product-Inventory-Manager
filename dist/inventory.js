"use strict";
// Product Inventory Manager
// Store products
let products = [];
// Function to add a product
function addProduct(product) {
    products.push(product);
    displayProducts();
}
// Function to calculate discounted price
function calculateDiscount(price, discountPercent = 10) {
    return price - (price * discountPercent / 100);
}
// Briefly highlight a stat card when its value changes
function bump(element) {
    if (!element)
        return;
    element.classList.remove("bump");
    void element.getBoundingClientRect();
    element.classList.add("bump");
}
// Count a number up to its new value
function animateValue(element, to, format) {
    var _a;
    if (!element)
        return;
    const from = Number((_a = element.dataset.value) !== null && _a !== void 0 ? _a : "0");
    element.dataset.value = to.toString();
    if (from === to) {
        element.textContent = format(to);
        return;
    }
    const duration = 650;
    const start = performance.now();
    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = format(Math.round(from + (to - from) * eased));
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}
function displayProducts() {
    var _a, _b, _c;
    const productList = document.getElementById("productList");
    const emptyMessage = document.getElementById("emptyMessage");
    if (!productList)
        return;
    productList.innerHTML = "";
    let totalValue = 0;
    let stockCount = 0;
    products.forEach((product) => {
        const row = document.createElement("tr");
        const stockBadge = product.inStock
            ? `<span class="badge in-stock">✓ In Stock</span>`
            : `<span class="badge out-of-stock">✕ Out of Stock</span>`;
        row.innerHTML = `
            <td>
                <span class="id">${product.productId}</span>
            </td>
            <td><strong>${product.productName}</strong></td>
            <td>
                <span class="price">₹${product.price.toLocaleString()}</span>
            </td>
            <td>${stockBadge}</td>
            <td>
                ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </td>
        `;
        productList.appendChild(row);
        totalValue += product.price;
        if (product.inStock) {
            stockCount++;
        }
    });
    // Show or hide the empty message
    if (emptyMessage) {
        if (products.length === 0) {
            emptyMessage.style.display = "block";
        }
        else {
            emptyMessage.style.display = "none";
        }
    }
    // Update statistics
    const totalProducts = document.getElementById("totalProducts");
    const stockProducts = document.getElementById("stockProducts");
    const totalValueElement = document.getElementById("totalValue");
    const productCount = document.getElementById("productCount");
    const stockBar = document.getElementById("stockBar");
    const stockPercent = document.getElementById("stockPercent");
    animateValue(totalProducts, products.length, value => `${value}`);
    bump((_a = totalProducts === null || totalProducts === void 0 ? void 0 : totalProducts.closest(".stat-card")) !== null && _a !== void 0 ? _a : null);
    animateValue(stockProducts, stockCount, value => `${value}`);
    bump((_b = stockProducts === null || stockProducts === void 0 ? void 0 : stockProducts.closest(".stat-card")) !== null && _b !== void 0 ? _b : null);
    animateValue(totalValueElement, totalValue, value => `₹${value.toLocaleString()}`);
    bump((_c = totalValueElement === null || totalValueElement === void 0 ? void 0 : totalValueElement.closest(".stat-card")) !== null && _c !== void 0 ? _c : null);
    // In-stock share of the inventory
    const stockRatio = products.length === 0
        ? 0
        : Math.round(stockCount / products.length * 100);
    if (stockBar) {
        stockBar.style.width = `${stockRatio}%`;
    }
    animateValue(stockPercent, stockRatio, value => `${value}%`);
    if (productCount) {
        productCount.textContent =
            `${products.length} Product${products.length === 1 ? "" : "s"}`;
    }
}
// Theme switching
const themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle === null || themeToggle === void 0 ? void 0 : themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    localStorage.setItem("inventory-theme", theme);
}
const savedTheme = localStorage.getItem("inventory-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme !== null && savedTheme !== void 0 ? savedTheme : (prefersDark ? "dark" : "light"));
themeToggle === null || themeToggle === void 0 ? void 0 : themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
});
// Handle form submission
const form = document.getElementById("productForm");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const productName = document.getElementById("productName").value;
    const price = Number(document.getElementById("price").value);
    const productId = document.getElementById("productId").value;
    const tags = document.getElementById("tags").value.split(",");
    const inStock = document.getElementById("inStock").checked;
    const product = {
        productId: productId,
        productName: productName,
        price: price,
        inStock: inStock,
        tags: tags.map(tag => tag.trim())
    };
    addProduct(product);
    form.reset();
});
