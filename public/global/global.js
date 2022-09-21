$(document).ready(function(){
    $('.datepicker').datepicker({
        dateFormat: 'dd-mm-yy'
    });
})

$(document).on('focus','.focus',function(){
    $(this).select();
})

$(document).on('click','.confirmation',function () {
    var href = $(this).attr('data-href');
    if(isIframe){
        href += '?key='+ck;
    }
    var action = $(this).attr('btn-action');
    if(!action){
        action = 'do';
    }
    $.confirm({
        title: '<b>'+siteContents['confirmation']+'!</b>',
        content:'<b>'+siteContents['are_you_sure']+' '+action+'?</b>',
        escapeKey: true,
        backgroundDismiss: true,
        theme:'light',
        buttons: {
            Confirm: {
                text: action,
                btnClass: 'btn-success',
                keys: ['enter'],
                action: function () {
                    window.location.href = window.location.origin+href;
                }
            },
            cancel: {
                text: siteContents['no'],
                btnClass: 'btn-warning',
                action: function () {
                    // close
                }
            }
        }
    });
})

function photoPreview(input,preview_id,width,height,classes='') {
    var img = $(input).val();
    var ext = img.split('.');
    ext = ext[ext.length-1];
    var allow = ["jpg", "jpeg", "png"];
    var exist = allow.indexOf(ext.toLowerCase());
    if(exist>=0){
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(preview_id).html('<img src="'+e.target.result+'" class="img-fluid '+classes+'" width="'+width+'" height="'+height+'"/>');
            }
            reader.readAsDataURL(input.files[0]);
            return true;
        }
    }else{
        return false
    }

}

function resetForm($form){
    $form.find('input[type=text]').val('');
    $form.find('select').val('');
    $form.find('input[type=number]').val('');
}

$(document).on('keypress keyup','.real-number',function (event) {
    var number=parseInt($(this).val());
    //console.log(event);
    if(isNaN(number) || number==0){
        if(event.charCode==48){
            return false;
        }
        if(event.charCode==0){
            return false;
        }
    }
    return isRealNumber(event, this)
});

$(document).on('keypress keyup','.none-zero',function (event) {
    var number=parseInt($(this).val());
    //console.log(event);
    if(isNaN(number) || number==0){
        if(event.charCode==48){
            $(this).val('')
            return false;
        }
        if(event.charCode==0){
            $(this).val('')
            return false;
        }
    }
});
function isRealNumber(evt, element) {

    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        //(charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
    //(charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}


$(document).on('keypress keyup','.decimal',function (event) {
    return isDecimal(event, this)
});
$(document).on('keyup','.percent',function () {
    let percent = parseFloat($(this).val());
    if(percent>100){
        $(this).val(100);
    }else if(percent<0){
        $(this).val(0);
    }
    $(this).trigger('change')
});

function isDecimal(evt, element) {

    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        //(charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;


    return true;
}

function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}