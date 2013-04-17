function import_data(){
    try{
		csvToJson();
      $("#dialog2").slideUp();
    }catch(err){
      alert(err.message)
    }
    
}

function opendialog2(){
    $("#data2").val("")
    $("#dialog2").slideDown()
  }



function playData(){
	timerCount = 1;
	for (var i = 0; i < things.length; i++){
		var testing = document.createElement("input");
		testing.type = "range";
		testing.id = "test"+i;
		testing.min = 1;
		testing.max = 10;
		testing.step = 1;
		testing.value = 1;
		document.getElementById("datain").insertBefore(testing);
	}
	dataTimer = setInterval(function(){displayData()},1000);

}

function displayData(){

// 	for (var j = 0; j < things.length; j++){
//   		document.getElementById("datain").innerHTML += objArr[j][labels[timerCount]]+ ",";
//   	}
//   	document.getElementById("datain").innerHTML += "<br />";
  	for (var j = 0; j < things.length; j++){
  		document.getElementById("test"+j).value = objArr[j][labels[timerCount]];
  		if (attrSelect == "opacity"){
  			editor.selected[0].attr({opacity:objArr[draggableId][labels[timerCount]]/100});
  		}
  		else if (attrSelect == "scale"){
  			var box = editor.selected[0].getBBox();
			var x = box.width;
			var y = box.height;
			var xp = box.x +x/2;
    		var yp = box.y +y/2;
    		var sc = "S" + objArr[draggableId][labels[timerCount]], x, xp, yp;
			editor.selected[0].transform(sc);
  		}
  		else if (attrSelect == "rotation"){
		var box = editor.selected[0].getBBox();
		var x = box.width;
		var y = box.height;
		var xp = box.x +x/2;
    	var yp = box.y +y/2;
    	var rt = "R"+objArr[draggableId][labels[timerCount]], xp, yp;
		editor.selected[0].transform(rt);
  		}
  	}
  	
  	if (timerCount < labels.length-1){
  		timerCount++;
  	}
  	else{
  		clearInterval(dataTimer);
  	}
 } 
 
function dataSlide(){
	
}


function errorMessage (message)
{
document.getElementById("datain").innerHTML += '<p>' + message + '</p>';

}

function parseCSVLine (line)
{
line = line.split(',');

// check for splits performed inside quoted strings and correct if needed
for (var i = 0; i < line.length; i++)
{
var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
var quote = "";
if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";

if (quote != "")
{
var j = i + 1;

if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");

while (j < line.length && chunk.charAt(chunk.length - 1) != quote)
{
line[i] += ',' + line[j];
line.splice(j, 1);
chunk = line[j].replace(/[\s]*$/g, "");
}

if (j < line.length)
{
line[i] += ',' + line[j];
line.splice(j, 1);
}
}
}

for (var i = 0; i < line.length; i++)
{
// remove leading/trailing whitespace
line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");

// remove leading/trailing quotes
if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
}

return line;
}

function csvToJson ()
{

var message = "";
var error = false;
var csvText = document.getElementById("data2").value;
var jsonText = "";


if (csvText == "") { error = true; message = "Enter CSV text."; errorMessage(message);}

if (!error)
{
csvRows = csvText.split(/[\r\n]/g); // split into rows

// get rid of empty rows
for (var i = 0; i < csvRows.length; i++)
{
if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "")
{
csvRows.splice(i, 1);
i--;
}
}

if (csvRows.length < 2) { error = true; message = "The CSV text MUST have a header row!"; errorMessage(message);}
else
{
objArr = [];

for (var i = 0; i < csvRows.length; i++)
{
csvRows[i] = parseCSVLine(csvRows[i]);
}

for (var i = 1; i < csvRows.length; i++){
things[i-1] = csvRows[i][0];
}

for (var i = 0; i < csvRows[0].length; i++){
labels[i] = csvRows[0][i];
}


for (var i = 1; i < csvRows.length; i++)
{
if (csvRows[i].length > 0) objArr.push({});

for (var j = 0; j < csvRows[i].length; j++)
{
objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
}
}


jsonText = JSON.stringify(objArr, null, "\t");

}
}

//visualize data
//what happens if they go in and change data to import? things get printed multiple times
//document.getElementById("datain").innerHTML = "";


$( "#datain" ).draggable();





for (var i = 0; i<things.length; i++){
	//probably going to have to dynamically make a new div for every "thing"
		var labelling = document.createElement("div");
		labelling.id = "this"+i;
		labelling.min = 1;
		labelling.max = 10;
		labelling.step = 1;
		labelling.value = 1;
		labelling.className = "dynamicDiv";
		p = i*15;
		labelling.style.padding = p + "px"; 
		//document.getElementById("datain").insertBefore(labelling);
		document.body.appendChild(labelling); 
	document.getElementById("this"+i).innerHTML += things[i] + "<br />";
	$("#this"+i).draggable();
	 $( "#dropshape" ).droppable({
drop: function( event, ui ) { 
	draggableId = ui.draggable.attr("id");
	draggableId = draggableId.match(/\d+$/); 
	draggableId = parseInt(draggableId, 10);
    $("#attrSelect").slideDown()
}
});
}

}

function attrScale(){
	attrSelect = "scale";
	$("#attrSelect").slideUp()
}

function attrRotation(){
	attrSelect = "rotation";
	$("#attrSelect").slideUp()
}

function attrOpacity(){
	attrSelect = "opacity";
	$("#attrSelect").slideUp()
}