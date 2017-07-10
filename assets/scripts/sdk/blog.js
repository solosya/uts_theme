    $.fn.Ajax_LoadBlogArticles = function(options){
        
        var defaults = {
            'limit': 20,
            'containerClass': 'ajaxArticles',
            'onSuccess' : function(){},
            'onError' : function(){},
            'beforeSend' : function(){},
            'onComplete' : function(){}
        };
        
        var opts = $.extend( {}, defaults, options );
        
        var offset = parseInt($('.'+opts.containerClass).data('offset'));
        if(isNaN(offset) || offset < 0) {
            offset = opts.limit;
        }
        
        var existingNonPinnedCount = parseInt($('.'+opts.containerClass).data('existing-nonpinned-count'));
        if(isNaN(existingNonPinnedCount)) {
            existingNonPinnedCount = -1;
        }
        
        $('.'+opts.containerClass).data('offset', (offset + opts.limit));
        
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        
        var dateFormat = 'SHORT';
        
        $.ajax({
            type: 'post',
            url: _appJsConfig.baseHttpPath + '/home/load-articles',
            dataType: 'json',
            data: {offset: offset, limit: opts.limit, existingNonPinnedCount: existingNonPinnedCount, _csrf: csrfToken, dateFormat: dateFormat},
            success: function (data, textStatus, jqXHR) {
                if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                    opts.onSuccess(data, textStatus, jqXHR);
                }                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                if (opts.onError && typeof opts.onError === 'function') {
                    opts.onError(jqXHR, textStatus, errorThrown);
                }
            },
            beforeSend: function (jqXHR, settings) {
                if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                    opts.beforeSend(jqXHR, settings);
                }
            },
            complete: function (jqXHR, textStatus) {
                if (opts.onComplete && typeof opts.onComplete === 'function') {
                    opts.onComplete(jqXHR, textStatus);
                }
            }
        });        
    };