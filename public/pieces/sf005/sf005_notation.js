//#ef NOTES
/*
Implement Animation Engine
*/
//#endef NOTES

//#ef GLOBAL VARIABLES

//##ef Timing
const FRAMERATE = 60;
let FRAMECOUNT = 0;
const PX_PER_SEC = 50;
const PX_PER_HALFSEC = PX_PER_SEC / 2;
const PX_PER_FRAME = PX_PER_SEC / FRAMERATE;
const MS_PER_FRAME = 1000.0 / FRAMERATE;
const LEAD_IN_TIME_SEC = 2;
const LEAD_IN_TIME_MS = LEAD_IN_TIME_SEC * 1000;
const LEAD_IN_FRAMES = LEAD_IN_TIME_SEC * FRAMERATE;
let startTime_epochTime_MS = 0;

let pauseState = 0;
let timePaused = 0;
let pieceClockAdjustment = 0;
let displayClock;
//##endef Timing

//#ef Animation Engine Variables
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;
let animationEngineCanRun = false;
//#endef END Animation Engine Variables

//#ef TIMESYNC
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef TIMESYNC

//##ef World Panel Variables
let worldPanel;
const DEVICE_SCREEN_W = window.screen.width;
const DEVICE_SCREEN_H = window.screen.height;
// console.log(DEVICE_SCREEN_W);
const MAX_W = 1280; //16:10 aspect ratio; 0.625
const MAX_H = 720;
const WORLD_MARGIN = 15;
const WORLD_W = Math.min(DEVICE_SCREEN_W, MAX_W) - (WORLD_MARGIN * 2);
const WORLD_H = Math.min(DEVICE_SCREEN_H, MAX_H) - 45;
const WORLD_CENTER = WORLD_W / 2;
const GAP = 6;
const WORLD_W_FRAMES = WORLD_W / PX_PER_FRAME;
//##endef World Panel Variables

//##ef Canvas Variables
let notationCanvasDiv, notationCanvasSVG;
const NOTATIONCANVAS_TOP = 0;
const NOTATIONCANVAS_H = WORLD_H;
const NOTATIONCANVAS_W = WORLD_W;
//##endef Canvas Variables

//##ef Staves Variables
const NUMSTAVES = 4;
const STAFFGAP = 4;
const STAFF_H = (NOTATIONCANVAS_H - (STAFFGAP*(NUMSTAVES-1))) / NUMSTAVES;
const STAFF_W = NOTATIONCANVAS_W;
let stavesRects = [];
//##endef Staves Variables


//##ef Cursor Variables
let cursorLine, cursorRectFront, cursorRectBack;
const CURSOR_RECT_W = 40;
const CURSOR_X = Math.round(WORLD_W / 4);
const NUM_PX_WORLD_R_TO_CURSOR = WORLD_W - CURSOR_X;
const NUM_FRAMES_WORLD_R_TO_CURSOR = Math.round(NUM_PX_WORLD_R_TO_CURSOR / PX_PER_FRAME);
const NUM_FRAMES_WORLD_CURSOR_TO_WORLD_L = Math.round(CURSOR_X / PX_PER_FRAME);
const CURSOR_BACK_CENTER_X = CURSOR_X - (CURSOR_RECT_W / 2);
//##endef Cursor Variables

//#endef GLOBAL VARIABLES

//#ef INIT
function init() {

  makeWorldPanel();
  makeCanvas();
  makeStaves();

  let ts_Date = new Date(TS.now());
  let t_startTime_epoch = ts_Date.getTime();
  startTime_epochTime_MS = t_startTime_epoch;
  epochTimeOfLastFrame_MS = t_startTime_epoch;

  requestAnimationFrame(animationEngine); //kick off animation

} // function init() END
//#endef INIT

//#ef BUILD WORLD

//##ef Make World Panel
function makeWorldPanel() {
  worldPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: 'SoundFlow #5',
    onwindowresize: true,
    clr: 'none',
    ipos: 'center-top',
  });

  worldPanel.content.addEventListener('click', function() {
    document.documentElement.webkitRequestFullScreen({
      navigationUI: 'hide'
    });
  });

} // function makeWorldPanel() END
//##endef Make World Panel

//##ef Make Canvas
function makeCanvas() {

  notationCanvasDiv = mkDiv({
    canvas: worldPanel.content,
    w: NOTATIONCANVAS_W,
    h: NOTATIONCANVAS_H,
    top: NOTATIONCANVAS_TOP,
    left: 0,
    bgClr: 'white'
  });

  notationCanvasSVG = mkSVGcontainer({
    canvas: notationCanvasDiv,
    w: NOTATIONCANVAS_W,
    h: NOTATIONCANVAS_H,
    x: 0,
    y: 0,
    clr: 'white'
  });

} // function makeCanvas() END
//##endef Make Canvas

//##ef Make Staves
function makeStaves() {

  for (var i = 0; i < NUMSTAVES; i++) {
    let ty=i*(STAFF_H+STAFFGAP);
    let tStaffRect = mkSvgRect({
      svgContainer:notationCanvasSVG,
      x: 0,
      y: ty,
      w: STAFF_W,
      h: STAFF_H,
      fill: 'black',
      stroke: 'black',
      strokeW: 0,
      roundR: 0
    });

    stavesRects.push(tStaffRect);

  }

} // function makeStaves() END
//##endef Make Staves


//##ef Make Cursor
function makeCursor() {

  cursorRectFront = mkSvgRect({
    svgContainer: canvas,
    x: CURSOR_X,
    y: 1,
    w: CURSOR_RECT_W,
    h: WORLD_H - 2,
    fill: 'none',
    stroke: 'white',
    strokeW: 2,
    roundR: 0
  });

  cursorRectBack = mkSvgRect({
    svgContainer: canvas,
    x: CURSOR_X - CURSOR_RECT_W,
    y: 1,
    w: CURSOR_RECT_W,
    h: WORLD_H - 2,
    fill: 'black',
    stroke: 'white',
    strokeW: 2,
    roundR: 0
  });

  cursorLine = mkSvgLine({
    svgContainer: canvas,
    x1: CURSOR_X,
    y1: 0,
    x2: CURSOR_X,
    y2: WORLD_W,
    stroke: 'yellow',
    strokeW: 4
  });


} // function makeCursor() END
//##endef Make Cursor

//#endef BUILD WORLD

//#ef WIPE/UPDATE/DRAW


//##ef Scrolling Cursors WIPE/UPDATE/DRAW

//###ef wipeTempoCsrs
function wipeTempoCsrs() {
  tempoCursors.forEach((tempoCsr) => {
    tempoCsr.setAttributeNS(null, 'display', 'none');
  });
}
//###endef END wipeTempoCsrs

//###ef updateScrollingCsrs
function updateScrollingCsrs() {
  if (FRAMECOUNT > 0) { //No lead in motion for scrolling cursors
    scoreData.scrollingCsrCoords_perTempo.forEach((posObjSet, tempoIx) => { // Loop: set of goFrames

      let setIx = FRAMECOUNT % posObjSet.length; //adjust current FRAMECOUNT to account for lead-in and loop this tempo's set of goFrames

      let tX = posObjSet[setIx].x;
      let tY1 = posObjSet[setIx].y1;
      let tY2 = posObjSet[setIx].y2;
      tempoCursors[tempoIx].setAttributeNS(null, 'x1', tX);
      tempoCursors[tempoIx].setAttributeNS(null, 'x2', tX);
      tempoCursors[tempoIx].setAttributeNS(null, 'y1', tY1);
      tempoCursors[tempoIx].setAttributeNS(null, 'y2', tY2);
      tempoCursors[tempoIx].setAttributeNS(null, 'display', 'yes');

    }); //goFrameCycles_perTempo.forEach((bbYposSet, tempoIx) => END
  } // if (FRAMECOUNT > LEAD_IN_FRAMES) END
} // function updateScrollingCsrs() END
//###endef updateScrollingCsrs

//##endef Scrolling Cursors WIPE/UPDATE/DRAW

//#endef WIPE/UPDATE/DRAW

//#ef ANIMATION

//##ef Animation Engine
function animationEngine(timestamp) { //timestamp not used; timeSync server library used instead

  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS; //update epochTimeOfLastFrame_MS for next frame

  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) { //if too little change of clock time will wait until 1 animation frame's worth of MS before updating etc.; if too much change will update several times until caught up with clock time

    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME; //escape hatch if more than 1 second of frames has passed then just skip to next update according to clock

    wipe();
    update();
    draw();

    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME; //subtract from cumulativeChangeBtwnFrames_MS 1 frame worth of MS until while cond is satisified

  } // while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) END

  if (animationEngineCanRun) requestAnimationFrame(animationEngine); //animation engine gate: animationEngineCanRun

} // function animationEngine(timestamp) END
//##endef Animation Engine END

//#ef WIPE/UPDATE/DRAW


//##ef Wipe Function
function wipe() {
  wipeLiveSampPortals();
  wipeGc1Portals();
} // function wipe() END
//##endef Wipe Function

//##ef Update Function
function update() {
  updateLiveSamplingPortals();
  updateGc1Portals();
}
//##endef Update Function

//##ef Draw Function
function draw() {

}
//##endef Draw Function


//#endef WIPE/UPDATE/DRAW

//#endef ANIMATION





//
