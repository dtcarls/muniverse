(function() {

  var GAME_OVER_TEXTURE = 'images/gameover-sheet0.png';

  var c2 = construct2api;

  var scoreVar = '';
  function rawScore() {
    return c2.globalVar(scoreVar).data;
  }

  var gameOver = false;
  var endgameScore = 0;
  window.muniverse = {
    init: function(options) {
      if (options.scoreMode === 'coins') {
        scoreVar = 'Coins';
      } else if (options.scoreMode === 'stars') {
        scoreVar = 'Score';
      } else if (options.scoreMode === 'distance') {
        scoreVar = 'Distances';
      } else {
        return Promise.reject('invalid score mode: ' + options.scoreMode);
      }
      return init4j().then(function() {
        faketime.pause();

        cr_getC2Runtime().doChangeLayout(cr_getC2Runtime().layouts.Game);
        faketime.advance(100);

        // No consistent actions for game over, and no
        // high score variable to hijack.
        // Instead, we wait for the gameover sheet.
        var objsByUid = cr_getC2Runtime().objectsByUid;
        var objects = Object.keys(objsByUid).map((x) => objsByUid[x]);
        var views = objects.filter((x) => x.curFrame);
        var popup = views.find((x) => x.curFrame.texture_file === GAME_OVER_TEXTURE);
        popup.set_bbox_changed = () => {
          gameOver = true;
          endgameScore = rawScore();
        };

        // Disable pause.
        c2.disableActions([
          "9251491818357576",
          "7483521627439599",
          "8713546147633934",
          "4203344673501515"
        ]);

        // Disable restart.
        c2.disableActions([
          "9251491818357576",
          "9296648633567888",
          "2646800759975057"
        ]);
      });
    },
    step: function(millis) {
      faketime.advance(millis);
      return Promise.resolve(gameOver);
    },
    score: function() {
      return Promise.resolve(gameOver ? endgameScore : rawScore());
    }
  };

})();
