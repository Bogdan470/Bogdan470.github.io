var arr = [];

 for (var i = 0; i < 5; i++) {
    arr.unshift(prompt('Введите имя'));
 }
 
var inputName = prompt('Введите свое имя');

for (var i = 0; i < arr.length; i++) {
    if (inputName == arr[i]) {
        alert(inputName + ' ' + 'Вы успешно вошли');
        break;
    }
}
if(inputName != arr[i]){
    alert('Ошибка');
}
