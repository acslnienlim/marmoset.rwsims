/** Wraps a <select /> tag for displaying a dropdown rubric. */
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

$("#edit-dialog").dialog({autoOpen: false});


/** Manages the dynamic list of rubrics in a table of rubrics. */
function RubricManager(table) {
    this.table = table;
    this.rubricCount = 0;

    this.templates = {
        dropdown: $("#dropdownRowTemplate")
    };
}

RubricManager.prototype._addRubric = function(template) {
    this.rubricCount++;
    row = template.render({count: this.rubricCount});
    this.table.append(row);
    return row;
}

/** Add a dropdown rubric to the table managed by this instance. */
RubricManager.prototype.addDropdown = function() {
    var row = this._addRubric(this.templates.dropdown);
    var buttonId = "#dropdown-edit-" + this.rubricCount;
    var selectId = "#dropdown-select-" + this.rubricCount;
    var widget = new DropdownWidget($(selectId));
    $(buttonId).click(function(event) {
        event.preventDefault();
        widget.put("foo", "bar");
    });
}


window.$marmoset = {
    editDialog: $("#edit-dialog").dialog({autoOpen: false}),
    manager: new RubricManager($("#rubric-table")),
};

$("#add-dropdown-button").click(function(event) {
    event.preventDefault();
    $marmoset.manager.addDropdown();
});
