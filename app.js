// ==========================================
// 1. STARRY NIGHT SKY CANVAS
// ==========================================
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
const STAR_COUNT = 120;
let animationFrameId = null;

// Handle window resizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

class Star {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.4;
    // Twinkling variables
    this.alpha = Math.random();
    this.twinkleSpeed = 0.005 + Math.random() * 0.015;
    this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
    // Panning drift speed (extremely slow for calming effect)
    this.vx = (Math.random() - 0.5) * 0.04;
    this.vy = -Math.random() * 0.03 - 0.01; // slow drifting upwards
    
    // Star color matching warm gold or soft cyan twilight
    const colors = ['#f8fafc', '#7df9ff', '#fbbf24', '#c084fc', '#e2e8f0'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    // Twinkle alpha pulsing
    this.alpha += this.twinkleDirection * this.twinkleSpeed;
    if (this.alpha >= 1) {
      this.alpha = 1;
      this.twinkleDirection = -1;
    } else if (this.alpha <= 0.1) {
      this.alpha = 0.1;
      this.twinkleDirection = 1;
    }

    // Panning drift movement
    this.x += this.vx;
    this.y += this.vy;

    // Reset if star moves out of boundary
    if (this.x < 0 || this.x > canvas.width || this.y < 0) {
      this.reset();
      this.y = canvas.height; // reappear at bottom
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    // Draw star with glow shadow
    ctx.shadowBlur = this.size * 3;
    ctx.shadowColor = this.color;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }
}

function drawBackgroundGradients() {
  // Soft twilight ambient purple/indigo nebulas in corners
  const topGrad = ctx.createRadialGradient(
    canvas.width * 0.2, 0, 10,
    canvas.width * 0.2, 0, canvas.height * 0.6
  );
  topGrad.addColorStop(0, 'rgba(192, 132, 252, 0.04)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bottomGrad = ctx.createRadialGradient(
    canvas.width * 0.8, canvas.height, 10,
    canvas.width * 0.8, canvas.height, canvas.height * 0.7
  );
  bottomGrad.addColorStop(0, 'rgba(125, 249, 255, 0.03)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animateSky() {
  // Semi-transparent overlay to prevent trails but retain clean draw
  ctx.fillStyle = '#05060c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Ambient glow nebulae
  drawBackgroundGradients();
  
  // Update and draw stars
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  animationFrameId = requestAnimationFrame(animateSky);
}

// Initialise star system
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initStars();
animateSky();


// ==========================================
// 2. DIGITAL CLOCK & GREETING MECHANISM
// ==========================================
const hoursEl = document.getElementById('time-hours');
const minutesEl = document.getElementById('time-minutes');
const secondsEl = document.getElementById('time-seconds');
const dateEl = document.getElementById('clock-date');
const greetingMsgEl = document.getElementById('greeting-msg');

function updateClock() {
  const now = new Date();
  
  // Pad strings with leading zeroes
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  // Smoothly update time elements
  if (hoursEl.textContent !== hh) hoursEl.textContent = hh;
  if (minutesEl.textContent !== mm) minutesEl.textContent = mm;
  if (secondsEl.textContent !== ss) secondsEl.textContent = ss;

  // Render elegant custom Date Format (e.g. Tuesday, May 19, 2026)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  if (dateEl.textContent !== dateStr) {
    dateEl.textContent = dateStr;
  }

  // Update Bedside sleep greeting based on hours
  const hour = now.getHours();
  let greeting = 'Good Evening';
  if (hour >= 5 && hour < 12) {
    greeting = 'Rise & Shine';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good Evening';
  } else {
    // Night times (10 PM to 5 AM)
    greeting = 'Rest Well, Traveler';
  }

  if (greetingMsgEl.textContent !== greeting) {
    greetingMsgEl.textContent = greeting;
  }
}

// Keep clock exact
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 3. GEOLOCATION SERVICES
// ==========================================
const locationCityEl = document.getElementById('location-city');
const locationCoordsEl = document.getElementById('location-coords');
const locationBtn = document.getElementById('location-btn');
const locationSpinner = document.getElementById('location-spinner');

// Initial load check for IP location
async function fetchIpLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('IP lookup failed');
    const data = await response.json();
    
    if (data.city && data.country_name) {
      updateLocationUI(
        `${data.city}, ${data.region_code || data.country_code}`,
        `IP: ${data.latitude.toFixed(4)}° N, ${data.longitude.toFixed(4)}° E`
      );
    }
  } catch (error) {
    console.warn('IP Geolocation failed. Waiting for manual GPS permission.', error);
    locationCityEl.textContent = 'Awaiting Traveler Location...';
  }
}

function updateLocationUI(resolvedText, coordsText) {
  locationSpinner.style.display = 'none';
  locationCityEl.textContent = resolvedText;
  locationCoordsEl.textContent = coordsText;
  locationCoordsEl.style.display = 'block';
}

async function handleReverseGeocoding(lat, lon) {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (!response.ok) throw new Error('Reverse geocoding failed');
    const data = await response.json();
    
    const city = data.city || data.locality || data.principalSubdivision || 'Unknown Haven';
    const country = data.countryName || '';
    const locationString = country ? `${city}, ${country}` : city;
    
    updateLocationUI(locationString, `GPS: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
  } catch (error) {
    console.error('Reverse Geocode failed, showing coords only.', error);
    updateLocationUI('Cozy Coordinates', `GPS: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
  }
}

function getGPSLocation() {
  locationSpinner.style.display = 'block';
  locationCityEl.textContent = 'Triangulating coordinates...';
  locationCoordsEl.style.display = 'none';
  locationBtn.disabled = true;

  if (!navigator.geolocation) {
    locationSpinner.style.display = 'none';
    locationCityEl.textContent = 'GPS not supported by browser';
    locationBtn.disabled = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      handleReverseGeocoding(lat, lon);
      locationBtn.style.display = 'none'; // hide button once we have precision GPS coordinates
    },
    error => {
      console.warn('GPS location permission denied or error:', error);
      locationSpinner.style.display = 'none';
      
      // Notify fallback
      locationCityEl.textContent = 'GPS Access Denied';
      setTimeout(() => {
        locationCityEl.textContent = 'Falling back to estimation...';
        fetchIpLocation();
      }, 2000);
      
      locationBtn.disabled = false;
      locationBtn.textContent = 'Retry GPS Access';
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

locationBtn.addEventListener('click', getGPSLocation);

// Execute soft IP lookup in background on page load
fetchIpLocation();


// ==========================================
// 4. AMBIENT AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
let audioContext = null;
let masterGain = null;
let isAudioPlaying = false;

// Audio Nodes references
let rainNode = null;
let windNode = null;
let windFilter = null;
let windLfo = null;
let windLfoGain = null;

const soundToggleBtn = document.getElementById('sound-toggle-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeContainer = document.getElementById('volume-ctrl-container');

// Sound synthesis helper: generates a Brownian Noise Buffer
// Brownian noise decreases by 6dB per octave, simulating calming wind and heavy rain.
function createBrownianNoiseBuffer(ctx) {
  const bufferSize = ctx.sampleRate * 4; // 4 seconds of unique noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // First-order accumulation to filter frequencies and color noise towards brown
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // boost amplitude to normalise
  }
  
  return buffer;
}

function initAudioSystem() {
  // Set up Audio Context and Master Gain Node
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContextClass();
  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(volumeSlider.value * 0.4, audioContext.currentTime); // keep max output gentle
  masterGain.connect(audioContext.destination);

  const noiseBuffer = createBrownianNoiseBuffer(audioContext);

  // 1. RAIN SYNTHESIZER
  // Uses Brownian noise through a bandpass filter to sound like soft raindrops
  const rainSource = audioContext.createBufferSource();
  rainSource.buffer = noiseBuffer;
  rainSource.loop = true;

  const rainFilter = audioContext.createBiquadFilter();
  rainFilter.type = 'bandpass';
  rainFilter.frequency.setValueAtTime(450, audioContext.currentTime); // focus on low-mid warm rain
  rainFilter.Q.setValueAtTime(0.8, audioContext.currentTime);

  const rainGain = audioContext.createGain();
  rainGain.gain.setValueAtTime(0.65, audioContext.currentTime);

  // Connection: Rain Source -> Filter -> Gain -> Master
  rainSource.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(masterGain);
  rainSource.start(0);
  rainNode = rainSource;

  // 2. WIND SYNTHESIZER
  // Uses Brownian noise filtered with high Q value, modulated dynamically by an LFO
  // to simulate relaxing, breathing gusts of wind
  const windSource = audioContext.createBufferSource();
  windSource.buffer = noiseBuffer;
  windSource.loop = true;

  windFilter = audioContext.createBiquadFilter();
  windFilter.type = 'lowpass';
  windFilter.frequency.setValueAtTime(300, audioContext.currentTime);
  windFilter.Q.setValueAtTime(3.0, audioContext.currentTime); // resonant filter creates wind-whistle

  const windGain = audioContext.createGain();
  windGain.gain.setValueAtTime(0.35, audioContext.currentTime);

  // Create an LFO to automate the wind filter frequency (breathing wind sound)
  windLfo = audioContext.createOscillator();
  windLfo.type = 'sine';
  windLfo.frequency.setValueAtTime(0.08, audioContext.currentTime); // extremely slow speed (12 seconds cycle)

  windLfoGain = audioContext.createGain();
  windLfoGain.gain.setValueAtTime(180, audioContext.currentTime); // modulate up/down by 180Hz

  // Connection: Wind Source -> Filter -> Gain -> Master
  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);

  // Connection: LFO -> Gain -> Filter Frequency (modulates standard 300Hz base frequency)
  windLfo.connect(windLfoGain);
  windLfoGain.connect(windFilter.frequency);

  windSource.start(0);
  windLfo.start(0);
  
  windNode = windSource;
}

function startAmbientSound() {
  if (!audioContext) {
    initAudioSystem();
  } else if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  isAudioPlaying = true;
  soundToggleBtn.classList.add('playing');
  volumeContainer.classList.add('active');
  
  // Transition svg into a pause bar
  soundToggleBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  `;
}

function pauseAmbientSound() {
  if (audioContext && audioContext.state === 'running') {
    audioContext.suspend();
  }
  isAudioPlaying = false;
  soundToggleBtn.classList.remove('playing');
  volumeContainer.classList.remove('active');
  
  // Transition back to play sign
  soundToggleBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  `;
}

soundToggleBtn.addEventListener('click', () => {
  if (isAudioPlaying) {
    pauseAmbientSound();
  } else {
    startAmbientSound();
  }
});

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(value * 0.4, audioContext.currentTime, 0.05);
  }
});
