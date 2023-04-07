
// @module CloudAlp.VoiceAI.VoiceAI
define('CloudAlp.VoiceAI.VoiceAI.View'
	, [
		'cloudalp_voiceai_voiceai.tpl'

		, 'CloudAlp.VoiceAI.VoiceAI.SS2Model'

		, 'Backbone'
		, 'SiteSearch.View'
		, 'ItemsSearcher.View'
		, 'Configuration'
		, 'Utils'
	]
	, function (
		cloudalp_voiceai_voiceai_tpl

		, VoiceAISS2Model

		, Backbone
		, SiteSearchView
		, ItemsSearcherView
		, Configuration
		, Utils
	) {
		'use strict';

		// @class CloudAlp.VoiceAI.VoiceAI.View @extends Backbone.View
		return Backbone.View.extend({

			template: cloudalp_voiceai_voiceai_tpl

			, initialize: function (options) {

				/*  Uncomment to test backend communication with an example service
					(you'll need to deploy and activate the extension first)
				*/

				// this.model = new VoiceAIModel();
				var self = this;
				// this.model.fetch().done(function(result) {
				// 	self.message = result.message;
				// 	self.render();
				// });
				let SpeechRecogntion = window.webkitSpeechRecognition;

				// let recognition = new window.SpeechRecogntion();
				self.recognition = new SpeechRecogntion();
			}

			, events: {
				'click #start-btn': "start",
				'click #stop-btn': "stop"
			}

			, stop: function () {
				let btn_start = $('#stop-btn');
				btn_start.attr("id", "start-btn");
				$("#mic-red").attr("fill", '#4285f4');
				this.recognition.stop();
			}
			, start: function () {
				var self = this;
				let btn_start = $('#start-btn');
				var content = "";
				this.recognition.continuous = true;
				this.recognition.onstart = () => ('Voice Recognition is on');
				this.recognition.onspeechend = () => {
					$('#stop-btn').attr("id", "start-btn");
					$("#mic-red").attr("fill", '#4285f4');
					this.recognition.stop();
					$('[data-type="search-input"]').val('');
				};
				this.recognition.onerror = (e) => {
					console.log("error");
					$("#mic-red").attr("fill", '#4285f4');
					this.recognition.stop();
				};
				this.recognition.onresult = (event) => {
					var current = event.resultIndex;
					var transcript = event.results[current][0].transcript;
					content += transcript;
					console.log("transcript", transcript);
					$('[data-type="search-input"]').val(transcript);
					self._executeSearch(transcript);
				};
				if (content.length) {
					content += '';
				}
				btn_start.attr('id', 'stop-btn');
				$("#mic-red").attr("fill", '#FF0000');

				this.recognition.start();
			}
			,// @method getCurrentSearchOptions Returns current search options formatted as query params.
			// @return {String}
			getCurrentSearchOptions: function () {
				const newOptions = [];
				const currentOptions = Utils.parseUrlOptions(window.location.href);

				_.each(currentOptions, function (value, key) {
					const lowerCaseKey = key.toLowerCase();
					if (
						lowerCaseKey === 'order' ||
						lowerCaseKey === 'show' ||
						lowerCaseKey === 'display'
					) {
						newOptions.push(lowerCaseKey + '=' + value);
					}
				});

				let newOptionsStr = newOptions.join('&');

				if (newOptionsStr.length > 0) {
					newOptionsStr = '&' + newOptionsStr;
				}

				return newOptionsStr;
			}
			, _executeSearch: function (keywords) {
				const search_url = Utils.getPathFromObject(Configuration, 'defaultSearchUrl');
				const delimiters = Utils.getPathFromObject(Configuration, 'facetDelimiters');
				const keywordsDelimited = delimiters
					? delimiters.betweenFacetsAndOptions + 'keywords' + delimiters.betweenOptionNameAndValue
					: '?keywords=';

				// If we are not in Shopping we have to redirect to it
				if (Utils.getPathFromObject(Configuration, 'currentTouchpoint') !== 'home') {
					// we called this using fragment instead of # because bridged domain
					window.location.href = Utils.addParamsToUrl(Session.get('touchpoints.home'), {
						fragment: search_url + keywordsDelimited + keywords
					});
				}
				// Else we stay in the same app
				else {
					// We navigate to the default search url passing the keywords
					Backbone.history.navigate(
						search_url + keywordsDelimited + keywords + this.getCurrentSearchOptions(),
						{ trigger: true }
					);
					this.recognition.stop();
				}
			}


			, bindings: {
			}

			, childViews: {

			}

			//@method getContext @return CloudAlp.VoiceAI.VoiceAI.View.Context
			, getContext: function getContext() {
				//@class CloudAlp.VoiceAI.VoiceAI.View.Context
				// console.log(isRecording);
				this.message = this.message || 'Hello World!!';
				return {
					message: this.message
				};
			}

		});
	});
