/**
 * ========================================================
 * 
 * 計算機
 * 
 * ========================================================
 */

/**
 * @constructor
 * 
 * @param {Screen} screen - 計算機螢幕
 * 
 * @property {Screen} screen - 計算機螢幕
 * @property {string} left - 左運算元(未轉換為number)
 * @property {string} right - 右運算元(未轉換為number)
 * @property {string} op - 運算子
 * @property {bool} canAppend - 字串是否可以串接在目前螢幕上的數字之後
 * @property {bool} hasAccessLeft - 是否正在存取left
 * @property {object} operate - 運算子對應運算方法
 */
function Abacus(screen){
    this.screen = screen; //螢幕dom
    this.reset();
    this.operate = {
        "+": function(v1, v2){return v1 + v2},
        "-": function(v1, v2){return v1 - v2},
        "x": function(v1, v2){return v1 * v2},
        "/": function(v1, v2){return v1 / v2},
    };
    this.screen.write(0);
}

/**
 * 點擊按鍵
 * @param {string} input - 使用者點擊的按鍵指令 
 */
Abacus.prototype.click = function(input){
    this.input = input;
    //小數點
    if(this.isClickPoint() && !this.canNumOverrideScreen){
        if(this.screen.read().indexOf(".") == -1){
            this.screen.append(input);
        }
        return;
    }

    //畫面只有0
    if(this.isOnlyZeroOnScreen()){
        if(this.isClickNumber()){
            this.screen.write(input);
        }
        return;
    }

    if(this.isClickNumber()){ //整數

        this.hasAccessLeft = false;

        if(this.canNumOverrideScreen){
            this.screen.write(input);
            this.reset();
        }else if(this.hasOp() && !this.canAppend){
            this.screen.write(input);
            this.canAppend = !this.canAppend;
        }else{
            this.screen.append(input);
        }

    }else{ //運算子

        //螢幕上的值是否應為left值
        if(!this.hasAccessLeft){
            if(!this.hasLeft()){
                this.left = this.screen.read();
                this.hasAccessLeft = true;
            } else if(!this.hasRight()){
                this.right = this.screen.read();
            }

            //計算
            if(this.hasLeft() && this.hasOp() && this.hasRight()){
                var result = this.compute();
                this.screen.write(result);
                var op = this.op;
                this.reset();
                
                //點擊的按鍵不是"="
                if(!this.isClickEqual() ){
                    this.hasAccessLeft = true;
                    this.left = result;
                    this.op = op;
                }
                this.canNumOverrideScreen = true;
            }
        }

        this.op = this.isClickEqual()?undefined:input;

    }

    console.log(`${this.left} ${this.op} ${this.right}`);
}

/**
 * 計算完後重新設置
 */
Abacus.prototype.reset = function(){
    this.op = undefined;
    this.left = undefined;
    this.right = undefined;
    this.canAppend = false;
    this.hasAccessLeft = false;
    this.canNumOverrideScreen = false;
}

/**
 * 螢幕上是否只有"0"
 * @return {boolean}
 */
Abacus.prototype.isOnlyZeroOnScreen = function(){
    return this.screen.read() == "0";
}

/**
 * 是否按下等於
 * @return {boolean}
 */
Abacus.prototype.isClickEqual = function(){
    return this.input == "=";
}

/**
 * 是否按下數字鍵
 * @return {boolean}
 */
Abacus.prototype.isClickNumber = function(){
    return !isNaN(parseInt(this.input) || parseFloat(this.input));
}

/**
 * 是否按下小數點
 * @return {boolean}
 */
Abacus.prototype.isClickPoint = function(){
    return this.input == ".";
}

/**
 * 是否有運算元
 * @return {boolean}
 */
Abacus.prototype.hasOp = function(){
    return this.op !== undefined;
}

/**
 * left是否有定義
 * @return {boolean}
 */
Abacus.prototype.hasLeft = function(){
    return this.left !== undefined;
}

/**
 * right是否有定義
 * @return {boolean}
 */
Abacus.prototype.hasRight = function(){
    return this.right !== undefined;
}

/**
 * 計算
 * @return {number}
 */
Abacus.prototype.compute = function(){
   return this.operate[this.op](parseFloat(this.left), parseFloat(this.right));
}

/**
 * ========================================================
 * 
 * 處理screenDom文字讀寫
 * 
 * ========================================================
 */

/**
 * constructor
 * @param {Element} screen - 計算機螢幕dom 
 */
function Screen(screen){
    this.screen = screen; //螢幕dom
}

/**
 * 回傳螢幕上的字
 * @return {string}
 */
Screen.prototype.read = function(){
    return this.screen.innerHTML;
}

/**
 * 輸出字串到螢幕上
 * @param {string} output - 顯示到螢幕上的字串
 */
Screen.prototype.write = function(output){
    this.screen.innerHTML = output;
}

/**
 * 在螢幕的字串之後串接字串
 * @param {string} output - 顯示到螢幕上的字串
 */
Screen.prototype.append = function(output){
    this.screen.innerHTML += output;
}