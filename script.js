// Número de WhatsApp del emprendimiento
const whatsappNumber = "59892610829";

// Carrito en memoria
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart-button");
  const cartList = document.getElementById("cart-list");
  const cartEmpty = document.getElementById("cart-empty");
  const cartWhatsappButton = document.getElementById("cart-whatsapp-button");
  const cartClearButton = document.getElementById("cart-clear-button");

  // Inicializar carruseles
  initCarousels();

  // Agregar productos al carrito
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.productName;
      const priceDisplay = btn.dataset.productPrice;

      addToCart(name, priceDisplay);
      renderCart();

      // Feedback visual
      const originalText = btn.textContent;
      btn.textContent = "Agregado ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 800);
    });
  });

  // Limpiar carrito
  cartClearButton.addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  // Enviar pedido por WhatsApp
  cartWhatsappButton.addEventListener("click", () => {
    if (cart.length === 0) return;

    const lines = cart.map((item) => {
      return `- ${item.name} (${item.priceDisplay}) x${item.quantity}`;
    });

    const message =
      "Hola, quiero hacer un pedido con los siguientes productos:\n\n" +
      lines.join("\n") +
      "\n\n¿Podrías confirmarme disponibilidad, forma de pago y envío?";

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  });

  // Función para agregar al carrito
  function addToCart(name, priceDisplay) {
    const existing = cart.find(
      (item) => item.name === name && item.priceDisplay === priceDisplay
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name,
        priceDisplay,
        quantity: 1,
      });
    }
  }

  // Función para eliminar un ítem del carrito por índice
  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  // Render del carrito
  function renderCart() {
    if (cart.length === 0) {
      cartEmpty.classList.remove("hidden");
      cartList.classList.add("hidden");
      cartList.innerHTML = "";
      cartWhatsappButton.disabled = true;
      cartClearButton.disabled = true;
      return;
    }

    cartEmpty.classList.add("hidden");
    cartList.classList.remove("hidden");
    cartWhatsappButton.disabled = false;
    cartClearButton.disabled = false;

    cartList.innerHTML = "";

    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "cart-item";

      const mainDiv = document.createElement("div");
      mainDiv.className = "cart-item-main";

      const nameEl = document.createElement("span");
      nameEl.className = "cart-item-name";
      nameEl.textContent = item.name;

      const priceEl = document.createElement("span");
      priceEl.className = "cart-item-price";
      priceEl.textContent = item.priceDisplay;

      const qtyEl = document.createElement("span");
      qtyEl.className = "cart-item-qty";
      qtyEl.textContent = `Cantidad: ${item.quantity}`;

      mainDiv.appendChild(nameEl);
      mainDiv.appendChild(priceEl);
      mainDiv.appendChild(qtyEl);

      const removeBtn = document.createElement("button");
      removeBtn.className = "cart-item-remove";
      removeBtn.textContent = "Quitar";
      removeBtn.addEventListener("click", () => removeFromCart(index));

      li.appendChild(mainDiv);
      li.appendChild(removeBtn);

      cartList.appendChild(li);
    });
  }

  // Inicializar vista vacía del carrito
  renderCart();
});

// =========================
// Carruseles genéricos
// =========================

function initCarousels() {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const items = carousel.querySelectorAll(".carousel-item");
    if (!items.length) return;

    let index = 0;
    const type = carousel.dataset.carousel;
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");

    function show(newIndex) {
      index = (newIndex + items.length) % items.length;

      items.forEach((item, i) => {
        const isActive = i === index;
        item.classList.toggle("active", isActive);

        const video = item.querySelector("video");
        if (video && !isActive) {
          video.pause();
        }
      });
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => show(index - 1));
      nextBtn.addEventListener("click", () => show(index + 1));
    }

    if (type === "hero") {
      // Auto-play en el carrusel de portada
      setInterval(() => {
        show(index + 1);
      }, 4000);
    }

    // Mostrar el primer ítem
    show(0);
  });
}
