import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";

const app = new PIXI.Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0xffffff,
  width: window.innerWidth,
  height: window.innerHeight,
});

globalThis.__PIXI_APP__ = app;

// Preloads assets and calls handler
PIXI.Assets.load([
  "one.png",
  "two.png",
  "three.png",
  "four.png",
  "five.png",
  "six.png",
  "seven.png",
  "eight.png",
  "nine.png",
  "zero.png",
]).then(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

// onAssetsLoaded handler builds the slot machine
function onAssetsLoaded() {
  // Create different slot symbols
  const slotTextures = [
    PIXI.Texture.from("zero.png"),
    PIXI.Texture.from("one.png"),
    PIXI.Texture.from("two.png"),
    PIXI.Texture.from("three.png"),
    PIXI.Texture.from("four.png"),
    PIXI.Texture.from("five.png"),
    PIXI.Texture.from("six.png"),
    PIXI.Texture.from("seven.png"),
    PIXI.Texture.from("eight.png"),
    PIXI.Texture.from("nine.png"),
  ];

  const reelStrips = [
    [5, 4, 1, 3, 3, 5, 4, 0, 4, 3],
    [5, 5, 1, 4, 2, 0, 2, 3, 5, 5, 3, 1, 2, 4, 0],
    [3, 6, 4, 5, 2, 5, 5, 6],
    [3, 5, 4, 6, 2, 5, 2, 6, 1, 0],
    [1, 1, 6, 4, 1, 3, 2, 0, 3, 3],
  ];

  interface Reel {
    container: PIXI.Container;
    symbols: PIXI.Sprite[];
    position: number;
    previousPosition: number;
    blur: PIXI.BlurFilter;
  }
  const reels: Reel[] = [];
  const reelContainer = new PIXI.Container();
  for (let i = 0; i < 5; i++) {
    const rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel: Reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.BlurFilter(),
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < reelStrips[i].length; j++) {
      const texturesIndex = reelStrips[i][j];
      const symbol = new PIXI.Sprite(slotTextures[texturesIndex]);
      // Scale the symbol to fit symbol area
      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y =
        Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height) *
        0.95;
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5) / 2;
  const top = new PIXI.Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin);
  const bottom = new PIXI.Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);
  const textureButton = PIXI.Texture.from("button.png");

  // Build and position button
  const button = new PIXI.Sprite(textureButton);
  button.scale.set(0.3, 0.25);
  button.anchor.set(0.5);
  button.x = Math.round((bottom.width - button.width) / 2);
  button.y =
    app.screen.height -
    margin +
    Math.round((bottom.height - button.height) / 2);
  bottom.addChild(button);

  // Add button text
  const style = new PIXI.TextStyle({
    fill: "#ffffff",
    fillGradientStops: [0.6],
    fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
    fontSize: 36,
    fontVariant: "small-caps",
    fontWeight: "bold",
    letterSpacing: 2,
    lineJoin: "round",
    stroke: "#f20707",
    strokeThickness: 4,
  });

  const buttonText = new PIXI.Text("SPIN!", style);
  buttonText.scale.set(3);
  buttonText.anchor.set(0.5);
  button.addChild(buttonText);

  // Add header text
  const headerText = new PIXI.Text("MY FIRST SLOT MACHINE", style);
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // Set the interactivity
  button.interactive = true;
  button.cursor = "pointer";
  button.addListener("pointerdown", () => {
    startPlay();
  });

  let running = false;

  // Function to start playing
  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2000 + i * 250;
      new TWEEN.Tween(r)
        .to({ position: target }, time)
        .easing(backout(0.2))
        .onComplete(() => {
          if (i === reels.length - 1) {
            running = false;
          }
        })
        .start();
    }
  }

  // Listen for animate update
  app.ticker.add((delta) => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // Update symbol positions on reel
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
      }
    }
  });
}

// Listen for animate update
app.ticker.add((delta) => {
  TWEEN.update();
});

// Custom easing function
function backout(amount: number) {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}
