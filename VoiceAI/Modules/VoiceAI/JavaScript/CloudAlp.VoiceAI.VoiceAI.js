
define(
	'CloudAlp.VoiceAI.VoiceAI'
	, [
		'CloudAlp.VoiceAI.VoiceAI.View',
		"SiteSearch.View",
		"Configuration",
		"underscore",
		"ItemsSearcher.View"
	]
	, function (
		VoiceAIView,
		SiteSearchView,
		Configuration,
		_,
		ItemsSearcherView
	) {
		'use strict';

		return {
			mountToApp: function mountToApp(container) {
				// using the 'Layout' component we add a new child view inside the 'Header' existing view
				// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
				// more documentation of the Extensibility API in
				// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html

				/** @type {LayoutComponent} */
				var layout = container.getComponent('Layout');
				const PageType = container.getComponent('PageType');
				// PageType.registerPageType({
				// 	name: 'voice',
				// 	routes: ['voice'],
				// 	options: {
				// 	},
				// 	view: VoiceAIView
				// });

				let AI_DATA_VIEW = '<div class="site-search-ai" data-view="AI"></div>';
				_.extend(ItemsSearcherView.prototype, {
					initialize: _.wrap(ItemsSearcherView.prototype.initialize, function (fn) {
						fn.apply(this, _.toArray(arguments).slice(1));
						$(() => {
							let s = $('.site-search-button-submit');
							s.append(AI_DATA_VIEW);
							console.log("trigg", s);
						});

					})
				});
				if (layout) {
					layout.addChildView('AI', function () {
						return new VoiceAIView({ container: container });
					});
				}

			}
		};
	});
