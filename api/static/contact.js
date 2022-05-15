$(document).ready(function () {
    $("form").submit(function (event) {
        var formData = {
            email : $('#email').val(),
            msg : $('#msg').val(),
        };

        $.ajax({
            type : "POST",
            url : "/contact",
            data : formData,
            dataType : "json",
            encode : true,
        }).done(function (data) {
            console.log(data);
        })

        event.preventDefault(); 

    })
})