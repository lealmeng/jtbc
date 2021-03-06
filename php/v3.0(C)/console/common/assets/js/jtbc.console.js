var jtbc = window.jtbc || {};
jtbc.console = {
  obj: null,
  param: [],
  parent: jtbc,
  root: null,
  manageURL: 'manage.php',
  managerapiURL: 'managerapi.php',
  materialFolder: 'universal/material/',
  bindEventsByMode: function(argObj)
  {
    var tthis = this;
    var obj = argObj;
    obj.find('*[mode]').each(function(){
      var thisObj = $(this);
      if (thisObj.attr('modebinded') != 'true')
      {
        thisObj.attr('modebinded', 'true');
        if (thisObj.attr('mode') == 'aloneTips')
        {
          if (thisObj.parent().find(this.tagName).length == thisObj.parent().find(this.tagName + '.hide').length) thisObj.removeClass('hide');
        }
        else if (thisObj.attr('mode') == 'ajaxPost')
        {
          thisObj.find('button.submit').on('click', function(){
            var btnObj = $(this);
            thisObj.find('textarea.editor').each(function(){
              try {
                var myEditorObj = $(this);
                var myCurrentEditorIndex = myEditorObj.attr('editor-index');
                var myEditor = tthis.param['editor-instance-' + myCurrentEditorIndex];
                myEditorObj.val(tthis.parent.editor.getHTML(myEditor, myEditorObj.attr('name')));
              } catch(e){};
            });
            if (!btnObj.hasClass('lock'))
            {
              btnObj.addClass('lock');
              btnObj.trigger('before');
              var url = tthis.param['current-main-fileurl'] + thisObj.attr('action');
              $.post(url, thisObj.serialize(), function(data){
                var dataObj = $(data);
                btnObj.attr('msg', dataObj.find('result').attr('message')).removeClass('lock');
                if (dataObj.find('result').attr('status') == '0')
                {
                  if (btnObj.attr('message') == 'custom') btnObj.trigger('message');
                  else
                  {
                    var msgObj = thisObj.find('.form_tips').html('').append('<ul></ul>').find('ul');
                    var message = btnObj.attr('msg').split('|');
                    for (var i in message) msgObj.append('<li>' + message[i] + '</li>');
                  };
                }
                else if (dataObj.find('result').attr('status') == '1')
                {
                  if (btnObj.attr('done') == 'custom') btnObj.trigger('done');
                  else if (typeof(btnObj.attr('doneclick')) != 'undefined') tthis.obj.find(btnObj.attr('doneclick')).trigger('click');
                  else thisObj.find('.form_tips').html('<em>' + btnObj.attr('msg') + '</em>');
                };
              });
            };
          });
        }
        else if (thisObj.attr('mode') == 'att')
        {
          var myObj = thisObj.parent();
          var myEditorString = thisObj.attr('editor');
          if (typeof(myEditorString) != 'undefined')
          {
            var myEditorObj = thisObj.parent().parent().parent().find(myEditorString);
            if (myEditorObj.length == 1)
            {
              var myCurrentEditorIndex = myEditorObj.attr('editor-index');
              var myEditor = tthis.param['editor-instance-' + myCurrentEditorIndex];
              tthis.lib.initAttEvents(myObj, function(argContent){ tthis.parent.editor.insertHTML(myEditor, myEditorString.substring(myEditorString.indexOf('.') + 1), argContent); });
            }
            else tthis.lib.initAttEvents(myObj);
          }
          else tthis.lib.initAttEvents(myObj);
        }
        else if (thisObj.attr('mode') == 'categoryFilter')
        {
          tthis.lib.initCategoryFilterEvents(thisObj);
        }
        else if (thisObj.attr('mode') == 'confirmUrlExec')
        {
          thisObj.on('click', function(){
            var myObj = $(this);
            tthis.lib.popupConfirm(myObj.attr('confirm_text'), myObj.attr('confirm_b2'), myObj.attr('confirm_b3'), function(argObj){
              var btnObj = argObj;
              var url = tthis.param['current-main-fileurl'] + myObj.attr('urlexec');
              $.get(url, function(data){ tthis.loadMainURLRefresh(); btnObj.parent().find('button.b3').click(); });
            });
          });
        }
        else if (thisObj.attr('mode') == 'batchSwitch')
        {
          tthis.lib.initBatchSwitchEvents(thisObj);
        }
        else if (thisObj.attr('mode') == 'editor')
        {
          var myEditorIndex = tthis.param['editor-index'];
          if (isNaN(myEditorIndex)) myEditorIndex = 0;
          var myCurrentEditorIndex = myEditorIndex + 1;
          thisObj.attr('editor-index', myCurrentEditorIndex);
          tthis.param['editor-index'] = myCurrentEditorIndex;
          tthis.param['editor-instance-' + myCurrentEditorIndex] = tthis.parent.editor.replace(thisObj.get(0));
        }
        else if (thisObj.attr('mode') == 'highlightLine')
        {
          thisObj.on('click', function(){
            var myObj = $(this);
            if (this.checked) myObj.parent().parent().parent().addClass('selected');
            else myObj.parent().parent().parent().removeClass('selected');
          });
        }
        else if (thisObj.attr('mode') == 'highlightLineAll')
        {
          thisObj.on('click', function(){
            var myObj = $(this);
            var myForObj = $('input[name=\'' + myObj.attr('forname') + '\']');
            if (this.checked)
            {
              myForObj.each(function(){ if (!this.checked) this.click(); });
            }
            else
            {
              myForObj.each(function(){ if (this.checked) this.click(); });
            };
          });
        }
        else if (thisObj.attr('mode') == 'iconTips')
        {
          thisObj.find('icon').each(function(){ if (!$(this).is(':hidden')) thisObj.attr('icon-hidden', 'no'); });
          if (thisObj.attr('icon-hidden') != 'no') thisObj.append('<span class="ash">' + thisObj.attr('text-null') + '</span>');
        }
        else if (thisObj.attr('mode') == 'pagiGo')
        {
          thisObj.on('click', function(){
            var myObj = $(this);
            var baseLink = myObj.attr('baselink');
            var myLink = baseLink.replace(/(\[\~page\])/g, myObj.parent().find('input.pagenum').val());
            tthis.loadMainURL(tthis.param['current-main-fileurl'] + myLink);
          });
        }
        else if (thisObj.attr('mode') == 'pitchon')
        {
          var pitchon = thisObj.attr('upitchon') || thisObj.attr('pitchon');
          if (pitchon) thisObj.find(pitchon).addClass('on');
        }
        else if (thisObj.attr('mode') == 'inputSwitch')
        {
          if (thisObj.attr('bind') != '1')
          {
            thisObj.attr('bind', '1');
            thisObj.find('b').on('mouseup', function(){
              thisObj.addClass('switch-1');
              thisObj.find('input.val').val('1');
            });
            thisObj.find('u').on('mouseup', function(){
              thisObj.removeClass('switch-1');
              thisObj.find('input.val').val('0');
            });
          };
        }
        else if (thisObj.attr('mode') == 'searchBox')
        {
          tthis.lib.initSearchBoxEvents(thisObj);
        }
        else if (thisObj.attr('mode') == 'shortcut')
        {
          var pointObj = thisObj.parent();
          if (thisObj.attr('parent') == '2') pointObj = pointObj.parent();
          else if (thisObj.attr('parent') == '3') pointObj = pointObj.parent().parent();
          pointObj = pointObj.find(thisObj.attr('shortcut'));
          if (!pointObj.is(':hidden'))
          {
            thisObj.addClass('hand').on('click', function(){ pointObj.trigger('click'); });
          };
        }
        else if (thisObj.attr('mode') == 'singleSelect')
        {
          thisObj.find(thisObj.attr('childtag')).click(function(){
            var childObj = $(this);
            childObj.parent().find(this.tagName).removeClass('on').eq(childObj.index()).addClass('on');
          });
        }
        else if (thisObj.attr('mode') == 'selectOption')
        {
          thisObj.val(thisObj.attr('val'));
        }
        else if (thisObj.attr('mode') == 'tagInput')
        {
          tthis.lib.initTagInputEvents(thisObj);
        }
        else if (thisObj.attr('mode') == 'upFile')
        {
          tthis.lib.initUpFileEvents(thisObj);
        };
      };
    });
  },
  insertHTML: function(argObj, argHTML)
  {
    var tthis = this;
    var obj = argObj;
    var html = argHTML;
    obj.html(html).find('dfn').each(function(){
      var myObj = $(this);
      if (myObj.attr('url'))
      {
        if (myObj.attr('once') == 'true')
        {
          if (tthis.param['dfn-once-' + myObj.attr('onceid')] != 'done')
          {
            tthis.param['dfn-once-' + myObj.attr('onceid')] = 'done';
            tthis.root.prepend('<script type="text/javascript" src="' + tthis.param['root'] + myObj.attr('url') + '"></script>');
          };
        }
        else obj.append('<script type="text/javascript" src="' + tthis.param['root'] + myObj.attr('url') + '"></script>');
      }
      else if (myObj.attr('cssurl')) obj.append('<link rel="stylesheet" href="' + tthis.param['root'] + myObj.attr('cssurl') + '" />');
      else if (myObj.attr('call')) eval(myObj.attr('call'));
    });
    tthis.bindEventsByMode(obj);
  },
  rsetWidthAndHeight: function()
  {
    var tthis = this;
    var windowHeight = $(window).height();
    tthis.obj.find('.container').css({'height': (windowHeight - tthis.obj.find('.topbar').height()) + 'px'});
  },
  loadHTML: function()
  {
    var tthis = this;
    $.get(tthis.manageURL, function(data){
      var dataObj = $(data);
      if (dataObj.find('result').attr('status') == '1') tthis.insertHTML(tthis.root, dataObj.find('result').text());
    });
  },
  loadMainURL: function(argUrl)
  {
    var tthis = this;
    var myURL = argUrl;
    var mainObj = tthis.obj.find('.container').find('.main');
    var loadedCallBack = function()
    {
      mainObj.find('nav').find('u').on('click', function(){
        var thisObj = $(this);
        var myLink = thisObj.attr('link');
        var myGenre = thisObj.attr('genre');
        if (myLink)
        {
          if (myGenre == '|self|') tthis.loadMainURL(myLink);
          else tthis.loadMainURL(tthis.param['root'] + thisObj.attr('genre') + '/' + thisObj.attr('link'));
        };
      });
      mainObj.find('a.link').on('click', function(){
        var thisObj = $(this);
        var managerObj = mainObj.find('.manager');
        if (thisObj.attr('link')) tthis.loadMainURL(tthis.param['current-main-fileurl'] + thisObj.attr('link'));
      });
      tthis.obj.find('nav').on('selectleftmenu', function(){
        var thisObj = $(this);
        var selGenre = thisObj.attr('genre');
        tthis.obj.find('.leftmenu').find('li').removeClass('on').find('span.tit').removeClass('on');
        if (selGenre)
        {
          var selGenreObj = tthis.obj.find('.leftmenu').find('span[genre=\'' + selGenre + '\']');
          if (selGenreObj.length == 1)
          {
            if (!tthis.obj.find('.leftmenu').hasClass('min'))
            {
              selGenreObj.addClass('on');
              tthis.obj.find('.leftmenu').find('li').has(selGenreObj).addClass('on').find('span.tit').first().addClass('open');
              tthis.obj.find('.leftmenu').find('dl').has(selGenreObj).addClass('open').find('span.tit').first().addClass('open');
            };
          };
        };
      }).trigger('selectleftmenu');
    };
    if (tthis.param['load-main-url-lock'] != true)
    {
      tthis.param['load-main-url-lock'] = true;
      tthis.param['load-main-url-waiting'] = setTimeout(function(){
        mainObj.parent().find('.waiting').addClass('on');
      }, 500);
      $.ajax({
        url: myURL,
        type: 'get',
        success: function(data)
        {
          var dataObj = $(data);
          if (dataObj.find('result').attr('status') == '1')
          {
            var showURL = myURL;
            var rootPath = tthis.param['root'];
            if (showURL.substr(0, rootPath.length) == rootPath) showURL = '/' + showURL.substr(rootPath.length);
            tthis.param['load-main-url'] = myURL;
            location.href = '#' + showURL;
            tthis.insertHTML(mainObj, dataObj.find('result').text());
            loadedCallBack();
            tthis.param['load-main-url-lock'] = false;
            clearTimeout(tthis.param['load-main-url-waiting']);
            mainObj.parent().find('.waiting').removeClass('on');
          }
          else this.error();
        },
        error: function()
        {
          var errorURL = this.url;
          tthis.param['load-main-url-lock'] = false;
          tthis.lib.popupAlert(mainObj.attr('urlerror') + '<em><a href="' + tthis.parent.htmlEncode(errorURL) + '" target="_blank">' + tthis.parent.htmlEncode(errorURL) + '</a></em>', mainObj.attr('ikown'), function(){
            clearTimeout(tthis.param['load-main-url-waiting']);
            mainObj.parent().find('.waiting').removeClass('on');
          });
        }
      });
    };
  },
  loadMainURLRefresh: function()
  {
    var tthis = this;
    tthis.loadMainURL(tthis.param['load-main-url']);
  },
  initConsole: function()
  {
    var tthis = this;
    tthis.obj = tthis.root.find('.console');
    tthis.obj.find('.topbar').find('span.menu').click(function(){
      var thisObj = $(this);
      if (thisObj.parent().hasClass('min'))
      {
        thisObj.parent().removeClass('min');
        tthis.obj.find('.leftmenu').removeClass('min');
        tthis.obj.find('.leftmenu').find('span.tit.t1').removeAttr('title');
        tthis.obj.find('nav').trigger('selectleftmenu');
      }
      else
      {
        thisObj.parent().addClass('min');
        tthis.obj.find('.leftmenu').addClass('min').find('li').removeClass('on');
        tthis.obj.find('.leftmenu').find('span.tit').removeClass('open');
        tthis.obj.find('.leftmenu').find('dl.open').removeClass('open');
        tthis.obj.find('.leftmenu').find('span.tit.t1').each(function(){ $(this).attr('title', $(this).attr('mytitle')); });
      };
    });
    tthis.obj.find('.topbar').find('account').find('li.l1').click(function(){
      var thisObj = $(this);
      if (thisObj.attr('loading') != 'true')
      {
        thisObj.attr('loading', 'true');
        $.get(tthis.manageURL + '?type=modifypassword', function(data){
          var dataObj = $(data);
          if (dataObj.find('result').attr('status') == '1')
          {
            var pageObj = tthis.lib.popupPage(dataObj.find('result').text());
            var tinyformObj = pageObj.find('.tinyform');
            tinyformObj.find('button.b2').click(function(){
              var thisObj = $(this);
              if (!thisObj.hasClass('lock'))
              {
                thisObj.addClass('lock');
                var formObj = thisObj.parent().parent();
                var url = tthis.manageURL + formObj.attr('action');
                $.post(url, formObj.serialize(), function(data){
                  var dataObj = $(data);
                  thisObj.removeClass('lock');
                  formObj.find('span.tips').addClass('h').html(dataObj.find('result').attr('message'));
                  if (dataObj.find('result').attr('status') == '1') formObj.each(function(){ this.reset(); });
                });
              };
            });
          };
          thisObj.attr('loading', 'false');
        });
      };
    });
    tthis.obj.find('.topbar').find('account').find('li.l2').click(function(){ tthis.obj.find('.topbar').find('logout').trigger('click'); });
    tthis.obj.find('.topbar').find('lang').each(function(){
      var thisObj = $(this);
      $.get(tthis.manageURL + '?type=getlang', function(data){
        var dataObj = $(data);
        if (dataObj.find('result').attr('status') == '1')
        {
          thisObj.html(dataObj.find('result').text());
          thisObj.find('li').on('click', function(){
            var thisObj = $(this);
            if (thisObj.attr('loading') != 'true')
            {
              thisObj.attr('loading', 'true');
              $.get(tthis.manageURL + '?type=action&action=setlang&lang=' + encodeURIComponent(thisObj.attr('val')), function(data){
                var dataObj = $(data);
                thisObj.attr('loading', 'false');
                if (dataObj.find('result').attr('status') == '1')
                {
                  tthis.obj.find('nav').find('u:last').trigger('click');
                  thisObj.parent().parent().find('b').find('flag').attr('class', 'f' + thisObj.attr('val')).nextAll('span').html(tthis.parent.htmlEncode(thisObj.attr('text')));
                };
              });
            };
          });
        };
      });
    });
    tthis.obj.find('.topbar').find('logout').click(function(){
      var thisObj = $(this);
      tthis.lib.popupConfirm(thisObj.attr('confirm_text'), thisObj.attr('confirm_b2'), thisObj.attr('confirm_b3'), function(){ $.get(tthis.manageURL + '?type=action&action=logout', function(data){ location.href = './'; }); });
    });
    tthis.obj.find('.leftmenu').find('span.tit').click(function(){
      var thisObj = $(this);
      if (!tthis.obj.find('.leftmenu').hasClass('min'))
      {
        if (thisObj.next().hasClass('open'))
        {
          thisObj.removeClass('open');
          thisObj.next().removeClass('open');
        }
        else
        {
          thisObj.addClass('open');
          thisObj.next().addClass('open');
        };
      };
      if (thisObj.attr('link')) tthis.loadMainURL(tthis.param['root'] + thisObj.attr('genre') + '/' + thisObj.attr('link'));
    });
    var defURL = tthis.obj.find('.container').find('.main').attr('def');
    var getLocURL = function()
    {
      var locURL = '';
      if (location.href.indexOf('#') != -1)
      {
        locURL = location.href.substr(location.href.indexOf('#') + 1);
        if (locURL.substr(0, 1) == '/') locURL = tthis.param['root'] + locURL.substr(1);
      };
      return locURL;
    };
    tthis.loadMainURL(getLocURL() || defURL);
    tthis.rsetWidthAndHeight();
    $(window).on('resize', function(){ tthis.rsetWidthAndHeight(); });
    $(window).on('hashchange', function(){
      var locURL = getLocURL();
      if (locURL != '' && locURL != tthis.param['load-main-url']) tthis.loadMainURL(locURL);
    });
  },
  initLogin: function()
  {
    var tthis = this;
    var myObj = $('.login');
    myObj.find('.button .b1').click(function(){
      var thisObj = $(this);
      if (!thisObj.hasClass('lock'))
      {
        thisObj.addClass('lock');
        myObj.find('.message').html(thisObj.attr('loading'));
        var formValue = myObj.find('form').serialize();
        $.post(tthis.manageURL + '?type=action&action=login', formValue, function(data){
          var dataObj = $(data);
          thisObj.removeClass('lock');
          if (dataObj.find('result').attr('status') != '1')
          {
            myObj.find('.message').html(dataObj.find('result').attr('message'));
          }
          else
          {
            tthis.loadHTML();
          };
        });
      };
    });
  },
  ready: function()
  {
    var tthis = this;
    tthis.root = $('#console');
    tthis.param['root'] = tthis.root.attr('root');
    tthis.loadHTML();
  }
};

jtbc.console.lib = {
  param: [],
  parent: jtbc.console,
  dragSort: function(argObj, argChild, argDragName, argCallBack, argCallBackDone)
  {
    var tthis = this;
    var myObj = argObj;
    var myChild = argChild;
    var myDragName = argDragName;
    var myCallBack = argCallBack;
    var myCallBackdDone = argCallBackDone;
    myObj.on({
      mousemove: function(ev)
      {
        var thisObj = $(this);
        var noselectObj = thisObj.find(myChild + '.noselect');
        if (noselectObj.length == 1)
        {
          var targetObj = null;
          if (ev.pageY < noselectObj.offset().top || ev.pageY > (noselectObj.offset().top + noselectObj.height()))
          {
            thisObj.find(myChild).each(function(){
              var myLiObj = $(this);
              if (ev.pageY < (myLiObj.offset().top + myLiObj.height()))
              {
                if (!myLiObj.hasClass('.noselect')) targetObj = myLiObj;
                return false;
              };
            });
          };
          if (targetObj != null)
          {
            thisObj.attr('change', 'true');
            if (targetObj.index() < noselectObj.index()) targetObj.before(noselectObj);
            else targetObj.after(noselectObj);
            myCallBack();
          };
        };
      },
      mouseup: function()
      {
        var thisObj = $(this);
        $(document.body).removeClass('noselect');
        thisObj.find(myChild + '.noselect').removeClass('noselect');
        if (thisObj.attr('change') == 'true')
        {
          myCallBackdDone();
          thisObj.attr('change', 'false');
        };
      },
      mouseover: function()
      {
        var thisObj = $(this);
        clearTimeout(tthis.param[thisObj.attr('ds')]);
      },
      mouseout: function()
      {
        var thisObj = $(this);
        tthis.param[thisObj.attr('ds')] = setTimeout(function(){ thisObj.trigger('mouseup'); }, 100);
      }
    });
    myObj.on('mousedown', myChild + ' ' + myDragName, function(){
      var thisObj = $(this);
      var itemObj = thisObj.parent();
      myObj.attr('ds', 'rnd' + Math.floor(Math.random() * 1000000 + 1000000));
      $(document.body).addClass('noselect');
      itemObj.find(myChild).removeClass('noselect');
      itemObj.addClass('noselect');
    });
  },
  fileUp: function(argObj, argFileUpObj, argFileUpURL, argCallBack, argCallBackItem)
  {
    var tthis = this;
    var myObj = argObj;
    var fileUpObj = argFileUpObj;
    var fileUpURL = argFileUpURL;
    var callback = argCallBack;
    var callbackItem = argCallBackItem;
    var fileupload = {
      files: null,
      filecount: 0,
      fileindex: 0,
      formatFileInfo: function(argFile)
      {
        var fileSize = 0;
        var file = argFile;
        if (file.size > 1024 * 1024) fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else if (file.size > 1024) fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
        else fileSize = file.size + 'B';
        var fileItem = $('<div class="item"></div>');
        fileItem.append('<span class="filename">' + file.name + '</span>');
        fileItem.append('<span class="filesize">' + fileSize + '</span>');
        fileItem.append('<span class="bar"></span>');
        return fileItem;
      },
      uploadNextFile: function()
      {
        var index = this.fileindex;
        tthis.fileUpSingle(this.files[index], fileUpURL, function(result){
          var upSucceed = false;
          var upMessage = '';
          var resultStatus = result.find('result').attr('status');
          if (resultStatus == '1') upSucceed = true;
          else if (resultStatus == '0') upMessage = result.find('result').attr('message');
          if (upSucceed == false)
          {
            fileUpObj.find('div.item').eq(fileupload.fileindex).addClass('error').attr('title', upMessage).on('dblclick', function(){ $(this).fadeOut(); });
          };
          if (typeof(callbackItem) == 'function') callbackItem(upSucceed, result, fileupload.fileindex);
          fileupload.fileindex += 1;
          if (fileupload.fileindex < fileupload.filecount) fileupload.uploadNextFile();
          else callback();
        }, function(percent) { fileUpObj.find('div.item').eq(fileupload.fileindex).find('span.bar').css({'width': percent + '%'}); });
      },
      startUpload: function()
      {
        this.fileindex = 0;
        this.uploadNextFile();
      }
    };
    if (myObj.files.length >= 1)
    {
      fileupload.files = myObj.files;
      fileupload.filecount = myObj.files.length;
      for (var k = 0; k < myObj.files.length; k ++)
      {
        fileUpObj.append(fileupload.formatFileInfo(myObj.files[k]));
      };
      fileupload.startUpload();
    };
  },
  fileUpSingle: function(argFile, argFileUpURL, argDoneCallBack, argProgressCallBack)
  {
    var tthis = this;
    var file = argFile;
    var fileUpURL = argFileUpURL;
    var doneCallback = argDoneCallBack;
    var progressCallBack = argProgressCallBack;
    if (typeof file == 'object')
    {
      var fileSize = file.size;
      var chunkSize = 1024 * 1024;
      var chunkCount = Math.floor(fileSize / chunkSize);
      var chunkCurrentIndex = 0;
      var chunkParam = '';
      var timeStringRandom = tthis.parent.parent.getTimeStringAndRandom();
      var chunkUpload = function()
      {
        if (chunkCurrentIndex <= chunkCount)
        {
          var fileStart = chunkCurrentIndex * chunkSize;
          var fileEnd = Math.min(fileSize, fileStart + chunkSize);
          var myFormData = new FormData();
          myFormData.append('file', file.slice(fileStart, fileEnd), file.name);
          myFormData.append('fileSize', fileSize);
          myFormData.append('chunkCount', chunkCount);
          myFormData.append('chunkCurrentIndex', chunkCurrentIndex);
          myFormData.append('chunkParam', chunkParam);
          myFormData.append('timeStringRandom', timeStringRandom);
          var myXMLHttpRequest = new XMLHttpRequest();
          myXMLHttpRequest.upload.addEventListener('progress', function(evt){
            var requestPercent = Math.round(chunkCurrentIndex / (chunkCount + 1) * 100 + (1 / (chunkCount + 1)) * Math.round(evt.loaded / evt.total) * 100);
            progressCallBack(requestPercent);
          }, false);
          myXMLHttpRequest.addEventListener('load', function(evt){
            var dataObj = $(evt.target.responseXML);
            if (dataObj.find('result').attr('status') == '-1')
            {
              chunkCurrentIndex += 1;
              chunkParam = dataObj.find('result').attr('param');
              chunkUpload();
            }
            else doneCallback(dataObj);
          }, false);
          myXMLHttpRequest.open('POST', fileUpURL);
          myXMLHttpRequest.send(myFormData);
        };
      };
      chunkUpload();
    };
  },
  getCheckBoxValue: function(argObj)
  {
    var value = '';
    var myObj = argObj;
    myObj.each(function(){ value += $(this).val() + ','; });
    if (value.length > 0) value = value.substring(0, value.length - 1);
    return value;
  },
  initAttEvents: function(argObj, argInsertFun)
  {
    var tthis = this;
    var myObj = argObj;
    var canInsert = true;
    var insertFun = argInsertFun;
    var attObj = myObj.find('.att');
    var attValObj = attObj.find('input[name=\'' + attObj.attr('name') + '\']');
    if (typeof(insertFun) == 'undefined') canInsert = false;
    var resetAttInputVal = function()
    {
      var attArray = new Array();
      attObj.find('ul').find('li').each(function(){
        var thisObj = $(this);
        if (!thisObj.hasClass('del'))
        {
          attArray[attArray.length] = thisObj.attr('param');
        };
      });
      attValObj.val(JSON.stringify(attArray));
    };
    var appendNewAttLi = function(argParam)
    {
      var param = argParam;
      var paramArray = JSON.parse(param);
      var ulObj = attObj.find('ul');
      ulObj.find('li.null').remove();
      ulObj.append('<li param="' + tthis.parent.parent.htmlEncode(param) + '"><em class="filetype move ' + tthis.parent.parent.htmlEncode(paramArray['filetype']) + '">' + tthis.parent.parent.htmlEncode(paramArray['filetype']) + '</em><span class="tit">' + tthis.parent.parent.htmlEncode(paramArray['filename']) + '</span><span class="size">' + tthis.parent.parent.htmlEncode(paramArray['filesizetext']) + '</span><icons><icon class="insert" title="' + ulObj.attr('text-insert') + '"></icon><icon class="delete" title="' + ulObj.attr('text-delete') + '"></icon></icons></li>');
      if (canInsert == false) ulObj.find('icon.insert').remove();
      resetAttInputVal();
    };
    var initAttValLi = function(){
      var attValObjValue = attValObj.val();
      if (attValObjValue)
      {
        allAttObj = JSON.parse(attValObjValue);
        for (var i in allAttObj) appendNewAttLi(allAttObj[i]);
      };
    }();
    tthis.dragSort(attObj.find('ul'), 'li', 'em.filetype', function(){ resetAttInputVal(); });
    attObj.find('ul').on('click', 'li span.tit', function(){
      var thisObj = $(this);
      var liObj = thisObj.parent();
      var paramArray = JSON.parse(liObj.attr('param'));
      var filetype = paramArray['filetype'];
      var fileURL = paramArray['fileurl'];
      if (!tthis.parent.parent.isAbsoluteURL(fileURL)) fileURL = attObj.attr('folder') + fileURL;
      var pageObj = tthis.previewAtt(filetype, paramArray['filename'], fileURL, liObj.parent().attr('text-preview-link'), '1');
      pageObj.find('input.title').on('input', function(){
        paramArray['filename'] = $(this).val();
        thisObj.html(tthis.parent.parent.htmlEncode(paramArray['filename']));
        liObj.attr('param', JSON.stringify(paramArray));
        resetAttInputVal();
      });
    });
    attObj.find('ul').on('click', 'li icon.insert', function(){
      var thisObj = $(this);
      var liObj = thisObj.parent().parent();
      var paramArray = JSON.parse(liObj.attr('param'));
      var filetype = paramArray['filetype'];
      if (filetype == 'jpg' || filetype == 'gif' || filetype == 'png')
      {
        insertFun('<img src="' + tthis.parent.parent.htmlEncode(paramArray['fileurl']) + '" alt="" />');
      }
      else if (filetype == 'mp4')
      {
        insertFun('<video controls="controls" width="480" height="270"><source src="' + tthis.parent.parent.htmlEncode(paramArray['fileurl']) + '" type="video/mp4" /></video>');
      }
      else
      {
        insertFun('<a href="' + tthis.parent.parent.htmlEncode(paramArray['fileurl']) + '" target="_blank">' + tthis.parent.parent.htmlEncode(paramArray['filename']) + '</a>');
      };
    });
    attObj.find('ul').on('click', 'li icon.delete', function(){
      var thisObj = $(this);
      var liObj = thisObj.parent().parent();
      if (!liObj.hasClass('del')) liObj.addClass('del');
      else liObj.removeClass('del');
      resetAttInputVal();
    });
    attObj.find('div.icons').find('icon.db').on('click', function(){
      var thisObj = $(this);
      tthis.loadSelectMaterialPage('multiple', function(argFileInfo){
        var fileInfo = argFileInfo;
        var fileAry = JSON.parse(fileInfo);
        for (var i in fileAry)
        {
          var currentFile = JSON.parse(fileAry[i]);
          var currentFileURL = currentFile['fileurl'];
          if (!tthis.parent.parent.isAbsoluteURL(currentFileURL)) currentFile['fileurl'] = thisObj.attr('root') + tthis.parent.materialFolder + currentFileURL;
          appendNewAttLi(JSON.stringify(currentFile));
        };
      });
    });
    attObj.find('div.icons').find('icon.upload').on('click', function(){
      var thisObj = $(this);
      if (!thisObj.hasClass('lock')) attObj.find('input.upload').trigger('click');
    });
    attObj.find('input.upload').on('change', function(){
      var thisObj = $(this);
      var url = tthis.parent.param['current-main-fileurl'] + thisObj.attr('action');
      if (thisObj.attr('uploading') != 'true')
      {
        thisObj.attr('uploading', 'true');
        myObj.find('.fileup').find('.item').remove();
        attObj.find('div.upload').addClass('lock');
        tthis.fileUp(this, myObj.find('.fileup'), url, function(){
          attObj.find('div.upload').removeClass('lock');
          attObj.find('input.upload').attr('uploading', 'false').val('');
        }, function(argUpSucceed, argUpResult, argFileIndex){
          var upSucceed = argUpSucceed;
          var upResult = argUpResult;
          var fileIndex = argFileIndex;
          if (upSucceed == true)
          {
            var param = upResult.find('result').attr('param');
            myObj.find('.fileup').find('.item').eq(fileIndex).fadeOut();
            appendNewAttLi(param);
          };
        });
      };
    });
  },
  initBatchSwitchEvents: function(argObj)
  {
    var tthis = this;
    var myObj = argObj;
    myObj.find('span.ok').click(function(){
      var thisObj = $(this);
      var batch = thisObj.parent().find('select.batch').val();
      if (batch != 'null')
      {
        tthis.popupConfirm(thisObj.attr('confirm_text'), thisObj.attr('confirm_b2'), thisObj.attr('confirm_b3'), function(argObj){
          var btnObj = argObj;
          var ids = tthis.getCheckBoxValue(myObj.parent().parent().find('input.id:checked'));
          var url = tthis.parent.param['current-main-fileurl'] + '?type=action&action=batch';
          url += '&batch=' + encodeURIComponent(batch) + '&ids=' + encodeURIComponent(ids);
          $.get(url, function(data){ tthis.parent.loadMainURLRefresh(); btnObj.parent().find('button.b3').click(); });
        });
      };
    });
  },
  initCategoryFilterEvents: function(argObj)
  {
    var tthis = this;
    var myObj = argObj;
    myObj.find('icon.category').on('click', function(){
      var thisObj = $(this);
      if (thisObj.attr('loading') != 'true')
      {
        thisObj.attr('loading', 'true');
        var url = tthis.parent.param['current-main-fileurl'] + thisObj.attr('url') + '&fid=' + encodeURIComponent(thisObj.attr('fid'));
        $.get(url, function(data){
          var dataObj = $(data);
          if (dataObj.find('result').attr('status') == '1')
          {
            thisObj.attr('loading', 'false');
            var pageObj = tthis.parent.lib.popupPage(dataObj.find('result').text());
            pageObj.find('ul.list').find('li:not(.alonetips)').on('click', function(){
              var thisObj = $(this);
              pageObj.find('span.close').trigger('click');
              tthis.parent.loadMainURL(tthis.parent.param['current-main-fileurl'] + thisObj.attr('link'));
            });
          };
        });
      };
    });
  },
  initUpFileEvents: function(argObj)
  {
    var tthis = this;
    var myObj = argObj;
    myObj.find('button.upbtn').click(function(){
      var thisObj = $(this);
      if (!thisObj.hasClass('lock') && !thisObj.hasClass('show-0')) thisObj.parent().find('input.upfiles').trigger('click');
    });
    myObj.find('input.fileurl').on('dblclick', function(){
      var thisObj = $(this);
      var currentFileURL = thisObj.val();
      if (currentFileURL && thisObj.attr('text-preview-title'))
      {
        if (!tthis.parent.parent.isAbsoluteURL(currentFileURL)) currentFileURL = tthis.parent.param['current-main-path'] + currentFileURL;
        tthis.previewAtt(null, thisObj.attr('text-preview-title'), currentFileURL, thisObj.attr('text-preview-link'), '0');
      };
    });
    myObj.find('input.upfiles').on('change', function(){
      var thisObj = $(this);
      var btnObj = thisObj.parent().find('button.upbtn');
      var url = tthis.parent.param['current-main-fileurl'] + thisObj.attr('action');
      if (thisObj.attr('uploading') != 'true')
      {
        thisObj.attr('uploading', 'true');
        btnObj.addClass('lock').html(btnObj.attr('uploading'));
        if (this.files.length == 1)
        {
          tthis.fileUpSingle(this.files[0], url, function(result){
            thisObj.val('').attr('uploading', 'false');
            btnObj.removeClass('lock').html(btnObj.attr('text'));
            if (result.find('result').attr('status') == '1')
            {
              var upsourceArray = new Object();
              var param = result.find('result').attr('param');
              var paramArray = JSON.parse(param);
              upsourceArray.fileurl = paramArray['fileurl'];
              upsourceArray.uploadid = paramArray['uploadid'];
              thisObj.parent().parent().find('input.upsource').val(JSON.stringify(upsourceArray));
              thisObj.parent().parent().find('input.fileurl').val(paramArray['fileurl']);
            }
            else
            {
              if (thisObj.attr('alert') == 'mini') tthis.popupMiniAlert(result.find('result').attr('message'));
              else tthis.popupAlert(result.find('result').attr('message'), thisObj.attr('text-ok'), function(){});
            };
            btnObj.parent().find('span.bar').css({'width': '0%'});
          }, function(percent) { btnObj.parent().find('span.bar').css({'width': percent + '%'}); });
        };
      };
    });
    myObj.find('input.upsource').each(function(){
      var thisObj = $(this);
      if (thisObj.val())
      {
        var paramArray = JSON.parse(thisObj.val());
        thisObj.parent().find('input.fileurl').val(paramArray['fileurl']);
      };
    });
  },
  initSearchBoxEvents: function(argObj)
  {
    var tthis = this;
    var myObj = argObj;
    myObj.find('input.search').on('click', function(){
      var thisObj = $(this);
      var parmname = thisObj.attr('parmname') || 'keyword';
      var keyword = thisObj.parent().find('input.keyword').val();
      var url = tthis.parent.param['current-main-fileurl'] + thisObj.parent().attr('action') + '&' + parmname + '=' + encodeURIComponent(keyword);
      tthis.parent.loadMainURL(url);
    });
  },
  initTagInputEvents: function(argObj)
  {
    var tthis = this;
    var myObj = argObj;
    myObj.on('init', function(){
      var thisObj = $(this);
      var currentVal = myObj.find('input.val').val();
      if (currentVal)
      {
        var currentValArray = JSON.parse(currentVal);
        for (var i in currentValArray) thisObj.find('input.tag').val(currentValArray[i]).trigger('insert');
      };
    });
    myObj.on('click', function(){
      var thisObj = $(this);
      thisObj.find('input.tag').trigger('focus');
    });
    myObj.on('selectPrevHint', function(){
      var thisObj = $(this);
      var hintsObj = thisObj.find('.hints');
      var currentOnIndex = hintsObj.find('li.on').index();
      var currentPrevIndex = currentOnIndex - 1;
      if (currentOnIndex < 0) currentPrevIndex = hintsObj.find('li').length - 1;
      hintsObj.find('li').removeClass('on').eq(currentPrevIndex).addClass('on');
      thisObj.find('input.tag').val(hintsObj.find('li.on').text());
    });
    myObj.on('selectNextHint', function(){
      var thisObj = $(this);
      var hintsObj = thisObj.find('.hints');
      var currentOnIndex = hintsObj.find('li.on').index();
      var currentNextIndex = currentOnIndex + 1;
      if (currentOnIndex >= hintsObj.find('li').length) currentNextIndex = 0;
      hintsObj.find('li').removeClass('on').eq(currentNextIndex).addClass('on');
      thisObj.find('input.tag').val(hintsObj.find('li.on').text());
    });
    myObj.on('updateTag', function(){
      var thisObj = $(this);
      var currentTag = [];
      thisObj.find('div.tags').find('span').each(function(){ currentTag.push($(this).find('em').text()); });
      myObj.find('input.val').val(JSON.stringify(currentTag));
      myObj.find('.hints').css({'top': (myObj.outerHeight() - 2) + 'px'});
    });
    myObj.find('.hints').on('click', 'li', function(){
      var thisObj = $(this);
      myObj.find('input.tag').val(thisObj.text()).trigger('insert');
    });
    myObj.find('div.tags').on('click', 'span', function(){
      var thisObj = $(this);
      thisObj.remove();
      myObj.trigger('updateTag');
    });
    myObj.find('input.tag').on('input', function(){
      var thisObj = $(this);
      var thisObjVal = thisObj.val();
      if (thisObj.attr('lock') != 'true')
      {
        thisObj.css({'width': '60px'}).css({'width': (this.scrollWidth + 20) + 'px'});
        myObj.find('.hints').css({'top': (myObj.outerHeight() - 2) + 'px'});
        if (myObj.attr('var1') == '1')
        {
          if (!thisObjVal) myObj.find('.hints').removeClass('on');
          else
          {
            thisObj.attr('lock', 'true');
            var url = tthis.parent.param['current-main-fileurl'] + '?type=getTagHints&key=' + encodeURIComponent(thisObjVal);
            $.get(url, function(data){
              var dataObj = $(data);
              if (dataObj.find('result').attr('status') == '1')
              {
                if (dataObj.find('result').attr('param') == thisObjVal)
                {
                  myObj.find('.hints').html(dataObj.find('result').text()).addClass('on');
                };
              };
              thisObj.attr('lock', 'false');
            });
          };
        };
      };
    });
    myObj.find('input.tag').on('keyup', function(e){
      var thisObj = $(this);
      if (e.which == 13) thisObj.trigger('insert');
      else if (e.which == 38) myObj.trigger('selectPrevHint');
      else if (e.which == 40) myObj.trigger('selectNextHint');
    });
    myObj.find('input.tag').on('keydown', function(e){
      if (e.which == 13) return false;
    });
    myObj.find('input.tag').on('insert', function(){
      var thisObj = $(this);
      var thisObjVal = thisObj.val();
      var parentObj = thisObj.parent();
      if (thisObjVal)
      {
        var thisObjValMatch = false;
        parentObj.find('span').each(function(){
          var spanObj = $(this);
          if (spanObj.find('em').text() == thisObjVal) thisObjValMatch = true;
        });
        thisObj.val('');
        parentObj.parent().find('.hints').removeClass('on');
        if (thisObjValMatch == false) thisObj.before('<span><em>' + tthis.parent.parent.htmlEncode(thisObjVal) + '</em><x></x></span>');
        myObj.trigger('updateTag');
      };
    });
    myObj.find('input.tag').on('focus', function(){ myObj.addClass('focus'); });
    myObj.find('input.tag').on('blur', function(){ myObj.removeClass('focus'); });
    myObj.trigger('init');
  },
  initMainCommon: function(argObj)
  {
    var myObj = argObj;
    myObj.obj = myObj.parent.obj.find('.manager');
    try { myObj.parent.parent.editor.baseHref = myObj.obj.attr('folder'); } catch(e){};
    myObj.parent.param['current-main-path'] = myObj.parent.param['root'] + myObj.obj.attr('genre') + '/';
    myObj.parent.param['current-main-fileurl'] = myObj.param['fileurl'] = myObj.parent.param['current-main-path'] + myObj.obj.attr('filename');
    var myModule = myObj.obj.attr('module');
    var myModuleInit = 'init' + myModule.substring(0, 1).toUpperCase() + myModule.substring(1);
    if (myObj.hasOwnProperty(myModuleInit)) eval('myObj.' + myModuleInit + '();');
  },
  loadSelectMaterialPage: function(argMode, argCallBack)
  {
    var tthis = this;
    var mode = argMode;
    var callback = argCallBack;
    var url = tthis.parent.param['root'] + tthis.parent.materialFolder + tthis.parent.managerapiURL + '?type=list&mode=' + encodeURIComponent(mode);
    if (tthis.param['select-material-loading'] != true)
    {
      tthis.param['select-material-loading'] = true;
      $.get(url, function(data){
        var dataObj = $(data);
        if (dataObj.find('result').attr('status') == '1')
        {
          var pageObj = tthis.popupPage('');
          tthis.parent.insertHTML(pageObj.find('.content'), dataObj.find('result').text());
          pageObj.on('reload', '.substance', function(){
            var thisObj = $(this);
            if (tthis.param['select-material-loading'] != true)
            {
              tthis.param['select-material-loading'] = true;
              var reloadURL = url + '&get=reload&' + thisObj.attr('reloadparam');
              $.get(reloadURL, function(data){
                var dataObj = $(data);
                if (dataObj.find('result').attr('status') == '1')
                {
                  tthis.parent.insertHTML(pageObj.find('.content'), dataObj.find('result').text());
                  tthis.param['select-material-loading'] = false;
                };
              });
            };
          });
          pageObj.on('click', 'button.b2', function(){
            pageObj.find('span.close').trigger('click');
            callback(pageObj.find('input[name=\'material\']').val());
          });
          tthis.param['select-material-loading'] = false;
        };
      });
    };
  },
  previewAtt: function(argFileType, argFileName, argFileURL, argPreviewLinkText, argMode)
  {
    var tthis = this;
    var fileType = argFileType;
    var fileName = argFileName;
    var fileURL = argFileURL;
    var previewLinkText = argPreviewLinkText;
    var mode = argMode;
    var previewHTML = '';
    if (fileType == null)
    {
      var fileURLAry = fileURL.split('.');
      fileType = fileURLAry[fileURLAry.length - 1];
    };
    if (mode == '0') previewHTML += '<div class="title">' + tthis.parent.parent.htmlEncode(fileName) + '</div>';
    else if (mode == '1') previewHTML += '<div class="title"><input type="text" class="title" value="' + tthis.parent.parent.htmlEncode(fileName) + '" /></div>';
    if (fileType == 'jpg' || fileType == 'gif' || fileType == 'png')
    {
      previewHTML += '<div class="attPreview"><img class="item" src="' + tthis.parent.parent.htmlEncode(fileURL) + '" /></div>';
    }
    else
    {
      previewHTML += '<div class="attPreview"><a class="item" href="' + tthis.parent.parent.htmlEncode(fileURL) + '" target="_blank">' + tthis.parent.parent.htmlEncode(previewLinkText) + '</a></div>';
    };
    var pageObj = tthis.popupPage(previewHTML);
    return pageObj;
  },
  popupAlert: function(argWord, argB2, argCallBack)
  {
    var tthis = this;
    var word = argWord;
    var b2 = argB2;
    var callback = argCallBack;
    var rootObj = tthis.parent.root;
    if (rootObj.find('.popup_mask').length == 0) rootObj.append('<div class="popup_mask"></div>');
    if (rootObj.find('.popup_alert').length == 1) rootObj.find('.popup_alert').remove();
    rootObj.append('<div class="popup_alert"><div class="title"></div><div class="word"></div><div class="button"><button class="b2">' + b2 + '</button></div></div>');
    var alertObj = rootObj.find('.popup_alert');
    var maskObj = rootObj.find('.popup_mask');
    alertObj.find('.word').html(word);
    alertObj.find('button.b2').click(function(){
      callback($(this));
      maskObj.removeClass('on');
      alertObj.removeClass('on');
    });
    tthis.param['popup-alert-timeout'] = setTimeout(function(){
      maskObj.addClass('on');
      alertObj.addClass('on');
    }, 100);
    return alertObj;
  },
  popupMiniAlert: function(argWord)
  {
    var tthis = this;
    var word = argWord;
    var rootObj = tthis.parent.root;
    rootObj.find('.popup_minialert').remove();
    rootObj.append('<div class="popup_minialert"><div class="word"></div></div>');
    var minialertObj = rootObj.find('.popup_minialert');
    minialertObj.find('.word').html(word);
    clearTimeout(tthis.param['popup-minialert-timeout']);
    clearTimeout(tthis.param['popup-minialert-disappear-timeout']);
    tthis.param['popup-minialert-timeout'] = setTimeout(function(){
      minialertObj.addClass('on');
    }, 100);
    tthis.param['popup-minialert-disappear-timeout'] = setTimeout(function(){
      minialertObj.removeClass('on');
    }, 2000);
    return minialertObj;
  },
  popupConfirm: function(argWord, argB2, argB3, argCallBack)
  {
    var tthis = this;
    var word = argWord;
    var b2 = argB2;
    var b3 = argB3;
    var callback = argCallBack;
    var rootObj = tthis.parent.root;
    if (rootObj.find('.popup_mask').length == 0) rootObj.append('<div class="popup_mask"></div>');
    if (rootObj.find('.popup_confirm').length == 1) rootObj.find('.popup_confirm').remove();
    rootObj.append('<div class="popup_confirm"><div class="title"></div><div class="word"></div><div class="button"><button class="b3">' + b3 + '</button><button class="b2">' + b2 + '</button></div></div>');
    var confirmObj = rootObj.find('.popup_confirm');
    var maskObj = rootObj.find('.popup_mask');
    confirmObj.find('.word').html(word);
    confirmObj.find('button.b2').click(function(){
      var thisObj = $(this);
      if (!thisObj.hasClass('lock'))
      {
        thisObj.addClass('lock');
        callback($(this));
      };
    });
    confirmObj.find('button.b3').click(function(){
      maskObj.removeClass('on');
      confirmObj.removeClass('on');
    });
    tthis.param['popup-confirm-timeout'] = setTimeout(function(){
      maskObj.addClass('on');
      confirmObj.addClass('on');
    }, 100);
    return confirmObj;
  },
  popupPage: function(argHTML)
  {
    var tthis = this;
    var html = argHTML;
    var rootObj = tthis.parent.root;
    if (rootObj.find('.popup_mask').length == 0) rootObj.append('<div class="popup_mask"></div>');
    if (rootObj.find('.popup_page').length == 1) rootObj.find('.popup_page').remove();
    rootObj.append('<div class="popup_page"><span class="close"></span><div class="content"></div></div>');
    var pageObj = rootObj.find('.popup_page');
    var maskObj = rootObj.find('.popup_mask');
    pageObj.find('div.content').html(html);
    tthis.parent.bindEventsByMode(pageObj);
    pageObj.find('span.close').click(function(){
      maskObj.removeClass('on');
      pageObj.removeClass('on');
    });
    var checkPopupSize = function()
    {
      pageObj.css({'min-width': 'auto', 'min-height': 'auto'});
      var myWidth = Math.round(pageObj.width());
      var myHeight = Math.round(pageObj.height());
      if (myWidth % 2 == 1) myWidth = myWidth + 1;
      if (myHeight % 2 == 1) myHeight = myHeight + 1;
      if (myWidth != 0 && myHeight != 0) pageObj.css({'min-width': myWidth + 'px', 'min-height': myHeight + 'px'});
      requestAnimationFrame(checkPopupSize);
    };
    tthis.param['popup-page-timeout'] = setTimeout(function(){
      maskObj.addClass('on');
      pageObj.addClass('on');
    }, 100);
    checkPopupSize();
    return pageObj;
  }
};