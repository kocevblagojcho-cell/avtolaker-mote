class Particles {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      particleColors: options.particleColors || ['#00ffff', '#ff00ff', '#ffff00', '#ffffff'],
      particleCount: options.particleCount || 80,
      particleSpread: options.particleSpread || 10,
      speed: options.speed || 0.08,
      particleBaseSize: options.particleBaseSize || 4,
      moveParticlesOnHover: options.moveParticlesOnHover !== false,
      alphaParticles: options.alphaParticles || true,
      disableRotation: options.disableRotation || false,
      pixelRatio: options.pixelRatio || 1,
      ...options
    };

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.mouse = { x: null, y: null };

    this.init();
  }

  init() {
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';

    this.container.appendChild(this.canvas);
    this.resize();

    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width * this.options.pixelRatio;
    this.canvas.height = rect.height * this.options.pixelRatio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(this.options.pixelRatio, this.options.pixelRatio);
  }

  createParticles() {
    this.particles = [];
    const shapes = ['circle', 'square', 'triangle', 'hexagon', 'gear', 'circuit'];

    for (let i = 0; i < this.options.particleCount; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.particles.push({
        x: Math.random() * this.canvas.width / this.options.pixelRatio,
        y: Math.random() * this.canvas.height / this.options.pixelRatio,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed,
        size: Math.random() * this.options.particleBaseSize + 2,
        color: this.options.particleColors[Math.floor(Math.random() * this.options.particleColors.length)],
        alpha: this.options.alphaParticles ? Math.random() * 0.6 + 0.4 : 1,
        rotation: this.options.disableRotation ? 0 : Math.random() * Math.PI * 2,
        rotationSpeed: this.options.disableRotation ? 0 : (Math.random() - 0.5) * 0.02,
        shape: shape,
        depth: Math.random() * 0.5 + 0.5 // For 3D effect
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    if (this.options.moveParticlesOnHover) {
      document.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      document.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width / this.options.pixelRatio, this.canvas.height / this.options.pixelRatio);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width / this.options.pixelRatio;
      if (particle.x > this.canvas.width / this.options.pixelRatio) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height / this.options.pixelRatio;
      if (particle.y > this.canvas.height / this.options.pixelRatio) particle.y = 0;

      // Mouse interaction
      if (this.options.moveParticlesOnHover && this.mouse.x !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const force = (120 - distance) / 120;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
        }
      }

      // Apply friction
      particle.vx *= 0.995;
      particle.vy *= 0.995;

      // Update rotation
      particle.rotation += particle.rotationSpeed;

      // Draw particle with 3D effect
      this.drawParticle(particle);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawParticle(particle) {
    this.ctx.save();
    this.ctx.globalAlpha = particle.alpha * particle.depth;
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);

    // 3D shadow effect
    this.ctx.shadowColor = particle.color;
    this.ctx.shadowBlur = particle.size * 2;
    this.ctx.shadowOffsetX = particle.size * 0.1;
    this.ctx.shadowOffsetY = particle.size * 0.1;

    this.ctx.fillStyle = particle.color;
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = 1;

    const size = particle.size * particle.depth;

    switch (particle.shape) {
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case 'square':
        this.ctx.fillRect(-size / 2, -size / 2, size, size);
        break;

      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size / 2);
        this.ctx.lineTo(-size / 2, size / 2);
        this.ctx.lineTo(size / 2, size / 2);
        this.ctx.closePath();
        this.ctx.fill();
        break;

      case 'hexagon':
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = size / 2 * Math.cos(angle);
          const y = size / 2 * Math.sin(angle);
          if (i === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        break;

      case 'gear':
        this.drawGear(0, 0, size / 2);
        break;

      case 'circuit':
        this.drawCircuit(0, 0, size);
        break;
    }

    this.ctx.restore();
  }

  drawGear(x, y, radius) {
    const teeth = 8;
    const toothHeight = radius * 0.3;

    this.ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i * Math.PI) / teeth;
      const r = i % 2 === 0 ? radius : radius - toothHeight;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.fill();

    // Inner circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawCircuit(x, y, size) {
    const half = size / 2;
    // Draw a simple circuit pattern
    this.ctx.beginPath();
    this.ctx.moveTo(x - half, y);
    this.ctx.lineTo(x - half/2, y);
    this.ctx.moveTo(x + half/2, y);
    this.ctx.lineTo(x + half, y);
    this.ctx.moveTo(x, y - half);
    this.ctx.lineTo(x, y - half/2);
    this.ctx.moveTo(x, y + half/2);
    this.ctx.lineTo(x, y + half);
    this.ctx.stroke();

    // Small circles at ends
    this.ctx.beginPath();
    this.ctx.arc(x - half, y, 1, 0, Math.PI * 2);
    this.ctx.arc(x + half, y, 1, 0, Math.PI * 2);
    this.ctx.arc(x, y - half, 1, 0, Math.PI * 2);
    this.ctx.arc(x, y + half, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Services data
const services = [
  { id: 'celostno-farbanje', emoji: '🎨', title: 'Целосно Фарбање', description: 'целото возило', value: 'Целосно Фарбање' },
  { id: 'delumno-farbanje', emoji: '🖌️', title: 'Делумно Фарбање', description: 'одделни панели', value: 'Делумно Фарбање' },
  { id: 'izvlekuvanje', emoji: '⚡', title: 'Извлекување со Королинер', description: 'специјална техника без замена', value: 'Извлекување со Каролинер' },
  { id: 'poliranje', emoji: '✨', title: 'Полирање', description: 'машинско полирање за блесок', value: 'Полирање' },
  { id: 'nabavka-delovi', emoji: '🔧', title: 'Набавка на Делови', description: 'браник, врата, панели', value: 'Набавка на Делови' },
  { id: 'termo-lakiranje', emoji: '🌡️', title: 'Термо Лакирање', description: 'премиум заштита на лакот', value: 'Термо Лакирање' }
];

const galleryEntries = [
  { id: '1', title: 'Каросерија пред/после', before: 'images/car-paint-01-before.jpg', after: 'images/car-paint-01-after.jpg' },
  { id: '2', title: 'Целосно фарбање', before: 'images/car-paint-02-before.jpg', after: 'images/car-paint-02-after.jpg' },
  { id: '3', title: 'Реконструкција на панел', before: 'images/car-paint-03-before.jpg', after: 'images/car-paint-03-after.jpg' },
  { id: '4', title: 'Цврсто полирање', before: 'images/car-polishing-before.jpg', after: 'images/car-polishing-after.jpg' },
  { id: '5', title: 'Лесни поправки', before: 'images/car-paint-05-before.jpg', after: 'images/car-paint-after-5.jpg' },
  { id: '6', title: 'Крајна завршница', before: 'images/car-paint-06-before.jpg', after: 'images/car-paint-after-06.jpg' }
];

const defaultConfig = {
  business_name: 'АутоФикс Про Гараж',
  tagline: 'Експертна Нега за Ваше Возило',
  phone_number: '+389 2 123-4567',
  address: '123 Авто Лана, Град Механичар, МК 12345',
  accent_color: '#f59e0b',
  text_color: '#ffffff'
};

const STORAGE_KEY = 'garage_booking_data';
let bookings = [];
let currentRecordCount = 0;

const dataHandler = {
  onDataChanged(data) {
    bookings = data || [];
    currentRecordCount = bookings.length;
    updateBookingCount();
    renderAppointments();
  }
};

const localDataSdk = {
  init(handler) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      bookings = stored ? JSON.parse(stored) : [];
      currentRecordCount = bookings.length;
      handler.onDataChanged(bookings);
      return { isOk: true };
    } catch (err) {
      console.error('localDataSdk init error', err);
      return { isOk: false, error: err };
    }
  },
  create(booking) {
    try {
      const ts = Date.now();
      const id = `local-${ts}-${Math.random().toString(16).slice(2)}`;
      booking.__backendId = id;
      booking.status = 'Потврден';
      bookings = [...bookings, booking];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      dataHandler.onDataChanged(bookings);
      return { isOk: true, value: booking };
    } catch (err) {
      console.error('localDataSdk create error', err);
      return { isOk: false, error: err };
    }
  },
  delete(booking) {
    try {
      bookings = bookings.filter(b => b.__backendId !== booking.__backendId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      dataHandler.onDataChanged(bookings);
      return { isOk: true };
    } catch (err) {
      console.error('localDataSdk delete error', err);
      return { isOk: false, error: err };
    }
  }
};

function initializeApp() {
  if (!window.dataSdk) {
    window.dataSdk = localDataSdk;
  }

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        document.getElementById('business-name').textContent = config.business_name || defaultConfig.business_name;
        document.getElementById('tagline').textContent = config.tagline || defaultConfig.tagline;
        document.getElementById('phone-display').textContent = config.phone_number || defaultConfig.phone_number;
        const addressEl = document.getElementById('address-display');
        if (addressEl) {
          const address = config.address || defaultConfig.address;
          addressEl.innerHTML = `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> ${address}`;
        }
      },
      mapToCapabilities: (config) => ({
        recolorables: [{
          get: () => config.accent_color || defaultConfig.accent_color,
          set: (value) => { config.accent_color = value; window.elementSdk.setConfig({ accent_color: value }); }
        }],
        borderables: [],
      }),
      mapToEditPanelValues: (config) => ({
        business_name: config.business_name || defaultConfig.business_name,
        tagline: config.tagline || defaultConfig.tagline,
        phone_number: config.phone_number || defaultConfig.phone_number,
        address: config.address || defaultConfig.address
      })
    });
  }

  window.dataSdk.init(dataHandler);
  renderServices();
  populateServiceSelect();
  renderGallery();

  const dateInput = document.getElementById('preferred-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  showTab('services');

  // Initialize particles background
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    new Particles(particlesContainer, {
      particleColors: ["#00ffff", "#ff00ff", "#ffff00", "#ffffff"],
      particleCount: 80,
      particleSpread: 10,
      speed: 0.08,
      particleBaseSize: 4,
      moveParticlesOnHover: true,
      alphaParticles: true,
      disableRotation: false,
      pixelRatio: 1
    });
  }
}

function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  grid.innerHTML = services.map(service => `
    <div class="service-card bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-amber-500 transition-all duration-300 cursor-pointer" onclick="selectService('${service.value}')">
      <div class="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4"><span class="text-2xl">${service.emoji}</span></div>
      <h3 class="font-heading text-xl text-white mb-2">${service.title}</h3>
      <p class="text-gray-400 text-sm mb-4">${service.description}</p>
      <div class="flex items-center justify-between"><span class="text-amber-400 font-bold text-lg">По Договор</span></div>
    </div>
  `).join('');
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = galleryEntries.map(entry => `
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
      <h3 class="font-heading text-lg text-white mb-3">${entry.title}</h3>
      <div class="relative overflow-hidden rounded-xl border border-gray-600" style="height: 220px;">
        <img src="${entry.before}" alt="Before ${entry.title}" class="w-full h-full object-cover before-${entry.id} opacity-100 transition-opacity duration-300" />
        <img src="${entry.after}" alt="After ${entry.title}" class="w-full h-full object-cover absolute inset-0 opacity-0 after-${entry.id} transition-opacity duration-300" />
        <div class="absolute bottom-3 left-3 right-3 flex justify-between gap-2">
          <button class="px-3 py-1 text-xs font-semibold rounded-lg bg-black/60 text-white hover:bg-black/80" onclick="toggleBeforeAfter('${entry.id}', true); event.stopPropagation();">Пред</button>
          <button class="px-3 py-1 text-xs font-semibold rounded-lg bg-black/60 text-white hover:bg-black/80" onclick="toggleBeforeAfter('${entry.id}', false); event.stopPropagation();">После</button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleBeforeAfter(id, showBefore) {
  const beforeImg = document.querySelector(`img.before-${id}`);
  const afterImg = document.querySelector(`img.after-${id}`);
  if (!beforeImg || !afterImg) return;
  if (showBefore) {
    beforeImg.classList.remove('opacity-0');
    beforeImg.classList.add('opacity-100');
    afterImg.classList.remove('opacity-100');
    afterImg.classList.add('opacity-0');
  } else {
    afterImg.classList.remove('opacity-0');
    afterImg.classList.add('opacity-100');
    beforeImg.classList.remove('opacity-100');
    beforeImg.classList.add('opacity-0');
  }
}

function populateServiceSelect() {
  const select = document.getElementById('service-type');
  if (!select) return;
  select.innerHTML = '<option value="">Избери услуга</option>' + services.map(s => `<option value="${s.value}">${s.emoji} ${s.title}</option>`).join('');
}

function showTab(tab) {
  const tabs = ['services', 'booking', 'appointments'];
  const sectionList = ['services', 'booking', 'appointments', 'gallery'];

  sectionList.forEach((sectionName) => {
    const section = document.getElementById(`section-${sectionName}`);
    if (!section) return;
    if (sectionName === 'gallery') {
      if (tab === 'services') {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
      return;
    }

    const btn = document.getElementById(`tab-${sectionName}`);
    if (!btn) return;
    if (sectionName === tab) {
      section.classList.remove('hidden');
      btn.classList.add('text-amber-400', 'border-b-2', 'border-amber-500');
      btn.classList.remove('text-gray-400');
    } else {
      section.classList.add('hidden');
      btn.classList.remove('text-amber-400', 'border-b-2', 'border-amber-500');
      btn.classList.add('text-gray-400');
    }
  });
}

function selectService(service) {
  showTab('booking');
  const serviceSelect = document.getElementById('service-type');
  if (serviceSelect) serviceSelect.value = service;
}

function updateBookingCount() {
  const countEl = document.getElementById('booking-count');
  if (countEl) countEl.textContent = currentRecordCount;
}

function renderAppointments() {
  const container = document.getElementById('appointments-list');
  const noAppointments = document.getElementById('no-appointments');
  if (!container || !noAppointments) return;

  if (!bookings || bookings.length === 0) {
    container.innerHTML = '';
    noAppointments.classList.remove('hidden');
    return;
  }

  noAppointments.classList.add('hidden');
  const sorted = [...bookings].sort((a, b) => new Date(a.preferred_date) - new Date(b.preferred_date));
  const existingItems = {};
  [...container.children].forEach(el => {
    existingItems[el.dataset.id] = el;
  });

  sorted.forEach(booking => {
    const id = booking.__backendId || booking.id;
    const existingEl = existingItems[id];
    if (existingEl) {
      updateAppointmentElement(existingEl, booking);
      delete existingItems[id];
    } else {
      container.appendChild(createAppointmentElement(booking));
    }
  });

  // Remove elements that are no longer in the data
  Object.values(existingItems).forEach(el => el.remove());
}

function createAppointmentElement(booking) {
  const div = document.createElement('div');
  div.dataset.id = booking.__backendId || booking.id;
  div.className = 'booking-row bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700';
  updateAppointmentElement(div, booking);
  return div;
}

function updateAppointmentElement(el, booking) {
  const d = new Date(booking.preferred_date);
  const formattedDate = isNaN(d.valueOf()) ? 'N/A' : d.toLocaleDateString('mk-MK', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const statusColor = booking.status === 'Потврден' ? 'text-green-400 bg-green-500/20' : 'text-amber-400 bg-amber-500/20';

  el.innerHTML = `
    <div class="flex flex-wrap justify-between items-start gap-4">
      <div class="flex-1 min-w-[200px]">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="font-heading text-lg text-white">${escapeHtml(booking.customer_name)}</h3>
          <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColor}">${escapeHtml(booking.status || 'Во чекање')}</span>
        </div>
        <p class="text-gray-400 text-sm mb-1">📱 ${escapeHtml(booking.phone)}</p>
        <p class="text-gray-400 text-sm">🚗 ${escapeHtml(booking.vehicle)}</p>
      </div>
      <div class="text-right">
        <p class="text-amber-400 font-semibold mb-1">${escapeHtml(booking.service_type)}</p>
        <p class="text-gray-400 text-sm">📅 ${formattedDate}</p>
        ${booking.notes ? `<p class="text-gray-500 text-xs mt-2">💬 ${escapeHtml(booking.notes)}</p>` : ''}
      </div>
      <button onclick="confirmDelete('${booking.__backendId || booking.id}')" class="text-gray-500 hover:text-red-400 transition-colors p-2" title="Откажи прием">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </div>
    <div id="confirm-${booking.__backendId || booking.id}" class="hidden mt-4 pt-4 border-t border-gray-700">
      <p class="text-gray-300 text-sm mb-3">Откажи го овој прием?</p>
      <div class="flex gap-2">
        <button onclick="deleteBooking('${booking.__backendId || booking.id}')" class="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">Да, Откажи</button>
        <button onclick="hideConfirm('${booking.__backendId || booking.id}')" class="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Не, Задржи</button>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function confirmDelete(id) {
  const confirmEl = document.getElementById(`confirm-${id}`);
  if (confirmEl) confirmEl.classList.remove('hidden');
}

function hideConfirm(id) {
  const confirmEl = document.getElementById(`confirm-${id}`);
  if (confirmEl) confirmEl.classList.add('hidden');
}

function deleteBooking(id) {
  const booking = bookings.find(b => (b.__backendId || b.id) === id);
  if (!booking) return;

  const result = window.dataSdk.delete(booking);
  if (!result.isOk) {
    showFormMessage('Неуспешно откажување. Обидете се повторно.', 'error');
  } else {
    showFormMessage('Приемот е откажан.', 'success');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();

  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['customer-name', 'customer-phone', 'vehicle-info', 'service-type', 'preferred-date'];
    const missingFields = requiredFields.filter(fieldId => {
      const field = document.getElementById(fieldId);
      return !field || !field.value.trim();
    });

    if (missingFields.length > 0) {
      showFormMessage('Ве молиме пополнете ги сите задолжителни полиња (*).', 'error');
      return;
    }

    if (currentRecordCount >= 999) {
      showFormMessage('Максимален број приеми постигнат. Откажете претходен прием за нов.', 'error');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-btn-text');
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Закажувам...';

    const newBooking = {
      customer_name: document.getElementById('customer-name')?.value || '',
      phone: document.getElementById('customer-phone')?.value || '',
      vehicle: document.getElementById('vehicle-info')?.value || '',
      service_type: document.getElementById('service-type')?.value || '',
      preferred_date: document.getElementById('preferred-date')?.value || '',
      notes: document.getElementById('notes')?.value || '',
      created_at: new Date().toISOString(),
      status: 'Потврден'
    };

    const result = window.dataSdk.create(newBooking);

    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.textContent = 'Закажи Прием';

    if (result.isOk) {
      showFormMessage('Прием успешно заказан!', 'success');
      form.reset();
      setTimeout(() => showTab('appointments'), 800);
    } else {
      showFormMessage('Неуспешно резервирање. Обиди се повторно.', 'error');
    }
  });
});

function showFormMessage(message, type) {
  const msgEl = document.getElementById('form-message');
  if (!msgEl) return;

  msgEl.textContent = message;
  msgEl.className = `text-sm ${type === 'success' ? 'text-green-400' : 'text-red-400'}`;
  msgEl.classList.remove('hidden');

  setTimeout(() => msgEl.classList.add('hidden'), 4000);
}
