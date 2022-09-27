//#ef NOTES
/*
position sideshow panels
WORK ON DIMENSIONS
1080X720
15 PIXEL MARGIN
IMPORT NOTATION SVG FROM LILYPOD
SIDESHOW PANES
Notation Pane and Sideshow Panes
Refine notation
Determine size of lilypond page to fit notation pane
Measure distance between notes to assure proportionality
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

//##ef World Panel Variables
let worldPanel;
const DEVICE_SCREEN_W = window.screen.width;
const DEVICE_SCREEN_H = window.screen.height;
console.log(DEVICE_SCREEN_W);
const MAX_W = 1280; //16:10 aspect ratio; 0.625
const MAX_H = 720;
const WORLD_MARGIN = 15;
const WORLD_W = Math.min(DEVICE_SCREEN_W, MAX_W)-(WORLD_MARGIN*2);
const WORLD_H = Math.min(DEVICE_SCREEN_H, MAX_H)-45;
const WORLD_CENTER = WORLD_W / 2;
const GAP = 6;
const WORLD_W_FRAMES = WORLD_W / PX_PER_FRAME;
//##endef World Panel Variables

//##ef Canvas Variables
let canvasNotationDiv, canvasNotationSVG;
const NUMSIDESHOW = 4;
let sideShowDivs = [];
let sideShowSVGs = [];
let canvasSideShow01_div, canvasSideShow02_div, canvasSideShow03_div, canvasSideShow04_div;
let canvasSideShow01_SVG, canvasSideShow02_SVG, canvasSideShow03_SVG, canvasSideShow04_SVG;
const SIDESHOWCANVAS_H = (WORLD_H * 0.333) - 6;
const SIDESHOWCANVAS_W = (WORLD_W - (WORLD_MARGIN*5) ) /4;
const SIDESHOWCANVAS_TOP = 3;
const NOTATIONCANVAS_TOP = WORLD_H * 0.333; // 800 x 333
const NOTATIONCANVAS_H = WORLD_H * 0.667;
const NOTATIONCANVAS_W = WORLD_W;
//##endef Canvas Variables

//##ef Staff Notation
let staffNotationSVG;
//##endef Staff Notation


//#endef GLOBAL VARIABLES

//#ef INIT
function init() {

  makeWorldPanel();
//  makeCanvas();
  // makeStaffNotation();

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

  //###ef Notation Canvas
  canvasNotationDiv = mkDiv({
    canvas: worldPanel.content,
    w: NOTATIONCANVAS_W,
    h: NOTATIONCANVAS_H,
    top: NOTATIONCANVAS_TOP,
    left: 0,
    bgClr: 'white'
  });

  canvasNotationSVG = mkSVGcontainer({
    canvas: canvasNotationDiv,
    w: NOTATIONCANVAS_W,
    h: NOTATIONCANVAS_H,
    x: 0,
    y: 0,
    clr: 'white'
  });
  //###endef Notation Canvas

  //###ef Sideshow Canvas 01
  canvasSideShow01_div = mkDiv({
    canvas: worldPanel.content,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    top: SIDESHOWCANVAS_TOP,
    left: 3,
    bgClr: 'black'
  });

  canvasSideShow01_SVG = mkSVGcontainer({
    canvas: canvasSideShow01_div,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    x: 0,
    y: 0,
    clr: 'black'
  });
  //###endef Sideshow Canvas 01

  //###ef Sideshow Canvas 02
  canvasSideShow02_div = mkDiv({
    canvas: worldPanel.content,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    top: SIDESHOWCANVAS_TOP,
    left: SIDESHOWCANVAS_W + 6,
    bgClr: 'black'
  });

  canvasSideShow02_SVG = mkSVGcontainer({
    canvas: canvasSideShow02_div,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    x: 0,
    y: 0,
    clr: 'black'
  });
  //###endef Sideshow Canvas 02

  //###ef Sideshow Canvas 03
  canvasSideShow03_div = mkDiv({
    canvas: worldPanel.content,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    top: SIDESHOWCANVAS_TOP,
    left: (SIDESHOWCANVAS_W * 2) + 9,
    bgClr: 'black'
  });

  canvasSideShow03_SVG = mkSVGcontainer({
    canvas: canvasSideShow03_div,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    x: 0,
    y: 0,
    clr: 'black'
  });
  //###endef Sideshow Canvas 03

  //###ef Sideshow Canvas 04
  canvasSideShow04_div = mkDiv({
    canvas: worldPanel.content,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    top: SIDESHOWCANVAS_TOP,
    left: (SIDESHOWCANVAS_W * 3) + 12,
    bgClr: 'black'
  });

  canvasSideShow04_SVG = mkSVGcontainer({
    canvas: canvasSideShow04_div,
    w: SIDESHOWCANVAS_W,
    h: SIDESHOWCANVAS_H,
    x: 0,
    y: 0,
    clr: 'black'
  });
  //###endef Sideshow Canvas 04
} // function makeCanvas() END
//##endef Make Canvas

//##ef Make Staff Notation
function makeStaffNotation() {

  let staffNotationSVG = document.createElementNS(SVG_NS, "image");
  staffNotationSVG.setAttributeNS(XLINK_NS, 'xlink:href', '/pieces/sf005/notation/InteractiveLoopingLine001-1.svg');
  staffNotationSVG.setAttributeNS(null, "y", 0);
  staffNotationSVG.setAttributeNS(null, "x", 0);
  staffNotationSVG.setAttributeNS(null, "visibility", 'visible');
  staffNotationSVG.setAttributeNS(null, "display", 'yes');
  canvasNotationSVG.appendChild(staffNotationSVG);

} // makeStaffNotation() END
//##endef Make Staff Notation

//#endef BUILD WORLD


/*

//#ef GLOBAL VARIABLES

//##ef General Variables
let scoreData;
const colorsInOrder = [clr_brightOrange, clr_brightBlue, clr_mustard, clr_brightGreen, clr_lavander, clr_brightRed, clr_limeGreen, clr_neonMagenta];
//##endef General Variables

//##ef URL Args
let PIECE_ID = 'pieceId';
let partsToRun = [];
let TOTAL_NUM_PARTS_TO_RUN;
let SCORE_DATA_FILE_TO_LOAD = "";
let scoreControlsAreEnabled = true;
//##endef URL Args

//##ef Cursor Variables
let cursorLine, cursorRectFront, cursorRectBack;
const CURSOR_RECT_W = 40;
const CURSOR_X = Math.round(WORLD_W / 4);
const NUM_PX_WORLD_R_TO_CURSOR = WORLD_W - CURSOR_X;
const NUM_FRAMES_WORLD_R_TO_CURSOR = Math.round(NUM_PX_WORLD_R_TO_CURSOR / PX_PER_FRAME);
const NUM_FRAMES_WORLD_CURSOR_TO_WORLD_L = Math.round(CURSOR_X / PX_PER_FRAME);
const CURSOR_BACK_CENTER_X = CURSOR_X - (CURSOR_RECT_W / 2);
//##endef Cursor Variables

//##ef Portal Variables
const PORTAL_H = 36;
const PORTAL_HALF_H = PORTAL_H / 2;
const PORTAL_MARGIN = 10;
const PORTAL_GAP = PORTAL_MARGIN + PORTAL_H;
//##endef Portal Variables

//##ef Clock Variables
const NUM_ARCS_PER_CLOCK = 60;
const ARC_DEG_INC = 6;

//##endef Clock Variables

//#ef Animation Engine Variables
let cumulativeChangeBtwnFrames_MS = 0;
let epochTimeOfLastFrame_MS;
let animationEngineCanRun = false;
//#endef END Animation Engine Variables

//#ef SOCKET IO
let ioConnection;

if (window.location.hostname == 'localhost') {
  ioConnection = io();
} else {
  ioConnection = io.connect(window.location.hostname);
}
const SOCKET = ioConnection;
//#endef > END SOCKET IO

//#ef TIMESYNC
const TS = timesync.create({
  server: '/timesync',
  interval: 1000
});
//#endef TIMESYNC

//#endef GLOBAL VARIABLES

//#ef INIT
function init() {

  scoreData = generateScoreData();

  scoreCtrlPanel = makeControlPanel();
  makeWorldPanel();
  makeCanvas();
  makeLiveSampPortals();
  gc1_makePortals()

  makeCursor();

  makeLiveSampPortals_clock();
  gc1_makePortals_clock();

  makeClock();

} // function init() END
//#endef INIT

//#ef GENERATE SCORE DATA
function generateScoreData() {

  //##ef GENERATE SCORE DATA - VARIABLES
  let scoreDataObject = {};
  //##endef GENERATE SCORE DATA - VARIABLES

  return scoreDataObject;
} // function generateScoreData()
//#endef GENERATE SCORE DATA

//#ef BUILD WORLD

//##ef Make World Panel
function makeWorldPanel() {

  worldPanel = mkPanel({
    w: WORLD_W,
    h: WORLD_H,
    title: 'SoundFlow #5',
    onwindowresize: true,
    clr: 'none'
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
  canvas = mkSVGcontainer({
    canvas: worldPanel.content,
    w: WORLD_W,
    h: WORLD_H,
    x: 0,
    y: 0,
    clr: 'black'
  });
} // function makeCanvas() END
//##endef Make Canvas

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


function makeStaffNotation() {



  //##ef Draw Initial Notation
  // Make all motives and make display:none; Display All Quarters
  //make an SVG for each motive at each beat
  beatCoords.forEach((beatCoordsObj, beatIx) => { //each beat loop

    let tx = beatCoordsObj.x;
    let ty = beatCoordsObj.y;

    // motiveInfoSet = [{ // {path:, lbl:, num:, w:, h:, numPartials:}//used to be notationSvgPaths_labels
    motiveInfoSet.forEach((motiveObj) => { //each motive loop

      let tLabel = motiveObj.lbl;
      let motiveNum = motiveObj.num;
      let tDisp = motiveObj.num == 0 ? 'yes' : 'none'; //initial notation displayed
      // let tDisp = motiveObj.num == 3 ? 'yes' : 'none'; //initial notation displayed

      // Create HTML SVG image
      let tSvgImage = document.createElementNS(SVG_NS, "image");
      tSvgImage.setAttributeNS(XLINK_NS, 'xlink:href', '/pieces/sf004/notationSVGs/motives/' + tLabel + '.svg');
      tSvgImage.setAttributeNS(null, "y", ty - motiveObj.h);
      tSvgImage.setAttributeNS(null, "x", tx);
      tSvgImage.setAttributeNS(null, "visibility", 'visible');
      tSvgImage.setAttributeNS(null, "display", tDisp);
      rhythmicNotationObj.svgCont.appendChild(tSvgImage);

      motivesByBeat[beatIx][motiveNum] = tSvgImage;

    }); //notationSvgPaths_labels.forEach((motiveObj)  END

  }); //beatCoords.forEach((beatCoordsObj) END
  //##endef END Draw Initial Notation

} // makeStaffNotation() END

//#endef BUILD WORLD

//#ef CONTROL PANEL

//#ef Control Panel Vars
let scoreCtrlPanel;
const CTRLPANEL_W = 300;
const CTRLPANEL_H = 580;
const CTRLPANEL_MARGIN = 8;
const CTRLPANEL_MARGINS = CTRLPANEL_MARGIN * 2;
const BUTTON_MARGIN = 8;
const BUTTON_MARGINS = BUTTON_MARGIN * 2;
const CTRLPANEL_BTN_W = CTRLPANEL_W - CTRLPANEL_MARGINS - BUTTON_MARGINS;
const CTRLPANEL_BTN_H = 40;
const CTRLPANEL_BTN_L = (CTRLPANEL_W / 2) - (CTRLPANEL_BTN_W / 2) - CTRLPANEL_MARGIN - BUTTON_MARGIN;
const CTRLPANEL_SELECT_W = CTRLPANEL_W - CTRLPANEL_MARGINS - BUTTON_MARGINS;
const CTRLPANEL_SELECT_H = 40;
const CTRLPANEL_SELECT_ARROW_PAD = 8;
const CTRLPANEL_SELECT_L = (CTRLPANEL_W / 2) - (CTRLPANEL_SELECT_W / 2) - CTRLPANEL_MARGIN + CTRLPANEL_SELECT_ARROW_PAD;
let piece_canStart = true;
let startBtn_isActive = true;
let stopBtn_isActive = false;
let pauseBtn_isActive = false;
let gotoBtn_isActive = false;
let joinBtn_isActive = true;
let joinGoBtn_isActive = false;
let restartBtn_isActive = true;
//#endef END Control Panel Vars

//##ef Make Control Panel
function makeControlPanel() {

  let controlPanelObj = {};
  let BUTTON_GAP = CTRLPANEL_BTN_H + CTRLPANEL_MARGIN + 18;

  //###ef Control Panel Panel
  let controlPanelPanel = mkPanel({
    w: CTRLPANEL_W,
    h: CTRLPANEL_H,
    title: 'sf005 Control Panel',
    ipos: 'left-top',
    offsetX: '0px',
    offsetY: '0px',
    autopos: 'none',
    headerSize: 'xs',
    onwindowresize: true,
    contentOverflow: 'hidden',
    clr: 'black'
  });
  controlPanelObj['panel'] = controlPanelPanel;
  //###endef Control Panel Panel

  //###ef Start Audio Button
  let startAudioButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN,
    left: CTRLPANEL_MARGIN,
    label: 'Start Audio',
    fontSize: 14,
    action: function() {
      initAudio();
    }
  });
  controlPanelObj['startAudioBtn'] = startAudioButton;
  //###endef Start Audio Button

  //###ef Audio Input Select
  let inputSelectDiv = mkDiv({
    canvas: controlPanelPanel,
    w: CTRLPANEL_SELECT_W,
    h: CTRLPANEL_SELECT_H,
    top: CTRLPANEL_MARGIN + BUTTON_GAP + 35,
    left: CTRLPANEL_SELECT_L,
    bgClr: '#24b662'
  });
  inputSelectDiv.className = 'select';

  let inputSelect = document.createElement('select');
  inputSelect.className = 'select';
  inputSelectDiv.appendChild(inputSelect);

  controlPanelObj['audioInputSelect'] = inputSelect;
  //###endef Audio Input Select

  //###ef Start Piece Button
  let startButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 2),
    left: CTRLPANEL_MARGIN,
    label: 'Start',
    fontSize: 14,
    action: function() {
      markStartTime_startAnimation();
    }
  });
  controlPanelObj['startBtn'] = startButton;
  //###endef Start Piece Button

  //###ef Pause Button
  let pauseButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 3),
    left: CTRLPANEL_MARGIN,
    label: 'Pause',
    fontSize: 14,
    action: function() {
      pauseBtnFunc();
    }
  });
  pauseButton.className = 'btn btn-1_inactive';
  controlPanelObj['pauseBtn'] = pauseButton;
  //###endef Pause Button

  //###ef Stop Button
  let stopButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 4),
    left: CTRLPANEL_MARGIN,
    label: 'Stop',
    fontSize: 14,
    action: function() {
      stopBtnFunc();
    }
  });
  stopButton.className = 'btn btn-1_inactive';
  controlPanelObj['stopBtn'] = stopButton;
  //###endef Stop Button

  //###ef GoTo Input Fields & Button

  //###ef GoTo Button
  let gotoButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W - 94,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 5),
    left: CTRLPANEL_MARGIN,
    label: 'Go To',
    fontSize: 14,
    action: function() {
      gotoBtnFunc();
    }
  });
  gotoButton.className = 'btn btn-1_inactive';
  controlPanelObj['gotoBtn'] = gotoButton;
  //###endef GoTo Button

  let goToField_w = 18;
  let goToField_h = 18;
  let goToField_top = CTRLPANEL_MARGIN + (BUTTON_GAP * 5) + 18;
  let goToField_left = CTRLPANEL_W - CTRLPANEL_MARGIN - goToField_w - 15;

  //###ef GoTo Input Fields
  let goTo_secondsInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoSecInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left,
    fontSize: 15,
  }); // let goTo_secondsInput = mkInputField
  goTo_secondsInput.style.textAlign = 'right';
  goTo_secondsInput.value = 0;
  controlPanelObj['gotoSecInput'] = goTo_secondsInput;
  goTo_secondsInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_secondsInput.value > 59) goTo_secondsInput.value = 59;
    if (goTo_secondsInput.value < 0) goTo_secondsInput.value = 0;
  });
  goTo_secondsInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });

  let goTo_minutesInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoMinInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left - goToField_w - 10,
    fontSize: 15,
  }); // let goTo_minutesInput = mkInputField
  goTo_minutesInput.style.textAlign = 'right';
  goTo_minutesInput.value = 0;
  controlPanelObj['gotoMinInput'] = goTo_minutesInput;
  goTo_minutesInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_minutesInput.value > 59) goTo_minutesInput.value = 59;
    if (goTo_minutesInput.value < 0) goTo_minutesInput.value = 0;
  });
  goTo_minutesInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });

  let goTo_hoursInput = mkInputField({
    canvas: controlPanelPanel.content,
    id: 'gotoHrInput',
    w: goToField_w,
    h: goToField_h,
    top: goToField_top,
    left: goToField_left - goToField_w - 10 - goToField_w - 10,
    fontSize: 15,
  }); // let goTo_hoursInput = mkInputField
  goTo_hoursInput.style.textAlign = 'right';
  goTo_hoursInput.value = 0;
  controlPanelObj['gotoHrInput'] = goTo_hoursInput;
  goTo_hoursInput.addEventListener("blur", function(e) { //function for when inputfield loses focus; make sure the number is between 0-59
    if (goTo_hoursInput.value < 0) goTo_hoursInput.value = 0;
  });
  goTo_hoursInput.addEventListener("click", function(e) { // selects text when clicked
    this.select();
  });
  //###endef GoTo Input Fields



  //###endef GoTo Input Fields & Button

  //##ef Piece ID Caption
  let pieceIdDisplayLbl = mkSpan({
    canvas: controlPanelPanel.content,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 6),
    left: CTRLPANEL_MARGIN + 11,
    text: 'Piece ID:',
    fontSize: 13,
    color: 'white'
  });
  let pieceIdDisplay = mkSpan({
    canvas: controlPanelPanel.content,
    top: CTRLPANEL_MARGIN + (BUTTON_GAP * 6) + 20,
    left: CTRLPANEL_MARGIN + 11,
    text: PIECE_ID.toString(),
    fontSize: 13,
    color: 'white'
  });
  //##endef Piece ID Caption

  //###ef Join Button
  let joinButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_H - CTRLPANEL_BTN_H - CTRLPANEL_MARGIN - 22 - BUTTON_GAP,
    left: CTRLPANEL_MARGIN,
    label: 'Join',
    fontSize: 14,
    action: function() {
      joinBtnFunc();
    }
  });
  joinButton.className = 'btn btn-1';
  controlPanelObj['joinBtn'] = joinButton;
  //###endef Join Button

  //###ef Join Go Button
  let joinGoButton = mkButton({
    canvas: controlPanelPanel.content,
    w: CTRLPANEL_BTN_W,
    h: CTRLPANEL_BTN_H,
    top: CTRLPANEL_H - CTRLPANEL_BTN_H - CTRLPANEL_MARGIN - 22,
    left: CTRLPANEL_MARGIN,
    label: 'Go',
    fontSize: 14,
    action: function() {
      joinGoBtnFunc();
    }
  });
  joinGoButton.className = 'btn btn-1_inactive';
  joinGoButton.className = 'btn btn-1';
  controlPanelObj['joinGoBtn'] = joinGoButton;
  //###endef Join Go Button

  if (!scoreControlsAreEnabled) {
    startBtn_isActive = false;
    startButton.className = 'btn btn-1_inactive';
  }

  return controlPanelObj;

} // function makeControlPanel() END
//##endef Make Control Panel

//##ef Start Piece Button Function & Socket

// Broadcast Start Time when Start Button is pressed
// This function is run from the start button above in Make Control Panel
let markStartTime_startAnimation = function() {
  if (startBtn_isActive) {

    let ts_Date = new Date(TS.now());
    let t_startTime_epoch = ts_Date.getTime(); //send your current time to server to relay as the start time for everyone when received back from server

    // Send start time to server to broadcast to rest of players
    SOCKET.emit('sf005_newStartTimeBroadcast_toServer', {
      pieceId: PIECE_ID,
      startTime_epochTime_MS: t_startTime_epoch,
      pieceClockAdjustment: pieceClockAdjustment,
      pauseState: pauseState,
      timePaused: timePaused
    });

  } // if (startBtn_isActive)
} // let markStartTime = function() END

//START PIECE RECEIVE SOCKET FROM SERVER BROADCAST
// Receive new start time from server broadcast and set startTime_epochTime_MS
SOCKET.on('sf005_newStartTime_fromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    if (piece_canStart) { //Gate so the start functions aren't activated inadverently

      piece_canStart = false;
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
      if (scoreControlsAreEnabled) {
        stopBtn_isActive = true;
        scoreCtrlPanel.stopBtn.className = 'btn btn-1';
        pauseBtn_isActive = true; //activate pause button
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
        gotoBtn_isActive = true;
        scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
      }
      joinBtn_isActive = false;
      scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';
      animationEngineCanRun = true; //unlock animation gate


      // scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

      startTime_epochTime_MS = data.startTime_epochTime_MS; //stamp start time of this piece with timestamp relayed from server
      epochTimeOfLastFrame_MS = data.startTime_epochTime_MS; //update epochTimeOfLastFrame_MS so animation engine runs properly

      requestAnimationFrame(animationEngine); //kick off animation

    } // if (piece_canStart)
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf005_newStartTime_fromServer', function(data) END
//##endef Start Piece function & socket

//##ef Pause Button Function & Socket
// This function is run from the pause button above in Make Control Panel
let pauseBtnFunc = function() {
  if (pauseBtn_isActive) { //gate

    //increment the pause state here locally, but don't update global variable pauseState until received back from server
    let thisPress_pauseState = (pauseState + 1) % 2; //pause button is a toggle, change state each time it is pressed
    let tsNow_Date = new Date(TS.now());
    let timeAtPauseBtnPress_MS = tsNow_Date.getTime(); //timeAtPauseBtnPress_MS

    if (thisPress_pauseState == 1) { //Paused
      SOCKET.emit('sf005_pause', {
        pieceId: PIECE_ID,
        thisPress_pauseState: thisPress_pauseState,
        timeAtPauseBtnPress_MS: timeAtPauseBtnPress_MS,
        new_pieceClockAdjustment: pieceClockAdjustment //only used for unpause
      });
    } // if (pauseState == 1) { //Paused
    //
    else if (thisPress_pauseState == 0) { //unpaused

      let tsNow_Date = new Date(TS.now());
      let t_currTime_MS = tsNow_Date.getTime();
      //For here and in goto, you want the pieceClockAdjustment to be the same for all clients
      //Calculate here before sending to server to broadcast, and when received, set this number to pieceClockAdjustment for everyone
      let new_pieceClockAdjustment = t_currTime_MS - timePaused + pieceClockAdjustment; //t_currTime_MS - timePaused will be the amount of time to subtract off current time to get back to time when the piece was paused; + pieceClockAdjustment to add to any previous addjustments

      SOCKET.emit('sf005_pause', {
        pieceId: PIECE_ID,
        thisPress_pauseState: thisPress_pauseState,
        timeAtPauseBtnPress_MS: timeAtPauseBtnPress_MS,
        new_pieceClockAdjustment: new_pieceClockAdjustment
      });
    } // else if (pauseState == 0) { //unpaused

  } // if (pauseBtn_isActive)
} //let pauseBtnFunc = function()

//PAUSE PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_pause_broadcastFromServer', function(data) {

  let requestingId = data.pieceId;
  let thisPress_pauseState = data.thisPress_pauseState;
  let timeAtPauseBtnPress_MS = data.timeAtPauseBtnPress_MS;
  let new_pieceClockAdjustment = data.new_pieceClockAdjustment;

  if (requestingId == PIECE_ID) {

    if (thisPress_pauseState == 1) { //paused
      timePaused = timeAtPauseBtnPress_MS; //update local global variables //store in server
      pauseState = thisPress_pauseState; //store in server for join
      animationEngineCanRun = false;
      if (scoreControlsAreEnabled) {
        scoreCtrlPanel.pauseBtn.innerText = 'Resume';
        scoreCtrlPanel.pauseBtn.className = 'btn btn-2';
      }
    } //if (pauseState == 1) { //paused
    //
    else if (thisPress_pauseState == 0) { //unpaused
      pauseState = thisPress_pauseState;
      pieceClockAdjustment = new_pieceClockAdjustment; //t_currTime_MS - timePaused will be the amount of time to subtract off current time to get back to time when the piece was paused; + pieceClockAdjustment to add to any previous addjustments
      if (scoreControlsAreEnabled) {
        scoreCtrlPanel.pauseBtn.innerText = 'Pause';
        scoreCtrlPanel.pauseBtn.className = 'btn btn-1';
      }
      scoreCtrlPanel.panel.smallify();
      animationEngineCanRun = true;
      requestAnimationFrame(animationEngine);
    } //else if (pauseState == 0) { //unpaused

  } //if (requestingId == PIECE_ID)

}); // SOCKET.on('sf005_pauseBroadcast', function(data)

//##endef Pause Button Function & Socket

//##ef Stop Piece Button Function & Socket

let stopBtnFunc = function() {
  if (stopBtn_isActive) {

    // Send stop command to server to broadcast to rest of players
    SOCKET.emit('sf005_stop', { //stop also deletes this pieceId's score data on the server
      pieceId: PIECE_ID,
    });

  } // if (startBtn_isActive)
} // stopBtnFunc = function() END

//STOP PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_stop_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    location.reload();
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf005_stop_broadcastFromServer', function(data) END

//##endef Stop Piece Button Function & Socket

//##ef Goto Button Function & Socket

let gotoBtnFunc = function() {
  if (gotoBtn_isActive) { //gate

    //Get Goto time and convert to MS
    let goToTimeMS = (scoreCtrlPanel.gotoHrInput.value * 60 * 60 * 1000) + (scoreCtrlPanel.gotoMinInput.value * 60 * 1000) + (scoreCtrlPanel.gotoSecInput.value * 1000);
    let tsNow_Date = new Date(TS.now());
    let t_currTime_MS = tsNow_Date.getTime();
    let timeAdjustmentToGetToGotoTime = PIECE_TIME_MS - goToTimeMS;
    //For here and in pause, you want the pieceClockAdjustment to be the same for all clients
    //Calculate here before sending to server to broadcast, and when received, set this number to pieceClockAdjustment for everyone
    let newPieceClockAdjustment = pieceClockAdjustment + timeAdjustmentToGetToGotoTime;

    SOCKET.emit('sf005_goto', {
      pieceId: PIECE_ID,
      newPieceClockAdjustment: newPieceClockAdjustment
    });

  } // if (gotoBtn_isActive)
} // gotoBtnFunc = function()

//PAUSE PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_goto_broadcastFromServer', function(data) {

  let requestingId = data.pieceId;
  let newPieceClockAdjustment = data.newPieceClockAdjustment;

  if (requestingId == PIECE_ID) {
    pieceClockAdjustment = newPieceClockAdjustment;
    scoreCtrlPanel.panel.smallify();
  } //if (requestingId == PIECE_ID)

}); // SOCKET.on('sf005_goto_broadcastFromServer', function(data)

//##endef Goto Button Function & Socket

//##ef Join Button Function & Socket

let joinBtnFunc = function() {
  if (joinBtn_isActive) {

    // Send stop command to server to broadcast to rest of players
    SOCKET.emit('sf005_join', {
      pieceId: PIECE_ID,
    });

  } // if (joinBtn_isActive)
} // joinBtnFunc = function() END

//STOP PIECE RECEIVE SOCKET FROM SERVER BROADCAST
SOCKET.on('sf005_join_broadcastFromServer', function(data) {
  if (data.pieceId == PIECE_ID) {
    if (piece_canStart) { //since this is broadcast all players receive; if your score is started then you won't get this join info

      //Deactivate Start Button
      piece_canStart = false;
      startBtn_isActive = false;
      scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';

      //Populate the synced data
      startTime_epochTime_MS = data.startTime_epochTime_MS;
      pieceClockAdjustment = data.pieceClockAdjustment;
      pauseState = data.pauseState;
      timePaused = data.timePaused;

      //Activate Go Button
      scoreCtrlPanel.joinGoBtn.className = 'btn btn-1';
      joinGoBtn_isActive = true;

    } //  if (piece_canStart) { //since this is broadcast all players receive; if your score is started then you won't get this join info
  } //if (data.pieceId == PIECE_ID)
}); // SOCKET.on('sf005_join_broadcastFromServer', function(data) END

//JOIN GO BUTTON FUNCTION
let joinGoBtnFunc = function() {
  if (joinGoBtn_isActive) {

    piece_canStart = false;
    startBtn_isActive = false;
    scoreCtrlPanel.startBtn.className = 'btn btn-1_inactive';
    if (scoreControlsAreEnabled) {
      stopBtn_isActive = true;
      scoreCtrlPanel.stopBtn.className = 'btn btn-1';
      pauseBtn_isActive = true; //activate pause button
      scoreCtrlPanel.pauseBtn.className = 'btn btn-1'; //activate pause button
      gotoBtn_isActive = true;
      scoreCtrlPanel.gotoBtn.className = 'btn btn-1';
    }
    joinBtn_isActive = false;
    joinGoBtn_isActive = false;
    scoreCtrlPanel.joinBtn.className = 'btn btn-1_inactive';

    scoreCtrlPanel.joinGoBtn.className = 'btn btn-1_inactive';

    animationEngineCanRun = true; //unlock animation gate


    scoreCtrlPanel.panel.smallify(); //minimize control panel when start button is pressed

    epochTimeOfLastFrame_MS = startTime_epochTime_MS

    requestAnimationFrame(animationEngine); //kick off animation

  } // if (joinGoBtn_isActive)
} // joinGoBtnFunc = function() END

//##endef Join Button Function & Socket

//#endef CONTROL PANEL

//#ef ANIMATION


//##ef Animation Engine
function animationEngine(timestamp) { //timestamp not used; timeSync server library used instead

  let ts_Date = new Date(TS.now()); //Date stamp object from TimeSync library
  let tsNowEpochTime_MS = ts_Date.getTime();
  cumulativeChangeBtwnFrames_MS += tsNowEpochTime_MS - epochTimeOfLastFrame_MS;
  epochTimeOfLastFrame_MS = tsNowEpochTime_MS; //update epochTimeOfLastFrame_MS for next frame

  while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) { //if too little change of clock time will wait until 1 animation frame's worth of MS before updating etc.; if too much change will update several times until caught up with clock time

    if (cumulativeChangeBtwnFrames_MS > (MS_PER_FRAME * FRAMERATE)) cumulativeChangeBtwnFrames_MS = MS_PER_FRAME; //escape hatch if more than 1 second of frames has passed then just skip to next update according to clock

    pieceClock(tsNowEpochTime_MS);
    wipe();
    update();
    draw();

    cumulativeChangeBtwnFrames_MS -= MS_PER_FRAME; //subtract from cumulativeChangeBtwnFrames_MS 1 frame worth of MS until while cond is satisified

  } // while (cumulativeChangeBtwnFrames_MS >= MS_PER_FRAME) END

  if (animationEngineCanRun) requestAnimationFrame(animationEngine); //animation engine gate: animationEngineCanRun

} // function animationEngine(timestamp) END
//##endef Animation Engine END

//##ef Piece Clock
function pieceClock(nowEpochTime) {

  PIECE_TIME_MS = nowEpochTime - startTime_epochTime_MS - LEAD_IN_TIME_MS - pieceClockAdjustment;
  FRAMECOUNT = Math.round((PIECE_TIME_MS / 1000) * FRAMERATE); //Update FRAMECOUNT based on timeSync Time //if in lead-in FRAMECOUNT will be negative
  calcDisplayClock(PIECE_TIME_MS);

}
//##endef Piece Clock


//#endef ANIMATION

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

//#ef CLOCK
function makeClock() {
  displayClock = mkPanel({
    w: 66,
    h: 20,
    title: 'Clock',
    ipos: 'right-top',
    clr: 'white',
    onwindowresize: true
  })
  displayClock.content.style.fontSize = "16px";
  // displayClock.smallify();
}

function calcDisplayClock(pieceTimeMS) {
  let displayClock_TimeMS = pieceTimeMS % 1000;
  let displayClock_TimeSec = Math.floor(pieceTimeMS / 1000) % 60;
  let displayClock_TimeMin = Math.floor(pieceTimeMS / 60000) % 60;
  let displayClock_TimeHrs = Math.floor(pieceTimeMS / 3600000);
  displayClock.content.innerHTML = pad(displayClock_TimeHrs, 2) + ":" + pad(displayClock_TimeMin, 2) + ":" + pad(displayClock_TimeSec, 2);
}
//#endef CLOCK


*/



//
