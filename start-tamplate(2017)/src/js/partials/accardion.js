'use strict';

var accardion1 = new Accardion({
	button: '[data-accardion-title]',
	newContent: 'data-accardion-content',
	event: 'click',
	singleOpen: true
});

function Accardion(settings) {

	var that = this;
	var countAcardion = 0;

	that.accardion_title = document.querySelectorAll(settings.button);

	that.items = document.querySelectorAll("[" + settings.newContent + "]");

	function loop(elements, eventName, functionName) {

		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener(eventName, functionName);
		}
	}

	loop(that.accardion_title, settings.event, toggle);

	function toggle() {

		this.getAtr = this.getAttribute(settings.button.slice(1, -1));
		this.searchContent = document.querySelector("[" + settings.newContent + "= " + this.getAtr + "]");

		if (this.searchContent.style.maxHeight) {
			this.searchContent.style.maxHeight = null;
		} else {

			countAcardion++;

			if (settings.singleOpen && countAcardion > 1) {

				for (var i = 0; i < that.items.length; i++) {
					that.items[i].style.maxHeight = null;
				}
			}

			this.searchContent.style.maxHeight = this.searchContent.scrollHeight + 'px';
		}
	}
}

// var accardion1 = new Accardion({
// 	button: '[data-accardion-title]',
// 	newContent: 'data-accardion-content',
// 	event: 'click',
// 	singleOpen: true
// });

// function Accardion(settings) {
// 	var that = this;
// 	var countAcardion = 0;


// 	that.accardion_title = document.querySelectorAll(settings.button);

// 	that.items = document.querySelectorAll("[" + settings.newContent + "]");

// 	function loop(elements, eventName, functionName) {

// 		for (var i = 0; i < elements.length; i++) {
// 			elements[i].addEventListener(eventName, functionName);
// 		}


// 	}


// 	loop(that.accardion_title, settings.event, toggle);


// 	function toggle() {


// 		this.getAtr = this.getAttribute(settings.button.slice(1, -1));
// 		this.searchContent = document.querySelector("[" + settings.newContent + "= " + this.getAtr + "]");

// 		if (this.searchContent.style.maxHeight) {
// 			this.searchContent.style.maxHeight = null;

// 		} else {

// 			countAcardion++;

// 			if (settings.singleOpen && countAcardion > 1) {

// 				for (var i = 0; i < that.items.length; i++) {
// 					that.items[i].style.maxHeight = null;

// 				}
// 			}

// 			this.searchContent.style.maxHeight = this.searchContent.scrollHeight + 'px';
// 		}

// 	}

// }