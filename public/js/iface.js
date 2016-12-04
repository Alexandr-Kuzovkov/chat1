var I = {};

I.app = null;
I.messages = [];
I.NOTE_TIME = 3000; /*время показа заметки*/

/**
 * инициализация объекта интерфейса
 * @param app
 */
I.init = function(app){
    I.app = app;
    I.messages_block = document.getElementById('messages');
    I.note_block = document.getElementById('note');
    I.note_close = document.getElementById('note-close');
    if (I.note_close != null) I.note_close.onclick = I.hideNote;
    I.input = document.getElementById('input');
    I.send_btn = document.getElementById('send-btn');
    I.nicname = document.getElementById('nicname');
    I.clear_btn = document.getElementById('clear-btn');
    I.send_btn.onclick = I.btnSendHandler;
    I.exit_btn = document.getElementById('exit-btn');
    I.user_for_chat = document.getElementById('user-for-chat');
    if (I.exit_btn != null) I.exit_btn.onclick = I.exit;
    window.onkeypress = I.keyPressHandler;
    if (I.clear_btn != null) I.clear_btn.onclick = I.removeHistory;
    I.restoreMessages();
    I.showMessages();
    if (I.messages_block != null) I.messages_block.scrollTop = 9999;
    if (I.nicname != null) I.app.nicname = I.nicname.innerHTML;
    I.list_users_online = document.getElementById('users-online');
    if (window.localStorage) I.app.selected_user = window.localStorage.getItem('selected_user');
    document.getElementById('test').onclick = I.test;
};


I.test = function(){
    I.showNote('test message');
};

/**
 * добавление сообщения в список сообщений
 * @param message
 */
I.addMessage = function(user, message){
    I.messages.push({author:user, text:message});
    I.saveMessages();
    I.showMessages();
};

/**
 * обработка нажатия кнопки Send
 */
I.btnSendHandler = function(){
    I.app.sendUserMessage(I.input.value);
    I.input.value = '';
};

/**
 * Обработка нажатий клавиш
 * @param e
 */
I.keyPressHandler = function(e){
    if (e.keyCode == 13){
        I.btnSendHandler();
    }
};

/**
 * сохранение истории сообщений
 */
I.saveMessages = function(){
    if (window.localStorage){
        window.localStorage.setItem('messages', JSON.stringify(I.messages));
    }
}

/**
 * получение истории сохранений
 * @returns {string}
 */
I.restoreMessages = function(){
    if (window.localStorage){
        I.messages = JSON.parse(window.localStorage.getItem('messages'));
        if (I.messages == null){
            I.messages = [];
        }
    }
};

/**
 * показ списка сообщений
 */
I.showMessages = function(){
    if (I.messages_block == null) return;
    var html = ['<ul class="messages-list">'];
    for (var i = 0; i < I.messages.length; i++){
        html.push('<li><span class="author">');
        html.push(I.messages[i]['author']);
        html.push('</span>: <span class="text">');
        html.push(I.messages[i]['text']);
        html.push('</span></li>');
    }
    html.push('</ul>');
    I.messages_block.innerHTML = html.join('');
}

/**
 * удаление истории  сообщений
 */
I.removeHistory = function(){
    window.localStorage.removeItem('messages');
    I.restoreMessages();
    I.showMessages();
};

/**
 * выход из чата
 */
I.exit = function(){
    deleteCookie('nicname');
    I.reloadPage('/');
};

/**
 * перезагрузка страницы
 * @param url
 */
I.reloadPage = function(url){
    window.location.replace(url);
};

/**
 * заполнение списка рользовалелей online
 * @param user_list
 */
I.refreshUsersOnline = function(user_list){
    if (I.list_users_online == null) return;
    I.destroyChildren(I.list_users_online);
    for (var i = 0; i< user_list.length; i++){
        if (user_list[i] == I.app.nicname) continue;
        var li = document.createElement('li');
        li.id = 'chat-' + user_list[i];
        li.className = 'user-item';
        if (I.app.selected_user == user_list[i]){
            li.className = 'user-item selected';
        }

        if (I.app.selected_user == null){
            li.className = 'user-item selected';
            I.app.selected_user = user_list[i];
        }
        li.innerHTML = user_list[i];
        I.list_users_online.appendChild(li);
    }
    var list = document.getElementsByClassName('user-item');
    for (var i = 0; i < list.length; i++){
        list[i].addEventListener('click', I.selectUser);
    }
    if (I.user_for_chat != null) I.user_for_chat.innerHTML = I.app.selected_user;
};

/**
 * удаление дочерних узлов у DOM элемента
 * @param node DOM элемент
 **/
I.destroyChildren = function(node){
    if (!node) return;
    node.innerHTML = '';
    while (node.firstChild)
        node.removeChild(node.firstChild);
}

/**
 * Обработка выбора пользователя для общения
 * @param e
 */
I.selectUser = function(e){
    console.log(this.id.split('-').pop());
    var list = document.getElementsByClassName('user-item');
    for (var i = 0; i < list.length; i++){
        list[i].className = 'user-item';
    }
    this.className = 'user-item selected';
    I.app.setSelectedUser(this.id.split('-').pop());
    if (window.localStorage){
        window.localStorage.setItem('selected_user', this.id.split('-').pop());
    }
    if (I.user_for_chat != null) I.user_for_chat.innerHTML = I.app.selected_user;
};

/**
 * показ заметки
 */
I.showNote = function(text){
    if (I.note_block == null) return;
    I.note_block.innerHTML = text;
    I.note_block.style.display = 'block';
    setInterval(I.hideNote, I.NOTE_TIME);
};

/**
 * сокрытие заметки
 */
I.hideNote = function(){
    if (I.note_block == null) return;
    I.note_block.innerHTML = '';
    I.note_block.style.display = 'none';
};

