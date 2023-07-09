let Font;
var DB_R=9,DB_G=13,DB_B=31;//ダークブルー・メイン（最も暗い）
var LB_R=32,LB_G=37,LB_B=64;//ライトブルー・サブ（３番目に明るい）
var LBS_R=77,LBS_G=90,LBS_B=106;//さらに明るいライトブルー・少し強調（２番目に明るい）
var Orange_R=242, Orange_G=144,Orange_B=25;//オレンジ・強調（最も明るい）
var White=247;//白・少し強調（最も明るい）
var btnUnit //ボタンのサイズを決めるためのユニット。画面サイズに対応して変化。
var mStrokeW=4;//メインのstrokeWeight
var dispScore=0;//0から加算されていくところが見える表示用スコア

function preload() {
  Font=loadFont('Barlow-Light.ttf');
} //draw内にtextFont(Font);があり。

var boxSize;
var boxSizeRate=0.25;//画面サイズに対応させて立方体のサイズを割合で小さくする
var boxSizeOrigin;//立方体のサイズを決める数字（画面横幅か縦幅、どちらか短い方。）

var a; //box composed of (a,a,a) is the initial position of the virtual box
var Vz //virtual plane is z=v_z
var Fz //Castting support point
var fov //画角。視野角。デフォルトで60degree。z軸基準でzy平面を見て30*2

var cam_x, cam_y, cam_z; //The position of camera
//also (Ex,Ey,Ez)

var cam_z_Vz; //the distance between cam_z and Vz

var casted_x, casted_y; //casted posiion on the Vz, drawn by user

//Redrawn vertex of cube on the virtual plane
var Vx1, Vy1;
var Vx2, Vy2;
var Vx3, Vy3;
var Vx4, Vy4;
var Vx5, Vy5;
var Vx6, Vy6;
var Vx7, Vy7;
var Vx8, Vy8;

//Points of virtual box: Final points(X,Y,Z rotated)
var x1, y1, z1;
var x2, y2, z2;
var x3, y3, z3;
var x4, y4, z4;
var x5, y5, z5;
var x6, y6, z6;
var x7, y7, z7;
var x8, y8, z8;

//Points of virtual box: Y rotated
var Yrotated_x1, Yrotated_y1, Yrotated_z1;
var Yrotated_x2, Yrotated_y2, Yrotated_z2;
var Yrotated_x3, Yrotated_y3, Yrotated_z3;
var Yrotated_x4, Yrotated_y4, Yrotated_z4;
var Yrotated_x5, Yrotated_y5, Yrotated_z5;
var Yrotated_x6, Yrotated_y6, Yrotated_z6;
var Yrotated_x7, Yrotated_y7, Yrotated_z7;
var Yrotated_x8, Yrotated_y8, Yrotated_z8;

//Points of virtual box: X and Y rotated
var XYrotated_x1, XYrotated_y1, XYrotated_z1;
var XYrotated_x2, XYrotated_y2, XYrotated_z2;
var XYrotated_x3, XYrotated_y3, XYrotated_z3;
var XYrotated_x4, XYrotated_y4, XYrotated_z4;
var XYrotated_x5, XYrotated_y5, XYrotated_z5;
var XYrotated_x6, XYrotated_y6, XYrotated_z6;
var XYrotated_x7, XYrotated_y7, XYrotated_z7;
var XYrotated_x8, XYrotated_y8, XYrotated_z8;

//How much angle box is turned
var x_angle; //rotate around X axis
var y_angle; //rotate around Y axis
var z_angle; //rotate around Z axis

//Drawing answer line
var stick_x1, stick_y1;
var stick_x2, stick_y2;
var stick_x3, stick_y3;
var start_x1, start_y1;
var start_x2, start_y2;
var start_x3, start_y3;
var end_x1, end_y1;
var end_x2, end_y2;
var end_x3, end_y3;

//Score
var users_Answer_x, users_Answer_y;
var Answer_x, Answer_y;
var score;

//Flags
var flagStage = 1;
var flagShowAnswer = 0;//1になると答え(Solution)を表示する
var flagDrawing = 0;
var flagDrew = 0;
var flagLine = 0;
var flaghideYours = 0;//1になるとユーザーの描いたスケッチを消すフラグ
var flagScore=0;//1になるとスコアを表示する

var StageNum = 1;
var StageCount=1;

function touchStarted() {
  if (mouseY < windowHeight - btnUnit*9 &&flagScore==0) {
    if (StageNum == 1) {
      if (flagLine == 2) {
        flagLine = 0;
      }
    }
    if (StageNum == 0) {
      if (flagLine == 3) {
        flagLine = 0;
      }
    }
    if (flagLine == 0) {
      start_x1 = castX(mouseX, windowWidth);
      start_y1 = castY(mouseY, windowHeight);
    }
    if (flagLine == 1) {
      start_x2 = castX(mouseX, windowWidth);
      start_y2 = castY(mouseY, windowHeight);
    }
    if (flagLine == 2) {
      start_x3 = castX(mouseX, windowWidth);
      start_y3 = castY(mouseY, windowHeight);
    }
    flagDrawing = 1; //start drawing
    flagDrew = 0;
    return false;
  }
}

function touchEnded() {
  if (mouseY < windowHeight - btnUnit*9&&flagScore==0) {
    if (flagLine == 0) {
      end_x1 = stick_x1;
      end_y1 = stick_y1;
    }
    if (flagLine == 1) {
      end_x2 = stick_x2;
      end_y2 = stick_y2;
    }
    if (flagLine == 2) {
      end_x3 = stick_x3;
      end_y3 = stick_y3;
    }
    flagDrawing = 0; //no drawing
    flagDrew = 1; //finished drawing
    flagLine += 1;
    return false;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  if(windowWidth<windowHeight){
    boxSizeOrigin=windowWidth;
    btnUnit=windowWidth/28;
  }else{
    boxSizeOrigin=windowHeight;
    btnUnit=windowHeight/28;
  }
  boxSize = boxSizeOrigin*boxSizeRate;
  noFill();
  //Q1:Dicede how it appears
  x_angle = random(20, 60);
  y_angle = random(30, 70);
  z_angle = random(-140, 170);
  a = boxSize;
  fov = 60;
  Vz = 100; //Vz can change the size of box you see. 2000→too small, 100→proper, 
  //Fz=2000;//Fz can change the strength of perspective. 800→proper strong, 3000→almost ortho
  Fz = random(windowWidth*1.7, windowWidth*2);//iPhoneXのwindowWidthが414
  //Fzやx_angle, y_angle, z_angleはrefreshBtn_mousePressedみたいなやつの中で再定義されている（NEXTボタンを押したときに再度ランダム生成される）
  cam_z_Vz = windowHeight / (2 * tan(radians(fov / 2)));
  
  //３つのボタンの背景の役割をするだけのダミーボタン（四隅のラディアスがかかっているため後ろが微妙に見えていた）
  var backDam=createButton(" ");

  var answerButton = createButton("CHECK");
  var redrawButton = createButton("REDRAW");
  var refreshButton = createButton("NEXT");
  
  var solutionButton = createButton("SOLUTION");
  var yourSketchButton = createButton("YOUR SKETCH");
  var bothButton = createButton("BOTH");
  
  //選ばれている状態（ユーザーの滞在状況表示）を示すボタン。実際はボタンの機能を持たないダミー。
  var Sed_solutionButton = createButton("SOLUTION");
  var Sed_yourSketchButton = createButton("YOUR SKETCH");
  var Sed_bothButton = createButton("BOTH");
  
  //3つのボタンの背景のダミーボタン。設定はRedrawボタンと同じ
  backDam.style("font-size", "30px");
  let backDamCol=color(LB_R,LB_G,LB_B);
  backDam.style('background-color', backDamCol);
  backDam.style('border-radius',"16px");
  backDam.style('border',"0px");
  backDam.size(windowWidth - btnUnit*6, btnUnit*3);
  backDam.position(btnUnit*6/2, height - btnUnit*9);
  
  //Checkボタン
  answerButton.style("font-size", "30px");
  let answerCol=color(Orange_R,Orange_G,Orange_B);
  answerButton.style('background-color', answerCol);
  // let answerFontCol=color(White);
  let answerFontCol=color(DB_R,DB_G,DB_G);
  answerButton.style('color', answerFontCol);
  // answerButton.style('font-family', "Roboto");
  answerButton.style('border-radius',"16px");
  answerButton.style('border',"0px");
  answerButton.size(windowWidth - btnUnit*6, btnUnit*3);
  answerButton.position(btnUnit*6/2, height - btnUnit*5);//x座標は.sizeのx幅にてwindowWidthから引いていた数。ここではbtnUnit*6/2
  
  //Redrawボタン
  redrawButton.style("font-size", "30px");
  let redrawCol=color(LB_R,LB_G,LB_B);
  redrawButton.style('background-color', redrawCol);
  let redrawFontCol=color(White);
  redrawButton.style('color', redrawFontCol);
  // redrawButton.style('font-family', "Roboto");
  redrawButton.style('border-radius',"16px");
  redrawButton.style('border',"0px");
  redrawButton.size(windowWidth - btnUnit*6, btnUnit*3);
  redrawButton.position(btnUnit*6/2, height - btnUnit*9);
  
  //Nextボタン
  refreshButton.style("font-size", "30px");
  let refreshCol=color(Orange_R,Orange_G,Orange_B);
  refreshButton.style('background-color', refreshCol);
  // let refreshFontCol=color(White);
  let refreshFontCol=color(DB_R,DB_G,DB_G);
  refreshButton.style('color', refreshFontCol);
  // refreshButton.style('font-family', "Roboto");
  refreshButton.style('border-radius',"16px");
  refreshButton.style('border',"0px");
  refreshButton.size(windowWidth - btnUnit*6, btnUnit*3);
  refreshButton.position(btnUnit*6/2, height - btnUnit*5);
  refreshButton.hide();
  
  //Solutionボタン
  solutionButton.style("font-size", "30px");
  let solutionCol;
  let solutionFontCol;
  solutionCol=color(LB_R,LB_G,LB_B);
  solutionFontCol=color(White);
  solutionButton.style('background-color', solutionCol);
  solutionButton.style('color', solutionFontCol);
  // solutionButton.style('font-family', "Times");
  solutionButton.style('border-radius',"16px");
  solutionButton.style('border',"0px");
  solutionButton.size(windowWidth/3 - btnUnit*2, btnUnit*3);
  solutionButton.position(btnUnit*6/2, height - btnUnit*9);
  solutionButton.hide();
  
  //YourSketchボタン
  yourSketchButton.style("font-size", "30px");
  let yourSketchCol=color(LB_R,LB_G,LB_B);
  yourSketchButton.style('background-color', yourSketchCol);
  let yourSketchFontCol=color(White);
  yourSketchButton.style('color', yourSketchFontCol);
  // yourSketchButton.style('font-family', "Times");
  yourSketchButton.style('border-radius',"16px");
  yourSketchButton.style('border',"0px");
  yourSketchButton.size(windowWidth/3 - btnUnit*2, btnUnit*3);
  yourSketchButton.position(btnUnit*6/2+(windowWidth/3-btnUnit*2)*2, height - btnUnit*9);
  yourSketchButton.hide();
  
  //Bothボタン
  bothButton.style("font-size", "30px");
  let bothCol=color(LB_R,LB_G,LB_B);
  bothButton.style('background-color', bothCol);
  let bothFontCol=color(White);
  bothButton.style('color', bothFontCol);
  // bothButton.style('font-family', "Times");
  bothButton.style('border-radius',"16px");
  bothButton.style('border',"0px");
  bothButton.size(windowWidth/3 - btnUnit*2, btnUnit*3);
  bothButton.position(btnUnit*6/2+windowWidth/3-btnUnit*2, height - btnUnit*9);
  bothButton.hide();
  
  //選ばれている状態（ユーザーの滞在状況表示）を示すボタン。実際はボタンの機能を持たない。
  Sed_solutionButton.style("font-size", "30px");
  let Sed_solutionCol;
  let Sed_solutionFontCol;
  Sed_solutionCol=color(White);
  Sed_solutionFontCol=color(DB_R,DB_G,DB_G);
  Sed_solutionButton.style('background-color', Sed_solutionCol);
  Sed_solutionButton.style('color', Sed_solutionFontCol);
  // Sed_solutionButton.style('font-family', "Times");
  Sed_solutionButton.style('border-radius',"16px");
  Sed_solutionButton.style('border',"0px");
  Sed_solutionButton.size(windowWidth/3 - btnUnit*2, btnUnit*3);
  Sed_solutionButton.position(btnUnit*6/2, height - btnUnit*9);
  Sed_solutionButton.hide();
  
  Sed_yourSketchButton.style("font-size", "30px");
  let Sed_yourSketchCol=color(White);
  Sed_yourSketchButton.style('background-color', Sed_yourSketchCol);
  let Sed_yourSketchFontCol=color(DB_R,DB_G,DB_G);
  Sed_yourSketchButton.style('color', Sed_yourSketchFontCol);
  // Sed_yourSketchButton.style('font-family', "Times");
  Sed_yourSketchButton.style('border-radius',"16px");
  Sed_yourSketchButton.style('border',"0px");
  Sed_yourSketchButton.size(windowWidth/3 - btnUnit*2, btnUnit*3);
  Sed_yourSketchButton.position(btnUnit*6/2+(windowWidth/3-btnUnit*2)*2, height - btnUnit*9);
  Sed_yourSketchButton.hide();
  
  Sed_bothButton.style("font-size", "30px");
  let Sed_bothCol=color(White);
  Sed_bothButton.style('background-color', Sed_bothCol);
  let Sed_bothFontCol=color(DB_R,DB_G,DB_G);
  Sed_bothButton.style('color', Sed_bothFontCol);
  // Sed_bothButton.style('font-family', "Times");
  Sed_bothButton.style('border-radius',"16px");
  Sed_bothButton.style('border',"0px");
  Sed_bothButton.size(windowWidth/3 - btnUnit*2, btnUnit*3);
  Sed_bothButton.position(btnUnit*6/2+windowWidth/3-btnUnit*2, height - btnUnit*9);
  Sed_bothButton.hide();
  
  answerButton.mousePressed(function() {
    if(flagLine==2){
    if (flagScore == 0) {//採点フラグを立てる
      flagScore = 1
    } else {
      flagScore = 0
    }
    if (flagShowAnswer == 0) {//答え表示フラグを立てる
      flagShowAnswer = 1
    } else {
      flagShowAnswer = 0
    }
    answerButton.hide();
    redrawButton.hide();
    
    flaghideYours=0;
    
    refreshButton.show();
    solutionButton.show();
    yourSketchButton.show();
    Sed_bothButton.show();
  }
  });

  /*var nextStageButton = createButton("Change Stage");
  nextStageButton.style("font-size", "30px");
  nextStageButton.size((windowWidth - 100) / 2, 60);
  nextStageButton.position(windowWidth / 2, height - 170);
  nextStageButton.hide();
  nextStageButton.mousePressed(function() { //when nextStageButton Pressed
    if (flagShowAnswer == 0) {
      flagShowAnswer = 1
    } else {
      flagShowAnswer = 0
    }

    //proceed Stage
    flagStage += 1;

    //Same as refresh function
    //separate stage
    StageNum = flagStage % 2;
    if (StageNum == 1) {
      x_angle = random(20, 60);
      y_angle = random(30, 70);
      z_angle = random(-140, 170);
      Fz = random(1500, 2200);
    }

    if (StageNum == 0) {
      x_angle = random(-120, -160);
      y_angle = random(20, 60);
      z_angle = random(-140, 170);
      Fz = random(1500, 2200);
    }

    //Same function as refreshButton
    CastingCalculate();
    flagShowAnswer = 0;
    flagLine = 0;
    flagDrew = 0;
    flaghideYours = 0;

    nextStageButton.hide();
    hideYoursButton.hide();
    answerButton.show();
    StageCount+=1;
  });*/
  //hideYoursButton
  /*hideYoursButton.mousePressed(function() {
    if (flaghideYours == 0) {
      flaghideYours = 1
    } else {
      flaghideYours = 0
    }
  });*/
  
  redrawButton.mousePressed(function(){//描き直す
    flagShowAnswer = 0;
    flagLine = 0;
    flagDrew = 0;
    flaghideYours = 0;
    flagScore=0;
  });

  solutionButton.mousePressed(function(){//ユーザーのスケッチを消すフラグを立てる
    flagShowAnswer = 1;
    flaghideYours = 1;
    
    solutionButton.hide();
    Sed_solutionButton.show();
    
    Sed_bothButton.hide();
    bothButton.show();
    Sed_yourSketchButton.hide();
    yourSketchButton.show();
  });
  
  bothButton.mousePressed(function(){//ユーザーのスケッチを消すフラグを立てない
    flagShowAnswer = 1;
    flaghideYours = 0;
    
    bothButton.hide();
    Sed_bothButton.show();
    
    Sed_solutionButton.hide();
    solutionButton.show();
    Sed_yourSketchButton.hide();
    yourSketchButton.show();
  });
  
  yourSketchButton.mousePressed(function(){//答え表示のフラグを立てない
    flagShowAnswer = 0;
    flaghideYours = 0;
    
    yourSketchButton.hide();
    Sed_yourSketchButton.show();
    
    Sed_solutionButton.hide();
    solutionButton.show();
    Sed_bothButton.hide();
    bothButton.show();
  });
  
  //RefreshButton
  refreshButton.mousePressed(function() {
      x_angle = random(20, 60);
      y_angle = random(30, 70);
      z_angle = random(-140, 170);
      // Fz = random(1500, 2200);
    Fz = random(windowWidth*1.7, windowWidth*2);//iPhoneXのwindowWidthが414

    CastingCalculate();
    flagShowAnswer = 0;
    flagLine = 0;
    flagDrew = 0;
    flaghideYours = 0;
    flagScore=0;
    dispScore=0;
    
    refreshButton.hide();
    
    solutionButton.hide();
    yourSketchButton.hide();
    bothButton.hide();
    
    Sed_solutionButton.hide();
    Sed_yourSketchButton.hide();
    Sed_bothButton.hide();
    
    answerButton.show();
    redrawButton.show();
    
    
    StageCount+=1;
  });

  cam_x = 0;
  cam_y = 0;
  cam_z = Vz + cam_z_Vz; //The distance between cam_z and Vz will decide how much the Virtual plane fits to the screen.

  perspective(radians(fov), windowWidth / windowHeight, 0.1, cam_z); //視錐台の定義
  CastingCalculate();
}

function CastingCalculate() {
  //Create virtual box
  //Yrotation from (a,a,a) to (Yrotated_x1,,)
  Yrotated_x1 = Yrotation_xreturn(a, a, a, y_angle);
  Yrotated_y1 = Yrotation_yreturn(a, a, a, y_angle);
  Yrotated_z1 = Yrotation_zreturn(a, a, a, y_angle);
  Yrotated_x2 = Yrotation_xreturn(a, a, -a, y_angle);
  Yrotated_y2 = Yrotation_yreturn(a, a, -a, y_angle);
  Yrotated_z2 = Yrotation_zreturn(a, a, -a, y_angle);
  Yrotated_x3 = Yrotation_xreturn(-a, a, -a, y_angle);
  Yrotated_y3 = Yrotation_yreturn(-a, a, -a, y_angle);
  Yrotated_z3 = Yrotation_zreturn(-a, a, -a, y_angle);
  Yrotated_x4 = Yrotation_xreturn(-a, a, a, y_angle);
  Yrotated_y4 = Yrotation_yreturn(-a, a, a, y_angle);
  Yrotated_z4 = Yrotation_zreturn(-a, a, a, y_angle);
  Yrotated_x5 = Yrotation_xreturn(a, -a, a, y_angle);
  Yrotated_y5 = Yrotation_yreturn(a, -a, a, y_angle);
  Yrotated_z5 = Yrotation_zreturn(a, -a, a, y_angle);
  Yrotated_x6 = Yrotation_xreturn(a, -a, -a, y_angle);
  Yrotated_y6 = Yrotation_yreturn(a, -a, -a, y_angle);
  Yrotated_z6 = Yrotation_zreturn(a, -a, -a, y_angle);
  Yrotated_x7 = Yrotation_xreturn(-a, -a, -a, y_angle);
  Yrotated_y7 = Yrotation_yreturn(-a, -a, -a, y_angle);
  Yrotated_z7 = Yrotation_zreturn(-a, -a, -a, y_angle);
  Yrotated_x8 = Yrotation_xreturn(-a, -a, a, y_angle);
  Yrotated_y8 = Yrotation_yreturn(-a, -a, a, y_angle);
  Yrotated_z8 = Yrotation_zreturn(-a, -a, a, y_angle);

  //Xrotation from (Yrotated_x1,,) to (XYrotated_x1,,)
  XYrotated_x1 = Xrotation_xreturn(Yrotated_x1, Yrotated_y1, Yrotated_z1, x_angle);
  XYrotated_y1 = Xrotation_yreturn(Yrotated_x1, Yrotated_y1, Yrotated_z1, x_angle);
  XYrotated_z1 = Xrotation_zreturn(Yrotated_x1, Yrotated_y1, Yrotated_z1, x_angle);
  XYrotated_x2 = Xrotation_xreturn(Yrotated_x2, Yrotated_y2, Yrotated_z2, x_angle);
  XYrotated_y2 = Xrotation_yreturn(Yrotated_x2, Yrotated_y2, Yrotated_z2, x_angle);
  XYrotated_z2 = Xrotation_zreturn(Yrotated_x2, Yrotated_y2, Yrotated_z2, x_angle);
  XYrotated_x3 = Xrotation_xreturn(Yrotated_x3, Yrotated_y3, Yrotated_z3, x_angle);
  XYrotated_y3 = Xrotation_yreturn(Yrotated_x3, Yrotated_y3, Yrotated_z3, x_angle);
  XYrotated_z3 = Xrotation_zreturn(Yrotated_x3, Yrotated_y3, Yrotated_z3, x_angle);
  XYrotated_x4 = Xrotation_xreturn(Yrotated_x4, Yrotated_y4, Yrotated_z4, x_angle);
  XYrotated_y4 = Xrotation_yreturn(Yrotated_x4, Yrotated_y4, Yrotated_z4, x_angle);
  XYrotated_z4 = Xrotation_zreturn(Yrotated_x4, Yrotated_y4, Yrotated_z4, x_angle);
  XYrotated_x5 = Xrotation_xreturn(Yrotated_x5, Yrotated_y5, Yrotated_z5, x_angle);
  XYrotated_y5 = Xrotation_yreturn(Yrotated_x5, Yrotated_y5, Yrotated_z5, x_angle);
  XYrotated_z5 = Xrotation_zreturn(Yrotated_x5, Yrotated_y5, Yrotated_z5, x_angle);
  XYrotated_x6 = Xrotation_xreturn(Yrotated_x6, Yrotated_y6, Yrotated_z6, x_angle);
  XYrotated_y6 = Xrotation_yreturn(Yrotated_x6, Yrotated_y6, Yrotated_z6, x_angle);
  XYrotated_z6 = Xrotation_zreturn(Yrotated_x6, Yrotated_y6, Yrotated_z6, x_angle);
  XYrotated_x7 = Xrotation_xreturn(Yrotated_x7, Yrotated_y7, Yrotated_z7, x_angle);
  XYrotated_y7 = Xrotation_yreturn(Yrotated_x7, Yrotated_y7, Yrotated_z7, x_angle);
  XYrotated_z7 = Xrotation_zreturn(Yrotated_x7, Yrotated_y7, Yrotated_z7, x_angle);
  XYrotated_x8 = Xrotation_xreturn(Yrotated_x8, Yrotated_y8, Yrotated_z8, x_angle);
  XYrotated_y8 = Xrotation_yreturn(Yrotated_x8, Yrotated_y8, Yrotated_z8, x_angle);
  XYrotated_z8 = Xrotation_zreturn(Yrotated_x8, Yrotated_y8, Yrotated_z8, x_angle);

  //Zrotation from (XYrotated_x1,,) to (x1,y1,z1)
  x1 = Zrotation_xreturn(XYrotated_x1, XYrotated_y1, XYrotated_z1, z_angle);
  y1 = Zrotation_yreturn(XYrotated_x1, XYrotated_y1, XYrotated_z1, z_angle);
  z1 = Zrotation_zreturn(XYrotated_x1, XYrotated_y1, XYrotated_z1, z_angle);
  x2 = Zrotation_xreturn(XYrotated_x2, XYrotated_y2, XYrotated_z2, z_angle);
  y2 = Zrotation_yreturn(XYrotated_x2, XYrotated_y2, XYrotated_z2, z_angle);
  z2 = Zrotation_zreturn(XYrotated_x2, XYrotated_y2, XYrotated_z2, z_angle);
  x3 = Zrotation_xreturn(XYrotated_x3, XYrotated_y3, XYrotated_z3, z_angle);
  y3 = Zrotation_yreturn(XYrotated_x3, XYrotated_y3, XYrotated_z3, z_angle);
  z3 = Zrotation_zreturn(XYrotated_x3, XYrotated_y3, XYrotated_z3, z_angle);
  x4 = Zrotation_xreturn(XYrotated_x4, XYrotated_y4, XYrotated_z4, z_angle);
  y4 = Zrotation_yreturn(XYrotated_x4, XYrotated_y4, XYrotated_z4, z_angle);
  z4 = Zrotation_zreturn(XYrotated_x4, XYrotated_y4, XYrotated_z4, z_angle);
  x5 = Zrotation_xreturn(XYrotated_x5, XYrotated_y5, XYrotated_z5, z_angle);
  y5 = Zrotation_yreturn(XYrotated_x5, XYrotated_y5, XYrotated_z5, z_angle);
  z5 = Zrotation_zreturn(XYrotated_x5, XYrotated_y5, XYrotated_z5, z_angle);
  x6 = Zrotation_xreturn(XYrotated_x6, XYrotated_y6, XYrotated_z6, z_angle);
  y6 = Zrotation_yreturn(XYrotated_x6, XYrotated_y6, XYrotated_z6, z_angle);
  z6 = Zrotation_zreturn(XYrotated_x6, XYrotated_y6, XYrotated_z6, z_angle);
  x7 = Zrotation_xreturn(XYrotated_x7, XYrotated_y7, XYrotated_z7, z_angle);
  y7 = Zrotation_yreturn(XYrotated_x7, XYrotated_y7, XYrotated_z7, z_angle);
  z7 = Zrotation_zreturn(XYrotated_x7, XYrotated_y7, XYrotated_z7, z_angle);
  x8 = Zrotation_xreturn(XYrotated_x8, XYrotated_y8, XYrotated_z8, z_angle);
  y8 = Zrotation_yreturn(XYrotated_x8, XYrotated_y8, XYrotated_z8, z_angle);
  z8 = Zrotation_zreturn(XYrotated_x8, XYrotated_y8, XYrotated_z8, z_angle);

  Vx1 = VirtualPlane_xreturn(x1, y1, z1, cam_x, cam_y, Fz, Vz);
  Vy1 = VirtualPlane_yreturn(x1, y1, z1, cam_x, cam_y, Fz, Vz);
  Vx2 = VirtualPlane_xreturn(x2, y2, z2, cam_x, cam_y, Fz, Vz);
  Vy2 = VirtualPlane_yreturn(x2, y2, z2, cam_x, cam_y, Fz, Vz);
  Vx3 = VirtualPlane_xreturn(x3, y3, z3, cam_x, cam_y, Fz, Vz);
  Vy3 = VirtualPlane_yreturn(x3, y3, z3, cam_x, cam_y, Fz, Vz);
  Vx4 = VirtualPlane_xreturn(x4, y4, z4, cam_x, cam_y, Fz, Vz);
  Vy4 = VirtualPlane_yreturn(x4, y4, z4, cam_x, cam_y, Fz, Vz);
  Vx5 = VirtualPlane_xreturn(x5, y5, z5, cam_x, cam_y, Fz, Vz);
  Vy5 = VirtualPlane_yreturn(x5, y5, z5, cam_x, cam_y, Fz, Vz);
  Vx6 = VirtualPlane_xreturn(x6, y6, z6, cam_x, cam_y, Fz, Vz);
  Vy6 = VirtualPlane_yreturn(x6, y6, z6, cam_x, cam_y, Fz, Vz);
  Vx7 = VirtualPlane_xreturn(x7, y7, z7, cam_x, cam_y, Fz, Vz);
  Vy7 = VirtualPlane_yreturn(x7, y7, z7, cam_x, cam_y, Fz, Vz);
  Vx8 = VirtualPlane_xreturn(x8, y8, z8, cam_x, cam_y, Fz, Vz);
  Vy8 = VirtualPlane_yreturn(x8, y8, z8, cam_x, cam_y, Fz, Vz);
}

function draw() {
  background(DB_R,DB_G,DB_B);//RGB
  camera(cam_x, cam_y, cam_z, 0, 0, 0, 0, 1, 0);
  translate(0, 0, Vz); //Since here all process is done on plane Vz
  
  /*noStroke();
  fill(LBS_R,LBS_G,LBS_B);
  quad(-windowWidth / 2, windowHeight / 2 - 200, windowWidth / 2, windowHeight / 2 - 200, windowWidth / 2, windowHeight / 2, -windowWidth / 2, windowHeight / 2);*/
  
  noFill();
  if (flagScore == 1) {//答え表示フラグが立っている場合、答えを表示する。
    
//       //Show answer of perspective line//パース線を伸ばしたやつ①
    //2022/04/30の更新にて、伸ばした線の表示をやめた。
//       strokeWeight(mStrokeW);
//       stroke(LB_R,LB_G,LB_B);
//       extend(Vx1, Vy1, Vx4, Vy4);
//       extend(Vx2, Vy2, Vx3, Vy3);
//       extend(Vx5, Vy5, Vx8, Vy8);

//       extend(Vx1, Vy1, Vx5, Vy5);
//       extend(Vx4, Vy4, Vx8, Vy8);
//       extend(Vx3, Vy3, Vx7, Vy7);

//       extend(Vx1, Vy1, Vx2, Vy2);
//       extend(Vx3, Vy3, Vx4, Vy4);
//       extend(Vx7, Vy7, Vx8, Vy8);

    if(flaghideYours==1){
      stroke(White);
    }else{
      stroke(Orange_R,Orange_G,Orange_B);//答え表示の色と太さ
    }
      strokeWeight(mStrokeW);//答え表示の色と太さ
      if(flagShowAnswer==1){
      //Show answer of box in hidden processing
      line(Vx1, Vy1, Vx2, Vy2);
      line(Vx4, Vy4, Vx3, Vy3);
      line(Vx8, Vy8, Vx7, Vy7);
      line(Vx1, Vy1, Vx5, Vy5);
      line(Vx4, Vy4, Vx8, Vy8);
      line(Vx3, Vy3, Vx7, Vy7);
      line(Vx1, Vy1, Vx4, Vy4);
      line(Vx2, Vy2, Vx3, Vy3);
      line(Vx5, Vy5, Vx8, Vy8);
      }
    /*if (StageNum == 0) {
      //Show answer of perspective line
      //パース線を伸ばしたやつ②
      strokeWeight(5);
      stroke(LB_R,LB_G,LB_B);
      extend(Vx2, Vy2, Vx3, Vy3);
      extend(Vx6, Vy6, Vx7, Vy7);
      extend(Vx5, Vy5, Vx8, Vy8);

      extend(Vx1, Vy1, Vx5, Vy5);
      extend(Vx2, Vy2, Vx6, Vy6);
      extend(Vx3, Vy3, Vx7, Vy7);

      extend(Vx1, Vy1, Vx2, Vy2);
      extend(Vx5, Vy5, Vx6, Vy6);
      extend(Vx7, Vy7, Vx8, Vy8);

      stroke(Orange_R,Orange_G,Orange_B);//答え表示の色と太さ①
      strokeWeight(5);//答え表示の色と太さ①
      
      //Show answer of box in hidden processing
      line(Vx1, Vy1, Vx2, Vy2);
      line(Vx5, Vy5, Vx6, Vy6);
      line(Vx8, Vy8, Vx7, Vy7);
      line(Vx1, Vy1, Vx5, Vy5);
      line(Vx2, Vy2, Vx6, Vy6);
      line(Vx3, Vy3, Vx7, Vy7);
      line(Vx6, Vy6, Vx7, Vy7);
      line(Vx2, Vy2, Vx3, Vy3);
      line(Vx5, Vy5, Vx8, Vy8);
    }*/
  }

  //ユーザーのスケッチ
  if (flagDrawing == 1) {
    stroke(Orange_R,Orange_G,Orange_B);
    ellipse(castX(mouseX, windowWidth), castY(mouseY, windowHeight), btnUnit*3, btnUnit*3); //User's current position
  }

  if (flagLine == 0) { //User's drawing.No.1
    if (flagDrawing == 0) {
      push();
      strokeWeight(mStrokeW);
      stroke(Orange_R,Orange_G,Orange_B);
      ellipse(Vx8, Vy8, millis()/70%btnUnit*3, millis()/70%btnUnit*3); //Sign of stick position
      pop();
    }

    stick_x1 = map(castX(mouseX, windowWidth), start_x1, castX(mouseX, windowWidth), Vx8, castX(mouseX, windowWidth) - start_x1 + Vx8);
    stick_y1 = map(castY(mouseY, windowHeight), start_y1, castY(mouseY, windowHeight), Vy8, castY(mouseY, windowHeight) - start_y1 + Vy8);

    if (flagDrawing == 1) {
      strokeWeight(mStrokeW);
      stroke(White);
      line(stick_x1, stick_y1, Vx8, Vy8); //User's actual drawing
    }
  }
  if (flagLine == 1) { //User's drawing.No.2

    if (flagDrawing == 0) { // Make user recall what he drew
      strokeWeight(mStrokeW);
      stroke(230);
      //extend(Vx8, Vy8, stick_x1, stick_y1); //User's drawing's perspective
      //extend(Vx4, Vy4, Vx3, Vy3);
      //extend(Vx2, Vy2, Vx1, Vy1);
      //extend(Vx6,Vy6,Vx5,Vy5);

      strokeWeight(mStrokeW);
      stroke(White);
      line(end_x1, end_y1, Vx8, Vy8); //drawing No.1:already drawn

      push();
      strokeWeight(mStrokeW);
      stroke(Orange_R,Orange_G,Orange_B);
      ellipse(Vx3, Vy3, millis()/70%btnUnit*3, millis()/70%btnUnit*3); //Sign of stick position
      pop();
    }

    stick_x2 = map(castX(mouseX, windowWidth), start_x2, castX(mouseX, windowWidth), Vx3, castX(mouseX, windowWidth) - start_x2 + Vx3);
    stick_y2 = map(castY(mouseY, windowHeight), start_y2, castY(mouseY, windowHeight), Vy3, castY(mouseY, windowHeight) - start_y2 + Vy3);

    if (flagDrawing == 1) {
      stroke(LBS_R,LBS_G,LBS_B);
      strokeWeight(mStrokeW);
      line(end_x1, end_y1, Vx8, Vy8); //drawing No.1:already drawn

      strokeWeight(mStrokeW);
      stroke(White);
      line(stick_x2, stick_y2, Vx3, Vy3); //User's actual drawing 
    }
  }
  if (flagLine == 2) { //ユーザーは２本引き終わった。引き直すか、採点ボタンを押すかの２選択。つまり３本目のタッチをすることでflagLine==0に戻す　or　ボタンが押され答え表示フラグとスコアフラグの２つのフラグを立てるか。
    
    //Make user's answer in thick line
    var UserAnswerIntersectionX = bothX_Answer(end_x1, end_y1, Vx8, Vy8, end_x2, end_y2, Vx3, Vy3);
    var UserAnswerIntersectionY = bothY_Answer(end_x1, end_y1, Vx8, Vy8, end_x2, end_y2, Vx3, Vy3);
    
    
    if (flagDrawing == 0) { // Make user recall what he drew ユーザーは２本引き終わり、画面ノータッチの状態
      if (flaghideYours == 0) {//ユーザーのスケッチ消去フラグは立っていない状態。 
        /*if(flagScore==1){//答え表示フラグが立ってるから、ユーザーのスケッチ２本に対してのパース線を描写する
        if(flagShowAnswer==0){
          
        stroke(LBS_R,LBS_G,LBS_B);
        strokeWeight(5);
        extend(Vx3, Vy3, stick_x2, stick_y2); //User's drawing's perspective
        //extend(Vx8, Vy8, Vx4, Vy4);
        //extend(Vx5, Vy5, Vx1, Vy1);
          
        //extend(Vx6,Vy6,Vx2,Vy2);

        extend(Vx8, Vy8, stick_x1, stick_y1); //User's drawing's perspective
        //extend(Vx4, Vy4, Vx3, Vy3);
        //extend(Vx2, Vy2, Vx1, Vy1);
          
        //extend(Vx6,Vy6,Vx5,Vy5);
          }
        }*/
      
      if(flagScore==0){
      strokeWeight(mStrokeW)
      stroke(LB_R,LB_G,LB_B);
      line(end_x2, end_y2, Vx3, Vy3);
      line(end_x1, end_y1, Vx8, Vy8);
      }
        
      stroke(White);
      strokeWeight(mStrokeW);
      line(UserAnswerIntersectionX, UserAnswerIntersectionY, Vx3, Vy3);
      line(UserAnswerIntersectionX, UserAnswerIntersectionY, Vx8, Vy8);

        if (flagShowAnswer == 0) {//ユーザーのスケッチもスケッチ２本も両方表示、答えは表示しない。yourSketchのボタンを押した状態。
            /*push();
            strokeWeight(5);
            stroke(Orange_R,Orange_G,Orange_B);
            ellipse(Vx8, Vy8, millis()/1.3/10%100, millis()/1.3/10%100); //Sign of stick position
            pop();
            */

          /*if (StageNum == 0) {
            push();
            strokeWeight(5);
            stroke(Orange_R,Orange_G,Orange_B);
            ellipse(Vx6, Vy6, millis()/1.3/10%100, millis()/1.3/10%100); //Sign of stick position
            pop();
          }*/
        }
      }
    }
  }
  /*if (flagLine == 3) {
      strokeWeight(2);
      stroke(230);
      if (flaghideYours == 0) {
        if(flagShowAnswer==1){
      extend(Vx3, Vy3, stick_x2, stick_y2); //User's drawing's perspective
      //extend(Vx8, Vy8, Vx4, Vy4);
      extend(Vx5, Vy5, Vx1, Vy1);
      extend(Vx6,Vy6,Vx2,Vy2);

      extend(Vx8, Vy8, stick_x1, stick_y1); //User's drawing's perspective
      //extend(Vx4, Vy4, Vx3, Vy3);
      extend(Vx2, Vy2, Vx1, Vy1);
      extend(Vx6,Vy6,Vx5,Vy5);
        
          extend(Vx6,Vy6,stick_x3,stick_y3);
          extend(Vx2,Vy2,Vx3,Vy3);
          extend(Vx5,Vy5,Vx8,Vy8);
          }
        
      if (flaghideYours == 0) {
      strokeWeight(4);
      stroke(100);
      line(end_x1, end_y1, Vx8, Vy8); //drawing No.1:already drawn
      line(end_x2, end_y2, Vx3, Vy3); //drawing No.2:already drawn
      line(end_x3, end_y3, Vx6, Vy6); //drawing No.3:already drawn

      push();
      strokeWeight(3);
      stroke(0, 200, 200, 1);
      ellipse(Vx8, Vy8, millis()/10%100, millis()/10%100); //Sign of stick position
      pop();
    }
  }
}*/

//出題の立方体の描写
  //注目させるべき辺のみを黒く示すために、まず薄い線を常に表示。そしてユーザーがスケッチを回答中かどうかの条件分岐で黒太の線をどこに描くのかを指定している。
  //Draw question box on the virtual plane
    //Thin gray lines(always shown)
     //show Question&show User's answer
      stroke(LBS_R,LBS_G,LBS_B);
      strokeWeight(mStrokeW);
      
      beginShape();
      vertex(Vx1, Vy1);
      vertex(Vx2, Vy2);
      vertex(Vx3, Vy3);
      vertex(Vx4, Vy4);
      endShape();
      vertex(Vx1, Vy1);
      vertex(Vx5, Vy5);
      vertex(Vx8, Vy8);
      vertex(Vx4, Vy4);
      endShape();
      line(Vx1, Vy1, Vx4, Vy4);
    

    //Thick black lines
    stroke(White);
    strokeWeight(mStrokeW);
    if (flagLine == 0) {
      if (flagDrawing == 1) { //No Other Line mode
        line(Vx4, Vy4, Vx3, Vy3);
        line(Vx1, Vy1, Vx2, Vy2);
      } else { //normal mode
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx2, Vy2);
        vertex(Vx3, Vy3);
        vertex(Vx4, Vy4);
        endShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx8, Vy8);
        vertex(Vx4, Vy4);
        endShape();
        line(Vx1, Vy1, Vx4, Vy4);
      }
    }
    if (flagLine == 1) {
      if (flagDrawing == 1) { //No Other Line mode
        line(Vx1, Vy1, Vx5, Vy5);
        line(Vx4, Vy4, Vx8, Vy8);
      } else {
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx2, Vy2);
        vertex(Vx3, Vy3);
        vertex(Vx4, Vy4);
        endShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx8, Vy8);
        vertex(Vx4, Vy4);
        endShape();
        line(Vx1, Vy1, Vx4, Vy4);
      }
    }

    if (flagLine == 2) {
      if (flagDrawing == 0) {
        stroke(White);
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx2, Vy2);
        vertex(Vx3, Vy3);
        vertex(Vx4, Vy4);
        endShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx8, Vy8);
        vertex(Vx4, Vy4);
        endShape();
        line(Vx1, Vy1, Vx4, Vy4);
      
        /*if(flaghideYours==0){
      strokeWeight(5)
      stroke(LB_R,LB_G,LB_B);
      line(end_x2, end_y2, Vx3, Vy3);
      line(end_x1, end_y1, Vx8, Vy8);
      stroke(White);
      strokeWeight(5);
      line(UserAnswerIntersectionX, UserAnswerIntersectionY, Vx3, Vy3);
      line(UserAnswerIntersectionX, UserAnswerIntersectionY, Vx8, Vy8);
        }*/
      }
    }
  /*if (StageNum == 0) {
    //Thin gray lines(always shown)
    if (flaghideYours == 0) { //show Question&show User's answer
      stroke(LBS_R,LBS_G,LBS_B);
      strokeWeight(5);
      beginShape();
      vertex(Vx1, Vy1);
      vertex(Vx5, Vy5);
      vertex(Vx6, Vy6);
      vertex(Vx2, Vy2);
      endShape();
      line(Vx1, Vy1, Vx2, Vy2);
      line(Vx5, Vy5, Vx8, Vy8);
      line(Vx2, Vy2, Vx3, Vy3);
    }

    //Thick black lines
    stroke(White);
    strokeWeight(5);
    if (flagLine == 0) {
      if (flagDrawing == 1) { //No Other Line mode
        line(Vx5, Vy5, Vx6, Vy6);
        line(Vx1, Vy1, Vx2, Vy2);
      } else { //normal mode
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx6, Vy6);
        vertex(Vx2, Vy2);
        endShape();
        line(Vx1, Vy1, Vx2, Vy2);
        line(Vx5, Vy5, Vx8, Vy8);
        line(Vx2, Vy2, Vx3, Vy3);
      }
    }
    if (flagLine == 1) {
      if (flagDrawing == 1) {
        line(Vx1, Vy1, Vx5, Vy5);
        line(Vx2, Vy2, Vx6, Vy6);
      } else {
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx6, Vy6);
        vertex(Vx2, Vy2);
        endShape();
        line(Vx1, Vy1, Vx2, Vy2);
        line(Vx5, Vy5, Vx8, Vy8);
        line(Vx2, Vy2, Vx3, Vy3);
      }
    }
    if (flagLine == 2) {
      if (flagDrawing == 1) {
        line(Vx2, Vy2, Vx3, Vy3);
        line(Vx5, Vy5, Vx8, Vy8);
      } else {
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx6, Vy6);
        vertex(Vx2, Vy2);
        endShape();
        line(Vx1, Vy1, Vx2, Vy2);
        line(Vx5, Vy5, Vx8, Vy8);
        line(Vx2, Vy2, Vx3, Vy3);
      }
    }
    if (flagLine == 3) {
      if (flaghideYours == 0) {
        stroke(White);
        beginShape();
        vertex(Vx1, Vy1);
        vertex(Vx5, Vy5);
        vertex(Vx6, Vy6);
        vertex(Vx2, Vy2);
        endShape();
        line(Vx1, Vy1, Vx2, Vy2);
        line(Vx5, Vy5, Vx8, Vy8);
        line(Vx2, Vy2, Vx3, Vy3);
      }
    }
  }*/
  if (flagScore == 1) {
      users_Answer_x = bothX_Answer(end_x1, end_y1, Vx8, Vy8, end_x2, end_y2, Vx3, Vy3);
      users_Answer_y = bothY_Answer(end_x1, end_y1, Vx8, Vy8, end_x2, end_y2, Vx3, Vy3);
      Answer_x = Vx7;
      Answer_y = Vy7;
      score = scoring(users_Answer_x, users_Answer_y, Answer_x, Answer_y);
      
      textFont(Font);
    
      textAlign(CENTER, CENTER);
      textSize(btnUnit*1.5);
      fill(White);
      text("YOUR SCORE",0,-windowHeight/2+btnUnit*4);
      //text("Question"+StageCount,0,-700);
      
      textAlign(RIGHT,CENTER);
      textSize(btnUnit*4);
      fill(Orange_R,Orange_G,Orange_B);
      if(dispScore<score){
        dispScore++;
      }
      text(dispScore, -btnUnit*1.5,-windowHeight/2+btnUnit*7);
      
      textAlign(LEFT,CENTER);
      fill(LBS_R,LBS_G,LBS_B);
      text("/100",-btnUnit*1.5,-windowHeight/2+btnUnit*7);  
      
 }
  textFont(Font);
  textAlign(CENTER, CENTER);
  textSize(btnUnit*0.7);
  fill(White);
  text("Perspective Trainer  (only for Smartphone)", 0, -windowHeight/2+btnUnit);
} //End of draw function

//Calculation&Drawing to reach perspective line to the edge of screen
function extend(x1, y1, x2, y2) {
  var a = (y2 - y1) / (x2 - x1);
  var b = y1 - a * x1;
  var extendYR1 = a * windowWidth / 2 + b;
  var extendYL1 = a * -windowWidth / 2 + b;
  line(x1, y1, windowWidth / 2, extendYR1);
  line(x1, y1, -windowWidth / 2, extendYL1);
}

function scoring(users_Answer_x, users_Answer_y, Answer_x, Answer_y) {
  var distance = dist(users_Answer_x, users_Answer_y, Answer_x, Answer_y);
  var score = round((100 - distance),1);
  if(score<0){
  score=0;
  }
  return score;
} 

//Casting user drawing to virtual plane
function castX(mouseX, windowWidth) {
  var casted_x = map(mouseX, 0, windowWidth, -windowWidth / 2, windowWidth / 2);
  return casted_x;
}
//Casting user drawing to virtual plane
function castY(mouseY, windowHeight) {
  var casted_y = map(mouseY, 0, windowHeight, -windowHeight / 2, windowHeight / 2);
  return casted_y;
}

function Xrotation_xreturn(x, y, z, x_angle) {
  var x_Xrotation = x;
  var y_Xrotation = y * cos(radians(x_angle)) - z * sin(radians(x_angle));
  var z_Xrotation = y * sin(radians(x_angle)) + z * cos(radians(x_angle));
  return x_Xrotation;
}

function Xrotation_yreturn(x, y, z, x_angle) {
  var x_Xrotation = x;
  var y_Xrotation = y * cos(radians(x_angle)) - z * sin(radians(x_angle));
  var z_Xrotation = y * sin(radians(x_angle)) + z * cos(radians(x_angle));
  return y_Xrotation;
}

function Xrotation_zreturn(x, y, z, x_angle) {
  var x_Xrotation = x;
  var y_Xrotation = y * cos(radians(x_angle)) - z * sin(radians(x_angle));
  var z_Xrotation = y * sin(radians(x_angle)) + z * cos(radians(x_angle));
  return z_Xrotation;
}

function Yrotation_xreturn(x, y, z, y_angle) {
  var x_Yrotation = x * cos(radians(y_angle)) + z * sin(radians(y_angle));
  var y_Yrotation = y;
  var z_Yrotation = -x * sin(radians(y_angle)) + z * cos(radians(y_angle));
  return x_Yrotation;
}

function Yrotation_yreturn(x, y, z, y_angle) {
  var x_Yrotation = x * cos(radians(y_angle)) + z * sin(radians(y_angle));
  var y_Yrotation = y;
  var z_Yrotation = -x * sin(radians(y_angle)) + z * cos(radians(y_angle));
  return y_Yrotation;
}

function Yrotation_zreturn(x, y, z, y_angle) {
  var x_Yrotation = x * cos(radians(y_angle)) + z * sin(radians(y_angle));
  var y_Yrotation = y;
  var z_Yrotation = -x * sin(radians(y_angle)) + z * cos(radians(y_angle));
  return z_Yrotation;
}

function Zrotation_xreturn(x, y, z, z_angle) {
  var x_Zrotation = x * cos(radians(z_angle)) - y * sin(radians(z_angle));
  var y_Zrotation = x * sin(radians(z_angle)) + y * cos(radians(z_angle));
  var z_Zrotation = z;
  return x_Zrotation;
}

function Zrotation_yreturn(x, y, z, z_angle) {
  var x_Zrotation = x * cos(radians(z_angle)) - y * sin(radians(z_angle));
  var y_Zrotation = x * sin(radians(z_angle)) + y * cos(radians(z_angle));
  var z_Zrotation = z;
  return y_Zrotation;
}

function Zrotation_zreturn(x, y, z, z_angle) {
  var x_Zrotation = x * cos(radians(z_angle)) - y * sin(radians(z_angle));
  var y_Zrotation = x * sin(radians(z_angle)) + y * cos(radians(z_angle));
  var z_Zrotation = z;
  return z_Zrotation;
}

function VirtualPlane_xreturn(Dx, Dy, Dz, Ex, Ey, Ez, Vz) {
  var Vx = (Vz - Dz) * (Ex - Dx) / (Ez - Dz) + Dx;
  return Vx;
}

function VirtualPlane_yreturn(Dx, Dy, Dz, Ex, Ey, Ez, Vz) {
  var Vy = (Vz - Dz) * (Ey - Dy) / (Ez - Dz) + Dy;
  return Vy;
}

//culculate intersection, return x (2 lines(line(x1,y1,x2,y2)&line(x3,y3,x4,y4))
function bothX_Answer(x1, y1, x2, y2, x3, y3, x4, y4) {
  var a1 = (y2 - y1) / (x2 - x1);
  var a3 = (y4 - y3) / (x4 - x3);
  var X5 = (a1 * x1 - y1 - a3 * x3 + y3) / (a1 - a3);
  var Y5 = (y2 - y1) / (x2 - x1) * (X5 - x1) + y1
  return X5;
}

//culculate intersection, return x (2 lines(line(x1,y1,x2,y2)&line(x3,y3,x4,y4))
function bothY_Answer(x1, y1, x2, y2, x3, y3, x4, y4) {
  var a1 = (y2 - y1) / (x2 - x1);
  var a3 = (y4 - y3) / (x4 - x3);
  var X5 = (a1 * x1 - y1 - a3 * x3 + y3) / (a1 - a3);
  var Y5 = (y2 - y1) / (x2 - x1) * (X5 - x1) + y1
  return Y5;
}


//iOSのスクロール防止(20220430)
function disableScroll(event) {
  event.preventDefault();
}
// イベントと関数を紐付け
document.addEventListener('touchmove', disableScroll, { passive: false });
