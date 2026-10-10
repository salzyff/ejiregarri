(() => {
  'use strict';
  const config = window.EJIRE_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const key = 'ejire-enquiry-v1';
  let bag = [];
  let toastTimeout;
  const dialogFocus = new WeakMap();
  let occasionNote = '';
  const findProduct = (id) => config.products.find((p) => p.id === id);
  const clampQuantity = (value) => Math.min(10000, Math.max(1, Math.round(Number(value) || 1)));

  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) {
      const unique = new Map();
      stored.forEach((item) => {
        if (item && findProduct(item.id)) unique.set(item.id, { id: item.id, quantity: clampQuantity(item.quantity) });
      });
      bag = [...unique.values()];
    }
  } catch { /* The enquiry bag also works when storage is unavailable. */ }

  function save() {
    try { localStorage.setItem(key, JSON.stringify(bag)); } catch { /* Use in-memory state. */ }
    renderBag();
  }
  function toast(message) {
    clearTimeout(toastTimeout);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
  }
  function openDialog(dialog) {
    if (dialog.open) return;
    dialogFocus.set(dialog, document.activeElement);
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function closeDialog(dialog) { dialog.close(); }
  $$('.bag-dialog, .occasion-dialog').forEach((dialog) => {
    dialog.addEventListener('close', () => {
      if (!$$('dialog').some((d) => d.open)) {
        document.body.classList.remove('modal-open');
        const previousFocus = dialogFocus.get(dialog);
        if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
      }
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
  });
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.close))));
  $$('[data-open-bag]').forEach((button) => button.addEventListener('click', () => openDialog($('#bag-dialog'))));

  function addProduct(id, quantity = 1, replace = false) {
    const product = findProduct(id);
    if (!product) return;
    const item = bag.find((entry) => entry.id === id);
    if (item) item.quantity = clampQuantity(replace ? quantity : item.quantity + quantity);
    else bag.push({ id, quantity: clampQuantity(quantity) });
    save();
    toast(`${product.name} added to your enquiry`);
  }
  $$('[data-add]').forEach((button) => button.addEventListener('click', () => addProduct(button.dataset.add)));

  function renderBag() {
    const count = bag.reduce((sum, item) => sum + item.quantity, 0);
    $$('[data-bag-count]').forEach((element) => { element.textContent = count > 99 ? '99+' : String(count); });
    const container = $('#bag-items');
    container.replaceChildren();
    bag.forEach((item) => {
      const product = findProduct(item.id);
      const row = document.createElement('div');
      row.className = 'bag-item';
      // All interpolated labels here come from the fixed, local catalogue.
      row.innerHTML = `<div class="bag-item-icon"><img src="${product.image}" alt="" width="55" height="65"></div><div class="bag-item-info"><h3>${product.name}</h3><p>${product.kind} · ${product.unit}</p></div><div><div class="quantity-controls"><button type="button" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button><input type="number" min="1" max="10000" step="1" value="${item.quantity}" aria-label="Quantity for ${product.name}"><button type="button" data-change="1" aria-label="Increase ${product.name} quantity">+</button></div><button type="button" class="remove-item" aria-label="Remove ${product.name}">Remove</button></div>`;
      row.querySelectorAll('[data-change]').forEach((button) => {
        button.disabled = button.dataset.change === '-1' ? item.quantity === 1 : item.quantity === 10000;
        button.addEventListener('click', () => {
          const change = button.dataset.change;
          item.quantity = clampQuantity(item.quantity + Number(change));
          save();
          const newRow = container.children[bag.indexOf(item)];
          newRow?.querySelector(`[data-change="${change}"]`)?.focus();
        });
      });
      row.querySelector('input').addEventListener('change', (event) => {
        item.quantity = clampQuantity(event.target.value);
        save();
        container.children[bag.indexOf(item)]?.querySelector('input')?.focus();
      });
      row.querySelector('.remove-item').addEventListener('click', () => {
        bag = bag.filter((entry) => entry.id !== item.id);
        save();
        container.querySelector('.remove-item')?.focus();
        toast(`${product.name} removed`);
      });
      container.append(row);
    });
    $('#empty-bag').hidden = bag.length > 0;
    $('#enquiry-form').hidden = bag.length === 0;
    updateEmail();
  }
  function buildMessage() {
    const form = $('#enquiry-form');
    const name = form.elements.customer.value.trim();
    const location = form.elements.location.value.trim();
    const notes = form.elements.notes.value.trim();
    const lines = [`Hello ${config.brand}! I'd like to enquire about:`, '', ...bag.map((item) => `• ${findProduct(item.id).name}: ${item.quantity} ${findProduct(item.id).unit}`)];
    if (name) lines.push('', `Name: ${name}`);
    if (location) lines.push(`Delivery location: ${location}`);
    if (notes) lines.push('', `Preferences / notes: ${notes}`);
    lines.push('', 'Please confirm availability, pack sizes, prices and delivery options. Thank you!');
    return lines.join('\n');
  }
  function updateEmail() {
    $('#email-enquiry').href = `mailto:${config.email}?subject=${encodeURIComponent('Order enquiry — Ejire Onigarri')}&body=${encodeURIComponent(buildMessage())}`;
  }
  $('#enquiry-form').addEventListener('input', updateEmail);
  $('#enquiry-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bag.length || !event.currentTarget.reportValidity()) return;
    const form = event.currentTarget;
    if (!form.elements.customer.value.trim() || !form.elements.location.value.trim()) {
      toast('Please enter your name and delivery location.');
      return;
    }
    const url = `https://wa.me/${config.phone}?text=${encodeURIComponent(buildMessage())}`;
    // Runs synchronously from the click so the browser can open the compose screen.
    window.open(url, '_blank', 'noopener,noreferrer');
    toast('Your enquiry is ready to review in WhatsApp.');
  });

  $('#open-occasion').addEventListener('click', () => openDialog($('#occasion-dialog')));
  const localDate = new Date();
  const year = localDate.getFullYear();
  const dateMinimum = `${year}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  $('#occasion-form').elements.date.min = dateMinimum;
  $('#occasion-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const newNote = `Occasion: ${form.elements.occasion.value}\nEvent date: ${form.elements.date.value}\nNumber of souvenir packs: ${form.elements.packs.value}${form.elements.ideas.value.trim() ? `\nPackaging ideas: ${form.elements.ideas.value.trim()}` : ''}`;
    const notesField = $('#enquiry-form').elements.notes;
    const previousNotes = notesField.value;
    const preserved = occasionNote ? previousNotes.replace(occasionNote, '').trim() : previousNotes.trim();
    notesField.value = [preserved, newNote].filter(Boolean).join('\n\n').slice(0, 1500);
    occasionNote = newNote;
    addProduct('souvenirs', Number(form.elements.packs.value), true);
    closeDialog($('#occasion-dialog'));
    openDialog($('#bag-dialog'));
    updateEmail();
  });

  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); mobileNav.hidden = true; }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  });
  $$('#mobile-nav a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => { if (!event.target.closest('.header')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  const moments = {
    soak: { kicker: 'THE CLASSIC COMFORT', title: 'Cold water.<br>Good garri.<br><em>No long story.</em>', description: 'A splash of cold water, a little milk if that’s your thing, and groundnuts on the side. Some combinations just get you.', image: 'assets/bowl-placeholder.svg' },
    share: { kicker: 'GOOD COMPANY, GOOD CRUNCH', title: 'Pull up a chair.<br><em>There’s a bowl<br>for you too.</em>', description: 'An afternoon catch-up. A familiar snack. Put a bowl on the table and let the conversation do its thing.', image: 'assets/garri-placeholder.svg' },
    gift: { kicker: 'A LITTLE JOY TO TAKE HOME', title: 'Not just a pack.<br><em>A thoughtful<br>little gesture.</em>', description: 'For guests, friends or someone who deserves a little something. Ask about souvenir options for your occasion.', image: 'assets/gift-placeholder.svg' }
  };
  const tabs = $$('[data-moment]');
  function setMoment(button) {
    const moment = moments[button.dataset.moment];
    tabs.forEach((tab) => { tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1; });
    $('#moment-panel').setAttribute('aria-labelledby', button.id);
    $('#moment-kicker').textContent = moment.kicker;
    $('#moment-title').innerHTML = moment.title;
    $('#moment-description').textContent = moment.description;
    const artwork = $('#moment-art');
    const descriptions = { soak: 'Illustrated bowl of garri, a serving placeholder', share: 'Illustrated Ejire garri pouch, a sharing placeholder', gift: 'Illustrated Ejire gift pack, a souvenir placeholder' };
    artwork.src = moment.image;
    artwork.alt = descriptions[button.dataset.moment];
  }
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => setMoment(button));
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); setMoment(tabs[next]); tabs[next].focus(); }
    });
  });
  $('#year').textContent = String(year);
  renderBag();
})();
