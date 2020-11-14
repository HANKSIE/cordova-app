/**
 * constructor
 * @param {Screen} screen - 計算機螢幕dom 
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

    this.canAppend = false;

    this.screen.write(0);
}

/**
 * 點擊按鍵
 * @param {String} input - 使用者點擊的按鍵指令 
 */
Abacus.prototype.click = function(input){
    this.input = input;

    //小數點
    if(this.isClickPoint()){
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
        if(this.hasOp() && !this.canAppend){
            this.screen.write(input);
            this.canAppend = !this.canAppend;
        }else{
            this.screen.append(input);
        }
    }else{ //運算子
       if(this.hasTemp() && this.hasOp()){
            var result = this.compute();
            this.screen.write(result);
            var op = this.op;
            this.reset();
            if(!this.isClickEqual() ){
                this.op = op;
            }
        }
        
        this.temp = this.screen.read();
    
        //點擊的按鍵不是"="
        if(!this.isClickEqual()){
            this.op = input;
        }
    }

}

/**
 * 計算完後重新設置
 */
Abacus.prototype.reset = function(){
    this.op = undefined;
    this.temp = undefined;
    this.canAppend = false;
}

/**
 * 螢幕上是否只有"0"
 * @return {Boolean}
 */
Abacus.prototype.isOnlyZeroOnScreen = function(){
    return this.screen.read() == "0";
}

/**
 * 是否按下等於
 * @return {Boolean}
 */
Abacus.prototype.isClickEqual = function(){
    return this.input == "=";
}

/**
 * 是否按下數字鍵
 * @return {Boolean}
 */
Abacus.prototype.isClickNumber = function(){
    return !isNaN(parseInt(this.input) || parseFloat(this.input));
}

/**
 * 是否按下小數點
 * @return {Boolean}
 */
Abacus.prototype.isClickPoint = function(){
    return this.input == ".";
}

/**
 * 是否有運算元
 * @return {Boolean}
 */
Abacus.prototype.hasOp = function(){
    return this.op !== undefined;
}

/**
 * 是否有數字暫存
 * @return {Boolean}
 */
Abacus.prototype.hasTemp = function(){
    return this.temp !== undefined;
}

/**
 * 計算
 * @return {Number}
 */
Abacus.prototype.compute = function(){
   return this.operate[this.op](parseFloat(this.temp), parseFloat(this.screen.read()));
}

//=========================================================

/**
 * constructor
 * @param {Element} screen - 計算機螢幕dom 
 */
function Screen(screen){
    this.screen = screen; //螢幕dom
}

/**
 * 回傳螢幕上的字
 * @return {String}
 */
Screen.prototype.read = function(){
    return this.screen.innerHTML;
}

/**
 * 輸出字串到螢幕上
 * @param {String} output - 顯示到螢幕上的字串
 */
Screen.prototype.write = function(output){
    this.screen.innerHTML = output;
}

/**
 * 在螢幕的字串之後串接字串
 * @param {String} output - 顯示到螢幕上的字串
 */
Screen.prototype.append = function(output){
    this.screen.innerHTML += output;
}