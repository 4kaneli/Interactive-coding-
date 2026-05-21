# 🗂 Creative Archive — Template

Sito-archivio per sketch interattivi, generativi e con MediaPipe.
Ispirato a unknownrealityarchive.com.

---

## Struttura file

```
creative-archive/
├── index.html          ← pagina principale (non modificare la struttura)
├── style.css           ← estetica globale (modifica pure!)
├── main.js             ← router + registro progetti ← MODIFICA QUI
└── sketches/
    ├── demo-generative.html    ← sketch p5.js demo
    ├── demo-mediapipe.html     ← sketch MediaPipe demo
    └── [i tuoi sketch].html   ← aggiungi i tuoi qui
```

---

## Come aggiungere un tuo progetto

### 1. Crea il file dello sketch

Crea `sketches/mio-progetto.html` con questa struttura minima:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin:0; padding:0; }
    html, body { width:100%; height:100%; background:#0a0a0a; overflow:hidden; }
    canvas { display:block; }
  </style>
</head>
<body>
  <!-- Carica le tue librerie -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.3/p5.min.js"></script>
  <script>
    // INCOLLA QUI IL TUO CODICE p5.js
    function setup() {
      createCanvas(windowWidth, windowHeight);
    }
    function draw() {
      // ...
    }
    function windowResized() { resizeCanvas(windowWidth, windowHeight); }
  </script>
</body>
</html>
```

### 2. Registralo in main.js

Apri `main.js` e aggiungi il progetto nell'array `PROJECTS`:

```js
{
  id: "mio-progetto",           // ← compare nell'URL: ?content=mio-progetto
  name: "NOME VISIBILE",        // ← appare nel menu INDEX
  tag: "mediapipe / p5.js",     // ← etichetta piccola a destra
  description: "Descrizione breve.",
  file: "sketches/mio-progetto.html",
},
```

### Navigazione diretta via URL

Ogni sketch è raggiungibile direttamente:
```
https://tuonome.github.io/archive/?content=mio-progetto
```

---

## Pubblicare su GitHub Pages (gratis)

1. **Crea un account su [github.com](https://github.com)** se non ce l'hai
2. **Crea un nuovo repository** → es. `archive` (o qualsiasi nome)
3. **Carica tutti i file** nella root del repo:
   - `index.html`, `style.css`, `main.js`
   - la cartella `sketches/` con tutti i file dentro
4. Vai su **Settings → Pages**
5. In "Source" scegli **Deploy from a branch → main → / (root)**
6. Salva. Dopo ~1 minuto il sito sarà online a:
   `https://tuonome.github.io/archive/`

### Metodo alternativo (drag & drop) — Netlify

1. Vai su [netlify.com](https://netlify.com) → signup gratis
2. Drag & drop dell'intera cartella `creative-archive/` nel browser
3. Il sito è online istantaneamente con URL tipo `random-name.netlify.app`
4. Puoi rinominarlo nelle impostazioni

---

## Note su MediaPipe

Gli sketch MediaPipe richiedono:
- **HTTPS** (GitHub Pages e Netlify ce l'hanno di default ✓)
- **Permesso webcam** nel browser
- L'iframe nel sito principale ha già `allow="camera; microphone"` ✓

---

## Personalizzare l'estetica

In `style.css` modifica le variabili CSS:
```css
:root {
  --bg: #0a0a0a;        /* sfondo */
  --fg: #e8e4dc;        /* testo */
  --accent: #c8ff00;    /* colore accent (hover, bottoni) */
  --muted: #3a3a3a;     /* testo secondario */
}
```

In `index.html` cambia:
- `.splash-title` → il titolo grande della splash screen
- `.splash-sub` → il sottotitolo
