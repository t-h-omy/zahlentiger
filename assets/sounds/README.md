# Sound Effects for Zahlentiger

This folder contains sound effects used in the Zahlentiger math learning app.

## File Naming Conventions

The following files are expected in this directory:

- **correct.mp3** - Played when the user answers correctly
- **incorrect.mp3** - Played when the user answers incorrectly  
- **click.mp3** - (Optional) Played for button clicks or UI interactions

## Recommended Sound Characteristics

For a child-friendly experience, sound effects should be:

- **Short** (0.3-1.0 seconds)
- **Pleasant** and encouraging (not harsh or jarring)
- **Clear** and distinct from each other
- **Appropriate volume** (not too loud)

## Suggested Sources for Free SFX

You can find child-friendly, royalty-free sound effects from these sources:

- **Freesound.org** - Community-uploaded sounds (check license: CC0 or CC-BY)
- **Zapsplat.com** - Free sound effects library (attribution required for free tier)
- **Mixkit.co** - Free sound effects (no attribution required)
- **OpenGameArt.org** - Game sound effects (various licenses, check individual files)

## File Format Requirements

- **Format**: MP3 or OGG (MP3 recommended for broad browser support)
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128-192 kbps is sufficient for short sound effects

## Replacing Placeholder Files

1. Find or create appropriate sound effect files
2. Convert them to MP3 format if needed (using tools like Audacity or online converters)
3. Name them according to the convention above
4. Replace the placeholder files in this directory
5. Test the sounds in the app by playing the game

## Graceful Degradation

The application is designed to work even if sound files are missing. If a file cannot be loaded, the app will:
- Log a debug message to the console
- Continue functioning normally without playing that sound
- Not throw any errors or break the user experience

## License Considerations

When adding your own sound files:
- Ensure you have the right to use them (own creation or properly licensed)
- If attribution is required, add a LICENSE.txt or CREDITS.txt file in this folder
- For personal/non-commercial use, most free sound libraries are acceptable
- For commercial deployment, verify the license allows commercial use
