/* ===== MOMMA MICKY'S — SCRIPT.JS ===== */

// ─── PRODUCTS DATA ───────────────────────────────────────────
const products = [
  { id: 1, name: "Triple Chocolate Fudge Cake", cat: "cakes", price: 18, stars: 5, badge: "Popular", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
  { id: 2, name: "Strawberry Dream Cake", cat: "cakes", price: 20, stars: 5, badge: "New", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
  { id: 3, name: "Lemon Drizzle Loaf", cat: "bread", price: 12, stars: 4, badge: null, img: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&q=80" },
  { id: 4, name: "Almond Croissant", cat: "pastries", price: 6, stars: 5, badge: "Bestseller", img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80" },
  { id: 5, name: "Pink Velvet Cupcake", cat: "cupcakes", price: 5, stars: 5, badge: "Favourite", img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&q=80" },
  { id: 6, name: "Choco Chip Cookies (doz)", cat: "cookies", price: 9, stars: 4, badge: null, img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80" },
  { id: 7, name: "Red Velvet Brownie", cat: "brownies", price: 8, stars: 5, badge: "New", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
  { id: 8, name: "Artisan Sourdough", cat: "bread", price: 10, stars: 4, badge: null, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
  { id: 9, name: "Tiramisu Cake", cat: "cakes", price: 22, stars: 5, badge: "Premium", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80" },
  { id: 10, name: "Vanilla Bean Cupcake (6pk)", cat: "cupcakes", price: 14, stars: 5, badge: "Popular", img: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&q=80" },
  { id: 11, name: "Butter Croissant", cat: "pastries", price: 5, stars: 4, badge: null, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
  { id: 12, name: "Peanut Butter Cookies (doz)", cat: "cookies", price: 10, stars: 4, badge: null, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80" },
];

// ─── STATE ─────────────────────────────────────────────────
let cart = [];
let currentPage = 0;
let currentFilter = "all";
const itemsPerPage = 8;

// ─── PRELOADER ─────────────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hide");
  }, 1500);
});

// ─── NAVBAR ────────────────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  document.getElementById("backToTop").classList.toggle("show", window.scrollY > 400);
});

// Hamburger
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"));
});

// ─── HERO SLIDER ───────────────────────────────────────────
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const AUTOPLAY_MS = 5000;
let autoplayId = null;

function goToSlide(n) {
  if (!slides.length) return;

  const prevIndex = slideIndex;
  slideIndex = (n + slides.length) % slides.length;

  if (slides[prevIndex]) slides[prevIndex].classList.remove("active");
  if (dots[prevIndex]) dots[prevIndex].classList.remove("active");
  if (slides[slideIndex]) slides[slideIndex].classList.add("active");
  if (dots[slideIndex]) dots[slideIndex].classList.add("active");
}

function startAutoplay() {
  if (!slides.length) return;
  autoplayId = setInterval(() => goToSlide(slideIndex + 1), AUTOPLAY_MS);
}

function resetAutoplay() {
  if (autoplayId) clearInterval(autoplayId);
  startAutoplay();
}

// Ensure we start on whatever slide is marked active in HTML
const initialActive = Array.from(slides).findIndex(s => s.classList.contains("active"));
slideIndex = initialActive >= 0 ? initialActive : 0;

document.getElementById("prevSlide")?.addEventListener("click", () => {
  goToSlide(slideIndex - 1);
  resetAutoplay();
});

document.getElementById("nextSlide")?.addEventListener("click", () => {
  goToSlide(slideIndex + 1);
  resetAutoplay();
});

dots.forEach(dot =>
  dot.addEventListener("click", () => {
    goToSlide(+dot.dataset.index);
    resetAutoplay();
  })
);

startAutoplay();

// ─── CATEGORY CARDS ────────────────────────────────────────
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    const filter = card.dataset.filter;
    setFilter(filter);
    document.getElementById("featured").scrollIntoView({ behavior: "smooth" });
  });
});

// ─── PRODUCT GRID ──────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const filtered = currentFilter === "all" ? products : products.filter(p => p.cat === currentFilter);
  const start = currentPage * itemsPerPage;
  const slice = filtered.slice(start, start + itemsPerPage);

  grid.innerHTML = "";
  if (slice.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px 0">No items in this category yet. Check back soon! 🎂</p>`;
    return;
  }

  slice.forEach(p => {
    const stars = "★".repeat(p.stars) + "☆".repeat(5 - p.stars);
    const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
    grid.innerHTML += `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img">
          ${badge}
          <button class="product-fav" onclick="toggleFav(this)" title="Wishlist">🤍</button>
          <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x300/FDE8EC/F2637A?text=🎂'"/>
        </div>
        <div class="product-info">
          <div class="cat-tag">${p.cat}</div>
          <h4>${p.name}</h4>
          <div class="product-stars">${stars}</div>
          <div class="product-footer">
            <span class="product-price">$${p.price}.00</span>
            <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
  });

  // Pagination buttons
  document.getElementById("prevPage").disabled = currentPage === 0;
  document.getElementById("nextPage").disabled = start + itemsPerPage >= filtered.length;
  document.getElementById("prevPage").style.opacity = currentPage === 0 ? "0.4" : "1";
  document.getElementById("nextPage").style.opacity = start + itemsPerPage >= filtered.length ? "0.4" : "1";
}

function setFilter(cat) {
  currentFilter = cat;
  currentPage = 0;
  // sync filter tabs
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === cat || (cat !== "all" && btn.dataset.cat === cat));
    if (btn.dataset.cat === "all" && cat === "all") btn.classList.add("active");
  });
  renderProducts();
}

// Filter tabs
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    setFilter(btn.dataset.cat);
  });
});

// Pagination
document.getElementById("prevPage").addEventListener("click", () => { if (currentPage > 0) { currentPage--; renderProducts(); document.getElementById("featured").scrollIntoView({ behavior: "smooth" }); } });
document.getElementById("nextPage").addEventListener("click", () => { currentPage++; renderProducts(); document.getElementById("featured").scrollIntoView({ behavior: "smooth" }); });

renderProducts();

// ─── WISHLIST HEART ────────────────────────────────────────
function toggleFav(btn) {
  btn.textContent = btn.textContent === "🤍" ? "❤️" : "🤍";
}

// ─── CART ──────────────────────────────────────────────────
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  openCartDrawer();
  showToast(`${product.name} added to cart! 🎂`);
}

function addToCartDirect(name, price) {
  const existing = cart.find(c => c.name === name);
  if (existing) { existing.qty++; }
  else { cart.push({ id: Date.now(), name, price, qty: 1 }); }
  updateCartUI();
  openCartDrawer();
  showToast(`${name} added to cart! 🎂`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((a, c) => a + c.qty, 0);
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  document.getElementById("cartCount").textContent = count;

  // Cart drawer
  const body = document.getElementById("cartDrawerBody");
  if (cart.length === 0) {
    body.innerHTML = `<div style="text-align:center;padding:60px 0;color:var(--text-muted)"><div style="font-size:48px;margin-bottom:16px">🛒</div><p>Your cart is empty.<br/>Add some treats!</p></div>`;
    document.getElementById("cartDrawerTotal").textContent = "";
  } else {
    body.innerHTML = cart.map(c => `
      <div class="cart-item-row">
        <div>
          <div class="cart-item-name">${c.name}</div>
          <div style="font-size:13px;color:var(--text-muted)">Qty: ${c.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="cart-item-price">$${(c.price * c.qty).toFixed(2)}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${c.id})"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>`).join("");
    document.getElementById("cartDrawerTotal").textContent = `Total: $${total.toFixed(2)}`;
  }

  // Order section cart
  const orderCartItems = document.getElementById("cartItems");
  const orderCartTotal = document.getElementById("cartTotal");
  if (cart.length === 0) {
    orderCartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    orderCartTotal.textContent = "";
  } else {
    orderCartItems.innerHTML = cart.map(c => `
      <div class="cart-item-row">
        <span class="cart-item-name">${c.name} × ${c.qty}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="cart-item-price">$${(c.price * c.qty).toFixed(2)}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${c.id})"><i class="fas fa-times"></i></button>
        </div>
      </div>`).join("");
    orderCartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}

// Cart drawer
function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("show");
}
function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("show");
}
document.getElementById("cartBtn").addEventListener("click", openCartDrawer);
document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
document.getElementById("cartOverlay").addEventListener("click", closeCartDrawer);

// ─── TOAST NOTIFICATION ────────────────────────────────────
function showToast(msg) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = msg;
  toast.style.cssText = `
    position:fixed;bottom:90px;right:32px;background:var(--brown);color:white;
    padding:14px 24px;border-radius:var(--radius);box-shadow:var(--shadow-lg);
    font-size:14px;font-weight:600;z-index:2000;
    animation:slideInToast 0.4s ease forwards;
  `;
  document.head.insertAdjacentHTML("beforeend", `<style>@keyframes slideInToast{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}</style>`);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── ORDER FORM ────────────────────────────────────────────
document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("fname").value.trim();
  const phone = document.getElementById("fphone").value.trim();
  if (!name || !phone) { showToast("Please fill in your name and phone number."); return; }

  // Clear cart after order
  cart = [];
  updateCartUI();

  document.getElementById("orderForm").classList.add("hide");
  document.getElementById("orderSuccess").classList.add("show");
  showToast("🎉 Order placed successfully!");
});

function resetForm() {
  document.getElementById("orderForm").reset();
  document.getElementById("orderForm").classList.remove("hide");
  document.getElementById("orderSuccess").classList.remove("show");
}

// ─── NEWSLETTER ────────────────────────────────────────────
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("🎉 You're subscribed! Sweet deals coming your way.");
  e.target.reset();
});

// ─── BACK TO TOP ───────────────────────────────────────────
document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ─── REVEAL ON SCROLL ──────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ─── ACTIVE NAV LINK ───────────────────────────────────────
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.toggle("active-link", link.getAttribute("href") === `#${current}`);
  });
});