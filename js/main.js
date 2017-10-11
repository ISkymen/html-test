
'use strict';

$(document).ready(function () {

  $('.news .in-tabs__header').click(function() {
    var tab_id = $(this).attr('data-tab');

    $('.news .in-tabs__header').removeClass('in-tabs__header--current');
    $('.news .in-tabs__content').removeClass('in-tabs__content--current');

    $(this).addClass('in-tabs__header--current');
    $('.news .' + tab_id).addClass('in-tabs__content--current');
  });

  $('.events .in-tabs__header').click(function() {
    var tab_id = $(this).attr('data-tab');

    $('.events .in-tabs__header').removeClass('in-tabs__header--current');
    $('.events .in-tabs__content').removeClass('in-tabs__content--current');

    $(this).addClass('in-tabs__header--current');
    $('.events .' + tab_id).addClass('in-tabs__content--current');
  });


});

