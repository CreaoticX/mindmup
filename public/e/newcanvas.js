/* global jQuery, MM, MAPJS, window*/
MM.CustomStyleController = function (mapController) {
	'use strict';
	var self = this,
		customStyleElement = jQuery('<style id="customStyleCSS" type="text/css"></style>').appendTo('body'),
		activeContent,
		currentStyleText,
		setActiveContent = function (mapId, content) {
			if (activeContent) {
				activeContent.removeEventListener('changed', publishData);
			}
			activeContent = content;
			publishData();
			activeContent.addEventListener('changed', publishData);
		},
		publishData = function () {
			var newText = activeContent.getAttr('customCSS');
			if (newText !== currentStyleText) {
				currentStyleText = newText;
				customStyleElement.text(currentStyleText || '');
				activeContent.dispatchEvent('changed');
			}
		};
	mapController.addEventListener('mapLoaded', setActiveContent);
	self.getStyle = function () {
		return currentStyleText || '';
	};
	self.setStyle = function (styleText) {
		activeContent.updateAttr(activeContent.id, 'customCSS', styleText);
	};
};
jQuery.fn.customStyleWidget = function (controller) {
	'use strict';
	var modal = this,
		textField = modal.find('[data-mm-role=style-input]'),
		confirmButton = modal.find('[data-mm-role=save]');
	modal.on('show', function () {
		textField.val(controller.getStyle());
	});
	confirmButton.click(function () {
		controller.setStyle(textField.val());
	});
};
MM.Extensions.newCanvas = function () {
	'use strict';
	var loadUI = function (html) {
			var parsed = jQuery(html),
				controller = new MM.CustomStyleController(MM.Extensions.components.mapController);
			parsed.find('[data-mm-role=top-menu]').clone().appendTo('#nodeContextMenu');
			parsed.find('[data-mm-role=modal]').clone().appendTo('body').customStyleWidget(controller);
		};
	MM.Extensions.components.mapModel.setLayoutCalculator(MAPJS.DOMRender.layoutCalculator);
	jQuery.fn.mapWidget = jQuery.fn.domMapWidget;
	jQuery('<link rel="stylesheet" href="' + MM.Extensions.mmConfig.publicUrl + '/mapjs.css" />').appendTo('body');
	jQuery.get(MM.Extensions.mmConfig.publicUrl + '/e/newcanvas.html', loadUI);
};
if (!window.jasmine) {
	MM.Extensions.newCanvas();
}
