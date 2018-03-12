$(document).ready(function(){

    var numArr = [];
    //array to store the numbers in the sum (to calculate answer later)
    var opArr = [];
    //array to store the operators in the sum (to calculate answer later)
    var answer = 0;
    //initial value for answer
    var entry = "";
    //will be used to store current entry
    var fullEntry = "";
    //will be used to store full entry (sum so far)
    var type = "";
    //will be used to store which type of button has been pressed
    var value = "";
    //will be used to store the value of the button pressed
    $("#currentEntry").html("");
    const maxEntry = 8;
    $("#allEntry").html("");
    const maxFullEntry = 14; //the html elements are cleared so that when we use $("#currentEntry").html().length later to check if the current on screen display is not too long, we do not hit our maxEntry limit by it counting characters that are alraedy in the element (div id="currentEntry" etc.) NB that the maxFullEntry value is 9 less than what we can actually fit in, this is kept to allow for a maximum of a 8 digit result
    //**********************************************************
    $("button").click(function(){
    //when a button is clicked 
    type = $(this).attr("id");
    //numeric values (not counting zero or .) do not have an id and so type will show as false for them. this will help in our if statements later.
    entry = $(this).attr("value");
    //value of the button pressed
    //====================================================================================================================
    if (entry === "ce") {
        $("#currentEntry").html("");
        //clear the entry field if clear entry is pressed
        if ($("#allEntry").html().indexOf("=") !== -1) { //if the currentEntry was displayin the result of a previous sum then also clear the previous sum from the allEntry field
        $("#allEntry").html("");
        numArr = [];
        opArr = [];
        }
    //====================================================================================================================
    } else if (entry === "ac") {
        $("#allEntry").html("");
        $("#currentEntry").html("");
        numArr = [];
        opArr = [];
        //clear all fields and all memory if clear all is pressed
        //====================================================================================================================
    } else if ($("#allEntry").html() === "digital limit exceeded!" || $("#allEntry").html() === "incomplete sum!" || $("#allEntry").html() === "no input found!") {
        //if a message is still showing on the screen
        $("#allEntry").html("");
        //clear message as a result of any button press
        $("#allEntry").stop().animate({opacity: '0.9'});
        //stop fadout which was executed as part of the message
        numArr = [];
        opArr = [];
        //reset the memory
        //====================================================================================================================
    } else if (!type && $("#currentEntry").html().length < maxEntry) {
        //we have a non zero numeric button pressed AND the current entry field is not full (not yet at its limit)
        
        if ($("#allEntry").html().indexOf("=") != -1) {
        //if the current entry is the result of a previous sum
        $("#currentEntry").html("");
        $("#allEntry").html("");
        numArr = [];
        opArr = [];
        $("#currentEntry").html(entry);
        //clear fields and memory, and make current entry the value of the button which was clicked
        } else if ($("#currentEntry").html() === "0") { 
        //if zero has already been entered, we do not want our number to be displayed with 0 as the leading digit
        $("#currentEntry").html("");
        $("#currentEntry").html(entry); 
        //clear the current entry field and make it show what has just been pressed instead
        } else {
        //whatever other value may be in current entry field can be followed by value of numerical button which has been clicked
        $("#currentEntry").append(entry);
        //add the numeric value to the current entry
        }
        
        //====================================================================================================================
    } else if (entry === "0" && $("#currentEntry").html() != "0") {
        //if zero is pressed AND there are already some characters in the current entry field (do not want to follow first 0 with anything but a decimal point)
        
        if ($("#allEntry").html().indexOf("=") != -1) {
        //if the current entry is the result of a previous sum
        $("#currentEntry").html("");
        $("#allEntry").html("");
        numArr = [];
        opArr = [];
        $("#currentEntry").html(entry);
        //clear fields and memory, and make current entry the value of the button which was clicked (in this case 0)
        } else if ($("#currentEntry").html().length < maxEntry){
        //if we have not hit the maximum characters allowed in the current entry field
        $("#currentEntry").append(entry);
        //add 0 to the end of the entry
        }
        
        //====================================================================================================================
    } else if (entry === '.' && $("#currentEntry").html().length != 0 && $("#currentEntry").html().length < maxEntry && $("#currentEntry").html().indexOf(".") == -1) {
        //if decimal is pressed AND there is already some character in the current entry field (do not want to allow . as the first character) AND there is not already a decimal place in the current entry field AND we have not hit the maximum amount of characters allowed in the current entry
        $("#currentEntry").append(entry);
        //add . to the end of the current entry
        //====================================================================================================================
    } else if (entry === "+" || entry === "-" || entry === "/" || entry === "*") {
        //if an operator button is pressed
        
        if ($("#allEntry").html().indexOf("=") != -1) {
        //if the current entry is a result of a previous sum (if we have an equals sign in the current full entry (full sum which has just been executed))
        $("#allEntry").html($("#currentEntry").html() + entry);
        //put result in full entry field with operator value that has been pressed
        numArr = [];
        //reset number memory
        numArr.push(parseFloat($("#currentEntry").html(), 10));
        //add result from last sum into our memory
        $("#currentEntry").html("");
        //clear current entry
        opArr = [];
        //reset operator memory
        opArr.push(entry);
        //add value of operator which has been pressed/clicked to our memory
        } else if ($("#allEntry").html().length + $("#currentEntry").html().length + entry.length > maxFullEntry) {
        //now we are dealing with cases that are not a result of a previous sum. if the length of the full entry plus the length of the current entry plus the length of the button value just pressed (could have just added 1 for this) is greater than the maximum allowed in the full entry (without result; will be explained later)
        $("#currentEntry").html("");
        $("#allEntry").html("digital limit exceeded!").fadeOut(2000,function(){
            $("#allEntry").html("");
            $("#allEntry").css("display","");
            numArr = [];
            opArr = [];
        });
        //clear current entry and give explanation in full entry field, then let explanation fade out, once faded out, clear memory and put the display property of the full entry field back to normal (since the fadeOut changes the css to display: none)
        } else if ($("#currentEntry").html().length != 0) {
        //if there are already some characters in the current entry field (since we do not want to add an operator to our memory nor to our fullEntry field without any values before it) and we have not hit our maximum full entry limit (implied by earlier conditions)
        numArr.push(parseFloat($("#currentEntry").html(), 10));
        //convert that current entry into a decimal number (not integer as that wouldn't allow for decimals) and add it to our memory (numArr) for calculating the answer later
        opArr.push(entry);
        //add the operator which has been pressed to our memory (opArr) for calculating our answer later
        $("#allEntry").append($("#currentEntry").html() + entry);
        $("#currentEntry").html("");
        //add the entry with the operator that has been pressed to our total sum (allEntry)
        }
        
        //====================================================================================================================
    } else if (entry === "=") {
        //if the equals button is pressed
        var decimalPlaces = 0;
        //this will be used to decide the precision needed in our answer
        
        if ($("#allEntry").html().indexOf("=") != -1) {
        //if the current entry is the result of a previous sum
        $("#currentEntry").html("");
        $("#allEntry").html("");
        numArr = [];
        opArr = [];
        //clear fields and memory
        } else if ($("#currentEntry").html().length === 0){
        //if there is nothing in the current entry field
        
        if ($("#allEntry").html().length === 0) {
            //if there was no attempt at a sum
            $("#allEntry").html("no input found!").fadeOut(2000,function(){
            $("#allEntry").html("");
            $("#allEntry").css("display","");
            numArr = [];
            opArr = [];
            });
        } else {
            //implies that ther was an attempt at making a sum
            $("#allEntry").html("incomplete sum!").fadeOut(2000,function(){
            $("#allEntry").html("");
            $("#allEntry").css("display","");
            numArr = [];
            opArr = [];
            });
        }
        //tell user the sum is incomplete (since either nothing has been entered or the last character in the sum is an operator)
        
        } else {
        //if there is something in the entry field and it is not a result of a previous sum (implied by earlier unsatisfied conditions)
        numArr.push(parseFloat($("#currentEntry").html(), 10));
        //add the current entry to the end of our sum (complete entry)
        for (var i=0; i<numArr.length; i++) {
            //for each numerical value stored in our memory
            
            if (numArr[i].toString().indexOf(".") != -1 && numArr[i].toString().slice(numArr[i].toString().indexOf(".") + 1).length > decimalPlaces) {
            //if there is a decimal point in our number AND the number of digits after the decimal point are higher than our current decimalPlaces value NB the toString method used will convert the number to string but also get rid of any irrelevant zeros after the decimal point (like 2.010 will just become 2.01) and so we do not give a precision higher than anything that is inputted
            decimalPlaces = numArr[i].toString().slice(numArr[i].toString().indexOf(".") + 1).length;
            //make the decimalPlaces value equal to the same number of decimal places as that of the most precise number inputted
            }
            
            if (i === 0) {
            //if dealing with the first numerical value
            answer = numArr[0];
            //make it our current answer
            } else {
            switch(opArr[i-1]) {
                //for the operator before our current numerical value (since the value before the current operator will have already been added to our answer thanks to the if statment immediately above)
                case "+":
                answer += numArr[i];
                break;
                case "-":
                answer -= numArr[i];
                break;
                case "/":
                answer /= numArr[i];
                break;
                case "*":
                answer *= numArr[i];
            }
            //manipulate the answer depending on which operator is being used (currently), and using what we have as our numerical answer so far and the numerical value we have next/currently
            }
            
        }
        answer = answer.toFixed(decimalPlaces);
        //toFixed was needed because when calculating with decimals often the numerical answer would be to so many decimal places that it would be higher than the maximum number of characters allowed (javaScript inherent precision errors); so to fix this I have converted it to a string and put it to the same number of decimal places as that of the most precise inputted number (toFixed(decimalPlaces));
        if ($("#allEntry").html().length + $("#currentEntry").html().length + 1 + answer.toString().length > maxFullEntry + 9 || answer.toString().length > maxEntry) {
            //if the length of total entry before equals was pressed, plus the length of what was in the current entry when equals was pressed, plus 1 for the equals character, plus the length of the answer, is less than maxFullEntry plus 9 (since 9 digits was needed in leighway for the answer to our sum and therefore not used in the maxFullEntry value) OR the length of the answer is greater than the max entry allowed
            $("#currentEntry").html("");
            $("#allEntry").html("digital limit exceeded!").fadeOut(2000,function(){
            $("#allEntry").html("");
            $("#allEntry").css("display","");
            numArr = [];
            opArr = [];
            });
            //let user no that the limit was exceeded
        } else {
            //if we do infact have enough screen room (limit not exceeded)
            $("#allEntry").append($("#currentEntry").html()+"="+answer);
            $("#currentEntry").html(answer);
            //display result in current entry and display full sum with result in all entry
        }
        } 
    }
    //====================================================================================================================
    
    })
})
//*********THIS MAY SEEM LONG WHINDED BUT IT IS STILL, 34 LINES OF JAVASCRIPT CODE LESS, THAN THAT OF THE EXAMPLE PROVIDED BY FREECODECAMP**********