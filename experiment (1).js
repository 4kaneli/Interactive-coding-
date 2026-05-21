/* ─────────────────────────────────────────────
   experiment.js  —  Elettricità
   Due indici vicini → arco elettrico + audio
   
   IMPORTANTE: questo file NON si auto-inizializza.
   Viene chiamato da index.html tramite window.ElettricIta.init()
   quando la project view diventa visibile.
───────────────────────────────────────────── */

window.Elettricita = (function () {

  let video, canvas, status, startBtn, ctx;
  let audioCtx, oscillator, gainNode, audioStarted = false;
  let handsInstance = null;
  let cameraInstance = null;
  let animId = null;
  let lastPoints = null;
  let running = false;

  /* ── Audio ── */
  function initAudio() {
    if (audioStarted) return;
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    gainNode   = audioCtx.createGain();
    oscillator = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 2;
    oscillator.type = "sawtooth";
    oscillator.frequency.value = 60;
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0;
    oscillator.start();
    audioStarted = true;
  }

  function updateAudio(signal) {
    if (!audioStarted) return;
    const t = audioCtx.currentTime;
    oscillator.frequency.setTargetAtTime(80 + signal * 820, t, 0.05);
    gainNode.gain.setTargetAtTime(signal * 0.18, t, 0.05);
  }

  /* ── Lightning ── */
  function drawLightning(x1, y1, x2, y2, signal, layers) {
    layers = layers || 3;
    for (let l = 0; l < layers; l++) {
      const points = [[x1, y1]];
      const segs   = 12 + Math.floor(signal * 10);
      const jitter = (1 - signal * 0.5) * 38;
      for (let i = 1; i < segs; i++) {
        const t  = i / segs;
        const px = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter * 2;
        const py = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter * 2;
        points.push([px, py]);
      }
      points.push([x2, y2]);
      const r = Math.floor(signal * 220);
      const g = Math.floor(180 + signal * 75);
      const b = 255;
      const alpha = 0.25 + signal * 0.65 - l * 0.08;
      const width  = (layers - l) * (1 + signal * 3.5);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth   = width;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur  = 18 + signal * 30;
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ── Sparks ── */
  const sparks = [];
  function spawnSparks(x, y, signal) {
    const n = Math.floor(signal * 6);
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4 * signal;
      sparks.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 1, decay: 0.04 + Math.random()*0.06 });
    }
  }
  function updateSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,230,255,${s.life})`;
      ctx.shadowColor = "rgba(150,220,255,0.9)";
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── Halo ── */
  function drawHalo(x, y, signal) {
    const r = 14 + signal * 22;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0,   `rgba(200,240,255,${0.5 + signal * 0.4})`);
    grad.addColorStop(0.4, `rgba(80,180,255,${0.3 + signal * 0.3})`);
    grad.addColorStop(1,   "rgba(0,100,255,0)");
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  /* ── Render loop ── */
  function render() {
    animId = requestAnimationFrame(render);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(5,5,5,0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!lastPoints) { updateSparks(); return; }

    const { a, b } = lastPoints;
    const dx   = a.x - b.x;
    const dy   = a.y - b.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxD = canvas.width * 0.55;
    const signal = Math.max(0, 1 - dist / maxD);

    updateAudio(signal);

    if (signal > 0.05) {
      drawLightning(a.x, a.y, b.x, b.y, signal, 3);
      if (signal > 0.4 && Math.random() < 0.5) {
        const mx = (a.x+b.x)/2 + (Math.random()-0.5)*60;
        const my = (a.y+b.y)/2 + (Math.random()-0.5)*60;
        drawLightning(a.x, a.y, mx, my, signal*0.6, 1);
        drawLightning(mx, my, b.x, b.y, signal*0.6, 1);
      }
    }

    drawHalo(a.x, a.y, signal);
    drawHalo(b.x, b.y, signal);

    if (signal > 0.3 && Math.random() < signal * 0.7) {
      spawnSparks((a.x+b.x)/2, (a.y+b.y)/2, signal);
    }
    updateSparks();

    const pct = Math.round(signal * 100);
    status.textContent = signal > 0.05
      ? `signal ${pct}%  ${pct > 70 ? "⚡⚡⚡" : pct > 35 ? "⚡⚡" : "⚡"}`
      : "avvicina gli indici";
  }

  /* ── Avvia camera + MediaPipe ── */
  function startCamera() {
    if (running) return;
    running = true;
    status.textContent = "avvio camera…";
    startBtn.textContent = "AVVIO…";
    startBtn.disabled = true;

    initAudio();

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });
    hands.onResults((results) => {
      if (!results.multiHandLandmarks || results.multiHandLandmarks.length < 2) {
        lastPoints = null;
        return;
      }
      const lm0 = results.multiHandLandmarks[0][8];
      const lm1 = results.multiHandLandmarks[1][8];
      lastPoints = {
        a: { x: (1 - lm0.x) * canvas.width, y: lm0.y * canvas.height },
        b: { x: (1 - lm1.x) * canvas.width, y: lm1.y * canvas.height },
      };
    });
    handsInstance = hands;

    const cam = new window.Camera(video, {
      onFrame: async () => { await hands.send({ image: video }); },
      width: 640,
      height: 480,
    });
    cam.start()
      .then(() => {
        status.textContent = "avvicina gli indici";
        startBtn.textContent = "CAMERA ON";
        startBtn.style.opacity = "0.4";
        if (!animId) render();
      })
      .catch((err) => {
        status.textContent = "errore camera: " + err.message;
        running = false;
        startBtn.disabled = false;
        startBtn.textContent = "RIPROVA";
      });
    cameraInstance = cam;
  }

  /* ── Stop: chiamato quando si torna alla gallery ── */
  function stop() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (cameraInstance) { cameraInstance.stop(); cameraInstance = null; }
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    if (audioStarted && gainNode) {
      gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    }
    lastPoints = null;
    sparks.length = 0;
    running = false;
    handsInstance = null;
    audioStarted = false;
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
  }

  /* ── Init: chiamato da index.html quando la view diventa visibile ── */
  function init() {
    video   = document.getElementById("webcam");
    canvas  = document.getElementById("output");
    status  = document.getElementById("status");
    startBtn = document.getElementById("startBtn");
    ctx     = canvas.getContext("2d");

    // Reset stato
    running = false;
    animId = null;
    lastPoints = null;
    sparks.length = 0;
    audioStarted = false;

    // Bottone manuale (sempre disponibile)
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.textContent = "START CAMERA";
    startBtn.onclick = () => startCamera();

    status.textContent = "premi START CAMERA";

    // Pulisci canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  return { init, stop };

})();
