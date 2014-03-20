require('./lib/icargo-node');

function log(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(body);
	}else{
		console.log(error);
		console.log(response.statusCode);
		console.log(body);
	}
}

//ICARGO.get('info', log);

//ICARGO.getFacts(703, log);
//ICARGO.get('sensors/google-glass/Simon', log);

//ICARGO.getLastKnown(703, 31, log);

// Create some facts for entity 703 (= Simon's secret device)
var envelope = ICARGO.createEnvelope(703, 119, 31, -1, 0, 0),
	fact1 = ICARGO.createFact(envelope, 50), // temperature = 48
	fact2 = ICARGO.createFact(envelope, 51), // temperature = 49
	facts = [fact1],
	msg   = ICARGO.createSet(facts);

//ICARGO.post(703, msg, log);

//ICARGO.addFacts(facts, log);

//ICARGO.put('sensors/google-glass/Simon', msg, log);

ICARGO.getLastKnown(703, 31, log);