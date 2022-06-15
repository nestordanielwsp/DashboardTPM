// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
(function ($) {

    $.alerts = {

        // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

        verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
        horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
        repositionOnResize: true,           // re-centers the dialog on window resize
        overlayOpacity: .55,                // transparency level of overlay
        overlayColor: '#333',            // base color of overlay
        draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
        okButton: '&nbsp;Aceptar&nbsp;',    // text for the OK button
        cancelButton: '&nbsp;Cancelar&nbsp;', // text for the Cancel button
        dialogClass: null,                  // if specified, this class will be applied to all dialogs

        // Public methods

        alert: function (message, title, callback) {
            if (title == null) title = 'Alert';
            $.alerts._show(title, message, null, 'alert', function (result) {
                if (callback) callback(result);
            });
        },

        confirm: function (message, title, callback) {
            if (title == null) title = 'Confirm';
            $.alerts._show(title, message, null, 'confirm', function (result) {
                if (callback) callback(result);
            });
        },

        prompt: function (message, value, title, callback) {
            if (title == null) title = 'Prompt';
            $.alerts._show(title, message, value, 'prompt', function (result) {
                if (callback) callback(result);
            });
        },

        error: function (message, title, callback) {
            if (title == null) title = 'Error';
            $.alerts._show(title, message, null, 'error', function (result) {
                if (callback) callback(result);
            });
        },

        warning: function (message, title, callback) {
            if (title == null) title = 'Warning';
            $.alerts._show(title, message, null, 'warning', function (result) {
                if (callback) callback(result);
            });
        },
        // Private methods

        _show: function (title, msg, value, type, callback) {

            $.alerts._hide();
            $.alerts._overlay('show');

            $("BODY").append(
			  '<div id="popup_container">' +
			    '<div id="popup_content_title" class="row-fluid alert_title"> ' +
                '  <span id="popup_icon"></span>&nbsp; ' +
                '  <span id="popup_title"></span> ' +
                '</div>' +
			    '<div id="popup_content" class="row-fluid alert_content" >' +
			      '<div id="popup_message" class="col-sm-12"></div>' +
				'</div>' +
                '<div id="popup_footer" class="row-fluid alert_footer" >' +
                '</div>' +
			  '</div>');

            if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);

            // IE6 Fix
           // var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';
            var pos =  'fixed';

            $("#popup_container").css({
                position: pos,
                zIndex: 99999,
                padding: 0,
                margin: 0
            });

            $("#popup_title").text(title);
            $("#popup_content").addClass(type);
            $("#popup_message").text(msg);
            $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
            /*
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
            */

            $.alerts._reposition();
            $.alerts._maintainPosition(true);

            switch (type) {
                case 'alert':
                    $("#popup_content_title").addClass("alert_title_information");
                    $("#popup_icon").append('<i class="icon-ok"></i>');
                    $("#popup_footer").append('<div><button class="btn btn-alert btn-success" type="button" id="popup_ok">' + $.alerts.okButton + '</button></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true);
                    });

                    $("#popup_ok").focus();
                    /*
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
                    */
                    break;
                case 'confirm':
                    $("#popup_content_title").addClass("alert_title_confirmation");
                    $("#popup_icon").append('<i class="icon-question"></i>');
                    $("#popup_footer").append('<div> <button id="popup_cancel" class="btn btn-alert btn-danger">' + $.alerts.cancelButton + '</button> <button id="popup_ok" class="btn btn-alert btn-success">' + $.alerts.okButton + '</button></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        if (callback) callback(true);
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback) callback(false);
                    });
                    $("#popup_cancel").focus();
                    /*
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
                    */
                    break;
                case 'error':
                    $("#popup_content_title").addClass("alert_title_error");
                    $("#popup_icon").append('<i class="icon-remove"></i>');
                    $("#popup_footer").append('<div><button class="btn btn-alert btn-success" type="button" id="popup_ok">' + $.alerts.okButton + '</button></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true);
                    });

                    $("#popup_ok").focus();
                    /*
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
                    */
                    break;
                case 'warning':
                    $("#popup_content_title").addClass("alert_title_warning");
                    $("#popup_icon").append('<i class="icon-warning-sign"></i>');
                    $("#popup_footer").append('<div><button class="btn btn-alert btn-success" type="button" id="popup_ok">' + $.alerts.okButton + '</button></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true);
                    });

                    $("#popup_ok").focus();
                    /*
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
                    */
                    //case 'prompt':
                    //    $("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><a id="popup_ok" href="#">' + $.alerts.okButton + '</a> <a id="popup_cancel" href="#">' + $.alerts.cancelButton + '</a></div>');
                    //	$("#popup_prompt").width( $("#popup_message").width() );
                    //	$("#popup_ok").click( function() {
                    //		var val = $("#popup_prompt").val();
                    //		$.alerts._hide();
                    //		if( callback ) callback( val );
                    //	});
                    //	$("#popup_cancel").click( function() {
                    //		$.alerts._hide();
                    //		if( callback ) callback( null );
                    //	});
                    //	$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
                    //		if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
                    //		if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
                    //	});
                    //	if( value ) $("#popup_prompt").val(value);
                    //	$("#popup_prompt").focus().select();
                    //break;
            }

            // Make draggable
            if ($.alerts.draggable) {
                try {
                    $("#popup_container").draggable({ handle: $("#popup_title") });
                    $("#popup_title").css({ cursor: 'move' });
                } catch (e) { /* requires jQuery UI draggables */ }
            }
        },

        _hide: function () {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false);
        },

        _overlay: function (status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break;
            }
        },

        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;

            // IE6 fix
           //if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();

            $("#popup_container").css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height());
        },

        _maintainPosition: function (status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break;
                }
            }
        }

    }

    // Shortuct functions
    jAlert = function (message, title, callback) {
        $.alerts.alert(message, title, callback);
    }

    jConfirm = function (message, title, callback) {
        $.alerts.confirm(message, title, callback);
    };

    jPrompt = function (message, value, title, callback) {
        $.alerts.prompt(message, value, title, callback);
    };

    jError = function (message, title, callback) {
        $.alerts.error(message, title, callback);
    }

    jWarning = function (message, title, callback) {
        $.alerts.warning(message, title, callback);
    }

})(jQuery);