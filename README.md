# Cross Campus Challenge

## Features of this branch:
  * Server-side for Client-Server Architecture with JSON API interface available at /api/gamestate, and moves at /api/gamestate?move=#
    * This makes wiring up different user interfaces three-hairs-beyond-non-trivial, a series of links, etc.
    * This makes testing against other robots or distant humans somewhat easier.
  * Interface and implementation are decoupled.
  * Cleanly written internals.  155 lines with comments.
  **TRADEOFFS
  * You can only play one game at a time until someone codes up some CRUD for it.  (And that prob. isn't me yet).
  * The A.I. is pretty loose cannon at this point.  Could be less random. . .

###Rules

There are two players (one player, one AI).
Each player writes a number, hidden from the other player. It can be any integer 1 through 10. Players can only use each number once!
The players reveal their numbers.
Whoever chose the lower number gets 1 point, unless the lower number is lower by only 1, then the player with the higher number gets 2 points
If they both chose the same number, neither player gets a point.
This repeats, and the game ends when one player has 5 points.
The challenge is to write a script to play this game. Knowing the rules and all your opponent's previous numbers, can you program a strategy? You should really try playing this first with your friends — you'll see there's a deep human element to predicting your opponent's choice. Is it possible to program a strong strategy?

###Requirements

Create an algorithm for the AI by EOD Monday - 1 submission per cohort!
Instructors will test and determine the winner



