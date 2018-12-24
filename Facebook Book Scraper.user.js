// ==UserScript==
// @name         Facebook Book Scraper
// @namespace    http://l33tch.net/
// @version      1.0
// @description  Get a list of your books off Facebook!
// @author       L33tCh
// @match        https://*.facebook.com/*/books*
// @grant        none
// ==/UserScript==

let books = [];
let icon;

const bookListQuerySelector = '#pagelet_timeline_medley_books>div>div>ul';
const bookElementClass = '_5rz';
const bookDetailClass = '_gx7';

const facebookButtonListQuerySelector = '#pagelet_dock>div>div>div>div';
const createdButtonClass = 'uiToggle _50-v fbNub _4up';
const createdLinkClass = 'fbNubButton';
const iconSymbol = '&#x2668;';
const tooltipText = 'Copy Book List';

class FacebookDate {
    constructor(element) {
        this.unix = element.getAttribute('data-utime');
        this.fuzzy = element.getElementsByClassName('timestampContent')[0].innerHTML;
        this.long = element.title;
    }
}

class Book {
    constructor(element) {
        addButton(element);
        this.title = Book.getTitle(element);
        this.facebookUrl = element.getElementsByClassName(bookDetailClass)[0].href;
        this.added = new FacebookDate(element.getElementsByClassName('livetimestamp')[0]);
        this.cover = element.querySelector('img').src;
    }
    static getTitle(element) {
        return element.getElementsByClassName(bookDetailClass)[0].title;
    }
}

const updateIcon = () => {
    icon.innerHTML = `${books.length}  ${iconSymbol} `;
}

const addBook = (book) => {
    const tempBook = new Book(book);
    if (!books.includes(tempBook)) {
        books = [...books, {...tempBook}];
    }
}

const MutationObserverCallback = (e) => {
    e.forEach(node => {
        addBook(node.addedNodes[0]);
    });
    updateIcon();
}

const copyToClipboard = (string) => {
    function handler (event){
        event.clipboardData.setData('text/plain', string);
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    }

    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
}

const addButton = (el) => {
    const target = el.querySelector('div>div>div>form');
    const button = document.createElement('span');
    button.setAttribute('class', '_4f-');
    const link = document.createElement('a');
    link.setAttribute('data-hover','tooltip');
    link.setAttribute('target','_blank');
    link.setAttribute('data-tooltip-alignh','right');
    link.setAttribute('data-tooltip-content','Get Detail');
    link.href = `https://www.googleapis.com/books/v1/volumes?q=${Book.getTitle(el)}`;
    const ico = document.createElement('i');
    ico.innerHTML = ` ${iconSymbol} `;
    link.appendChild(ico);
    button.appendChild(link);
    target.appendChild(button);
}

const createButton = () => {
    const target = document.querySelectorAll(facebookButtonListQuerySelector)[1];
    const button = document.createElement('div');
    button.setAttribute('class',createdButtonClass);
    const link = document.createElement('a');
    link.setAttribute('class',createdLinkClass);
    link.setAttribute('data-hover','tooltip');
    link.setAttribute('data-tooltip-alignh','right');
    link.setAttribute('data-tooltip-content',tooltipText);
    link.addEventListener('click', () => {
        copyToClipboard(JSON.stringify(books));
        window.alert(`${books.length} book titles sent to clipboard!`);
    });
    icon = document.createElement('i');
    updateIcon();

    link.appendChild(icon);
    button.appendChild(link);
    target.appendChild(button);
}

window.addEventListener('load', () => {
    'use strict';
    const config = { childList: true };
    const observer = new MutationObserver(MutationObserverCallback);
    const target = document.querySelector(bookListQuerySelector);

    [...document.getElementsByClassName(bookElementClass)]
        .forEach(book => addBook(book));

    createButton();
    observer.observe(target, config);
});
