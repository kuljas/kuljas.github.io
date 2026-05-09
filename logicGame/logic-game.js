const size=3;
const colors = ["red","green","blue"];
const numbers = ["1","2","3"];
var levels = createLevels();

function createLevels(){
    return [colors[getRandomInt(size)],numbers[getRandomInt(size)],colors[getRandomInt(size)]+" and "+numbers[getRandomInt(size)], colors[getRandomInt(size)]+" or "+numbers[getRandomInt(size)],"not "+colors[getRandomInt(size)]+" and "+numbers[getRandomInt(size)],colors[getRandomInt(size)]+" or not "+numbers[getRandomInt(size)],"not "+colors[getRandomInt(size)]+" and not "+numbers[getRandomInt(size)]];
}

class Field{
    constructor(text,color){
        this.text = text;
        this.color = color;
        }  	
    appropriateColor(formula){
        let check = true;
        let formulaColor=formula.getColor.split(' ');
        if (formulaColor.length == 2 && this.color == formulaColor[1])
            check = false;
        else if (formulaColor.length == 1 && this.color != formulaColor[0])
            check = false;
        return check;
    }
    appropriateNumber(formula){
        let check = true;
        let formulaNumber=formula.getNumber.split(' ');
        if (formulaNumber.length == 2 && this.text == formulaNumber[1])
            check = false;
        else if (formulaNumber.length == 1 && this.text != formulaNumber[0])
            check = false;
        return check;
    }
    isSolution(formula){
                let connector = formula.getConnector;
                    if (connector == "and")
            return this.appropriateNumber(formula) && this.appropriateColor(formula);
                else if (connector == "or" || connector == undefined)
            return this.appropriateNumber(formula) || this.appropriateColor(formula);
    }
}

class Formula{  
    constructor(formula){
        this.formula=formula;
    }
    get getWords(){
        return this.formula.split(' ');
    }
	get getLength(){
    	return this.getWords.length
    }        
    get getColor(){
        let words = this.getWords;
        if (words[0] == "not")
            return "not " + words[1];
        else
            return words[0];
    }
    get getConnector(){
        let words = this.getWords;
        if (words[0] == "not")
            return words[2];
        else
            return words[1];
    }
    get getNumber(){
        let words = this.getWords;
        let number = words[this.getLength-1];
        if (words[this.getLength-2] == "not")
            return "not " + number;
        else
            return number;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function numberOfFieldsInSolution(formula){
    let num = 0;
    let fields = createFields(size,colors);
    for (let i=0; i<fields.length; i++){
        if (fields[i].isSolution(formula))
            num++;
    }
    return num;
}

var currentLevelSize=0;
var currentLevel=0;
var levelTimerId = null;
var remainingTime = 0;
var levelCompleted = false;

const formulas = levels.map(x => new Formula(x))
const numberInSolution = formulas.map(x => numberOfFieldsInSolution(x));

function getLevelTimeLimit(levelIndex){
    const levelLimits = [20, 18, 16, 14, 12, 10, 10];
    if (levelIndex < levelLimits.length)
        return levelLimits[levelIndex];
    return 10;
}

function updateTimerDOM(){
    const timer = document.getElementById('timer');
    timer.innerHTML = "Time left: " + remainingTime.toString() + "s";
}

function stopLevelTimer(){
    if (levelTimerId !== null){
        clearInterval(levelTimerId);
        levelTimerId = null;
    }
}

function startLevelTimer(table, levelIndex){
    stopLevelTimer();
    remainingTime = getLevelTimeLimit(levelIndex);
    updateTimerDOM();
    levelTimerId = setInterval(function(){
        remainingTime--;
        updateTimerDOM();
        if (remainingTime <= 0){
            stopLevelTimer();
            drawSolutionDOM(table, levelIndex, "Time is up. This is a solution:");
        }
    }, 1000);
}

function createFields(numberInRow,colors){
    let fields=[];
    for (let i=0;i<numberInRow;i++){
        for(let j=1;j<numberInRow+1;j++){
            let field = new Field(j.toString(),colors[i]);
            fields.push(field)
        }
    }
  return fields
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}   

function createTable(tableSize,colors){
    let number = parseInt(tableSize[0]);
    let fields = createFields(number,colors)
    return shuffle(fields);
}

function drawLevelDOM(tableSize,currentLevel){
    if (currentLevel >= levels.length){
        const solution = document.getElementById('solution');
        solution.innerHTML="You won all levels!";
        const timer = document.getElementById('timer');
        timer.innerHTML = "Completed";
        return;
    }

    levelCompleted = false;
    currentLevelSize=0;
    document.getElementById('currentLevel').innerHTML="Level: "+(currentLevel+1).toString();
    const formulaDisplay = document.getElementById('formulaDisplay');
    formulaDisplay.innerHTML=levels[currentLevel];
    document.getElementById('solution').innerHTML="";
    let numberOfRows = parseInt(tableSize[0]);
    let table = createTable(tableSize,colors);
    const div = document.getElementById('fields');
    for (let i=0; i<numberOfRows; i++){
        const paragraph = document.createElement('p');
        div.appendChild(paragraph);
        for (let j=0; j<numberOfRows; j++){
            let button = document.createElement("BUTTON");
            paragraph.appendChild(button);
        }
    }
    const buttons = document.querySelectorAll("button");
    for(let i=0; i<numberOfRows*numberOfRows; i++){
        let color = table[i].color;
        let number = table[i].text;
        buttons[i].setAttribute("class",color);
        buttons[i].innerHTML = number;
    }
    startLevelTimer(table, currentLevel);
    addEvents(buttons,table,currentLevel);
}

function addEvents(buttons,table,currentLevel){
    for (let i=0; i<buttons.length; i++){
            buttons[i].addEventListener("click",function(){
                check(i,table,currentLevel);
            }); 
    }
}

function multipleRemove(buttons){
    for(let i=0;i<buttons.length;i++)
        buttons[i].remove();
}

function check(i,table,currentLevel){
    if (levelCompleted)
        return;

    const buttons = document.querySelectorAll("button");
    if (table[i].isSolution(formulas[currentLevel])){
        currentLevelSize++;
        pressedButtonStyle(buttons[i],table[i]);
        buttons[i].disabled = true;
        if (currentLevelSize==numberInSolution[currentLevel]){
            levelCompleted = true;
            stopLevelTimer();
            currentLevel++;
            multipleRemove(buttons);
            drawLevelDOM('3 x 3',currentLevel);
        }
    }
    else{
        stopLevelTimer();
        drawSolutionDOM(table,currentLevel,"You Lost. This is a solution:");
    }
}

function pressedButtonStyle(button,table){
    button.style.color = table.color;
    button.style.border = "3px solid "+ table.color;
    button.style.backgroundColor="white";
}

function drawSolutionDOM(table,currentLevel,message){
    levelCompleted = true;
    const solution = document.getElementById('solution');
    solution.innerHTML=message;
    const buttons = document.querySelectorAll("button");
    for(let i=0;i<table.length;i++){
        if (table[i].isSolution(formulas[currentLevel])){
            pressedButtonStyle(buttons[i],table[i])
            buttons[i].disabled = true;
        }
        else{
            buttons[i].setAttribute("class","silver");
            buttons[i].disabled = true;
        }
    }
}