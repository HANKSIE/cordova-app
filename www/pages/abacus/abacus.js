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
 * @param {Monitor} monitor - 螢幕
 * @param {Monitor} expressionMonitor - 顯示運算式的螢幕
 * @property {Monitor} monitor - 計算機螢幕
 * @property {string} left - 左運算元(未轉換為number)
 * @property {string} right - 右運算元(未轉換為number)
 * @property {string} op - 運算子
 * @property {bool} isAccessLeft - 是否正在存取left
 * @property {bool} isEndOfCompute - 是否計算結束
 * @property {object} operate - 運算子對應運算方法
 */
function Abacus(monitor, expressionMonitor){
    this.monitor = monitor; //螢幕dom
    this.expressionMonitor = expressionMonitor
    this.reset();
    this.operate = {
        "+": function(v1, v2){return v1 + v2},
        "-": function(v1, v2){return v1 - v2},
        "x": function(v1, v2){return v1 * v2},
        "/": function(v1, v2){return v1 / v2},
    };
    this.monitor.write(this.left);
    this.expressionMonitor.write(this.left);
}

/**
 * 點擊按鍵
 * @param {string} input - 使用者點擊的按鍵指令 
 */
Abacus.prototype.click = function(input){
    this.input = input;
    var isComputeError = false;

    if(this.isClickNumber() || this.isClickPoint()){ //數字&小數點
        
        var num = this[this.isAccessLeft?"left":"right"] || "0";

        num = (num == "0" && this.isClickNumber())?input:num.toString() + input;

        //結束計算
        if(this.isEndOfCompute){
            //如果結束計算後點擊小數點，設為"0."，反之設數字
            num = this.isClickPoint()?"0.":input;
            this.isEndOfCompute = false;
        }

        if(!isNaN(num)){ //是數字
            this[this.isAccessLeft?"left":"right"] = num;
        }

    }else { //運算元(加減乘除)

        //計算
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
            
            this.isEndOfCompute = true;
        } 
    }

    var show = (this.hasOp() && (this.isClickNumber() || this.isClickPoint())?this.right:this.left) || "0";
    
    this.monitor.write(show);

    if(this.isClickOp()){
        this.op = isComputeError?undefined:input;

        //計算有誤則繼續存取的變數為left
        this.isAccessLeft = isComputeError;
    }

    if(this.isClickEqual()){
        this.op = undefined;
        this.isAccessLeft = true;
    }

    var showLeft = this.left;
    var showRight = !this.isAccessLeft?(this.right === undefined?"":this.right):"";

    this.expressionMonitor.write(`${showLeft} ${this.op || ""} ${showRight}`);
}

/**
 * 計算完後重新設置
 */
Abacus.prototype.reset = function(){
    this.op = undefined;
    this.left = "0";
    this.right = undefined;
    this.isAccessLeft = true;
    this.isEndOfCompute = false;
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
 * 處理Dom文字讀寫
 * 
 * ========================================================
 */

/**
 * constructor
 * @param {Element} monitor - 計算機螢幕dom 
 */
function Monitor(monitor){
    this.monitor = monitor; //螢幕dom
}

/**
 * 回傳螢幕上的字
 * @return {string}
 */
Monitor.prototype.read = function(){
    return this.monitor.innerHTML;
}

/**
 * 輸出字串到螢幕上
 * @param {string} output - 顯示到螢幕上的字串
 */
Monitor.prototype.write = function(output){
    this.monitor.innerHTML = output;
}

/**
 * 在螢幕的字串之後串接字串
 * @param {string} output - 顯示到螢幕上的字串
 */
Monitor.prototype.append = function(output){
    this.monitor.innerHTML += output;
}