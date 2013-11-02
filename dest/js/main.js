var GREEN, PLAYER_HP_MAX, RED, TARGET_HP_MAX, centeringHorizontal, centeringVertical, createClickEffectSprite, createExplosionSprite, createHPGaugeSprites, createMainScene, createResultLabels, createResultScene, createTargetSprite, renda, replayGame, updateHPGauges;

TARGET_HP_MAX = 50;

PLAYER_HP_MAX = 10;

RED = '#FF5A5A';

GREEN = '#5AFF5A';

renda = {
  game: null,
  mainScene: null,
  resultScene: null,
  frameBegin: null,
  target: null,
  targetHP: null,
  targetHPMax: null,
  targetHPGauge: null,
  playerHP: null,
  playerHPMax: null,
  playerHPGauge: null,
  playerWin: null,
  score: null,
  highScore: null
};

renda.targetHPMax = TARGET_HP_MAX;

renda.playerHPMax = PLAYER_HP_MAX;

renda.targetHP = renda.targetHPMax;

renda.playerHP = renda.playerHPMax;

if (window.localStorage.getItem('highScore') === null) {
  window.localStorage.setItem('highScore', 0);
  renda.highScore = 0;
} else {
  renda.highScore = window.localStorage.getItem('highScore');
}

enchant();

$(function() {
  renda.game = new Game(500, 500);
  renda.game.preload('../images/letsnote.png', '../images/click_effect.png', '../images/explosion.png');
  renda.game.preload('../sound/atack0.wav', '../sound/atack1.wav', '../sound/kin0.wav', '../sound/kin1.wav', '../sound/bom.wav');
  renda.game.onload = function() {
    renda.mainScene = createMainScene();
    return renda.game.pushScene(renda.mainScene);
  };
  return renda.game.start();
});

createMainScene = function() {
  var gauge, gauges, scene, _i, _len;
  scene = new Scene();
  scene.backgroundColor = '#000';
  renda.target = createTargetSprite();
  scene.addChild(renda.target);
  gauges = createHPGaugeSprites();
  renda.targetHPGauge = gauges[0];
  renda.playerHPGauge = gauges[1];
  for (_i = 0, _len = gauges.length; _i < _len; _i++) {
    gauge = gauges[_i];
    scene.addChild(gauge);
  }
  scene.addEventListener('touchend', function(e) {
    switch (renda.target.frame) {
      case 0:
        renda.game.assets['../sound/atack' + Math.floor(Math.random() * 2) + '.wav'].play();
        scene.addChild(createClickEffectSprite(e.x, e.y));
        renda.targetHP--;
        break;
      case 1:
        renda.game.assets['../sound/kin' + Math.floor(Math.random() * 2) + '.wav'].play();
        renda.playerHP--;
    }
    renda.target.tl.moveBy(-5, 0, renda.game.fps * 0.05, enchant.Easing.QUAD_EASEOUT).moveBy(10, 0, renda.game.fps * 0.05, enchant.Easing.QUAD_EASEOUT).moveBy(-5, 0, renda.game.fps * 0.05, enchant.Easing.QUAD_EASEOUT);
    return updateHPGauges();
  });
  scene.addEventListener('enterframe', function(e) {
    if (renda.game.frame % renda.game.fps === 0) {
      renda.target.frame = Math.floor(Math.random() * 3) % 2;
    }
    if (renda.targetHP <= 0) {
      renda.playerWin = true;
      renda.score = Math.floor(renda.targetHPMax * renda.playerHP * 10000 / (renda.game.frame - renda.frameBegin));
      renda.game.assets['../sound/bom.wav'].play();
      renda.target.tl.fadeOut(1.0 * renda.game.fps).then(function() {
        renda.resultScene = createResultScene();
        return renda.game.replaceScene(renda.resultScene);
      });
    }
    if (renda.playerHP <= 0) {
      renda.playerWin = false;
      renda.resultScene = createResultScene();
      return renda.game.replaceScene(renda.resultScene);
    }
  });
  return scene;
};

createTargetSprite = function() {
  var sprite;
  sprite = new Sprite(492, 370);
  sprite.x = (renda.game.width - sprite.width) / 2.0;
  sprite.y = (renda.game.height - sprite.height) / 2.0;
  sprite.image = renda.game.assets['../images/letsnote.png'];
  sprite.frame = 1;
  return sprite;
};

createClickEffectSprite = function(x, y) {
  var sprite;
  sprite = new Sprite(64, 64);
  sprite.image = renda.game.assets['../images/click_effect.png'];
  sprite.frame = Math.floor(Math.random() * 2);
  sprite.x = x - sprite.width / 2.0;
  sprite.y = y - sprite.height / 2.0;
  sprite.scaleX = 0.0;
  sprite.scaleY = 0.0;
  sprite.tl.scaleTo(2.0, renda.game.fps * 0.1, enchant.Easing.QUAD_EASEOUT).scaleTo(1.0, renda.game.fps * 0.1, enchant.Easing.QUAD_EASEOUT).scaleTo(4.0, renda.game.fps * 0.1, enchant.Easing.QUAD_EASEOUT).then(function() {
    return sprite.parentNode.removeChild(sprite);
  });
  return sprite;
};

createExplosionSprite = function(x, y) {
  var sprite;
  sprite = new Sprite(62, 62);
  sprite.image = renda.game.assets['../images/explosion.png'];
  sprite.frame = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  sprite.x = x - sprite.width / 2.0;
  sprite.y = y - sprite.height / 2.0;
  sprite.tl.delay(15).then(function() {
    return sprite.parentNode.removeChild(sprite);
  });
  return sprite;
};

createHPGaugeSprites = function() {
  var playerHPGauge, playerHPGaugeFrame, targetHPGauge, targetHPGaugeFrame;
  targetHPGauge = new Sprite(300, 30);
  targetHPGauge.image = new Surface(targetHPGauge.width, targetHPGauge.height);
  targetHPGauge.image.context.fillStyle = RED;
  targetHPGauge.image.context.fillRect(0, 0, targetHPGauge.width, targetHPGauge.height);
  targetHPGauge.x = 20;
  targetHPGauge.y = 20;
  targetHPGaugeFrame = new Sprite(targetHPGauge.width, targetHPGauge.height);
  targetHPGaugeFrame.image = new Surface(targetHPGaugeFrame.width, targetHPGaugeFrame.height);
  targetHPGaugeFrame.image.context.lineWidth = 3;
  targetHPGaugeFrame.image.context.strokeStyle = RED;
  targetHPGaugeFrame.image.context.strokeRect(0, 0, targetHPGaugeFrame.width, targetHPGaugeFrame.height);
  targetHPGaugeFrame.x = targetHPGauge.x;
  targetHPGaugeFrame.y = targetHPGauge.y;
  playerHPGauge = new Sprite(200, 30);
  playerHPGauge.image = new Surface(playerHPGauge.width, playerHPGauge.height);
  playerHPGauge.image.context.fillStyle = GREEN;
  playerHPGauge.image.context.fillRect(0, 0, playerHPGauge.width, playerHPGauge.height);
  playerHPGauge.x = renda.game.width - playerHPGauge.width - 20;
  playerHPGauge.y = renda.game.height - playerHPGauge.height - 20;
  playerHPGaugeFrame = new Sprite(playerHPGauge.width, playerHPGauge.height);
  playerHPGaugeFrame.image = new Surface(playerHPGaugeFrame.width, playerHPGaugeFrame.height);
  playerHPGaugeFrame.image.context.lineWidth = 3;
  playerHPGaugeFrame.image.context.strokeStyle = GREEN;
  playerHPGaugeFrame.image.context.strokeRect(0, 0, playerHPGaugeFrame.width, playerHPGaugeFrame.height);
  playerHPGaugeFrame.x = playerHPGauge.x;
  playerHPGaugeFrame.y = playerHPGauge.y;
  return [targetHPGauge, playerHPGauge, targetHPGaugeFrame, playerHPGaugeFrame];
};

updateHPGauges = function() {
  renda.targetHPGauge.image.context.clearRect(0, 0, renda.targetHPGauge.width, renda.targetHPGauge.height);
  renda.targetHPGauge.image.context.fillRect(0, 0, renda.targetHPGauge.width * renda.targetHP / renda.targetHPMax, renda.targetHPGauge.height);
  renda.playerHPGauge.image.context.clearRect(0, 0, renda.playerHPGauge.width, renda.playerHPGauge.height);
  return renda.playerHPGauge.image.context.fillRect(0, 0, renda.playerHPGauge.width * renda.playerHP / renda.playerHPMax, renda.playerHPGauge.height);
};

createResultScene = function() {
  var label, labels, scene, _i, _len;
  scene = new Scene();
  if (renda.score > parseInt(window.localStorage.getItem('highScore'))) {
    window.localStorage.setItem('highScore', renda.score);
    renda.highScore = renda.score;
  }
  labels = createResultLabels();
  for (_i = 0, _len = labels.length; _i < _len; _i++) {
    label = labels[_i];
    scene.addChild(label);
  }
  return scene;
};

createResultLabels = function() {
  var highScoreLabel, marginVertical, replayLabel, replayLabelFrame, resultLabel, resultLabels, scoreLabel;
  resultLabels = [];
  if (renda.playerWin) {
    resultLabel = new Label('こわれました。');
    scoreLabel = new Label('スコア: ' + renda.score);
    highScoreLabel = new Label('ハイスコア: ' + renda.highScore);
    replayLabel = new Label('もういっかい');
    centeringHorizontal(resultLabel, scoreLabel, highScoreLabel, replayLabel);
    marginVertical = 40;
    resultLabel.y = 160;
    scoreLabel.y = resultLabel.y + resultLabel.height + marginVertical;
    highScoreLabel.y = scoreLabel.y + scoreLabel.height + marginVertical;
    replayLabel.y = highScoreLabel.y + highScoreLabel.height + marginVertical;
    resultLabels.push(resultLabel);
    resultLabels.push(scoreLabel);
    resultLabels.push(highScoreLabel);
    resultLabels.push(replayLabel);
  } else {
    resultLabel = new Label('こわせませんでした。');
    replayLabel = new Label('もういっかい');
    centeringHorizontal(resultLabel, replayLabel);
    marginVertical = 40;
    resultLabel.y = 200;
    replayLabel.y = resultLabel.y + resultLabel.height + marginVertical;
    resultLabels.push(resultLabel);
    resultLabels.push(replayLabel);
  }
  replayLabelFrame = new Sprite(replayLabel._boundWidth, replayLabel._boundHeight);
  replayLabelFrame.image = new Surface(replayLabelFrame.width, replayLabelFrame.height);
  replayLabelFrame.image.context.lineWidth = replayLabelFrame.image.context.strokeStyle = '#000';
  replayLabelFrame.image.context.strokeRect(0, 0, replayLabelFrame.width, replayLabelFrame.height);
  replayLabelFrame.x = replayLabel.x;
  replayLabelFrame.y = replayLabel.y;
  resultLabels.push(replayLabelFrame);
  replayLabelFrame.addEventListener('touchend', function() {
    return replayGame();
  });
  return resultLabels;
};

replayGame = function() {
  renda = {
    game: renda.game,
    mainScene: null,
    resultScene: null,
    frameBegin: renda.game.frame,
    target: null,
    targetHP: renda.targetHPMax,
    targetHPMax: renda.targetHPMax,
    targetHPGauge: null,
    playerHP: renda.playerHPMax,
    playerHPMax: renda.playerHPMax,
    playerHPGauge: null,
    playerWin: null,
    score: 0,
    highScore: renda.highScore
  };
  renda.mainScene = createMainScene();
  return renda.game.replaceScene(renda.mainScene);
};

centeringHorizontal = function() {
  var node, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = arguments.length; _i < _len; _i++) {
    node = arguments[_i];
    if (node instanceof Label) {
      _results.push(node.x = (renda.game.width - node._boundWidth) / 2.0);
    } else {
      _results.push(node.x = (renda.game.width - node.width) / 2.0);
    }
  }
  return _results;
};

centeringVertical = function() {
  var node, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = arguments.length; _i < _len; _i++) {
    node = arguments[_i];
    if (node instanceof Label) {
      _results.push(node.y = (renda.game.height - node._boundHeight) / 2.0);
    } else {
      _results.push(node.y = (renda.game.height - node.height) / 2.0);
    }
  }
  return _results;
};
