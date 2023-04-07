// Model.js
// -----------------------
// @module Case
define("CloudAlp.VoiceAI.VoiceAI.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/VoiceAI/SuiteScript2/VoiceAI.Service.ss"
            ),
            true
        )
});
});
