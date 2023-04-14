import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import { sound } from "@pixi/sound";

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

// Add sound effects
sound.add("spin", "spinning.wav");
sound.add("stop", "stop.wav");
sound.volume("spin", 0.01);
sound.volume("stop", 0.05);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

// onAssetsLoaded handler builds the slot machine
function onAssetsLoaded() {
  // Create different slot textures
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
  // Create each reel
  interface Reel {
    container: PIXI.Container;
    strip: number[];
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
      strip: [],
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.BlurFilter(),
    };

    // Randomise start of sequence
    const randomStartIndex = Math.floor(Math.random() * reelStrips[i].length);
    const randomStartSequence = [
      ...reelStrips[i].slice(randomStartIndex),
      ...reelStrips[i].slice(0, randomStartIndex),
    ];
    reel.strip.push(...randomStartSequence);
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < reel.strip.length; j++) {
      const texturesIndex = reel.strip[j];
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

  // Build top, bottom, left & right covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5) / 2;
  const top = new PIXI.Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin - 5);
  const bottom = new PIXI.Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(
    0,
    SYMBOL_SIZE * 3 + margin - 5,
    app.screen.width,
    margin + 5
  );
  const textureButton = PIXI.Texture.from("button.png");
  const left = new PIXI.Graphics();
  left.beginFill(0, 1);
  left.drawRect(
    0,
    margin - 5,
    Math.round(app.screen.width - REEL_WIDTH * 5) / 2,
    app.screen.height - margin * 2
  );
  const right = new PIXI.Graphics();
  right.beginFill(0, 1);
  right.drawRect(
    Math.round(app.screen.width - (app.screen.width - REEL_WIDTH * 5) / 2),
    margin - 5,
    Math.round(app.screen.width - REEL_WIDTH * 5) / 2,
    app.screen.height - margin * 2
  );

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

  // Add buttonDown effect
  const onButtonDown = function () {
    button.scale.set(0.25, 0.2);
    buttonText.scale.set(2.95);
  };
  const onButtonUp = function () {
    button.scale.set(0.3, 0.25);
    buttonText.scale.set(3);
  };

  // Add text style
  const style = new PIXI.TextStyle({
    fill: "#ffffff",
    fillGradientStops: [0.6],
    fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    fontSize: 36,
    fontVariant: "small-caps",
    fontWeight: "bold",
    letterSpacing: 2,
    lineJoin: "round",
    stroke: "#f20707",
    strokeThickness: 4,
  });

  // Add button text
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
  app.stage.addChild(left);
  app.stage.addChild(right);

  // Set the interactivity
  button.interactive = true;
  button.cursor = "pointer";
  button.on("pointerdown", onButtonDown).on("pointerup", onButtonUp);
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
        .onStart(() => {
          sound.play("spin");
        })
        .easing(backout(0.2))
        .onComplete(() => {
          isWinLineSymbol(r);
          if (i === reels.length - 1) {
            running = false;
            checkWinLine(line);
          }
          sound.play("stop");
        })
        .start();
    }
  }

  // Function to check win line
  let line: string[] = [];

  function isWinLineSymbol(currentReel) {
    const winLineSymbol = currentReel.symbols.find(
      (symbol) => Math.round(symbol.y) === 150
    )._texture.textureCacheIds;
    console.log(winLineSymbol);
    line.push(winLineSymbol);
  }

  function checkWinLine(line) {
    const win = line.every((x, i, a) => x === a[0]);
    console.log(win ? "You won!" : "Try again!");
  }

  // Listen for animate update
  app.ticker.add(() => {
    // Update the slots
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
    // Update tweens group
    TWEEN.update();
  });
}

// Custom easing function
function backout(amount: number) {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}
