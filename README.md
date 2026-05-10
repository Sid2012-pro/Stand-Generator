# Stand Generator

A JoJo's Bizarre Adventure themed boss-rush game built with HTML5, and JavaScript. This project features a unique Stand generation system, a persistent archive, and AI-narrated battle summaries powered by the Groq Cloud SDK.

## Features

- **Stand Generation**: Create unique Stands with randomized JoJo-style stats (A-E) and descriptions.
- **Persistent Archive**: Save your Stands to a local database (localStorage) to use in future battles
- **Battle Mode**: A mode where you bring your stands to battle with you to fight 13 stands based of the Stands from Stardust Crusaders - Part:3 JoJo's Bizarre Adventure 

## How to Play

1.  **Generate**: Go to the Generator page to create your Stand.
2.  **Archive**: Save your Stand to the Archive.
3.  **Battle**: Select your Stand from the Archive and enter the Battle arena.
4.  **Climb**: Defeat all 13 bosses in a row to become the Grand Champion.

## Technical Stack

- **Frontend**: HTML5, CSS3 (Advanced Glassmorphism), Vanilla JavaScript (ES6 Modules).
- **AI Integration**: Groq SDK for real-time battle narration.

## Cloning

This project is a static web application. To deploy as a clone:
1.  Ensure all paths for `style.css`, `battle.js`, and `archive.js` have not been altered.
2.  Host on GitHub Pages, Vercel, or Netlify.(Or anything else that is comfortable for you, my recommendation: Vercel)
3.  **Important**: Ensure your Groq API Key is handled securely if deploying to a public environment. (Also please give credit to me)

## Bosses

The game uses the following boss roster for its linear progression:
- Atum
- Sun
- Dark Blue Moon
- Horus
- Hermit Purple
- The Fool
- Anubis
- Hanged Man
- Silver Chariot
- Hierophant Green
- Magician's Red
- The World
- Star Platinum
