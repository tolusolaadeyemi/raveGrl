import { Application, Graphics, Text, Assets, Container, Sprite } from 'pixi.js';
//import { GlowFilter } from '@pixi/filter-glow';
import {initDevtools} from '@pixi/devtools';

(async() => {
  const app = new Application();

  await app.init({
    resizeTo: window,
    // backgroundAlpha: 0.5,
    //backgroundColor: 0xff69b4,
    backgroundColor: 0x000000
});

initDevtools({
    app
  });

app.canvas.style.position = 'absolute';
document.body.appendChild(app.canvas);

  const font = await Assets.load('/assets/PressStart2P-Regular.ttf');
  const text = new Text({
    text: 'RaveGrl',
    style: {
      fill: '#00FFFF',
      fontFamily: font.family,
      fontSize: 50,
      stroke: { color: '#4a1850', width: 5 },
      dropShadow: {
          color: '#C0C0C0',
          blur: 4,
          angle: Math.PI / 6,
          distance: 6,
      },
      wordWrap: true,
      wordWrapWidth: 1000
    }
  });

  // Position text
text.position.set(535, 140);
app.stage.addChild(text);

const faceContainer = new Container();
app.stage.addChild(faceContainer);

const faceBg = new Graphics()
.fill(0xffffff)
.circle(725, 500, 250)
.fill();
faceContainer.addChild(faceBg);


const faceTexture = await Assets.load('/assets/face.png');
const faceSprite = Sprite.from(faceTexture);

// scaling for a perfect fit
faceSprite.scale.set(0.2, 0.2); 
faceSprite.position.set(470, 200);
faceContainer.addChild(faceSprite);

//makeup assets
// lip liner
// looping through colors to create sprites
async function loadLipLinerOverlays() {
  const lipLinerColors = ['blue', 'black', 'purple', 'pink', 'red'];
  const lipLinerOverlays = {}; // store overlays

  await Promise.all(lipLinerColors.map(async (color) => {
      const lipLinerTexture = await Assets.load(`/assets/${color}_lip_liner.png`);
      const lipLinerOverlay = Sprite.from(lipLinerTexture);
      lipLinerOverlay.visible = false;
      // layer over the face sprite
      faceContainer.addChild(lipLinerOverlay);
      lipLinerOverlays[color] = lipLinerOverlay;
  }));
  //
  return lipLinerOverlays; // return overlays for later use
  
}

let lipLinerOverlays = await loadLipLinerOverlays();


// makeup tools
let selectedTool = null;
let selectedColor = null;


const toolbar = new Container();
toolbar.position.set(250, 500);
app.stage.addChild(toolbar);

const toolIcons = ["lipliner", "lipstick", "eyeshadow", "brush"]; 

toolIcons.forEach((tool, index) => {
    let toolButton = new Graphics()
    .fill(0xff66b2)
    .rect(20, 50 + index * 30, 20, 20)
    .fill();
    toolbar.addChild(toolButton);
    
    toolButton.eventMode = 'static';
    toolButton.on("pointerdown", () => {
      console.log(`Selected tool: ${tool}`);
      // resets all tool highlights
      toolbar.children.forEach(btn => btn.alpha = 1);
      // highlights the selected tool
       toolButton.alpha = 0.5; // dim others to show selection
        selectedTool = tool; // store the selected tool
    });
});

// color palette
const colorPalette = new Container();
colorPalette.position.set(450, 550);
app.stage.addChild(colorPalette);

const colorMap = {
  0x0000ff: "blue",
  0x000000: "black",
  0x800080: "purple",
  0xff69b4: "pink",
  0xff0000: "red"
}; // hex colors mapped to makeup names

const colors = Object.keys(colorMap).map(hex => Number(hex)); // Extract hex values

colors.forEach((color, index) => {
    let colorButton = new Graphics()
    .fill(color)
    .circle(700, 30 + index * 30, 10) // Color dots aligned vertically
    .fill();
    colorPalette.addChild(colorButton);

  
    // interactive functionality
  colorButton.eventMode = 'static';
    colorButton.on("pointerdown", () => {
      console.log(`Selected color: ${color.toString(16)}`); 
      // resets all color highlights
      colorPalette.children.forEach(btn => btn.alpha = 1);
      // highlights selected color
      colorButton.alpha = 0.5;
      // stores selected color as a name ("blue", "black", etc.)
        selectedColor = colorMap[color];
      applyMakeup();
    });
});

// apply when clicked
function applyMakeup() {
  if (selectedTool === 'lipliner' && selectedColor) {
    console.log("COLOR:", selectedColor)
    // hide all makeup overlays first (remove previous application)
    Object.values(lipLinerOverlays).forEach(overlay => overlay.visible = false);

    // find and show the correct color
    if (lipLinerOverlays[selectedColor]) {
        lipLinerOverlays[selectedColor].visible = true;
        lipLinerOverlays[selectedColor].position.set(470, 200)
        //lipLinerOverlays[selectedColor].scale.set(5, 5);
    }
}
}

})();



///TO-DO
// apply glow filter to title
//other makeup assets