# motion-play

Accelerometer-driven sound synthesis web app for iOS and Android.

## Features

- **Rhythm Mode**: Shake your device to trigger drums. Choose from 5 synth packs: 808 Classic, Electronic, Lo-fi, Tribal, Glitch Future
- **Melody Mode**: Tilt your device left/right to move between scale notes. Each note zone triggers automatically when you cross the threshold. Supports 8 scales and 12 root notes
- **Real-time Visuals**: Full-screen canvas with particle effects, heat maps, and bloom animations
- **PWA**: Install as a home screen app on iOS/Android

## Development

### Prerequisites
- Node.js 18+

### Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173/motion-play/](http://localhost:5173/motion-play/) in your browser.

### Build

```bash
npm run build
```

The production build is in the `dist/` folder.

## Deployment to GitHub Pages

1. Push the code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: motion-play webapp"
git remote add origin https://github.com/YOUR_USERNAME/motion-play.git
git branch -M main
git push -u origin main
```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select "main" branch and "/root" folder

3. Create a GitHub Actions workflow to auto-deploy on push. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Your app will be live at: `https://YOUR_USERNAME.github.io/motion-play/`

## Testing on Mobile

- **HTTPS required**: GitHub Pages automatically uses HTTPS
- **iOS**: Open the URL in Safari, tap Share → Add to Home Screen
- **Android**: Open the URL in Chrome, tap the menu → "Install app" or "Add to Home Screen"

## Architecture

- **Vite**: Fast build tool and dev server
- **React 18**: UI framework
- **Tone.js**: Web audio synthesizer
- **Canvas API**: Real-time visualizations
- **Vanilla DeviceMotion API**: Accelerometer input
- **PWA**: Service worker + manifest for offline + home-screen install

## Files Structure

```
src/
├── components/        # React UI components
├── audio/            # Tone.js engines & synth configs
├── motion/           # Accelerometer processing
├── visualizers/      # Canvas renderers
├── hooks/            # React hooks
├── types/            # TypeScript types
└── App.tsx           # Main app component
```

## Tips

- **Sensitivity**: Motion detection can be tuned in `motionProcessor.ts`
- **Audio packs**: Edit drum parameters in `drumPacks.ts`
- **Scales**: Modify available scales in `scales.ts`
- **Colors**: Update visualizer colors in the visualizer files
