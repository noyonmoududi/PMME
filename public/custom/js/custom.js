function changePrizeState(){
    var total_prize_amount = 0;
    var all_total_prize = 0;
    $('.prize_amount').each(function () {
        var prize_amount = $(this).val();
        if(prize_amount=='' || !$.isNumeric(prize_amount)){
            prize_amount = 0;
        }else{
            prize_amount = parseFloat(prize_amount);
        }
        var total_prize = $(this).closest('tr').find('.total_prize').val();

        if(total_prize == '' || !$.isNumeric(total_prize)){
            total_prize = 1;
        }else{
            total_prize = parseInt(total_prize);
        }

        total_prize_amount=total_prize_amount+(prize_amount*total_prize);
    });
    $('.total_prize').each(function () {
        var total_prize = $(this).val();
        if(total_prize == '' || !$.isNumeric(total_prize)){
            total_prize = 0;
        }else{
            total_prize = parseFloat(total_prize);
        }
        all_total_prize=all_total_prize+total_prize;
    });

    $('#total_prize_amount').html(parseFloat(total_prize_amount.toFixed(8)));
    $('#all_total_prize').html(all_total_prize);
}
$(document).ready(function(){

    changePrizeState();
    $(document).on("change  keyup", ".prize_amount,.total_prize", function()
    {
        changePrizeState()
    });

    $(document).on('change keyup','#sold_percent',function(){
        var percent = parseFloat($(this).val());
        var total_amount = parseFloat($(this).attr('total-amount'));
        var total_prize_amount = parseFloat($(this).attr('total-prize-amount'));

        let total_profit = ((total_amount/100)*percent)-total_prize_amount;
        $('#total_profit').html(total_profit.toFixed(2));

    })

    ///profile photo change
    $(document).on('click','#change_profile_img',function(){
        $(this).closest('div').find('input[name="phofile_photo"]').trigger('click');
    });

    var photo_parent = '#profile_img';
    var current_img = $(photo_parent).html();

    $(document).on('change','input[name="phofile_photo"]',function(){
        if(photoPreview(this,photo_parent,300,300)){
            $('#change_profile_img').hide();
            $(this).closest('form').show();
        }else{
            $('#reset_profile_img').trigger('click');
        }

    })
    $(document).on('click','#reset_profile_img',function () {
        $('#change_profile_img').show();
        $(this).closest('form').hide();
        $(photo_parent).html(current_img);
    })
    ///End profile photo change


    // change state by country
    $(document).on('change','#country_id',function () {
        var country_id = $(this).val();
        var url = window.location.origin+'/api/get-states/'+country_id;
        $this = $(this);
        $.get(url,function(states){
            var options  = '<option value="">Select State</option>';
            for(var k in states){
                options += '<option value="'+states[k].id+'">'+states[k].name+'</option>';
            }
            $this.closest('form').find('#state_id').html(options);
        },'json').fail(function(err){
            console.log('Error:');
            console.log(err);
        })
    })
    // end change state by country





});


function setTooltip(message, $this = '') {
    $($this).tooltip('hide')
        .attr('data-original-title', message)
        .tooltip('show');
}

function copyText(text) {
    var $temp = $("<textarea></textarea>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
    return true;
}

  $(document).on('click','.btn-copy',function(){
      var textTarget = $($(this).attr('data-copy'));
      copyText(textTarget.text());
      setTooltip('Copied', this);
      var _this = this;
      setTimeout(function(){
          $(_this).tooltip('hide').removeAttr('data-original-title');
      },1000)
  })

$(document).on('click','#subscribeNow',function () {
    var email = $(this).closest('form').find('input[type="email"]').val();
    var $this = $(this);
    if(isEmail(email)){
        var url = window.location.origin + '/api/subscribe';
        $(this).closest('form').find('.err-msg').empty();
        $.post(url,{email:email},function (res) {
            $this.closest('form').find('input[type="email"]').val('');
            $this.closest('form').find('.message').html(res.message);
            $this.closest('form').find('.message').addClass('text-success');
            $this.closest('form').find('.message').removeClass('text-danger');
        },'json')
    }else{
        $(this).closest('form').find('.message').removeClass('text-success');
        $(this).closest('form').find('.message').addClass('text-danger');
        $(this).closest('form').find('.message').html('Please enter valid email address')
    }

})


