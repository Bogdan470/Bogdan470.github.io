function pow(chislo, stepen) {
var result = chislo;
    for (var i = 1; i < stepen; i++) {
     result *= chislo;
    }
    return result;
}
var chislo = prompt('Введите число', '');
var stepen = prompt('Введите степень', '');

if (stepen <= 1) {
  alert('Степень ' + stepen +
    ' не верный формат...степень должна быть больше 1'
  );
} else {
  console.log( pow(chislo, stepen) );
}