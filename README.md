# Mandeep Yadav: Portfolio

A 3D-interactive portfolio. As you scroll, the camera flies through a glowing neural network built with Three.js; project cards tilt under your cursor; content animates in with GSAP.

No build step and no `npm install`. Three.js and GSAP load from the cdnjs CDN.

## Run it

Open `index.html` in your browser. That's it. (You need an internet connection for the CDN scripts and fonts.)

Or serve it locally:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Edit your content

Everything (profile text, projects, skills, education, hackathons, email) lives in **`data.js`**. Change it there and refresh.

To change the look, edit the colour variables at the top of `style.css` (`--a` and `--b` are the two accent colours the 3D scene and gradients use).

## Deploy for free (GitHub Pages)

1. Create a repo named `MandeepYadav26.github.io`.
2. Upload all the files in this folder (`index.html`, `style.css`, `main.js`, `data.js`, `resume.pdf`).
3. In the repo: Settings → Pages → deploy from the `main` branch, root folder.
4. Your site will be live at `https://MandeepYadav26.github.io`.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Styling |
| `data.js` | All your content |
| `main.js` | 3D scene, animations, rendering from `data.js` |
| `resume.pdf` | Linked from the "Download resume" button |
