
var keys = Object.values(emotions);
var other = Object.keys(emotions);
var dupe = false;


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

var respond = function() {

	var message = $('#usermsgArea').val()
	if (message=="") {return false;}
	
submitMessage()
	
	// $('#usermsgArea').val("")
	return false;
}

var submitMessage = function() {
	restart();

	var url = "https://allorigins.me/get?url=" + encodeURIComponent("https://watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=")

	var message = $('#usermsgArea').val()

	var call = url + encodeURIComponent(encodeURIComponent(message)) + "&callback=?"

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

	    	emotionsFormatted = "<h3>Emotions</h3>"
	    	for (var i = 0; i < myEmotions.length; i++) {
	    		emotionsFormatted += i+1 + ". " + myEmotions[i].toLowerCase() + "<br>"
	    	}

	    	needsFormatted = "<h3>Needs</h3>"
	    	for (var j = 0; j < myNeeds.length; j++) {
	    		needsFormatted += j+1 + ". " + myNeeds[j].toLowerCase() + "<br>"
	    	}

	    	$('#needs-box').html(emotionsFormatted)
	    	$('#emotions-box').html(needsFormatted)

	    }
	});
}

