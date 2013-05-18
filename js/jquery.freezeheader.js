/* ------------------------------------------------------------------------
Class: freezeHeader
Use:freeze header row in html table
Example 1:  $('#tableid').freezeHeader();
Example 2:  $("#tableid").freezeHeader({ 'height': '300px' });
Author: Laerte Mercier Junior
Version: 1.0.3
-------------------------------------------------------------------------*/
(function ($) {
    $.fn.freezeHeader = function (params) {
        var copiedHeader = false;
        var idObj = this.selector.replace('#', '');
        var container;
        var grid;
        var conteudoHeader;
        var openDivScroll = '';
        var closeDivScroll = '';

        if (params && params.height !== undefined) {
            divScroll = '<div id="hdScroll' + idObj + '" style="height: ' + params.height + '; overflow-y: scroll">';
            closeDivScroll = '</div>';
        }

        grid = $('table[id$="' + idObj + '"]');
        conteudoHeader = grid.find('thead');

        if (params && params.height !== undefined) {
            if ($('#hdScroll' + idObj).length == 0) {
                grid.wrapAll(divScroll);
            }
        }

        var obj = params && params.height !== undefined
           ? $('#hdScroll' + idObj)
           : $(window);

        if ($('#hd' + idObj).length == 0) {
            grid.before('<div id="hd' + idObj + '"></div>');
        }

        obj.scroll(function () { freezeHeader(); })

        function freezeHeader() {

            if ($('table[id$="' + idObj + '"]').length > 0) {

                container = $('#hd' + idObj);
                if (conteudoHeader.offset() != null) {
                    if (limiteAlcancado(params)) {
                        if (!copiedHeader) {
                            cloneHeaderRow(grid);
                            copiedHeader = true;
                        }
                    }
                    else {

                        if (($(document).scrollTop() > conteudoHeader.offset().top)) {
                            container.css("position", "absolute");
                            container.css("top", (grid.find("tr:last").offset().top - conteudoHeader.height()) + "px");
                        }
                        else {
                            container.css("visibility", "hidden");
                            container.css("top", "0px");
                            container.width(0);
                        }

                        copiedHeader = false;

                    }
                }
            }
        }

        function limiteAlcancado(params) {
            if (params && params.height !== undefined) {
                return (conteudoHeader.offset().top <= obj.offset().top);
            }
            else {
                return ($(document).scrollTop() > conteudoHeader.offset().top && $(document).scrollTop() < (grid.height() - conteudoHeader.height() - grid.find("tr:last").height()) + conteudoHeader.offset().top);
            }
        }

        function cloneHeaderRow() {
            container.html('');
            container.val('');
            var tabela = $('<table style="margin: 0 0;"></table>');
            var atributos = grid.prop("attributes");

            $.each(atributos, function () {

                if (this.name != "id") {
                    tabela.attr(this.name, this.value);
                }
            });

            tabela.append('<thead>' + conteudoHeader.html() + '</thead>');

            container.append(tabela);
            container.width(conteudoHeader.width());
            container.height(conteudoHeader.height);
            container.find('th').each(function (index) {
                var cellWidth = grid.find('th').eq(index).width();
                $(this).css('width', cellWidth);
            });

            container.css("visibility", "visible");

            if (params && params.height !== undefined) {
                container.css("top", obj.offset().top + "px");
                container.css("position", "absolute");
            } else {
                container.css("top", "0px");
                container.css("position", "fixed");
            }
        }
    };
})(jQuery);
