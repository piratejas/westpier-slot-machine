# westpier-slot-machine
Basic slot machine with Typescript, Pixi.js &amp; Tween.js

## Project Brief
We would like you to create a very basic spinning slot machine in PIXI, using tweens to animate the spinning behaviour.
- It should display 5 reels across, with 3 symbols down each reel (essentially a 5x3 grid).
- There should be a single button for spinning the slot machine.
- It should automatically stop spinning on its own, for a total spin time of three seconds.
- When it starts, all reels should start at the same time, but when it stops, each reel should stop in sequence from left to right.
- The symbols that each of the 5 reels spin through should be graphical representations of the numbers from the following 5 reel strips, wrapping around when the end of a reel is reached:
        [5, 4, 1, 3, 3, 5, 4, 0, 4, 3]
        [5, 5, 1, 4, 2, 0, 2, 3, 5, 5, 3, 1, 2, 4, 0]
        [3, 6, 4, 5, 2, 5, 5, 6]
        [3, 5, 4, 6, 2, 5, 2, 6, 1, 0]
        [1, 1, 6, 4, 1, 3, 2, 0, 3, 3]
