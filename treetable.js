(function() {
    'use strict';

    var input = {
        columns: [
            'Status',
            'Kunde',
            'Datum',
            'Abteilung',
            'Personalnummer'
        ],
        models: [{
            status: 'Bearbeiten',
            children: [{
                typ: 'Abrechnung',
                kunde: 'Witt, Frauke',
                datum: '18.05 - 19.05',
                abteilung: 'Vertrieb',
                personalnummer: 'C2420'
            }, {
                typ: 'Aufnahme',
                kunde: 'Meier, Hans',
                datum: '20.05',
                abteilung: 'Vertrieb',
                personalnummer: 'C1309'
            }, {
                status: 'Pausiert',
                children: [{
                    typ: 'Abrechnung',
                    kunde: 'Witt, Frauke',
                    datum: '18.05 - 19.05',
                    abteilung: 'Vertrieb',
                    personalnummer: 'C2400'
                }]
            }]
        }, {
            status: 'Kontrollieren',
            children: [{
                typ: 'Gespräch',
                kunde: 'Peterson, Friedrich',
                datum: '05.04 - 10.04',
                abteilung: 'Verkauf',
                personalnummer: 'IN35'
            }, {
                typ: 'Abrechnung',
                kunde: 'Witt, Frauke',
                datum: '18.05 - 19.05',
                abteilung: 'Vertrieb',
                personalnummer: 'C244'
            }]
        }, {
            status: 'Abgeschlossen',
            children: [{
                typ: 'Gespräch',
                kunde: 'Peterson, Friedrich',
                datum: '05.04 - 10.04',
                abteilung: 'Verkauf',
                personalnummer: 'IN35'
            }, {
                typ: 'Abrechnung',
                kunde: 'Witt, Frauke',
                datum: '18.05 - 19.05',
                abteilung: 'Vertrieb',
                personalnummer: 'C244'
            }]
        }]
    }

    function createTreeTable(columns, models) {
        var tt = document.createElement('table');
        tt.classList.add('tree-table');

        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');
        thead.appendChild(theadRow);

        columns.forEach(function(columnName) {
            var headCol = document.createElement('td');
            headCol.innerHTML = columnName;
            theadRow.appendChild(headCol);
        });

        tt.appendChild(thead);

        var nodes = createNodes(models);
        nodes.forEach(function(node) {
            tt.appendChild(node);
        });

        return tt;
    };

    function createNodes(models, layer) {
        layer = layer || 0;
        var nodes = [];

        models.forEach(function(model, index) {
            var node = document.createElement('tr');
            node.classList.add('layer-' + layer);

            var hasChildren = model.hasOwnProperty('children');
            var childNodes = null;

            if (hasChildren)
                childNodes = createNodes(model.children, layer + 1);

            Object.keys(model).forEach(function(key, keyIndex) {
                if (key !== 'children') {
                    var cell = document.createElement('td');
                    cell.classList.add('tt-cell');

                    if (keyIndex === 0 && hasChildren) {
                        var expandBtn = document.createElement('span');
                        expandBtn.classList.add('expand-btn');
                        expandBtn.innerHTML = '-';

                        function createExpandHandler(childNodes, btn) {
                            return function() {
                                if (btn.innerHTML == '-') {
                                    childNodes.forEach(function(childNode) {
                                        childNode.classList.add('hidden');
                                    });
                                    expandBtn.innerHTML = '+';
                                } else if (btn.innerHTML == '+') {
                                    childNodes.forEach(function(childNode) {
                                        childNode.classList.remove('hidden');
                                    });
                                    expandBtn.innerHTML = '-';
                                }

                            };
                        }

                        expandBtn.addEventListener('click', createExpandHandler(childNodes, expandBtn));

                        cell.appendChild(expandBtn);
                    }

                    cell.appendChild(document.createTextNode(model[key]));
                    node.appendChild(cell);
                }
            });

            nodes.push(node);

            if (hasChildren) {
                var childContainer = document.createElement('tbody');
                var subChilds = null;

                childNodes.forEach(function(childNode) {
                    if (childNode.tagName !== 'TBODY')
                        childContainer.appendChild(childNode);
                    else
                        subChilds = childNode;
                });

                nodes.push(childContainer);
                if (subChilds)
                    nodes.push(subChilds);
            }
        });

        return nodes;
    };

    window.onload = function() {
        var tt = createTreeTable(input.columns, input.models);
        document.body.appendChild(tt);
    };

})();
