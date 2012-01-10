var marmoset = marmoset || {};


/**
 * @class Wraps a <select /> tag for displaying a dropdown rubric.
 *
 * @author rwsims
 *
 * @constructor
 * @param {object} the select tag to wrap.
 * @param {object} [hidden] the hidden input for storing the value string.
 */
marmoset.DropdownWidget = function(select, hidden) {
    this.$select = $(select);
    this.$hidden = $(hidden);
    this.valueMap = {};
};

marmoset.DropdownWidget.prototype.getValueString = function() {
    var pairs = [];
    $.each(this.valueMap, function(value, score) {
        pairs.push(value + ":" + score);
    });
    return pairs.join(",");
};

marmoset.DropdownWidget.prototype.redraw = function() {
    this.$select.empty();
    var frag = document.createDocumentFragment();
    for (var k in this.valueMap) {
        var option = document.createElement('option');
        option.innerHTML = k + " [" + this.valueMap[k] + "]";
        frag.appendChild(option);
    }
    this.$select.append(frag);
    if (this.$hidden) {
        this.$hidden.val(this.getValueString());
    }
};

marmoset.DropdownWidget.prototype.put = function(name, score) {
    this.valueMap[name] = score;
    this.redraw();
};

marmoset.DropdownWidget.prototype.setValues = function(valueMap) {
    this.clear();
    var thisValueMap = this.valueMap;
    $.each(valueMap, function(value, score) {
        thisValueMap[value] = score;
    });
    this.redraw();
};

marmoset.DropdownWidget.prototype.remove = function(name) {
    delete this.valueMap[name];
    this.redraw();
};

marmoset.DropdownWidget.prototype.clear = function() {
    this.valueMap = {};
    this.redraw();
};


/**
 * @class Edits dropdown rubric items.
 *
 * @author rwsims
 *
 * @constructor
 * @param {string} dialogId the id of the div with the dialog markup.
 */
marmoset.DropdownEditor = function(dialogId) {
    var editor = this;
    this.dialog = $(dialogId).dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "OK": function() {
                $(this).dialog("close");
                editor._save();
                editor.clearAndClose();
            },
            "Cancel": function() {
                $(this).dialog("close");
                editor.clearAndClose();
            }
        }
    });
    this.select = this.dialog.find(dialogId + "-dropdown-select");
    this.widget = new marmoset.DropdownWidget(this.select);
    this.valueInput = this.dialog.find(dialogId + "-value-input");
    this.scoreInput = this.dialog.find(dialogId + "-score-input");

    this.dialog.find(dialogId + "-controls").buttonset();
    this.dialog.find(dialogId + "-add").click(function(event) {
        var value = editor.valueInput.val(),
            score = editor.scoreInput.val();
        if (value && score) {
            editor.widget.put(value, score);
        }
    });
    this.dialog.find(dialogId + "-delete").click(function(event) {
        var value = editor.valueInput.val();
        if (value) {
            editor.widget.remove(value);
        }
    });
    this.dialog.find(dialogId + "-clear-all").click(function(event) {
        editor.widget.clear();
    });
}

marmoset.DropdownEditor.prototype.clearAndClose = function() {
    this.dialog.dialog("close");
    this.widget.clear();
    this.valueInput.val('');
    this.scoreInput.val('');
};

marmoset.DropdownEditor.prototype.edit = function(widget) {
    this.dialog.dialog("open");
    this.currentWidget = widget;
    this.widget.setValues(widget.valueMap);
};

marmoset.DropdownEditor.prototype._save = function() {
    if (!this.currentWidget) {
        return;
    }
    this.currentWidget.setValues(this.widget.valueMap);
    delete this.currentWidget;
};


/**
 * @class Manages the dynamic list of rubrics in a table of rubrics.
 *
 * @author rwsims
 *
 * @constructor
 * @param {string} rubricTableId the id of the rubric table.
 * @param {DropdownEditor} dropdownEditor dropdown editor instance.
 */
marmoset.RubricManager = function(rubricTableId, dropdownEditor) {
    this.table = $(rubricTableId);
    this.dropdownEditor = dropdownEditor;
    this.rubricCount = 0;

    this.templates = {
        rubric: $("#rubricTemplate"),
        dropdown: $("#dropdownTemplate")
    };
};

/** Render a rubric template and add it to the table. Returns the jQuery object
 * that results.
 */
marmoset.RubricManager.prototype._addRubric = function(template, values) {
    this.rubricCount += 1;
    values.count = this.rubricCount;
    values.editWidgets = template.render(values);
    var row = this.templates.rubric.render(values);
    return $(row).appendTo(this.table);
};

/** Add a dropdown rubric to the table managed by this instance. */
marmoset.RubricManager.prototype._addDropdown = function(event) {
    var values = {
        presentation: "DROPDOWN",
        header: "Dropdown"
    };
    var row = this._addRubric(this.templates.dropdown, values);

    // Closure to get editor and widget variables into the event handler.
    function makeHandler(row, count) {
        var select = $("#dropdown-select-" + count),
            hidden = $("#rubric-value-" + count),
            widget = new marmoset.DropdownWidget(select, hidden),
            editor = this.dropdownEditor;
        return function(event) {
            event.preventDefault();
            editor.edit(widget);
        };
    }
    $("#dropdown-edit-" + this.rubricCount).click(makeHandler(row, this.rubricCount));
};

/**
 * Set the button to add a dropdown rubric.
 *
 * @param {string} id of the button to use.
 */
marmoset.RubricManager.prototype.setAddDropdownButton = function(buttonId) {
    var manager = this;
    $(buttonId).click(function(event) {
        manager._addDropdown();
    });
};
