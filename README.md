# westpier-slot-machine

Basic slot machine with Typescript, pixi.js &amp; tween.js

## Project Brief

We would like you to create a very basic spinning slot machine in PIXI, using tweens to animate the spinning behaviour.

- It should display 5 reels across, with 3 symbols down each reel (essentially a 5x3 grid).
- There should be a single button for spinning the slot machine.
- It should automatically stop spinning on its own, for a total spin time of three seconds.
- When it starts, all reels should start at the same time, but when it stops, each reel should stop in sequence from left to right.
- The symbols that each of the 5 reels spin through should be graphical representations of the numbers from the following 5 reel strips, wrapping around when the end of a reel is reached:
  - [5, 4, 1, 3, 3, 5, 4, 0, 4, 3]
  - [5, 5, 1, 4, 2, 0, 2, 3, 5, 5, 3, 1, 2, 4, 0]
  - [3, 6, 4, 5, 2, 5, 5, 6]
  - [3, 5, 4, 6, 2, 5, 2, 6, 1, 0]
  - [1, 1, 6, 4, 1, 3, 2, 0, 3, 3]

This task should take you no more than about 3-4 days at most. You're welcome to take more time if you want to add features beyond the short brief (e.g. win lines), but that's up to you and we don't expect it since the basic task already takes up some of your time. We recommend looking at some existing online slot games to get a sense of spin behaviour.

The symbol and button graphics you use can come from anywhere. You could find some on the internet or make them yourself - up to you (this isn't an art role after all). As for the tweens, you can use any library you like (we use CreateJS/TweenJS), but do make sure you're using tweens for spinning and NOT manually moving symbols with frame-by-frame updates.

## Resources

https://pixijs.io/examples/#/demos-advanced/slots.js  
https://www.pixijselementals.com/  
https://createjs.com/docs/tweenjs/modules/TweenJS.html  
https://github.com/tweenjs/tween.js/blob/HEAD/docs/user_guide.md  
https://miltoncandelero.github.io/tweedle.js/index.html  
https://github.com/kittykatattack/learningPixi  
https://www.trysmudford.com/blog/linear-interpolation-functions/  
[Tween Movements with JavaScript](https://www.youtube.com/watch?v=YKb50865IG8)
