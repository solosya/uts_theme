var HomeController = (function ($) {
    return {
        listing: function () {
            HomeController.Listing.init();
        },
        blog: function() {
            HomeController.Blog.init();
        }
    };
}(jQuery));

HomeController.Listing = (function ($) {

    var bindPinUnpinArticle = function(){
        $('button.PinArticleBtn').Ajax_pinUnpinArticle({
            onSuccess: function(data, obj){
                var status = $(obj).data('status');
                (status == 1) 
                    ? $(obj).attr('title', 'Un-Pin Article') 
                    : $(obj).attr('title', 'Pin Article');
               (status == 1) 
                    ? $(obj).find('span').first().html('Un-Pin') 
                    : $(obj).find('span').first().html('Pin');
            }
        });
    };
    
    var bindDeleteHideArticle = function(){
        $('button.HideBlogArticle').Ajax_deleteArticle({
            onSuccess: function(data, obj){
                var sectionPostsCount = $(obj).closest('.section__content').find('.card__news').length;
                if(sectionPostsCount <= 1) {
                    $(obj).closest('.section__content').addClass('hide');
                }
                $(obj).closest('.card').parent('div').remove();
                var postsCount = $('body').find('.card__news').length;
                if(postsCount <= 0) {
                    $('.NoArticlesMsg').removeClass('hide');
                }
            }
        });
    };
    
    var attachEvents = function () {
        if(_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
            //Bind pin/unpin article event
            bindPinUnpinArticle();

            //Bind delete social article & hide system article
            bindDeleteHideArticle();
        }
        
        function initSwap() {
            initDroppable();
            initDraggable();
            
            //Following will called on page load and also on load more articles
            $(".articleMenu, .socialMenu").delay(2000).fadeIn(500);
        }
        
        function initDraggable() {
            $('.swap').draggable({
                helper: 'clone',
                revert: true,
                zIndex: 100,
                scroll: true,
                scrollSensitivity: 100,
                cursorAt: { left: 150, top: 50 },
                appendTo:'body',
//                containment: false,
                start: function( event, ui ) {
                    ui.helper.attr('class', '');
                    var postImage = $(ui.helper).data('article-image');
                    var postText = $(ui.helper).data('article-text');
                    console.log($('div.SwappingHelper'));
                    if(postImage !== "") {
                        $('div.SwappingHelper img.article-image').attr('src', postImage);

                    }
                    else {
                        $('div.SwappingHelper img.article-image').attr('src', 'http://www.placehold.it/100x100/EFEFEF/AAAAAA&amp;text=no+image');
                    }
                    $('div.SwappingHelper p.article-text').html(postText);
                    $(ui.helper).html($('div.SwappingHelper').html());    
                }
            });
        }

        function initDroppable() {
            console.log('adding droppable');
            $('.swap').droppable({
                hoverClass: "ui-state-hover",
                drop: function(event, ui) {
                    var sourceObj = $(ui.draggable);
                    var $this = $(this);
                    //get positions
                    var sourcePosition = $(sourceObj).data('position');
                    var sourcePostId = parseInt($(sourceObj).data('id'));
                    var sourceIsSocial = parseInt($(sourceObj).data('social'));
                    var destinationPosition = $($this).data('position');
                    var destinationPostId = parseInt($($this).data('id'));
                    var destinationIsSocial = parseInt($($this).data('social'));

                    $(this).after(ui.draggable.clone().removeAttr('style'));
                    $(ui.draggable).after($(this).clone());
                    $(ui.helper).remove(); //destroy clone
                    $(ui.draggable).remove();
                    $(this).remove();
                    
                    //swap positions
                    $(sourceObj).data('position', destinationPosition);
                    $(this).data('position', sourcePosition);
                    
                    var csrfToken = $('meta[name="csrf-token"]').attr("content");
                    var postData = {
                        sourcePosition: sourcePosition,
                        sourceArticleId: sourcePostId,
                        sourceIsSocial: sourceIsSocial,
                        
                        destinationPosition: destinationPosition,
                        destinationArticleId: destinationPostId,
                        destinationIsSocial: destinationIsSocial,
                        
                        _csrf: csrfToken
                    };
                    console.log(postData);
                    $.ajax({
                        url: _appJsConfig.baseHttpPath + '/home/swap-article',
                        type: 'post',
                        data: postData,
                        dataType: 'json',
                        success: function(data){
                            console.log(data);
                            if(data.success) {
                                $.fn.General_ShowNotification({message: "Articles swapped successfully"});
                            }
                            
                            $(".card p, .card h1").dotdotdot();
                            initSwap();
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            //$().General_ShowErrorMessage({message: jqXHR.responseText});
                        },
                        beforeSend: function(jqXHR, settings) { 
                        },
                        complete: function(jqXHR, textStatus) {
                        }
                    });

                }
            }); 
        }

        if(_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
            initSwap();
        }
        
        $('.loadMoreArticles').on('click', function(e){
            e.preventDefault();

            var btnObj = $(this);
            $.fn.Ajax_LoadBlogArticles({
                onSuccess: function(data, textStatus, jqXHR){
                    if (data.success == 1) {
                        $('.ajaxArticles').data('existing-nonpinned-count', data.existingNonPinnedCount);

                        if (data.articles.length < 20) {
                            $(btnObj).css('display', 'none');
                        }
                        for (var i in data.articles) {
                            data.articles[i]['containerClass'] = 'col-quarter';
                            data.articles[i]['pinTitle'] = (data.articles[i].isPinned == 1) ? 'Un-Pin Article' : 'Pin Article';
                            data.articles[i]['pinText'] = (data.articles[i].isPinned == 1) ? 'Un-Pin' : 'Pin';
                            data.articles[i]['promotedClass'] = (data.articles[i].isPromoted == 1)? 'ad_icon' : '';
                            data.articles[i]['hasArticleMediaClass'] = (data.articles[i].hasMedia == 1)? 'withImage__content' : 'without__image';
                            data.articles[i]['blogClass']= '';
                            if(data.articles[i].blog['id'] !== null) {
                               data.articles[i]['blogClass']= 'card--blog_'+data.articles[i].blog['id'];
                            } 
                            
                                                        
                            var ImageUrl = $.image({media:data.articles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
                            data.articles[i]['imageUrl'] = ImageUrl;
                            var articleId = parseInt(data.articles[i].articleId);
                            var articleTemplate;
                            if (isNaN(articleId) || articleId <= 0) {
                                data.articles[i]['videoClass'] = '';
                                if(data.articles[i].social.media.type && data.articles[i].social.media.type == 'video') {
                                    data.articles[i]['videoClass'] = 'video_card';
                                }
                                articleTemplate = Handlebars.compile(socialCardTemplate); 
                            } else {
                                articleTemplate = Handlebars.compile(systemCardTemplate);
                            }
                            var article = articleTemplate(data.articles[i]);
                            $('.ajaxArticles').append(article);
                        }

                        $(".card p, .card h1").dotdotdot();
                        
                        bindSocialShareArticle();
                        
                        $('.video-player').videoPlayer();
                        
                        //Lazyload implement
                        $("div.lazyload").lazyload({
                            effect: "fadeIn"
                        });
                        if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
                            //Bind pin/unpin article event
                            bindPinUnpinArticle();
                            //Bind delete social article & hide system article
                            bindDeleteHideArticle();
                            bindSocialUpdatePost();

                            initSwap();
                        }
                    }
                 
                },
                beforeSend: function(jqXHR, settings){
                    $(btnObj).html("Please wait...");
                },
                onComplete: function(jqXHR, textStatus){
                    $(btnObj).html("Load More");
                }
            });
        });
        
        var bindSocialShareArticle = function () {
            $('.shareIcons').SocialShare({
                onLoad: function (obj) {
                    var title = obj.parents('div.article').find('.card__news-category').text();
                    var url = obj.parents('div.article').find('a').attr('href');
                    var content = obj.parents('div.article').find('.card__news-description').text();
                    $('.rrssb-buttons').rrssb({
                        title: title,
                        url: url,
                        description: content
                    });
                    setTimeout(function () {
                        rrssbInit();
                    }, 10);
                }
            });
        };
        
        var bindSocialUpdatePost = function () {
            $('.editSocialPost').on('click', function (e) {
                e.preventDefault();
                var elem = $(this);
                var url = elem.data('url');
                var popup = window.open(url, '_blank', 'toolbar=no,scrollbars=yes,resizable=false,width=360,height=450');
                popup.focus();

                var intervalId = setInterval(function () {
                    if (popup.closed) {
                        clearInterval(intervalId);
                        var socialId = elem.parents('a').data('id');
                        if ($('#updateSocial' + socialId).data('update') == '1') {
                            $().General_ShowNotification({message: 'Social Post(s) updated successfully.'});
                        }
                    }
                }, 50);

                return;
            });
        };

    };
    return {
        init: function () {
            console.log('attaching events');
            attachEvents();
        }
    };

}(jQuery));

HomeController.Blog = (function ($) {
    
    var attachEvents = function () {
       
        //attach follow blog
        $('a.followBlog').followBlog({
            'onSuccess': function(data, obj){
                var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
                $.fn.General_ShowNotification({message: message + " blog(s) successfully."});   
            },
            'beforeSend': function(obj){
                $(obj).html("Please wait...");
            },
            'onComplete': function(obj){
                ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
            }
        });
        
        //attach follow user
        $('.followUser').followUser({
            'onSuccess': function(data, obj){
                var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
                $.fn.General_ShowNotification({message: message + " user(s) successfully."});   
            },
            'beforeSend': function(obj){
                $(obj).html("Please wait...");
            },
            'onComplete': function(obj){
                ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
            }
        });
        
    };
    
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));