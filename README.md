# Phonics Playground

An interactive phonics learning tool, intended for the rough age range of 4 and up.

## Features

- Tap letters to form words
- Support for words up to 9 letters long
- Text-to-speech pronunciation of any letter combination
- Word-specific emoji associations (e.g., "cat" shows a cat emoji)

## How to Use

1. Tap letters to form words
2. Rearrange letters by dragging them within word area
3. Remove letters by tapping on them in the word area
4. Click "Speak Word" to hear your word pronounced
5. When you spell a complete word in the current dictionary, a celebration modal appears with the corresponding emoji
7. Click "Clear All" to start over with a new word

## Word List

The application recognizes these words, and shows their corresponding emoji when correctly spelled:

### Animals
cat, dog, fish, bear, lion, wolf, fox, owl, pig, frog, duck, bird, cow, goat, bug, ant, bee, yak, giraffe, mouse, rabbit, tiger

### Body Parts
hand, foot, ear, eye, nose, mouth, tooth, tongue, hair

### Transportation
car, bus, ship, boat

### Objects
hat, sock, ball, book, pen, key, map, bed, kite

### Nature
sun, moon, star, tree, rain, snow, leaf, ice, web

### Food
cake, egg, nut, pea, honey

### Places
house

### Getting Started

1. Clone repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Roadmap

See [ROADMAP.md](ROADMAP.md)

## License

[MIT License](LICENSE)

## Deployment

This project is currently configured for deployment as a subdirectory of a GitHub Pages site. Check it out here (unless and until @pleimbigler migrates to a new hosting method):

https://pjleimbigler.github.io/foniks/

### GitHub Pages Deployment Setup

The project is set up to automatically deploy to GitHub Pages using GitHub Actions. Upon pushing to main, GH actions:

1. Builds project with correct base path (`/foniks/`)
2. Deploys built files to GitHub Pages environment

To set up deployment:

1. Ensure your repository has GitHub Pages enabled in Settings > Pages
2. Set the source to "GitHub Actions"
3. Push changes to main branch to trigger automatic deployment

For local testing with the subdirectory path, use:

```bash
npm run build
npm run preview -- --base=/foniks/
```
