# Kids Arcade Website Documentation

## Overview

The Kids Arcade website is an interactive platform designed specifically for
children, hosting three engaging games: "Run Rabbit Run",
"Memory Card Game", and "2048". Each game is self-contained within its respective
directory, which includes all necessary HTML, CSS, and JavaScript files.
Additionally, `arcade` directory that contains elements for
the website's front page, ensuring a cohesive and user-friendly interface.

## Directory Structure

The website is organized into the following main directories:

- **Arcade**: Contains elements and assets used on the front page of the website.
- **Run Rabbit Run**: Contains the files for the "Run Rabbit Run" game.
- **Memory Card Game**: Contains the files for the "Memory Card Game".
- **2048**: Contains the files for the "2048" game, which is adapted from an
  open-source project.

### Detailed Breakdown

1. **Arcade**

   - **Location**: `/arcade`
   - **Contents**:
     - `index.html` - The main HTML document for the arcade's front page.
     - 'about.html' - The HTML document for the about page.
     - `style.css` - CSS file for styling the front page.

2. **Run Rabbit Run**

   - **Location**: `/run-rabbit-run`
   - **Contents**:
     - `index.html` - The main HTML document for the game.
     - `run-rabbit-run.css` - CSS file for styling the game's interface.
     - `run-rabbit-run.js` - JavaScript file containing the game's logic.

3. **Memory Card Game**

   - **Location**: `/memory-card-game`
   - **Contents**:
     - `index.html` - The main HTML document for the game.
     - `memory-card-game.css` - CSS file for styling the game's interface.
     - `memory-card-game-script.js` - JavaScript file containing the game's logic.

4. **2048**

   - **Location**: `/2048`
   - **Contents**:
     - `index.html` - The main HTML document for the game.
     - `/css` - CSS files for styling the game's interface.
       Changes were made to `style.css` to match the styles of our other games.
     - `/js` - JavaScript files containing the game's logic, adapted from an
       open-source version. Changes/improvement made to the `game.js` and `view.js` modules
       can be found at the top of the respective files.

## How to Run

Already runnign website can be found at https://jpsingh10.github.io/ECS162-p2/arcade/index.html

To run the Kids Game Arcade website locally, you need to follow these steps:

1. Clone or download the repository containing the project.
2. Navigate to the root directory of the project.
3. Open the `index.html` file located inside the `arcade` directory in your web
   browser to access the front page of the arcade.
4. From the front page, you can select and play any of the games.

## Notes

- The "2048" game implementation is adapted from an existing open-source project.
  Modifications and improvements should respect the original licensing terms.
