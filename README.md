# Phonics Playground

An interactive phonics learning tool for children ages 4 and up. This web application helps children learn letter sounds and phonemes through a fun, interactive interface.

## Features

- Draggable letter tiles that can be arranged to form words
- Stacked letter system with 3 copies of each letter available
- Ability to rearrange letters by dragging within the word area
- Drag letters back out of the word area when needed
- Insert new letters between existing letters in the word area
- Support for words up to 9 letters long
- Text-to-speech pronunciation of any letter combination
- Special celebration when complete words are spelled
- Word-specific emoji associations (e.g., "cat" shows a cat emoji)
- Interactive tile placement with smooth animations
- Visual feedback and sound effects for all interactions
- Simple and intuitive interface designed for young children
- Modal celebration window for successfully spelled words

## How to Use

1. Drag letter tiles from the stacks into the drop zone to build words (limit of 9 tiles)
2. Rearrange letters by dragging them within the drop zone
3. Insert new letters between existing ones by dragging to the gap indicators
4. Remove letters by dragging them out of the drop zone or clicking on them
5. Click "Speak Word" to hear your word pronounced
6. When you spell a complete word in our dictionary, a special celebration modal appears with the corresponding emoji
7. Click the green checkmark to close the celebration modal
8. Click "Clear All" to start over with a new word

## Word List

The application recognizes these words (and shows their corresponding emoji):

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

## Development

This project is built with:
- React
- Vite
- Web Speech API for text-to-speech
- @dnd-kit for drag-and-drop functionality
- @dnd-kit/sortable for rearranging letters within the drop zone

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Implementation Notes

This project uses:
- Single file component approach for easier maintenance
- Inline styles for direct visual control
- React hooks for state management
- Web Audio API for simple sound effects
- Web Speech API for text-to-speech
- Stacked letter system with visual count indicators
- Flexible drop zone with position indicators for precise letter placement

## Future Enhancements

Potential features for future development:
- Add more words and corresponding emojis
- Implement difficulty levels (simple words vs. more complex phonics)
- Add phonics-specific challenges (consonant blends, digraphs, etc.)
- Create a scoring or achievement system
- Add animations for incorrect attempts
- Implement a hint system for struggling learners
- Add support for multiple languages
- Save progress between sessions
- Add user accounts for multiple children
- Implement a teacher/parent dashboard for monitoring progress

## License

[MIT License](LICENSE)

## Deployment

This project is configured to be deployed as a subdirectory of a GitHub Pages site. The current deployment can be accessed at:

https://pjleimbigler.github.io/foniks/

### GitHub Pages Deployment Setup

The project is set up to automatically deploy to GitHub Pages using GitHub Actions. The deployment process:

1. Builds the project with the correct base path (`/foniks/`)
2. Deploys the built files to the GitHub Pages environment

To set up deployment:

1. Ensure your repository has GitHub Pages enabled in Settings > Pages
2. Set the source to "GitHub Actions"
3. Push changes to the main branch to trigger automatic deployment

For local testing with the subdirectory path, use:

```bash
npm run build
npm run preview -- --base=/foniks/
```
