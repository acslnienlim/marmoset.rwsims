/**
 * @class Wraps a <select /> tag for displaying a dropdown rubric.
 *
 * @author rwsims
 *
 * @constructor
 * @param {object} the select tag to wrap.
 */
function DropdownWidget(select) {
    this.$select = $(select)
    this.valueMap = {};
}

DropdownWidget.prototype.redraw = function() {
    this.$select.empty();
    var frag = document.createDocumentFragment();
    for (k in this.valueMap) {
        option = document.createElement('option');
        option.innerHTML = k + " [" + this.valueMap[k] + "]";
        frag.appendChild(option);
    }
    this.$select.append(frag);
}

DropdownWidget.prototype.put = function(name, score) {
    this.valueMap[name] = score;
    this.redraw();
}

DropdownWidget.prototype.remove = function(name) {
    delete this.valueMap[name];
}

/**
 * @class Manages the dynamic list of rubrics in a table of rubrics.
 *
 * @author rwsims
 *
 * @constructor
 * @param {string} rubricTableId the id of the rubric table
 * @param {string} dropdownDialogId the id of the div containing the dropdown
 *                                  dialog.
 */
function RubricManager(rubricTableId, dropdownDialogId) {
    this.table = $(rubricTableId);
    this.dropdownDialog = $(dropdownDialogId).dialog({autoOpen: false});
    this.rubricCount = 0;

    this.templates = {
        dropdown: $("#dropdownRowTemplate")
    };
}

/** Render a rubric template and add it to the table. Returns the jQuery object
 * that results.
 */
RubricManager.prototype._addRubric = function(template) {
    this.rubricCount++;
    var row = template.render({count: this.rubricCount});
    return $(row).appendTo(this.table);
}

/** Add a dropdown rubric to the table managed by this instance. */
RubricManager.prototype._addDropdown = function(event) {
    var row = this._addRubric(this.templates.dropdown);
    console.log(row.attr("id"));
    var select = $("#dropdown-select-" + this.rubricCount);
    var widget = new DropdownWidget(select);
    $("button", row).click(function(event) {
            event.preventDefault();
            widget.put("foo", "bar");
    });
}

/**
 * Set the button to add a dropdown rubric.
 *
 * @param {string} id of the button to use.
 */
RubricManager.prototype.setAddDropdownButton = function(buttonId) {
    var manager = this;
    $(buttonId).click(function(event) {
        manager._addDropdown();
    });
}
