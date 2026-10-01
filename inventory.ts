// Product Inventory Manager

// Interface for Product
interface Product {
    productId: number | string;
    productName: string;
    price: number;
    inStock: boolean;
    tags: string[];
}

// Store products
let products: Product[] = [];

// Function to add a product
function addProduct(product: Product): void {
    products.push(product);
    displayProducts();
}

// Function to calculate discounted price
function calculateDiscount(
    price: number,
    discountPercent: number = 10
): number {
    return price - (price * discountPercent / 100);
}
// Briefly highlight a stat card when its value changes
function bump(element: Element | null): void {
    if (!element) return;

    element.classList.remove("bump");
    void element.getBoundingClientRect();
    element.classList.add("bump");
}

// Count a number up to its new value
function animateValue(
    element: HTMLElement | null,
    to: number,
    format: (value: number) => string
): void {
    if (!element) return;

    const from = Number(element.dataset.value ?? "0");
    element.dataset.value = to.toString();

    if (from === to) {
        element.textContent = format(to);
        return;
    }

    const duration = 650;
    const start = performance.now();

    const step = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        element.textContent = format(
            Math.round(from + (to - from) * eased)
        );

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

function displayProducts(): void {
    const productList = document.getElementById("productList");
    const emptyMessage = document.getElementById("emptyMessage");

    if (!productList) return;

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
        } else {
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
    bump(totalProducts?.closest(".stat-card") ?? null);

    animateValue(stockProducts, stockCount, value => `${value}`);
    bump(stockProducts?.closest(".stat-card") ?? null);

    animateValue(
        totalValueElement,
        totalValue,
        value => `₹${value.toLocaleString()}`
    );
    bump(totalValueElement?.closest(".stat-card") ?? null);

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

function applyTheme(theme: string): void {
    document.documentElement.setAttribute("data-theme", theme);

    themeToggle?.setAttribute(
        "aria-pressed",
        theme === "dark" ? "true" : "false"
    );

    localStorage.setItem("inventory-theme", theme);
}

const savedTheme = localStorage.getItem("inventory-theme");
const prefersDark =
    window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(savedTheme ?? (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");

    applyTheme(current === "dark" ? "light" : "dark");
});

// Handle form submission
const form = document.getElementById("productForm") as HTMLFormElement;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const productName = (
        document.getElementById("productName") as HTMLInputElement
    ).value;

    const price = Number(
        (document.getElementById("price") as HTMLInputElement).value
    );

    const productId = (
        document.getElementById("productId") as HTMLInputElement
    ).value;

    const tags = (
        document.getElementById("tags") as HTMLInputElement
    ).value.split(",");

    const inStock = (
        document.getElementById("inStock") as HTMLInputElement
    ).checked;

    const product: Product = {
        productId: productId,
        productName: productName,
        price: price,
        inStock: inStock,
        tags: tags.map(tag => tag.trim())
    };

    addProduct(product);

    form.reset();
});
