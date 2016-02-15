$(function(){
    
    var html = $('#my_page').html();
    var data = {
       name_foto : "Алтухов Богдан Адександрович", 
       image_foto_url : "img/foto.png", 
       img_alt : "Фото Алтухов Богдан", 
       img_title : "Алтухов Богдан Александрович",
       proffesion : "Инженер в сфере аудио-визуальных технологий",
        want_job : "Хочу учить фронтенд, потому что:",
        would_1 : "Нравиться фронтенд",
        would_2 : "Вижу себя там",
        would_3 : "Хочу зарабатывать",
        would_4 : "Хочу чтоб фронтенд превратился из хобби в основную работу",
        my_tel : "Мой контактный телефон",
        my_number_tel : "+380969419551",
        text_vkontakte : "Мой профиль вконтакте ",
        text_prof_vkontakte : "https://vk.com/id6687563",
        my_feedback : "Мой фидбек: ",
        text_my_feedback : "Готов много учиться и познать новое чтобы быть полезным"
        
    };
    
    var page = tmpl(html, data);
    $('body').append(page);
});