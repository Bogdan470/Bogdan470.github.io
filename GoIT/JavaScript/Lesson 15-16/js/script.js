function GoogleCallback (func, data) {
    window[func](data);
}

$(function() {

var $searchForm = $('.searchForm');

var $ajaxQuery = function(k){

    var $text = $('#textForSearch');
    var $wrapper = $('.wrapper');
    $('.results').remove();

    $.ajax({
        url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&key=ABQIAAAACKQaiZJrS0bhr9YARgDqUxQBCBLUIYB7IF2WaNrkYqF0tBovNBQFDtM_KNtb3xQxWff2mI5hipc3lg&rsz=8&start=' + k*8 + '&q='+ encodeURIComponent($text.val()) + '&callback=GoogleCallback&context=?',
        dataType : "jsonp",
        success: function(data) {

            var results = document.createElement('div');
            results.classList.add('results');
            
            var ul = document.createElement('ul');

            var moreResults = document.createElement('div');
            moreResults.classList.add('otherResults');
            
            var p = document.createElement('p');
            p.classList.add('otherResults-list');

                for (var i = 0; i < 10; i++) {
                    p.innerHTML += '<a href="http://more... :)" class="search-more">' + (i+1) + '</a>';
                }

            $.each(data.results, function(i, val) {
                var li = document.createElement('li');
                li.innerHTML = ('<h3><a href="' + val.url + '">' + val.title + '</a></h3><p class="visibleURL">' + val.visibleUrl + '</p><p class="content">' + val.content + '</p>');
                ul.appendChild(li);
            });

            $wrapper.append(results);
            results.appendChild(ul);
            results.appendChild(moreResults);
            moreResults.appendChild(p);

            var setAnchors = function(k) {

                var $anchors = $('.search-more');
                $.each($anchors, function(i) {
                    $anchors[i].addEventListener('click', function(e) {
                        e.preventDefault();
                        $ajaxQuery(i);
                    });
                });

                $anchors[k].classList.add('active');
            };

            setAnchors(k);
        }
    });

};

$searchForm.submit(function(e) {
    e.preventDefault();
    $ajaxQuery(0);
});
    var human = {
        name : 'HumanName',
        age : 33,
        sex : 'Мужской',
        height : '185',
        weight : '100'
    };
    var worker = {
        workPlace : 'Luxoft',
        salary : 10000,
        work : function() {
        alert('I work');
    }
    };
    var student = {
    studyPlace: 'НАУ',
    grants: 1000,
    watchTV: function() {
        alert('I watch serials');
    }
    };
Object.setPrototypeOf(worker, human);
Object.setPrototypeOf(student, human);
    var Nick =  Object.create(student);
    Nick.name = 'Nick';
    Nick.age = 20;
    Nick.height =200;
    
    console.log('human', human);
    console.log('worker', worker);
    console.log('student', student);
    console.log('Студент ', Nick.name + ' , ' + ' Пол ' + Nick.sex + ' , ' + ' учиться в ' + Nick.studyPlace  + ' , ' + ' возраст ' + Nick.age + ' лет ' + ' , ' + ' вес ' + Nick.weight + ' кг ' );
});