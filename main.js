$(function() {
    var items = [];
    var total = 0;



    $('button[type=submit]').click(function(e) {
        e.preventDefault();

        if (!$('input[name=size]:checked').length > 0) {
            $('#size-modal').modal('show');
            return 0;
        }

        var data = $('form').serializeArray();
        var size = data[0]['value'];
        var sizes = {small: 10, medium: 15, large: 20, xlarge: 25};
        var names = [];
        var nums = 0;
        var dict = {};
        var id = s4();

        for (var i = 1; i < data.length; i++) {
            names.push(data[i]['name']);
            nums += Number(data[i]['value']);
        }

        nums += sizes[size];
        dict['size'] = size;
        dict['toppings'] = names;
        dict['price'] = nums;
        dict['id'] = id;

        items.push(dict);

        total += Number(dict['price']);
        $('#total').html('$'+total+'.00');

        function top(obj) {
            var string = '';
            for (var i = 0; i < obj.length; i++) {
                var li = '<li>' + obj[i] + '</li>';
                string = string + li;
            }
            return string;
        }

        var t = top(dict['toppings']);

        $('#items').append(
            '<li class="list-group-item clearfix" id="' + id + '">' +
                '<strong>' + dict['size'] + '</strong>' +
                '<ul>' + t + '</ul>' +
                '<hr>' +
                '<button type="button" class="btn btn-xs btn-danger remove">remove</button>' +
                '<span style="float: right;">$' + dict['price'] + '.00</span>' +
            '</li>'
        );

        $('input[name=size]').prop('checked', false);
        $('input[type=checkbox]').prop('checked', false);
        $('.btn').removeClass('active');
    });



    $('#finished').click(function() {
        var i = JSON.stringify(items);

        if (items.length > 0) {
            $('#success-modal').modal('show');

            // $.ajax({
            //     url: '/checkout/',
            //     type: 'POST',
            //     data: {i, total},
            //     dataType: 'json',
            //     success: function(data) {console.log(data);}
            // });
        } else {
            $('#no-items-modal').modal('show');
        }

        $('#items').html('');
        items = [];
        total = 0;
        $('#total').html('$0.00');
    });



    function s4() { return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1); 
    };


    $(document).on('click', '.remove', function() {
        var id = $(this).parent().attr('id');

        $(this).parent().remove();

        for (var i = 0; i < items.length; i++) {
            if (items[i]['id'] === id) {
                total -= items[i]['price'];
                $('#total').html('$'+total+'.00');
                var index = items.indexOf(items[i]);
                items.splice(index, 1);
                return 0;
            }
        }
    });





    // using jQuery
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    // console.log(csrftoken);

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
});