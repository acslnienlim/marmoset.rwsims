/** Wraps a <select /> tag for displaying a dropdown rubric. */
function DropdownWidget(select) {
    this.select = select;
}


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
        alert(selectId);
        event.preventDefault();
    });
}


window.$marmoset = {
    editDialog: $("#edit-dialog"),
    manager: new RubricManager($("#rubric-table")),
};

$("#edit-dialog").dialog({autoOpen: false});

$("#add-dropdown-button").click(function(event) {
    event.preventDefault();
    $marmoset.manager.addDropdown();
});
