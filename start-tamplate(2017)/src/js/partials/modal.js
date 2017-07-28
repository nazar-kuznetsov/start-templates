'use strict';

var popup = new Modal({
  button: { // Кнопки открытия и закрытия
    dataAttribute: 'data-popup', // Атрибут который должен быть на кнопке и внутри него селектор который нужно открыть 
    close: '.close-modal' // кнопка закрыть
  },
  popup: { // Overlay + Модальное окно
    overlay: '.overlay', //Названия Tag Который нужно создать для overlay popup
    modal: '.modal' // модальное окно с позиционированое на экране
  },
  auto: { // Автоматически запустить Модальное окно
    time: 5000, // Через какое время автоматически откроеться модальное окно
    box: '.gunit',
    open: false // если стоит true модальное окно откроеться автоматом
  },
  event: { // Собития по которым будет открываться и закрываться popup
    open: 'click', // собия открыть блок
    close: 'click', // собития закрыть по крестику
    closeOverlay: 'click' // собития закрыть по заднему фону
  }
});

function Modal(settings) {
  var that = this;

  // Создаем div для overlay добавляем клас и помещяем в конец body
  that.createOverlay = document.createElement('div');
  that.createOverlay.classList.add(settings.popup.overlay.substr(1));
  document.body.appendChild(that.createOverlay);

  // Создаем div для modal добавляем клас внутрь overlay
  that.createModal = document.createElement('div');
  that.createModal.classList.add(settings.popup.modal.substr(1));
  that.createOverlay.appendChild(that.createModal);

  that.overlay = document.querySelector(settings.popup.overlay);
  that.modal = document.querySelector(settings.popup.modal);
  that.openBtn = document.querySelectorAll("[" + settings.button.dataAttribute + "]");

  // Перебераем элементы и на каждый элемент вешаем функцию переланую в аргументе
  that.loopElements = function (elements, nameFunction, eventName) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener(eventName, nameFunction);
    }
  };

  that.getFunction = function () {

    that.getSelector = this.getAttribute(settings.button.dataAttribute);
    that.getModal = document.querySelector(that.getSelector);

    that.open(that.getSelector, that.getModal.innerHTML);
  };

  that.loopElements(that.openBtn, that.getFunction, settings.event.open);

  that.open = function (getSelector, content) {
    that.overlay.classList.add('active');
    that.modal.classList.add('active', getSelector);
    that.modal.innerHTML = content;
    that.closeBtn = document.querySelectorAll(settings.button.close);

    that.loopElements(that.closeBtn, that.close, settings.event.close);
  };

  // Автоматически открыть popup
  if (settings.auto.open) {
    that.autoModal = document.querySelector(settings.auto.box);

    setTimeout(function () {
      that.open(settings.auto.box.substr(1), that.autoModal.innerHTML);
    }, settings.auto.time);
  }

  that.close = function (e) {

    if (e.target === this) {
      that.overlay.classList.remove('active');
      that.modal.className = settings.popup.modal.substr(1);
    }
  };

  that.overlay.addEventListener(settings.event.closeOverlay, that.close);
}

/*

<button data-popup=".shotgun">50 cent</button>
<div class="shotgun hide">

  <span class="close-modal">1</span>
   321
</div>

*/