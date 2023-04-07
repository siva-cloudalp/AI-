
function service(request, response)
{
	'use strict';
	try 
	{
		require('CloudAlp.VoiceAI.VoiceAI.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CloudAlp.VoiceAI.VoiceAI.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}