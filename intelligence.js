
var keys = Object.values(emotions);
var other = Object.keys(emotions);
var dupe = false;

// for (var k = 0; k < keys.length; k++) {

// for(var i=0;i<keys.length;i++){
//  for(var j=i+1;j<keys.length;j++){
 	
// 	   if(emotions[keys[i]] === emotions[keys[j]]){
// 	     console.log(other[i] + "==" + other[j-1])
// 	     dupe = true;
// 	   }

//  }
//  if(dupe){ console.log("dupe value is there.."); break; }
// }

// }



var restart = function(){
	myEmotions = ""
	maybeEmotion = []
	mainEmotion = ""
	mainEmotionUntranslated = ""
	emotionIteration = 0

	myNeeds = ""
	maybeNeeds = []
	mainNeed = ""
	needIteration = 0
}

var translate = function(word) {
	return translation[word][0]
}

restart()

message = ""
sessionOne = true

var newResponse = function(response) {
	var circle = $('.yellow-circle')[$('.yellow-circle').length-1];
	if (circle != undefined ) {
		circle.remove();
	}
	$('.loading_dots').remove();
	$('#chatbox').append("<div class='yellow-circle'></div><p>" + response + "</p><br>");
	$('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
}

shortFeeling = ["My best guess would be that you are feeling ", "Could you be feeling ", "Are you feeling ", "I'm guessing you might be feeling ", "Maybe you're feeling ", "Are you "]
longFeeling = ["My best guess would be that you are feeling ", "Hmm, it sounds like you might be feeling ", "Based on what you said, I would guess that you might be feeling ", "Is it possible that you could be feeling ", "Alright, my best guess would be that you are ", "I guess it sounds like you are probably feeling "]
needIntro = ["Alright. So do you think you could be ", "Okay, do you think you might be ", "Got it. And could you be feeling "]
metNeed = [" has been met?", " is being met?", " is met?", " has been fulfilled?"]
notMetNeed = [" has not been met?", " is not met?", " is not met?", " has not been fulfilled?"]
failedFeeling = ["Okay, well then maybe you are feeling ", "In that case, maybe you are ", "Are you ", "How about ", "Then how about ", "Then could you be feeling ", "Okay, are you feeling ", "Okay, are you feeling ", "Alright, are you ", "Alright, how about ", "Could you be "]
failedNeed = ["Okay, well then maybe you are feeling ", "In that case, maybe you are ", "Are you ", "Could you be feeling ", "Okay, are you feeling ", "Alright, are you ", "Could you be ", "Could you be ", "Could you be ", "Could you be "]

var randOutroNeed = function(feeling) {
	if (translation[feeling][1]=="p") { return metNeed[Math.floor(Math.random() * metNeed.length)]}
	if (translation[feeling][1]=="n") { return notMetNeed[Math.floor(Math.random() * notMetNeed.length)]}
}

var randIntroNeed = function() {
	return needIntro[Math.floor(Math.random() * needIntro.length)]
}

var randIntroFeeling = function() {
	if (message.split(" ").length > 10) {return longFeeling[Math.floor(Math.random() * longFeeling.length)]}
	else {return shortFeeling[Math.floor(Math.random() * shortFeeling.length)]}
}

var randFailedFeeling = function() {
	return failedFeeling[Math.floor(Math.random() * failedFeeling.length)]
}

var randFailedNeed = function() {
	return failedNeed[Math.floor(Math.random() * failedNeed.length)]
}

newResponse("Hi, I'm an empathic AI. I do my best to understand human emotions. If you send me messages I'll make an empathy guess. I do best with longer messages.")

var respond = function() {

	var message = $('#usermsg').val()
	if (message=="") {return false;}
	
	$('#chatbox').append("<div class=blue-circle></div><p>" + message + "</p><br>")
	$('#chatbox').append("<div class=yellow-circle></div><div class='loading_dots'></div>")
	$('#chatbox').scrollTop($('#chatbox')[0].scrollHeight)

	if (sessionOne) {
		switch(message.toLowerCase()) {
	    case "yes":
	    	if (myEmotions[emotionIteration] == undefined) { newResponse("Sorry, I don't understand what you're saying. Can you try again?"); break; }
	        mainEmotion = translate(myEmotions[emotionIteration])
	        mainEmotionUntranslated = myEmotions[emotionIteration]
	        sessionOne = false
			newResponse(randIntroNeed() + mainEmotion + " because your need for <strong>" + myNeeds[needIteration].toLowerCase() + "</strong>" + randOutroNeed(mainEmotionUntranslated) + "<br>(You can type 'start over' at any time if you want to give me more context and let me try again.)")
	        break;
	    case "no":
	    	if (myEmotions[emotionIteration] == undefined) { newResponse("Sorry, I don't understand what you're saying. Can you try again?"); break; }
	        emotionIteration++
	        if (translation[myEmotions[emotionIteration]] == undefined) {
	        	newResponse("I'm having trouble guessing at your feelings. Maybe if you try saying it a different way I would have better luck. The more you give me the more likely that I will get it right.")
	        }
	        else {
	        	newResponse(randFailedFeeling() + "<strong>" + translate(myEmotions[emotionIteration]) + "</strong>?")
	    	}
	        break;
	    // case "maybe":
	    // 	maybeEmotion.push(translate(myEmotions[emotionIteration]))
	    //     emotionIteration++
	    //     newResponse("Are you feeling " + translate(myEmotions[emotionIteration]) + "?")
	    //     break;
	    case "start over":
	       	newResponse("Okay, talk to me.");
	        break;
	    default:
	       	submitMessage();
	       	alreadyThere = false;
	       	$( document ).ajaxComplete(function() {
	       		if (alreadyThere == false) { 
	       			newResponse(randIntroFeeling(myEmotions[emotionIteration]) + "<strong>" + translate(myEmotions[emotionIteration]) + "</strong>? (You can say yes or no.)");
	       			alreadyThere = true;
	       		}
			});
		}
	}
	else {
		switch(message.toLowerCase()) {
	    case "yes":
	        mainNeed = myNeeds[needIteration].toLowerCase()
	        newResponse("Alright, so you're feeling <strong>" + mainEmotion + "</strong> because of the universal human need <strong>" + mainNeed + "</strong>.")
	        sessionOne = true
	        break;
	    case "no":
	        needIteration++
			newResponse(randFailedNeed() + mainEmotion + " because your need for <strong>" + myNeeds[needIteration].toLowerCase() + "</strong>" + randOutroNeed(mainEmotionUntranslated))
	        break;
	    // case "maybe":
	    // 	maybeNeeds.push(myNeeds[needIteration].toLowerCase())
	    //     needIteration++
	    //     newResponse("Could you be " + mainEmotion + " because of a need for " + myNeeds[needIteration].toLowerCase()  + "?")
	    //     break;
	    case "start over":
	    	sessionOne = true
	       	newResponse("Okay, talk to me.");
	        break;
	    default:
	    	newResponse("I don't understand. You can say 'yes' or 'no', or 'start over' if you want to say something else.")
		}

	}
	
	$('#usermsg').val("")
	return false;
}

var submitMessage = function() {
	restart();

	// var url = "http://anyorigin.com/go?url=https%3A//watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone%3Fversion%3D2016-05-19%26text%3D"

	// var url = "https://allorigins.us/get?url=https%3A//watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone%3Fversion%3D2016-05-19%26text%3D"

	var url = "https://allorigins.us/get?url=" + encodeURIComponent("https://watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=")

	var message = $('#usermsg').val()
	// console.log(message)

	var call = url + encodeURIComponent(encodeURIComponent(message)) + "&callback=?"
	// console.log(call)

$.ajax({
      crossOrigin: true,
      url : call,
      type : "GET",
      success:function(data){

	    console.log(JSON.parse( data.split("typeof  === 'function' && (")[1].split(",'status':")[0].split(");")[0] ) )
	    contents = JSON.parse( JSON.parse( data.split("typeof  === 'function' && (")[1].split(",'status':")[0].split(");")[0] ).contents )

	    // If no data available for input
	    if (contents.document_tone == undefined) {
	    	newResponse("Sorry, I don't really understand what you're saying. Can you try again?");
	    	return false;
	    }

	    response = contents.document_tone.tone_categories

		emotionalTone = response[0].tones
		languageTone = response[1].tones
		socialTone = response[2].tones

		tones = {}
		rankThis = {}

		for (var i = 0; i < emotionalTone.length; i++) {
			tones[emotionalTone[i]["tone_id"]] = emotionalTone[i]["score"]
			if (emotionalTone[i]["score"] != 0) { rankThis[emotionalTone[i]["tone_id"]] = emotionalTone[i]["score"] }
		}
		for (var i = 0; i < languageTone.length; i++) {
			tones[languageTone[i]["tone_id"]] = languageTone[i]["score"]
			if (languageTone[i]["score"] != 0) { rankThis[languageTone[i]["tone_id"]] = languageTone[i]["score"]; }
		}
		for (var i = 0; i < socialTone.length; i++) {
			tones[socialTone[i]["tone_id"]] = socialTone[i]["score"]
			if (socialTone[i]["score"] != 0) { rankThis[socialTone[i]["tone_id"]] = socialTone[i]["score"] }
		}

		normalizedTones = {}

		total1 = 0

		jQuery.each( tones, function( j, val ) {
			total1 = total1 + val
		})

		multiplyBy = 1 / total1

		jQuery.each( tones, function( j, val ) {
			newscore = val*multiplyBy
	    	normalizedTones[j] = newscore
		})

		var rankThis = function(rankWhat) {
			// ranked intitial variables
			ranked = Object.keys(rankThis).sort(function(a,b){return rankThis[b]-rankThis[a]})

			// ranked subtle emotions (not ranked until finalRankedEmotions)
			rankedEmotions = {}

			jQuery.each( rankWhat, function( i, val ) {

				score = 0

				jQuery.each( val, function( j, degree ) {
					difference = Math.abs(degree - normalizedTones[j])
					score = score - difference
				})

				rankedEmotions[i] = score

			})

			finalRankedEmotions = Object.keys(rankedEmotions).sort(function(a,b){return rankedEmotions[b]-rankedEmotions[a]})

			return finalRankedEmotions
		};


	    	myEmotions = rankThis(emotions)
	    	myEmotion = myEmotions[0].toLowerCase()
	    	myNeeds = rankThis(needs)
	    	myNeed = myNeeds[0].toLowerCase()
	    }
	});
}

