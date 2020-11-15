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
 * @param {Screen} screen - 螢幕
 * @param {Screen} expressionScreen - 顯示運算式的螢幕
 * @property {Screen} screen - 計算機螢幕
 * @property {string} left - 左運算元(未轉換為number)
 * @property {string} right - 右運算元(未轉換為number)
 * @property {string} op - 運算子
 * @property {bool} isAccessLeft - 是否正在存取left
 * @property {object} operate - 運算子對應運算方法
 */
function Abacus(screen, expressionScreen){
    this.screen = screen; //螢幕dom
    this.expressionScreen = expressionScreen
    this.reset();
    this.operate = {
        "+": function(v1, v2){return v1 + v2},
        "-": function(v1, v2){return v1 - v2},
        "x": function(v1, v2){return v1 * v2},
        "/": function(v1, v2){return v1 / v2},
    };
    this.screen.write(this.left);
    this.expressionScreen.write(this.left);
}

/**
 * 點擊按鍵
 * @param {string} input - 使用者點擊的按鍵指令 
 */
Abacus.prototype.click = function(input){
    this.input = input;
    var isComputeError = false;

    if(this.isClickNumber() || this.isClickPoint()){ //數字&小數點
        var num = (this[this.isAccessLeft?"left":"right"] || "0") + input;

        if(!isNaN(num)){ //是數字

            //開頭連續兩個0
            if(num[0] == "0" && num[1] == "0"){
                num = "0";
            }

            this[this.isAccessLeft?"left":"right"] = num;
        }
    }else { //運算元

        if(this.hasLeft() && this.hasOp() && this.hasRight()){
            var result = this.compute().toString();
            var op = this.op;
            this.reset();

            //計算結果為NaN或Infinity
            if(!this.isNumber(result)){
                alert(`不正確的運算式`);
                this.left = "0";
                isComputeError = true;
            }else{
                this.left = result;
            }
            
            if(this.isClickOp()){
                this.op = op;
            }
        } 
    }

    var show = (this.hasOp() && (this.isClickNumber() || this.isClickPoint())?this.right:this.left) || "0";
    
    this.screen.write(show.slice(show[0] == "0" && show[1] != "." && show.length > 1?1:0));

    if(this.isClickOp()){
        this.op = isComputeError?undefined:input;
        this.isAccessLeft = false;
    }

    if(this.isClickEqual()){
        this.op = undefined;
        this.isAccessLeft = true;
    }

    var showLeft = this.left, showRight = !this.isAccessLeft?this.right || "0":"",

    showLeft = showLeft.slice(showLeft[0] == "0" && showLeft[1] != "." && showLeft.length > 1?1:0);
    showRight = showRight.slice(showRight[0] == "0" && showRight[1] != "."?1:0);

    this.expressionScreen.write(`${showLeft} ${this.op || ""} ${showRight}`);
}

/**
 * 計算完後重新設置
 */
Abacus.prototype.reset = function(){
    this.op = undefined;
    this.left = "0";
    this.right = undefined;
    this.isAccessLeft = true;
}

/**
 * 是否按下加減乘除
 * @return {boolean}
 */
Abacus.prototype.isClickOp = function(){
    return Object.keys(this.operate).includes(this.input);
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
    return this.isNumber(this.input);
}

/**
 * 是否按下小數點
 * @return {boolean}
 */
Abacus.prototype.isClickPoint = function(){
    return this.input == ".";
}

/**
 * 是否為數字
 * @param {number} val
 * @return {boolean}
 */
Abacus.prototype.isNumber = function(val){
    return !isNaN(val) && isFinite(val);
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