'use strict';

const messagesElem = document.getElementById('messages');
const clearMessages = () => {
    messagesElem.className = '';
    messagesElem.innerHTML = '';
}
const showMessages = (type, messages) => {
    messagesElem.className = 'alert alert-' + type;
    messagesElem.innerHTML = messages;
}

const messages2Elem = document.getElementById('messages2');
const clearMessages2 = () => {
    messages2Elem.className = '';
    messages2Elem.innerHTML = '';
}
const showMessages2 = (type, messages) => {
    messages2Elem.className = 'alert alert-' + type;
    messages2Elem.innerHTML = messages;
}
