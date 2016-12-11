/**
 * Created by user1 on 10.12.16.
 */

F = {};
F.app = null;
F.FILE_API = false;
F.choosen_files = [];

/**
 * инициализация
 * @param app
 */
F.init = function(app){
    F.app = app;
    if (window.File && window.FileReader && window.FileList && window.Blob){
        F.FILE_API = true;
        console.log('File API is supported');
    }else{
        F.FILE_API = false;
        console.log('File API is not supported');
    }
}

/**
 * обработчик выбора файлов
 * @param ev
 */
F.handlerFileSelect = function(ev){
    var files = ev.target.files;
    F.choosen_files = files;
    var output = [];
    for (var i =0,f; f = files[i]; i++){
        output.push([escape(f.name), f.type || 'n/a', f.size]);
        filename = f.name;
    }
    F.app.iface.fillFilesList(output);
};

/**
 * чтение файла
 * @param f объект File
 * @param callback функция обратного вызова в которую
 * передается объект File и прочитанное содержимое файла
 */
F.readFile = function(f, callback){
    var reader = new FileReader();
    reader.onload = function(e){
        callback(f, e.target.result);
    };
    reader.readAsBinaryString(f);
};
