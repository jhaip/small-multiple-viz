$.get("http://192.168.2.13:5000/data?start=2017-01-19T00-00-55Z&stop=2017-01-20T19-00-55Z", function(data) {
    console.log(data.results);
    $.each(data.results, function(i, r) {
        $(".frames").append('<img src="http://192.168.2.13:5000/clips/'+r+'" width="133" height="100">');
    });
})
