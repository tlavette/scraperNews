$(".form-check-input").change(function () {
    var isChecked = $(this).is(":checked");
    if (isChecked) {
        console.log("CheckBox checked.");
    } else {
        console.log("CheckBox not checked.");
    }
    console.log($(this).val())
});

// Check indicates save.  Will need a save route.  The information passed should include the ID and the check
// state, meaning, is checked or not checked.  When received it should determine if there is an update needed 
// as saved.

// in server, instead of deleting everything, should check if save != true and delete those only.