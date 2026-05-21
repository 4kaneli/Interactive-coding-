<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ARCHIVE - Elettricita</title>
  <link rel="stylesheet" href="../style.css" />
</head>
<body class="project-page" data-experiment="electric" data-audio="../assets/eletric.wav">
  <header class="project-topbar">
    <a class="project-back" href="../index.html">BACK TO INDEX</a>
    <span class="project-kicker">mediapipe - webcam - two fingers</span>
  </header>

  <main class="project-stage">
    <div class="canvas-wrap">
      <video id="webcam" autoplay muted playsinline></video>
      <canvas id="output" width="640" height="480"></canvas>
    </div>

    <aside class="project-panel">
      <span class="project-kicker">experiment 01</span>
      <h1>Elettricita</h1>
      <p>Avvicina i due indici: il segnale cresce, il colore cambia e l'audio sale.</p>
      <button id="startBtn" class="project-button" type="button">START CAMERA</button>
      <div id="status" class="project-status">waiting</div>
    </aside>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>
  <script src="experiment.js"></script>
</body>
</html>