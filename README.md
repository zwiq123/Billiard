This is a simple Billiards game, you can play with another player (hot chair method - not online).
What you need to run the game:
 - VS Code
 - VS Code extension - Live Server by Ritwick Dey (preferably)

1. Open the project in VS Code.
2. If you have properly installed the needed extension, then you should see a button in the bottom right corner of the window - "Go Live". Click it.
3. The game should automatically open in your browser. You're good to go.

You don't need all the project files for the game to work. You can safely delete:
 - src
 - package-lock.json
 - package.json
 - todo.txt
 - tsconfig.json
 - node_modules

About the game:
Not all the rules from the original game are implemented, to not make it too complex, but at the same time - more fun.
The moment the first ball (excluding the cue ball (the white one)) is captured, ball sides are assigned to players (Example: Player 2 captured ball #3, Player 2 is assigned filled balls, Player 1 is assigned half-filled balls).
The goal of the game is to capture all the balls of your assigned side AND THEN capture the 8-ball.
If you capture the 8-ball before you capture all your side's balls, you instantly lose.

Faults (your turn ends):
 - not capturing any ball on the table
 - capturing the cue ball
 - capturing one or more of your opponent's balls
 - capturing the 8-ball prematurely (end of game)

The white player icon indicates who's turn it is.

In the settings (top right corner), you can turn off helping lines or restart the game.
