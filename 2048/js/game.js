// added comment to function and oraganed like methods and fixed some inconsistent naming scheme.

var Game = (function () {
  // Private variables
  var cell = data.cell;
  var over = false;
  var move = false;

  // Constructor
  var Game = function (view) {};

  // Prototype methods
  Game.prototype = {
    // Initialize the game
    init: function (view) {
      var _this = this;
      this.view = view;
      var history = this.getHistory();
      if (history) {
        this.restoreHistory(history);
      } else {
        this.initCell();
        this.start();
      }
      this.setBest();
      setTimeout(function () {
        _this.view.setup();
      });
    },

    // Start the game
    start: function () {
      for (var i = 0; i < 2; i++) {
        this.randomAddItem();
      }
    },

    // Restart the game
    restart: function () {
      var _this = this;
      over = false;
      this.initCell();
      this.view.restart();
      this.start();
      data.score = 0;
      this.save();
      setTimeout(function () {
        _this.view.setup();
      });
    },

    // Save game state
    save: function () {
      localStorage.bestScore = data.best;
      localStorage.gameState = JSON.stringify({
        cell: data.cell,
        score: data.score, // Corrected 'socre' to 'score'
      });
    },

    // Handle winning scenario
    winning: function () {
      over = true;
      localStorage.gameState = "";
      this.view.winning();
    },

    // Check if the player has won
    checkWinning: function () {
      var isWinning = cell.find(function (el) {
        return el.val === config.max;
      });
      if (isWinning) {
        this.winning();
      }
    },

    // Handle game failure
    failure: function () {
      over = true;
      localStorage.gameState = "";
      this.view.failure();
    },

    // Check if the game has failed
    checkFailure: function () {
      var _this = this;
      var same = false;
      var called = function (arr, str) {
        if (same) return;
        same = arr.some(function (el) {
          return _this.checkSame(el);
        });
      };
      called(this.chunkX(), "x");
      called(this.chunkY(), "y");
      setTimeout(function () {
        if (!same) {
          _this.failure();
        }
      });
    },

    // Check if elements in an array are the same
    checkSame: function (arr, index) {
      same = arr.some(function (el, index, arr) {
        if (index === arr.length - 1) return;
        return el.val === arr[index + 1].val;
        return true;
      });
      return same;
    },

    // Set the best score
    setBest: function () {
      var best = getLocalStorage("bestScore");
      data.best = best || 0;
    },

    // Get game history from local storage
    getHistory: function () {
      var gameState = getLocalStorage("gameState");
      if (gameState && gameState.score && gameState.cell) {
        return gameState;
      }
    },

    // Restore game state from history
    restoreHistory: function (history) {
      data.cell = history.cell;
      data.score = history.score;
      cell = data.cell;
      this.view.restoreTile();
    },

    // Initialize cell array
    initCell: function () {
      for (var i = 0; i < 16; i++) {
        cell[i] = {
          val: 0,
          index: i,
        };
      }
    },

    // Add score to the game
    addScore: function (score) {
      data.score += score;
      if (data.best < data.score) {
        data.best = data.score;
        this.view.updateBest();
      }
      this.view.updateScore(score);
    },

    // Chunk the cell array in X direction
    chunkX: function () {
      var new_cell = [];
      for (var i = 0; i < cell.length; i += 4) {
        new_cell.push(cell.slice(i, i + 4));
      }
      return new_cell;
    },

    // Chunk the cell array in Y direction
    chunkY: function () {
      var arr = this.chunkX();
      var new_cell = [[], [], [], []];
      for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
          new_cell[j][i] = arr[i][j];
        }
      }
      return new_cell;
    },

    // Reverse the inner arrays of a 2D array
    arrayInnerReverse: function (arr) {
      arr.forEach(function (el, index) {
        arr[index] = el.reverse();
      });
      return arr;
    },

    // Update position of an item in the cell array
    updatePos: function (old_index, index) {
      cell[index].val = cell[old_index].val;
      cell[old_index].val = 0;
      move = true;
      return old_index;
    },

    // Update value of an item in the cell array
    updateVal: function (index, val) {
      var _this = this;
      cell[index].val = val;
      setTimeout(function () {
        _this.view.updateVal(index);
      }, 0);
    },

    // Update item position and value
    updateItem: function (old_index, index) {
      if (cell[old_index] === cell[index]) return;
      var old_index = this.updatePos(old_index, index);
      this.view.move(old_index, index);
    },

    // Remove an item from the cell array
    removeItem: function (index) {
      cell[index].val = 0;
      this.view.remove(index);
    },

    // Get sum of values at two indices in the cell array
    getSum: function (obj, i, j) {
      return obj[i].val + obj[j].val;
    },

    // Move items in a given direction
    move: function (dir) {
      if (over) return;
      var _this = this;
      var _score = 0;
      var _move = false;
      var new_cell = [];
      if (dir === 0 || dir === 2) {
        new_cell = this.chunkX();
      } else if (dir === 1 || dir === 3) {
        new_cell = this.chunkY();
      }
      if (dir === 2 || dir === 3) {
        new_cell = this.arrayInnerReverse(new_cell);
      }
      new_cell.forEach(function (arr, index) {
        var moveInfo = _this.moving(arr, indexs[dir][index]);
        _score += moveInfo.score;
      });
      this.addScore(_score);
      if (move) {
        this.randomAddItem();
        _move = true;
        move = false;
      }
      this.save();
      this.checkWinning();
      if (this.isFull()) {
        this.checkFailure();
      }
      return {
        move: _move,
      };
    },

    // Merge move for combining items
    mergeMove: function (_cell, index, num1, num2, num3) {
      var sum = this.getSum(_cell, num1, num2);
      this.removeItem(_cell[num1].index);
      this.updateItem(_cell[num2].index, index[num3]);
      this.updateVal(index[num3], sum);
    },

    // Normal move without merging
    normalMove: function (_cell, index) {
      var _this = this;
      _cell.forEach(function (el, i) {
        _this.updateItem(_cell[i].index, index[i]);
      });
    },

    // Perform moving and merging operations
    moving: function (arr, index) {
      var _this = this;
      var _score = 0;
      var _cell = arr.filter(function (el) {
        return el.val !== 0;
      });
      if (_cell.length === 0) {
        return {
          score: 0,
        };
      }
      var calls = [
        function () {
          _this.normalMove(_cell, index);
        },
        function () {
          if (_cell[0].val === _cell[1].val) {
            _this.mergeMove(_cell, index, 0, 1, 0);
            _score += config.bonus_point;
          } else {
            _this.normalMove(_cell, index);
          }
        },
        function () {
          if (_cell[0].val === _cell[1].val) {
            _this.mergeMove(_cell, index, 0, 1, 0);
            _this.updateItem(_cell[2].index, index[1]);
            _score += config.bonus_point;
          } else if (_cell[1].val === _cell[2].val) {
            _this.updateItem(_cell[0].index, index[0]);
            _this.mergeMove(_cell, index, 1, 2, 1);
            _score += config.bonus_point;
          } else {
            _this.normalMove(_cell, index);
          }
        },
        function () {
          if (_cell[0].val === _cell[1].val) {
            _this.mergeMove(_cell, index, 0, 1, 0);
            _score += config.bonus_point;
            if (_cell[2].val === _cell[3].val) {
              _this.mergeMove(_cell, index, 2, 3, 1);
              _score += config.bonus_point;
            } else {
              _this.updateItem(_cell[2].index, index[1]);
              _this.updateItem(_cell[3].index, index[2]);
            }
          } else if (_cell[1].val === _cell[2].val) {
            _this.mergeMove(_cell, index, 1, 2, 1);
            _this.updateItem(_cell[3].index, index[2]);
            _score += config.bonus_point;
          } else if (_cell[2].val === _cell[3].val) {
            _this.mergeMove(_cell, index, 2, 3, 2);
            _score += config.bonus_point;
          }
        },
      ];
      calls[_cell.length - 1]();
      return {
        score: _score,
      };
    },

    // Check if the cell array is full
    isFull: function () {
      var full = cell.filter(function (el) {
        return el.val === 0;
      });
      return full.length === 0;
    },

    // Add a random item to the cell array
    randomAddItem: function () {
      if (this.isFull()) return;
      while (true) {
        var index = random(0, data.cell.length - 1);
        var exist = data.cell[index].val !== 0;
        if (!exist) {
          this.addItem(index, 2);
          break;
        }
      }
    },

    // Add an item to the cell array
    addItem: function (index, val) {
      data.cell[index] = {
        val: val,
        index: index,
      };
      this.view.appear(index);
    },
  };

  return Game;
})();
