//Start time?
var play = 0;
var first= 0;
// Start Timer on Spacebar
var currentBlindLevel = 0;
var blindOffset = 0;
var onBreak = 0;
var timePassed = 1;
var currentBlindTime, currentBlindSeconds, currentSmallBlind, currentBigBlind, currentAnte;
window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
};
var selection = document.getElementById("playerDropdown");
selection.onkeydown = function(e){
    if(e.keyCode === 39 || e.keyCode === 40) { //up or down
        e.preventDefault();
        //return false;
    }
};
document.body.onkeyup = function(e){
	"use strict";
    e.preventDefault();
    var TimerArea = document.getElementById("Timer").className;
    if(e.keyCode === 32 && Boolean(play)===false && Boolean(onBreak)===false && TimerArea==="content activeContent"){
        if(Boolean(first)===false){
            rounders.play();
            first=1;
        }
		document.getElementById("instr").innerHTML = "Playing";
		document.getElementById("blind").innerHTML = currentSmallBlind+ " / "+ currentBigBlind + ((currentAnte > 0) ? ", " + currentAnte : " ");
        play = 1;
    }
	else if(e.keyCode === 32 && Boolean(play)===true && Boolean(onBreak)===false && TimerArea==="content activeContent"){
		play = 0;
		document.getElementById("instr").innerHTML = "Paused";
	}
	else if(e.keyCode === 32 && Boolean(play)===false && Boolean(onBreak)===true && TimerArea==="content activeContent"){
        document.getElementById("instr").innerHTML = "Playing";
		play = 1;
		onBreak = 0;
        timePassed = 0;
        currentBlindLevel++;
        document.getElementById("blind").innerHTML = "Blinds: "+nextBlindLevel();
	}
};
var audio = new Audio('sound.mp3');
var rounders = new Audio('play_poker.mp3');
var missingIDs = [];
var playerList = [];
var playersUsed= [{key:0,value:"empty"}];
var database = firebase.database();
var update = 0;
var red = 0;
var Player = database.ref("Players");
Player.on('value', function(snapshot){
    playerList= snapshot.val();
    update=1;
});

//count down every second
var x = setInterval(function() {
	"use strict";
	//Update loop
	if(Boolean(update)){
		var selectElmnt = document.getElementById("playerDropdown");
        for(var i=1;i<playerList.length;i++){
        	var tempUsed = playersUsed[i];
        	var tempPlyr = playerList[i];
        	if(tempUsed===undefined && tempPlyr != undefined && missingIDs[0]!==i){
                selectElmnt.appendChild(createOption(i,playerList[i]));
                playersUsed.push({key: i,value: playerList[i]});
			}
			else if(tempPlyr === undefined){
			    missingIDs.push(i);
            }
            else if(missingIDs.length>0 && missingIDs[0]=== i){
                selectElmnt.appendChild(createOption(i,playerList[i]));
                playersUsed.push({key: i,value: playerList[i]});
                missingIDs.shift();
            }
		}
        update=0;
	}


    if(Boolean(onBreak)===false){
        currentBlindTime = document.getElementsByName("duration")[currentBlindLevel-blindOffset].value;
        currentBlindSeconds = currentBlindTime * 60;
        currentSmallBlind = document.getElementsByName("blinds_small")[currentBlindLevel-blindOffset].value;
        currentBigBlind = document.getElementsByName("blinds_big")[currentBlindLevel-blindOffset].value;
	currentAnte = document.getElementsByName("ante")[currentBlindLevel-blindOffset].value;
        document.getElementById("blind").innerHTML = currentSmallBlind+ " / "+ currentBigBlind + ((currentAnte > 0) ? ", " + currentAnte : " ");
	}
    document.getElementById("next").innerHTML = "Next Level: "+nextBlindLevel();
	//Play loop
	if(Boolean(play)){
		var time = currentBlindSeconds-timePassed;
		var minutes = Math.floor(time/60);
		var seconds = Math.floor(time%60);
		var formattedMinutes = ("0" + minutes).slice(-2);
		var formattedSeconds = ("0" + seconds).slice(-2);
		// Output the result in an element with id="demo"
    	document.getElementById("demo").innerHTML = formattedMinutes + ":" + formattedSeconds;
    	timePassed = timePassed+1;
    	// If the count down is over, write some text
        if(time<6){
            if (Boolean(red)===false){
                document.getElementById("demo").className = "Red";
                red = 1;
            }
            audio.play();
        }
        else if(Boolean(red)){
            document.getElementById("demo").className = "";
            red = 0;
        }
    	if (time < 1) {
    		timePassed= 0;
    		if(nextBlindLevel() === "Break"){
				blindOffset++;
                document.getElementById("instr").innerHTML = "Press Spacebar to Resume";
                document.getElementById("blind").innerHTML = " ";
                document.getElementById("demo").innerHTML = "BREAK";
				play = 0;
				onBreak = 1;
			}
            currentBlindLevel++;
        	//clearInterval(x);
        	//document.getElementById("demo").innerHTML = "00:00";
    	}
	}



}, 1000);
//Next Level
function nextBlindLevel(){
	var levelList = document.getElementById("blindList").children;
	if(levelList[currentBlindLevel+1].className == "level"){
		var nextChildren = levelList[currentBlindLevel+1].children;

		return nextChildren[0].value + "/" + nextChildren[1].value + ((nextChildren[2].value > 0) ? ", " + nextChildren[2].value : " ");
	}
	else if(levelList[currentBlindLevel+1].className == "break"){
		return "Break";
	}
	return levelList[currentBlindLevel+1];
}
//Switch to set up view
function openTab(evt, tabName) {
	"use strict";
    var i, content, tablinks;
    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) {
		content[i].className = content[i].className.replace(" activeContent","");
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).className += " activeContent";
    evt.currentTarget.className += " active";
}
var shown= 0;
function showaddField(evt,fieldName){
	"use strict";
	var field;
    field = document.getElementById(fieldName);
	if(Boolean(shown)===false){
        field.className += " shown";
        evt.currentTarget.innerHTML = "-";
        shown=1;
	}
	else if(Boolean(shown)===true){
		field.className = field.className.replace(" shown","");
        evt.currentTarget.innerHTML = "+";
		shown=0;
	}

}
function openSubTab(evt, tabName) {
	"use strict";
    var i, subcontent, subtablinks;
    subcontent = document.getElementsByClassName("subcontent");
    for (i = 0; i < subcontent.length; i++) {
		subcontent[i].className = subcontent[i].className.replace(" activeSubContent","");
    }
    subtablinks = document.getElementsByClassName("subtablinks");
    for (i = 0; i < subtablinks.length; i++) {
        subtablinks[i].className = subtablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).className += " activeSubContent";
    evt.currentTarget.className += " active";
}
function deleteTab(evt){
	"use strict";
	evt.currentTarget.parentNode.remove();
}
function createInput(min,max,name,type,pholder){
	"use strict";
	var x = document.createElement("INPUT");
	x.setAttribute("min",min);
	x.setAttribute("max",max);
	x.setAttribute("name",name);
	x.setAttribute("type",type);
	x.setAttribute("placeholder",pholder);
	return x;
}
function createBtn(cls,onclk){
	"use strict";
	var btn = document.createElement("BUTTON");
	btn.className = cls;
	btn.setAttribute("onclick",onclk);
	return btn;
}
function createOption(index,name){
    var opt = document.createElement("OPTION");
    opt.value = index;
    opt.innerHTML = name;
    return opt;
}
function addBlind(evt,arg){
	"use strict";
    var li = document.createElement("LI");
    li.className = "level";
    var smallBlind = createInput(0,100000,"blinds_small","number","Small Blind");
    li.appendChild(smallBlind);
    var bigBlind = createInput(0,100000,"blinds_big","number","Big Blind");
    li.appendChild(bigBlind);
    var ante = createInput(0,100000,"ante","number","Ante");
    li.appendChild(ante);
    var minutes = createInput(0,60,"duration","number","Minutes");
    li.appendChild(minutes);
    var deleteBtn=createBtn("delete","deleteTab(event)");
    li.appendChild(deleteBtn);
    var addBtn=createBtn("addblind","addBlind(event,1)");
    li.appendChild(addBtn);
    var breakBtn=createBtn("break","addBreak(event,1)");
    li.appendChild(breakBtn);
	if(arg===1){
		var clicked = evt.currentTarget.parentNode;
		var clickedParent = evt.currentTarget.parentNode.parentNode;
		clickedParent.insertBefore(li,clicked.nextElementSibling);
    }
    else{
    	var ol = document.getElementById("blindList");
    	ol.appendChild(li);
	}
}
function addBreak(evt,arg){
    "use strict";
    var li = document.createElement("LI");
    li.className = "break";
	var h3brk = document.createElement("H3");
	h3brk.className = "brk";
	h3brk.textContent = "Break";
	li.appendChild(h3brk);
    var deleteBtn=createBtn("delete","deleteTab(event)");
    li.appendChild(deleteBtn);
    var addBtn=createBtn("addblind","addBlind(event,1)");
    li.appendChild(addBtn);
    var breakBtn=createBtn("break","addBreak(event,1)");
    li.appendChild(breakBtn);
    if(arg===1){
        var clicked = evt.currentTarget.parentNode;
        var clickedParent = evt.currentTarget.parentNode.parentNode;
        clickedParent.insertBefore(li,clicked.nextElementSibling);
	}
	else{
        var ol = document.getElementById("blindList");
        ol.appendChild(li);
	}
}
function createTableLine(player){
	var tr = document.createElement("TR");
	var name = document.createElement("TD");
	var table = document.createElement("TD");
	var number = document.createElement("TD");
	var remove = document.createElement("TD");
    var btn = createBtn("tableBtn","removeTableAndAddOption(event,'"+player+"')");
    btn.innerHTML= "Remove";
    remove.appendChild(btn);
	name.innerHTML = player;
	table.className = "tableColor";
	number.className = "tablePosition";
	tr.appendChild(name);
	tr.appendChild(table);
	tr.appendChild(number);
	tr.appendChild(remove);
	return tr;
}
function removeTableAndAddOption(evt,name){
    "use strict";
    var index;
    for(var i in playersUsed){
        if (playersUsed[i].value===name){
            index=playersUsed[i].key;
        }
    }
    var selectElmnt = document.getElementById("playerDropdown");
    selectElmnt.appendChild(createOption(index,name));
    evt.currentTarget.parentNode.parentNode.remove();
}
function removeSelection(id){
	var Options = document.getElementById("playerDropdown").children;
	for(var i = 0;i<Options.length;i++){
		var gottenValue = Options[i].value;
		if (gottenValue === id){
			Options[i].remove();
		}
	}
}
function usePlayer(id){
    document.getElementById("playerTable").appendChild(createTableLine(playerList[id]));
	removeSelection(id);
}
function createPlayersPaid(amount){
    var i;
    var payoutList = document.getElementById("PlacesList");
    while (payoutList.firstChild) {
        payoutList.removeChild(payoutList.firstChild);
    }
    var PlacesList = document.getElementById("Places");
    while (PlacesList.firstChild) {
        PlacesList.removeChild(PlacesList.firstChild);
    }
    for(i=0; i<amount;i++){
        var li = document.createElement("li");
        var input = createInput(1,1000,i,"number","Amount");
        input.setAttribute("onchange","updatePaid(this.name,this.value)");
        li.appendChild(input);
        payoutList.appendChild(li);
        var li2 = document.createElement("li");
        var add;
        if(i===0){
            add="st";
        }
        else if(i===1){
            add="nd";
        }
        else if(i===2){
            add="rd";
        }
        else{
            add="th";
        }
        li2.innerHTML=i+1+add;
        PlacesList.appendChild(li2);
    }
}
function updatePaid(id,value){
    var place = document.getElementById("Places").childNodes[id];
    place.innerHTML= place.innerHTML.slice(0,3);
    place.innerHTML+=": "+value+"??";
}
function writePlayerData(id,name){
    firebase.database().ref("Players/"+id).set(name);
}
function addToDatabase(field){
	if(event.key === 'Enter'){
	    if(field.value !=="" && missingIDs.length>0){
            writePlayerData(missingIDs[0],field.value);
            //missingIDs.shift();
        }
        else if(field.value !=="") {
            writePlayerData(playerList.length,field.value);
        }
		field.value="";
	}
}
function executeInput(evt,field){
	var inputField = document.getElementById(field);
	if (inputField.value!== "" && missingIDs.length>0){
        writePlayerData(missingIDs[0],inputField.value);
        //missingIDs.shift();
	}
	else if(inputField.value!== ""){
        writePlayerData(playerList.length,inputField.value);
    }
    inputField.value="";
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function generateTables(event,tableColor,tablePosition){
	var allTableColorFields,allTablePositionFields,amount,numOfTables,table1num,table2num,table3num,table4num;
	var Positions = [];
	allTableColorFields = document.getElementsByClassName(tableColor);
	allTablePositionFields = document.getElementsByClassName(tablePosition);
	amount = allTableColorFields.length;
	//var rand = Positions[Math.floor(Math.random()*Positions.length)];
	if(amount <=8){
        for(var i =1; i<=amount;i++){
        	var table="Black";
            Positions.push({key:i,value:table});
        }
		numOfTables = 1;
		shuffle(Positions);
		for(var i =0; i<amount;i++){
            allTablePositionFields[i].innerHTML = Positions[i].key;
            allTableColorFields[i].innerHTML = Positions[i].value;
            allTablePositionFields[i].className = tablePosition;
            allTableColorFields[i].className = tableColor;
            allTablePositionFields[i].className += " "+Positions[i].value;
            allTableColorFields[i].className += " "+Positions[i].value;
		}
	}
	else if(amount/2<=8){
		numOfTables = 2;
		var half = Math.ceil(amount /2);
		table1num = half;
		table2num = amount-half;
        for(var i =1; i<=table1num;i++){
            var table="Black";
            Positions.push({key:i,value:table});
        }
        for(var i =1; i<=table2num;i++){
            var table="Blue";
            Positions.push({key:i,value:table});
        }
        shuffle(Positions);
        for(var i =0; i<amount;i++){
            allTablePositionFields[i].innerHTML = Positions[i].key;
            allTableColorFields[i].innerHTML = Positions[i].value;
            allTablePositionFields[i].className = tablePosition;
            allTableColorFields[i].className = tableColor;
            allTablePositionFields[i].className += " "+Positions[i].value;
            allTableColorFields[i].className += " "+Positions[i].value;
        }
	}
	else if(amount/3<=8){
		numOfTables = 3;
		var onethird = Math.ceil(amount/3);
        var half = Math.ceil((amount-onethird)/2);
		table1num=onethird;
		table2num=half;
		table3num=amount-onethird-half;
        for(var i =1; i<=table1num;i++){
            var table="Black";
            Positions.push({key:i,value:table});
        }
        for(var i =1; i<=table2num;i++){
            var table="Blue";
            Positions.push({key:i,value:table});
        }
        for(var i =1; i<=table3num;i++){
            var table="Green";
            Positions.push({key:i,value:table});
        }
        shuffle(Positions);
        for(var i =0; i<amount;i++){
            allTablePositionFields[i].innerHTML = Positions[i].key;
            allTableColorFields[i].innerHTML = Positions[i].value;
            allTablePositionFields[i].className = tablePosition;
            allTableColorFields[i].className = tableColor;
            allTablePositionFields[i].className += " "+Positions[i].value;
            allTableColorFields[i].className += " "+Positions[i].value;
        }
	}
	else if(amount/4<=8){
		numOfTables = 4;
		var onefourth = Math.ceil(amount/4);
        var onethird = Math.ceil((amount-onefourth)/3);
        var half = Math.ceil((amount-onefourth-onethird)/2);
        table1num=onefourth;
        table2num=onethird;
        table3num=half;
        table4num=amount-onefourth-onethird-half;
        for(var i =1; i<=table1num;i++){
            var table="Black";
            Positions.push({key:i,value:table});
        }
        for(var i =1; i<=table2num;i++){
            var table="Blue";
            Positions.push({key:i,value:table});
        }
        for(var i =1; i<=table3num;i++){
            var table="Green";
            Positions.push({key:i,value:table});
        }
        for(var i =1; i<=table4num;i++){
            var table="Red";
            Positions.push({key:i,value:table});
        }
        shuffle(Positions);
        for(var i =0; i<amount;i++){
            allTablePositionFields[i].innerHTML = Positions[i].key;
            allTableColorFields[i].innerHTML = Positions[i].value;
            allTablePositionFields[i].className = tablePosition;
            allTableColorFields[i].className = tableColor;
            allTablePositionFields[i].className += " "+Positions[i].value;
            allTableColorFields[i].className += " "+Positions[i].value;
        }
	}
    //document.getElementById("testing").innerHTML = "Players: "+amount+" Tables: "+numOfTables+" Table1: "+table1num+" Table2: "+table2num+" Table3: "+table3num+" Table4: "+table4num;

}
