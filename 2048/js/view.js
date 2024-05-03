// Method Grouping: Functions are grouped based on their functionality. Methods that update the UI (like updateScore, updateBest, updateVal) are placed together,
// as are methods handling animations (addScoreAnimation, appear, move, remove). This helps to logically segment the code based on what part of the UI is being manipulated.

// Methods related to the setup and reset of the game interface (setup, restart, resize) are placed at the beginning of the prototype definition.
// This organization reflects the typical lifecycle of the view in a user session, from initialization to restart.

// Methods that respond to game states (winning, failure) are grouped together to clearly separate the functionality that handles game-end scenarios from general UI updates.

// Error Checking: Added checks in methods like remove and move to prevent errors if the target elements are not found. This prevents potential script errors during runtime that could disrupt the gameplay experience.

var View = (function () {
  // Element references from the DOM
  var tileContainer = $(".tile-container")[0];
  var scoreContainer = $(".score-container")[0];
  var scoreDom = $(".score-container .score")[0];
  var scoreAddition = $(".score-addition")[0];
  var bestDom = $(".best-container .score")[0];
  var failureContainer = $(".failure-container")[0];
  var winningContainer = $(".winning-container")[0];

  // Constructor
  var View = function () {};

  // Prototype methods
  View.prototype = {
    // Set up initial view state, called on game start or reset
    setup: function () {
      failureContainer.classList.remove("action");
      winningContainer.classList.remove("action");
      this.updateScore(data.score);
      this.updateBest();
    },
    // Clear all tiles for a game restart
    restart: function () {
      tileContainer.innerHTML = "";
    },
    // Adjust tile positions to accommodate screen size changes
    resize: function () {
      var _this = this;
      data.cell.forEach(function (el, index) {
        var tile = _this.getTile(index);
        if (tile) {
          var pos = _this.getPos(indexToPos(index));
          _this.setPos(tile, pos);
        }
      });
    },
    // Display the failure overlay
    failure: function () {
      failureContainer.classList.add("action");
    },
    // Display the winning overlay
    winning: function () {
      winningContainer.classList.add("action");
    },
    // Re-create tiles from saved game state
    restoreTile: function () {
      var _this = this;
      data.cell.forEach(function (el, index) {
        if (el.val !== 0) {
          _this.appear(index);
        }
      });
    },
    // Animation for adding score
    addScoreAnimation: function (score) {
      if (score) {
        scoreAddition.innerHTML = "+" + score;
        scoreAddition.classList.add("action");
        setTimeout(function () {
          scoreAddition.classList.remove("action");
        }, 500);
      }
    },
    // Update the displayed score
    updateScore: function (score) {
      scoreDom.innerHTML = data.score;
      this.addScoreAnimation(score);
    },
    // Update the displayed best score
    updateBest: function () {
      bestDom.innerHTML = data.best;
    },
    // Animate and display a new tile appearing
    appear: function (index) {
      var cellData = data.cell[index];
      var pos = this.getPos(indexToPos(index));
      var newTile = this.createTileHTML({
        val: cellData.val,
        pos: pos,
        index: index,
        classNames: "tile new-tile",
      });
      tileContainer.appendChild(newTile);
    },
    // Remove a tile from the view
    remove: function (index) {
      var tile = this.getTile(index);
      if (tile) {
        tile.parentElement.removeChild(tile);
      }
    },
    // Move a tile from one position to another
    move: function (old_index, index) {
      var tile = this.getTile(old_index);
      if (tile) {
        var pos = this.getPos(indexToPos(index));
        this.setInfo(tile, pos, index);
      }
    },
    // Update a tile's value after merging
    updateVal: function (index) {
      var tile = this.getTile(index);
      if (tile) {
        var val = data.cell[index].val;
        tile.innerHTML = val;
        tile.setAttribute("data-val", val);
        tile.classList.add("addition");
        setTimeout(function () {
          tile.classList.remove("addition");
          tile.classList.remove("new-tile");
        }, 300);
      }
    },
    // Create the HTML for a new tile
    createTileHTML: function (obj) {
      var tile = document.createElement("div");
      tile.className = obj.classNames;
      tile.innerHTML = obj.val;
      tile.setAttribute("data-index", obj.index);
      tile.setAttribute("data-val", obj.val);
      this.setPos(tile, obj.pos);
      return tile;
    },
    // Get a tile element by index
    getTile: function (index) {
      return $(`.tile[data-index='${index}']`)[0];
    },
    // Calculate position for a tile based on grid coordinates
    getPos: function (pos) {
      var gridCell = $(
        `.grid-row:nth-child(${pos.y + 1}) .grid-cell:nth-child(${pos.x + 1})`
      )[0];
      return {
        left: gridCell.offsetLeft,
        top: gridCell.offsetTop,
      };
    },
    // Set position for a tile element
    setPos: function (elem, pos) {
      elem.style.left = pos.left + "px";
      elem.style.top = pos.top + "px";
    },
    // Set additional information for a tile element
    setInfo: function (elem, pos, index) {
      elem.style.left = pos.left + "px";
      elem.style.top = pos.top + "px";
      elem.setAttribute("data-index", index);
    },
  };

  return View;
})();
