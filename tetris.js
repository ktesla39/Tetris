PokiSDK.init().then(() => {
    console.log("Poki SDK initialized");
}).catch(() => {
    console.warn("Poki SDK failed to load");
});



function Tetris() {
    var self = this;
    this.stats = new function() {
        this.level,
        this.lines,
        this.score,
        this.puzzles,
        this.el = {
            level: document.getElementById("tetris-stats-level"),
            lines: document.getElementById("tetris-stats-lines"),
            score: document.getElementById("tetris-stats-score")
        };
        this.start = function() {
            this.reset()
        }
        ,
        this.stop = function() {}
        ,
        this.reset = function() {
            this.stop(),
            this.level = 1,
            this.lines = 0,
            this.score = 0,
            this.puzzles = 0,
            this.el.level.innerHTML = this.level,
            this.el.lines.innerHTML = this.lines,
            this.el.score.innerHTML = this.score
        }
        ,
        this.setScore = function(i) {
            this.score = i,
            this.el.score.innerHTML = this.score
        }
        ,
        this.setLevel = function(i) {
            this.level = i,
            this.el.level.innerHTML = this.level
        }
        ,
        this.setLines = function(i) {
            this.lines = i,
            this.el.lines.innerHTML = this.lines
        }
        ,
        this.setPuzzles = function(i) {
            this.puzzles = i
        }
        ,
        this.getScore = function() {
            return this.score
        }
        ,
        this.getLevel = function() {
            return this.level
        }
        ,
        this.getLines = function() {
            return this.lines
        }
        ,
        this.getPuzzles = function() {
            return this.puzzles
        }
    }
    ,
    this.puzzle = null,
    this.area = null,
    this.username = "",
    this.unit = 21,
    this.areaX = 10,
    this.areaY = 18,
    this.paused = !1,
    Sounds.loadSound("click"),
    Sounds.loadSound("ding"),
    Sounds.loadSound("win"),
    Sounds.loadSound("wrong"),

    
    document.getElementById("ad-skip").onclick = function () {
    PokiSDK.rewardedBreak().then(() => {
        // Reward: skip block
        clearLast3Lines();
    }).catch(() => {
        console.log("Ad was skipped or failed.");
    });
     };

    document.getElementById("ad-clear").onclick = function () {
       PokiSDK.rewardedBreak().then(() => {
        // Reward: remove 3 bottom lines
        if (tetrisGame && tetrisGame.area) {
            let removed = 0;
            let y = tetrisGame.area.y - 1;
            while (removed < 3 && y >= 0) {
                let isEmpty = true;
                for (let x = 0; x < tetrisGame.area.x; x++) {
                    if (tetrisGame.area.board[y][x]) {
                        tetrisGame.area.el.removeChild(tetrisGame.area.board[y][x]);
                        tetrisGame.area.board[y][x] = 0;
                        isEmpty = false;
                    }
                }
                if (!isEmpty) removed++;
                y--;
            }
        }
    }).catch(() => {
        console.log("Ad was skipped or failed.");
    });
   };


     document.getElementById("up").onclick = function() {
         self.up();
     };
 
     document.getElementById("down").onclick = function() {
        self.down();
     };

     document.getElementById("left").onclick = function() {
        self.left();
     };

     document.getElementById("right").onclick = function() {
       self.right();
     };

    this.start = function() {
        self.reset(),
        self.stats.start(),
        document.getElementById("tetris-nextpuzzle").style.display = "block",
        
        self.area = new Area(self.unit,self.areaX,self.areaY,"tetris-area"),
        self.puzzle = new Puzzle(self,self.area),
        self.puzzle.mayPlace() ? self.puzzle.place() : self.gameOver()
    }
    ,
    this.reset = function() {
        self.puzzle && (self.puzzle.destroy(),
        self.puzzle = null),
        self.area && (self.area.destroy(),
        self.area = null),
        document.getElementById("tetris-gameover").style.display = "none",
        document.getElementById("tetris-nextpuzzle").style.display = "none",
        
        self.stats.reset(),
        self.paused = !1,
        document.getElementById("tetris-pause").style.display = "block",
        document.getElementById("tetris-resume").style.display = "none"
    }
    ,
    this.pause = function() {
        if (null != self.puzzle)
            if (self.paused)
                self.puzzle.running = !0,
                self.puzzle.fallDownID = setTimeout(self.puzzle.fallDown, self.puzzle.speed),
                document.getElementById("tetris-pause").style.display = "block",
                document.getElementById("tetris-resume").style.display = "none",
                self.paused = !1;
            else {
                if (!self.puzzle.isRunning())
                    return;
                self.puzzle.fallDownID && clearTimeout(self.puzzle.fallDownID),
                document.getElementById("tetris-pause").style.display = "none",
                document.getElementById("tetris-resume").style.display = "block",
                self.paused = !0,
                self.puzzle.running = !1
            }
    }
    ,
    this.gameOver = function() {
        Sounds.play("wrong"),
        self.stats.stop(),
        self.puzzle.stop(),
        document.getElementById("tetris-nextpuzzle").style.display = "none",
        document.getElementById("tetris-gameover").style.display = "block";
        var score = this.stats.getScore()
          , lines = this.stats.getLines()
          
        }
    ,
    this.up = function() {
        self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && self.puzzle.mayRotate() && (self.puzzle.rotate(),
        Sounds.play("click"))
    }
    ,
    this.down = function() {
        self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && self.puzzle.mayMoveDown() && (self.stats.setScore(self.stats.getScore() + 1),
        self.puzzle.moveDown())
    }
    ,
    this.left = function() {
        self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && self.puzzle.mayMoveLeft() && self.puzzle.moveLeft()
    }
    ,
    this.right = function() {
        self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && self.puzzle.mayMoveRight() && self.puzzle.moveRight()
    }
    ,
    this.space = function() {
        self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.stop(),
        self.puzzle.forceMoveDown())
    }
    ,
    this.soundChanged = function() {
        document.getElementById("sounds").blur(),
        document.getElementById("sounds").checked ? Sounds.toggleMute(!1) : Sounds.toggleMute(!0)
    }
    ,
    document.getElementById("tetris-menu-start").onclick = function() {
        self.start(),
        this.blur()
    }
    ,
    document.getElementById("tetris-menu-pause").onclick = function() {
        self.pause(),
        this.blur()
    }
    ,
    document.getElementById("tetris-menu-resume").onclick = function() {
        self.pause(),
        this.blur()
    }
    ,
    document.getElementById("sounds").addEventListener("change", this.soundChanged, !1),
    this.username = document.getElementById("tetris").getAttribute("data-username");
    var keyboard = new function() {
        this.up = 38,
        this.down = 40,
        this.left = 37,
        this.right = 39,
        this.n = 78,
        this.p = 80,
        this.r = 82,
        this.x = 88,
        this.z = 90,
        this.space = 32,
        this.f12 = 123,
        this.escape = 27,
        this.keys = [],
        this.funcs = [],
        this.keyState = {};
        var self = this;
        this.set = function(key, func) {
            this.keys.push(key),
            this.funcs.push(func)
        }
        ,
        this.event = function(e) {
            e || (e = window.event);
            var key = e.keyCode || e.which;
            self.keyState[key] = !0;
            for (var i = 0; i < self.keys.length; i++)
                key == self.keys[i] && (e.preventDefault(),
                self.funcs[i]())
        }
        ,
        this.eventUp = function(e) {
            e || (e = window.event);
            var key = e.keyCode || e.which;
            self.keyState[key] = !1
        }
    }
    ;
    function Area(unit, x, y, id) {
        this.unit = unit,
        this.x = x,
        this.y = y,
        this.el = document.getElementById(id),
        this.board = [];
        for (y = 0; y < this.y; y++) {
            this.board.push(new Array);
            for (x = 0; x < this.x; x++)
                this.board[y].push(0)
        }
        this.destroy = function() {
            for (var y = 0; y < this.board.length; y++)
                for (var x = 0; x < this.board[y].length; x++)
                    this.board[y][x] && (this.el.removeChild(this.board[y][x]),
                    this.board[y][x] = 0)
        }
        ,
        this.removeFullLines = function() {
            for (var lines = 0, y = this.y - 1; 0 < y; y--)
                this.isLineFull(y) && (this.removeLine(y),
                lines++,
                y++);
            return lines
        }
        ,
        this.isLineFull = function(y) {
            for (var x = 0; x < this.x; x++)
                if (!this.board[y][x])
                    return !1;
            return !0
        }
        ,
        this.removeLine = function(y) {
            for (var x = 0; x < this.x; x++)
                this.el.removeChild(this.board[y][x]),
                this.board[y][x] = 0;
            for (y--; 0 < y; y--)
                for (x = 0; x < this.x; x++)
                    if (this.board[y][x]) {
                        var el = this.board[y][x];
                        el.style.top = el.offsetTop + this.unit + "px",
                        this.board[y + 1][x] = el,
                        this.board[y][x] = 0
                    }
        }
        ,
        this.getBlock = function(y, x) {
            if (y < 0)
                return 0;
            if (y < this.y && x < this.x)
                return this.board[y][x];
            throw "Area.getBlock(" + y + ", " + x + ") failed"
        }
        ,
        this.addElement = function(el) {
            var x = parseInt(el.offsetLeft / this.unit)
              , y = parseInt(el.offsetTop / this.unit);
            0 <= y && y < this.y && 0 <= x && x < this.x && (this.board[y][x] = el)
        }
    }
    function Puzzle(tetris, area) {
        var self = this;
        this.tetris = tetris,
        this.area = area,
        this.fallDownID = null,
        this.forceMoveDownID = null,
        this.type = null,
        this.nextType = null,
        this.position = null,
        this.speed = null,
        this.running = null,
        this.stopped = null,
        this.board = [],
        this.elements = [],
        this.nextElements = [],
        this.x = null,
        this.y = null,
        this.puzzles = [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[1, 1], [1, 1]], [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]],
        this.reset = function() {
            this.fallDownID && clearTimeout(this.fallDownID),
            this.forceMoveDownID && clearTimeout(this.forceMoveDownID),
            this.type = this.nextType,
            this.nextType = random(this.puzzles.length),
            this.position = 0,
            this.speed = 800 - 50 * this.tetris.stats.getLevel(),
            this.speed < 100 && (this.speed = 100),
            this.running = !1,
            this.stopped = !1,
            this.board = [],
            this.elements = [];
            for (var i = 0; i < this.nextElements.length; i++)
                document.getElementById("tetris-nextpuzzle").removeChild(this.nextElements[i]);
            this.nextElements = [],
            this.x = null,
            this.y = null
        }
        ,
        this.nextType = random(this.puzzles.length),
        this.reset(),
        this.isRunning = function() {
            return this.running
        }
        ,
        this.isStopped = function() {
            return this.stopped
        }
        ,
        this.getX = function() {
            return this.x
        }
        ,
        this.getY = function() {
            return this.y
        }
        ,
        this.mayPlace = function() {
            for (var puzzle = this.puzzles[this.type], areaStartX = parseInt((this.area.x - puzzle[0].length) / 2), lineFound = !1, lines = 0, y = puzzle.length - 1; 0 <= y; y--) {
                for (var x = 0; x < puzzle[y].length; x++)
                    if (puzzle[y][x] && (lineFound = !0,
                    this.area.getBlock(1, areaStartX + x)))
                        return !1;
                if (lineFound && lines++,
                1 - lines < 0)
                    break
            }
            return !0
        }
        ,
        this.place = function() {
            this.tetris.stats.setPuzzles(this.tetris.stats.getPuzzles() + 1),
            this.tetris.stats.getLines() >= 10 * this.tetris.stats.getLevel() && (this.tetris.stats.setLevel(this.tetris.stats.getLevel() + 1),
            this.tetris.stats.setPuzzles(0));
            var puzzle = this.puzzles[this.type]
              , areaStartX = parseInt((this.area.x - puzzle[0].length) / 2)
              , lineFound = !1
              , lines = 0;
            this.x = areaStartX,
            this.y = 1,
            this.board = this.createEmptyPuzzle(puzzle.length, puzzle[0].length);
            for (var y = puzzle.length - 1; 0 <= y; y--) {
                for (var x = 0; x < puzzle[y].length; x++) {
                    if (puzzle[y][x])
                        lineFound = !0,
                        (el = document.createElement("div")).className = "block" + this.type + " x" + x + " y" + y + " r0",
                        el.style.left = (areaStartX + x) * this.area.unit + "px",
                        el.style.top = (1 - lines) * this.area.unit + "px",
                        this.area.el.appendChild(el),
                        this.board[y][x] = el,
                        this.elements.push(el)
                }
                lines && this.y--,
                lineFound && lines++
            }
            this.running = !0,
            this.fallDownID = setTimeout(this.fallDown, this.speed);
            var nextPuzzle = this.puzzles[this.nextType];
            for (y = 0; y < nextPuzzle.length; y++)
                for (x = 0; x < nextPuzzle[y].length; x++) {
                    var el;
                    if (nextPuzzle[y][x])
                        (el = document.createElement("div")).className = "block" + this.nextType + " x" + x + " y" + y + " r0",
                        el.style.left = x * this.area.unit + "px",
                        el.style.top = y * this.area.unit + "px",
                        document.getElementById("tetris-nextpuzzle").appendChild(el),
                        this.nextElements.push(el)
                }
        }
        ,
        this.destroy = function() {
            for (var i = 0; i < this.elements.length; i++)
                this.area.el.removeChild(this.elements[i]);
            this.elements = [],
            this.board = [],
            this.reset()
        }
        ,
        this.createEmptyPuzzle = function(y, x) {
            for (var puzzle = [], y2 = 0; y2 < y; y2++) {
                puzzle.push(new Array);
                for (var x2 = 0; x2 < x; x2++)
                    puzzle[y2].push(0)
            }
            return puzzle
        }
        ,
        this.fallDown = function() {
            if (self.isRunning())
                if (self.mayMoveDown())
                    self.tetris.stats.setScore(self.tetris.stats.getScore() + 1),
                    self.moveDown(),
                    self.fallDownID = setTimeout(self.fallDown, self.speed);
                else {
                    Sounds.play("ding");
                    for (var i = 0; i < self.elements.length; i++)
                        self.elements[i].classList.add("stopped"),
                        self.area.addElement(self.elements[i]);
                    var lines = self.area.removeFullLines();
                    if (lines) {
                        Sounds.play("win");
                        var score = 40 * self.tetris.stats.getLevel();
                        2 == lines ? score = 100 * self.tetris.stats.getLevel() : 3 == lines ? score = 300 * self.tetris.stats.getLevel() : 4 == lines && (score = 1200 * self.tetris.stats.getLevel()),
                        self.tetris.stats.setLines(self.tetris.stats.getLines() + lines),
                        self.tetris.stats.setScore(self.tetris.stats.getScore() + score)
                    }
                    self.reset(),
                    self.mayPlace() ? self.place() : self.tetris.gameOver()
                }
        }
        ,
        this.forceMoveDown = function() {
            if (!self.isRunning() && !self.isStopped())
                if (self.mayMoveDown())
                    self.tetris.stats.setScore(self.tetris.stats.getScore() + 1),
                    self.moveDown(),
                    self.forceMoveDownID = setTimeout(self.forceMoveDown, 30);
                else {
                    Sounds.play("ding");
                    for (var i = 0; i < self.elements.length; i++)
                        self.elements[i].classList.add("stopped"),
                        self.area.addElement(self.elements[i]);
                    var lines = self.area.removeFullLines();
                    if (lines) {
                        Sounds.play("win");
                        var score = 40 * self.tetris.stats.getLevel();
                        2 == lines ? score = 100 * self.tetris.stats.getLevel() : 3 == lines ? score = 300 * self.tetris.stats.getLevel() : 4 == lines && (score = 1200 * self.tetris.stats.getLevel()),
                        self.tetris.stats.setLines(self.tetris.stats.getLines() + lines),
                        self.tetris.stats.setScore(self.tetris.stats.getScore() + score)
                    }
                    self.reset(),
                    self.mayPlace() ? self.place() : self.tetris.gameOver()
                }
        }
        ,
        this.stop = function() {
            this.running = !1
        }
        ,
        this.mayRotate = function() {
            for (var y = 0; y < this.board.length; y++)
                for (var x = 0; x < this.board[y].length; x++)
                    if (this.board[y][x]) {
                        var newY = this.getY() + this.board.length - 1 - x
                          , newX = this.getX() + y;
                        if (newY >= this.area.y)
                            return !1;
                        if (newX < 0)
                            return !1;
                        if (newX >= this.area.x)
                            return !1;
                        if (this.area.getBlock(newY, newX))
                            return !1
                    }
            return !0
        }
        ,
        this.rotate = function() {
            for (var puzzle = this.createEmptyPuzzle(this.board.length, this.board[0].length), y = 0; y < this.board.length; y++)
                for (var x = 0; x < this.board[y].length; x++)
                    if (this.board[y][x]) {
                        var newY = puzzle.length - 1 - x
                          , newX = y
                          , el = this.board[y][x]
                          , moveY = newY - y
                          , moveX = newX - x;
                        el.style.left = el.offsetLeft + moveX * this.area.unit + "px",
                        el.style.top = el.offsetTop + moveY * this.area.unit + "px",
                        el.rotate ? el.rotate++ : el.rotate = 1,
                        4 <= el.rotate && (el.rotate = 0),
                        el.classList.contains("r0") && el.classList.remove("r0"),
                        el.classList.contains("r1") && el.classList.remove("r1"),
                        el.classList.contains("r2") && el.classList.remove("r2"),
                        el.classList.contains("r3") && el.classList.remove("r3"),
                        el.classList.add("r" + el.rotate),
                        puzzle[newY][newX] = el
                    }
            this.board = puzzle
        }
        ,
        this.mayMoveDown = function() {
            for (var y = 0; y < this.board.length; y++)
                for (var x = 0; x < this.board[y].length; x++)
                    if (this.board[y][x]) {
                        if (this.getY() + y + 1 >= this.area.y)
                            return !(this.stopped = !0);
                        if (this.area.getBlock(this.getY() + y + 1, this.getX() + x))
                            return !(this.stopped = !0)
                    }
            return !0
        }
        ,
        this.moveDown = function() {
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].style.top = this.elements[i].offsetTop + this.area.unit + "px";
            this.y++
        }
        ,
        this.mayMoveLeft = function() {
            for (var y = 0; y < this.board.length; y++)
                for (var x = 0; x < this.board[y].length; x++)
                    if (this.board[y][x]) {
                        if (this.getX() + x - 1 < 0)
                            return !1;
                        if (this.area.getBlock(this.getY() + y, this.getX() + x - 1))
                            return !1
                    }
            return !0
        }
        ,
        this.moveLeft = function() {
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].style.left = this.elements[i].offsetLeft - this.area.unit + "px";
            this.x--
        }
        ,
        this.mayMoveRight = function() {
            for (var y = 0; y < this.board.length; y++)
                for (var x = 0; x < this.board[y].length; x++)
                    if (this.board[y][x]) {
                        if (this.getX() + x + 1 >= this.area.x)
                            return !1;
                        if (this.area.getBlock(this.getY() + y, this.getX() + x + 1))
                            return !1
                    }
            return !0
        }
        ,
        this.moveRight = function() {
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i].style.left = this.elements[i].offsetLeft + this.area.unit + "px";
            this.x++
        }
    }
    function random(i) {
        return Math.floor(Math.random() * i)
    }
    keyboard.set(keyboard.n, this.start),
    keyboard.set(keyboard.p, this.pause),
    keyboard.set(keyboard.z, this.up),
    keyboard.set(keyboard.up, this.up),
    keyboard.set(keyboard.down, this.down),
    keyboard.set(keyboard.left, this.left),
    keyboard.set(keyboard.right, this.right),
    keyboard.set(keyboard.x, this.space),
    window.addEventListener("keydown", keyboard.event, !0),
    window.addEventListener("keyup", keyboard.eventUp, !0)
}
function md5cycle(x, k) {
    var a = x[0]
      , b = x[1]
      , c = x[2]
      , d = x[3];
    b = ii(b = ii(b = ii(b = ii(b = hh(b = hh(b = hh(b = hh(b = gg(b = gg(b = gg(b = gg(b = ff(b = ff(b = ff(b = ff(b, c = ff(c, d = ff(d, a = ff(a, b, c, d, k[0], 7, -680876936), b, c, k[1], 12, -389564586), a, b, k[2], 17, 606105819), d, a, k[3], 22, -1044525330), c = ff(c, d = ff(d, a = ff(a, b, c, d, k[4], 7, -176418897), b, c, k[5], 12, 1200080426), a, b, k[6], 17, -1473231341), d, a, k[7], 22, -45705983), c = ff(c, d = ff(d, a = ff(a, b, c, d, k[8], 7, 1770035416), b, c, k[9], 12, -1958414417), a, b, k[10], 17, -42063), d, a, k[11], 22, -1990404162), c = ff(c, d = ff(d, a = ff(a, b, c, d, k[12], 7, 1804603682), b, c, k[13], 12, -40341101), a, b, k[14], 17, -1502002290), d, a, k[15], 22, 1236535329), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[1], 5, -165796510), b, c, k[6], 9, -1069501632), a, b, k[11], 14, 643717713), d, a, k[0], 20, -373897302), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[5], 5, -701558691), b, c, k[10], 9, 38016083), a, b, k[15], 14, -660478335), d, a, k[4], 20, -405537848), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[9], 5, 568446438), b, c, k[14], 9, -1019803690), a, b, k[3], 14, -187363961), d, a, k[8], 20, 1163531501), c = gg(c, d = gg(d, a = gg(a, b, c, d, k[13], 5, -1444681467), b, c, k[2], 9, -51403784), a, b, k[7], 14, 1735328473), d, a, k[12], 20, -1926607734), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[5], 4, -378558), b, c, k[8], 11, -2022574463), a, b, k[11], 16, 1839030562), d, a, k[14], 23, -35309556), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[1], 4, -1530992060), b, c, k[4], 11, 1272893353), a, b, k[7], 16, -155497632), d, a, k[10], 23, -1094730640), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[13], 4, 681279174), b, c, k[0], 11, -358537222), a, b, k[3], 16, -722521979), d, a, k[6], 23, 76029189), c = hh(c, d = hh(d, a = hh(a, b, c, d, k[9], 4, -640364487), b, c, k[12], 11, -421815835), a, b, k[15], 16, 530742520), d, a, k[2], 23, -995338651), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[0], 6, -198630844), b, c, k[7], 10, 1126891415), a, b, k[14], 15, -1416354905), d, a, k[5], 21, -57434055), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[12], 6, 1700485571), b, c, k[3], 10, -1894986606), a, b, k[10], 15, -1051523), d, a, k[1], 21, -2054922799), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[8], 6, 1873313359), b, c, k[15], 10, -30611744), a, b, k[6], 15, -1560198380), d, a, k[13], 21, 1309151649), c = ii(c, d = ii(d, a = ii(a, b, c, d, k[4], 6, -145523070), b, c, k[11], 10, -1120210379), a, b, k[2], 15, 718787259), d, a, k[9], 21, -343485551),
    x[0] = add32(a, x[0]),
    x[1] = add32(b, x[1]),
    x[2] = add32(c, x[2]),
    x[3] = add32(d, x[3])
}
function cmn(q, a, b, x, s, t) {
    return a = add32(add32(a, q), add32(x, t)),
    add32(a << s | a >>> 32 - s, b)
}
function ff(a, b, c, d, x, s, t) {
    return cmn(b & c | ~b & d, a, b, x, s, t)
}
function gg(a, b, c, d, x, s, t) {
    return cmn(b & d | c & ~d, a, b, x, s, t)
}
function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
}
function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t)
}
function md51(s) {
    txt = "";
    var i, n = s.length, state = [1732584193, -271733879, -1732584194, 271733878];
    for (i = 64; i <= s.length; i += 64)
        md5cycle(state, md5blk(s.substring(i - 64, i)));
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    if (tail[i >> 2] |= 128 << (i % 4 << 3),
    55 < i)
        for (md5cycle(state, tail),
        i = 0; i < 16; i++)
            tail[i] = 0;
    return tail[14] = 8 * n,
    md5cycle(state, tail),
    state
}
function md5blk(s) {
    var i, md5blks = [];
    for (i = 0; i < 64; i += 4)
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    return md5blks
}
String.prototype.trim || (String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, "")
}
),
Array.prototype.removeByIndex || (Array.prototype.removeByIndex = function(index) {
    this.splice(index, 1)
}
),
String.prototype.format || (String.prototype.format = function() {
    if (!arguments.length)
        throw "String.format() failed, no arguments passed, this = " + this;
    var tokens = this.split("?");
    if (arguments.length != tokens.length - 1)
        throw "String.format() failed, tokens != arguments, this = " + this;
    for (var s = tokens[0], i = 0; i < arguments.length; ++i)
        s += arguments[i] + tokens[i + 1];
    return s
}
);
var hex_chr = "0123456789abcdef".split("");
function rhex(n) {
    for (var s = "", j = 0; j < 4; j++)
        s += hex_chr[n >> 8 * j + 4 & 15] + hex_chr[n >> 8 * j & 15];
    return s
}
function hex(x) {
    for (var i = 0; i < x.length; i++)
        x[i] = rhex(x[i]);
    return x.join("")
}
function md5(s) {
    return hex(md51(s))
}
function add32(a, b) {
    return a + b & 4294967295
}
if ("5d41402abc4b2a76b9719d911017c592" != md5("hello"))
    function add32(x, y) {
        var lsw = (65535 & x) + (65535 & y);
        return (x >> 16) + (y >> 16) + (lsw >> 16) << 16 | 65535 & lsw
    }
var Sounds = {
    mute: !1,
    lastPlayed: null,
    webAudio: !1,
    audioCtx: null,
    sounds: {},
    loadSound: function(sound) {
        Sounds.webAudio ? Sounds.sounds[sound] || Sounds.loadWebAudio(sound, !1) : Sounds.sounds[sound] || Sounds.loadHTMLMedia(sound, !1)
    },
    loadHTMLMedia: function(sound) {
        "wrong" === sound ? Sounds.sounds.wrong = new Audio("wrong.wav") : "click" === sound ? Sounds.sounds.click = new Audio("click.wav") : "correct" === sound ? Sounds.sounds.correct = new Audio("correct.wav") : "win" === sound ? Sounds.sounds.win = new Audio("win.wav") : "ding" === sound ? Sounds.sounds.ding = new Audio("ding.wav") : "disco" === sound && (Sounds.sounds.disco = new Audio("clcik.wav")),
        "click" === sound && (Sounds.sounds.click.volume = .5)
    },
    loadWebAudio: function(sound, playOnLoad) {
        "wrong" === sound ? Sounds.loadOneAudio("wrong.wav", "wrong", playOnLoad) : "click" === sound ? Sounds.loadOneAudio("click.wav", "click", playOnLoad) : "correct" === sound ? Sounds.loadOneAudio("correct.wav", "correct", playOnLoad) : "win" === sound ? Sounds.loadOneAudio("win.wav", "win", playOnLoad) : "ding" === sound ? Sounds.loadOneAudio("ding.wav", "ding", playOnLoad) : "disco" === sound && Sounds.loadOneAudio("disco.mp3", "disco", playOnLoad)
    },
    loadOneAudio: function(soundURL, name, playOnLoad) {
        var request = new XMLHttpRequest;
        request.open("GET", soundURL, !0),
        request.responseType = "arraybuffer",
        request.addEventListener("load", function(event) {
            Sounds.audioCtx.decodeAudioData(event.target.response, function(buffer) {
                Sounds.sounds[name] = buffer,
                playOnLoad && Sounds.play(name)
            })
        }, !1),
        request.send()
    },
    toggleMute: function(mute) {
        Sounds.mute = mute,
        Sounds.lastPlayed && Sounds.lastPlayed.stop()
    },
    play: function(sound) {
        Sounds.mute || (Sounds.webAudio ? Sounds.sounds[sound] ? Sounds.playWebAudio(sound) : Sounds.loadWebAudio(sound, !0) : Sounds.sounds[sound] ? Sounds.playHTMLMedia(sound) : Sounds.loadHTMLMedia(sound))
    },
    playHTMLMedia: function(sound) {
        Sounds.lastPlayed && (Sounds.lastPlayed.pause(),
        Sounds.lastPlayed.currentTime = 0);
        var s = Sounds.sounds[sound];
        if (!isNaN(s.duration)) {
            var p = s.play();
            p && p.catch(function() {}),
            Sounds.lastPlayed = s
        }
    },
    playWebAudio: function(sound) {
        Sounds.lastPlayed && Sounds.lastPlayed.stop(),
        "suspended" === Sounds.audioCtx.state && Sounds.audioCtx.resume();
        var source = Sounds.audioCtx.createBufferSource();
        source.buffer = Sounds.sounds[sound],
        source.connect(Sounds.audioCtx.destination),
        source.start(),
        Sounds.lastPlayed = source
    },
    playTone: function() {
        var source = Sounds.audioCtx.createOscillator();
        source.type = 0,
        source.connect(Sounds.audioCtx.destination),
        source.start()
    }
};
window.AudioContext || window.webkitAudioContext ? (Sounds.audioCtx = new (window.AudioContext || window.webkitAudioContext),
Sounds.webAudio = !0) : Sounds.webAudio = !1;
