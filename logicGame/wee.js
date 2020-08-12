const size=3;
const colors = ["red","green","blue","purple"];
const numbers = ["1","2","3","4"];
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
        let veznik = formula.getVeznik;
          if (veznik == "and")
            return this.appropriateNumber(formula) && this.appropriateColor(formula);
        else if (veznik == "or" || veznik == undefined)
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
    get getVeznik(){
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

function numberOfFiledsInSolution(formula){
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

const formule = levels.map(x => new Formula(x))
const numberInSolution = formule.map(x => numberOfFiledsInSolution(x));

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
    currentLevelSize=0;
    document.getElementById('currentLevel').innerHTML="Level: "+(currentLevel+1).toString();
    const zadaj = document.getElementById('zadavanje');
    zadaj.innerHTML=levels[currentLevel];
    let numberOfRows = parseInt(tableSize[0]);
    let table = createTable(tableSize,colors);
    const div = document.getElementById('fields');
    for (let i=0; i<numberOfRows; i++){
        const paragraf = document.createElement('p');
        div.appendChild(paragraf);
        for (let j=0; j<numberOfRows; j++){
            let button = document.createElement("BUTTON");
            paragraf.appendChild(button);
        }
    }
    const buttons = document.querySelectorAll("button");
    for(let i=0; i<numberOfRows*numberOfRows; i++){
        let color = table[i].color;
        let number = table[i].text;
        buttons[i].setAttribute("class",color);
        buttons[i].innerHTML = number;
    }
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
    const buttons = document.querySelectorAll("button");
    if (table[i].isSolution(formule[currentLevel])){
        currentLevelSize++;
        pressedButtonStyle(buttons[i],table[i]);
        buttons[i].disabled = true;
        if (currentLevelSize==numberInSolution[currentLevel]){
            currentLevel++;
            multipleRemove(buttons);
            drawLevelDOM('3 x 3',currentLevel);
        }
    }
    else{
        console.log(currentLevel);
        drawSolutionDOM(table,currentLevel);
    }
}

function pressedButtonStyle(button,table){
    button.style.color = table.color;
    button.style.border = "3px solid "+ table.color;
    button.style.backgroundColor="white";
}

function drawSolutionDOM(table,currentLevel){
    const solution = document.getElementById('solution');
    solution.innerHTML="You Lost. This is a solution:";
    const buttons = document.querySelectorAll("button");
    for(let i=0;i<table.length;i++){
        if (table[i].isSolution(formule[currentLevel])){
            pressedButtonStyle(buttons[i],table[i])
            buttons[i].disabled = true;
        }
        else{
            buttons[i].setAttribute("class","silver");
            buttons[i].disabled = true;
        }
    }
}