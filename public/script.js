(function(){

    let generateAssignment = function() {
        return {
            sourcedId: $('#assignmentSourcedId').val(),
            name: $('#assignmentName').val(),
            assignDate: $('#assignmentAssignDate').val(),
            dueDate: $('#assignmentDueDate').val(),
            resultValueMin: $('#assignmentResultValueMin').val(),
            resultValueMax: $('#assignmentResultValueMax').val(),
            classSourcedId: $('#assignmentClassSourcedId').val(),
            gradingPeriodSourcedId: $('#assignmentGradingPeriodSourcedId').val()
        };
    };

    let generateScore = function() {
        return {
            sourcedId: $('#resultSourcedId').val(),
            score: $('#resultScore').val(),
            date: $('#resultDate').val(),
            lineItemSourcedId: $('#resultLineItemSourcedId').val(),
            studentSourcedId: $('#resultStudentSourcedId').val()
        }
    };

    let generateFinalGrade = function() {
        return {
            sourcedId: $('#finalGradeSourcedId').val(),
            score: $('#finalGradeScore').val(),
            percent: $('#finalGradePercent').val(),
            date: $('#finalGradeDate').val(),
            lineItemSourcedId: $('#finalGradeLineItemSourcedId').val(),
            studentSourcedId: $('#finalGradeStudentSourcedId').val(),
            comment: $('#finalGradeComment').val()
        }
    };

    let locallyStoredItems = [
        'url',
        'key',
        'secret',
        'vendorKey',
        'vendorSecret'
    ];

    $(document).ready(function() {

        var spinnerOpts = {
            lines: 13 // The number of lines to draw
          , length: 28 // The length of each line
          , width: 14 // The line thickness
          , radius: 42 // The radius of the inner circle
          , scale: 1 // Scales overall size of the spinner
          , corners: 1 // Corner roundness (0..1)
          , opacity: 0.25 // Opacity of the lines
          , direction: 1 // 1: clockwise, -1: counterclockwise
          , speed: 1 // Rounds per second
          , trail: 60 // Afterglow percentage
          , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
          , className: 'spinner' // The CSS class to assign to the spinner
          }
        var spinner = new Spinner(spinnerOpts);

        function startSpinner() {
            spinner.spin(document.getElementById('spinner'));
            $("#createAssignmentBtn").prop('disabled', true);
            $("#createScoreBtn").prop('disabled', true);
            $('#testConnectionBtn').prop('disabled', true);
            $('#createFinalGradeBtn').prop('disabled', true);
        }

        function stopSpinner() {
            spinner.stop();
            $("#createAssignmentBtn").prop('disabled', false);
            $("#createScoreBtn").prop('disabled', false);
            $('#testConnectionBtn').prop('disabled', false);
            $('#createFinalGradeBtn').prop('disabled', false);
        }

        locallyStoredItems.forEach(function(element){
            $('#' + element).val(localStorage.getItem(element));
            $('#' + element).change(function() {
                localStorage.setItem(element, $(this).val());
            });
        });

        //ASSIGNMENT
        var storedAssignment = JSON.parse(localStorage.getItem('assignment'));
        if(storedAssignment) {
            $('#assignmentSourcedId').val(storedAssignment.sourcedId);
            $("#assignmentName").val(storedAssignment.name);
            $("#assignmentAssignDate").val(storedAssignment.assignDate);
            $("#assignmentDueDate").val(storedAssignment.dueDate);
            $("#assignmentResultValueMin").val(storedAssignment.resultValueMin);
            $('#assignmentResultValueMax').val(storedAssignment.resultValueMax);
            $('#assignmentClassSourcedId').val(storedAssignment.classSourcedId);
            $("#assignmentGradingPeriodSourcedId").val(storedAssignment.gradingPeriodSourcedId);
        }
        $('.assignment').change(function() {
            let assignment = generateAssignment();
            localStorage.setItem('assignment', JSON.stringify(assignment));
        });

        //SCORE
        var storedScore = JSON.parse(localStorage.getItem(('score')));
        if(storedScore) {
            $("#resultSourcedId").val(storedScore.sourcedId);
            $('#resultScore').val(storedScore.score);
            $('#resultDate').val(storedScore.date);
            $('#resultLineItemSourcedId').val(storedScore.lineItemSourcedId);
            $('#resultStudentSourcedId').val(storedScore.studentSourcedId);
        }
        $('.score').change(function() {
            let score = generateScore();
            localStorage.setItem('score', JSON.stringify(score));
        });

        //FINAL GRADE
        var storedFinalGrade = JSON.parse(localStorage.getItem('finalGrade'));
        if(storedFinalGrade) {
            $('#finalGradeSourcedId').val(storedFinalGrade.sourcedId);
            $('#finalGradePercent').val(storedFinalGrade.percent);
            $("#finalGradeScore").val(storedFinalGrade.score);
            $('#finalGradeDate').val(storedFinalGrade.date);
            $('#finalGradeComment').val(storedFinalGrade.comment);
            $('#finalGradeLineItemSourcedId').val(storedFinalGrade.lineItemSourcedId);
            $('#finalGradeStudentSourcedId').val(storedFinalGrade.studentSourcedId);
        }
        $('.finalGrade').change(function() {
            let finalGrade = generateFinalGrade();
            localStorage.setItem('finalGrade', JSON.stringify(finalGrade));
        });

        //Date Pickers
        var DATEPICKER_OPTIONS = {
            format: 'yyyy-mm-dd',
            autoclose: true
        }
        $('#assignmentAssignDate').datepicker(DATEPICKER_OPTIONS);
        $("#assignmentDueDate").datepicker(DATEPICKER_OPTIONS);
        $("#resultDate").datepicker(DATEPICKER_OPTIONS);
        $('#finalGradeDate').datepicker(DATEPICKER_OPTIONS);

        function doneFunction(response) {
            console.log(JSON.stringify(response, null, 4));
            $("#responseModalBody").html(JSON.stringify(response.requestPayload, null, 4));
            if(response.error) {
                $('#responseModalBody2').html(JSON.stringify(response.error));
            } else {
                $('#responseModalBody2').html(JSON.stringify(response.response, null, 4));
            }
            $("#responseModal").modal();
            stopSpinner();
        }

        //Create Assignment
        $("#createAssignmentBtn").click(function() {

            startSpinner();

            $.ajax('createAssignment', {
                data: JSON.stringify({
                    url: $('#url').val(),
                    key: $("#key").val(),
                    secret: $('#secret').val(),
                    vendorKey: $("#vendorKey").val(),
                    vendorSecret: $('#vendorSecret').val(),
                    assignment: generateAssignment()
                }),
                contentType: 'application/json',
                type: 'POST',
                success: function() {
                    $('#responseModal').modal();
                }
            }).done(doneFunction);
        });

        $('#createScoreBtn').click(function() {

            startSpinner();

            $.ajax('createScore', {
                data: JSON.stringify({
                    url: $('#url').val(),
                    key: $("#key").val(),
                    secret: $('#secret').val(),
                    vendorKey: $("#vendorKey").val(),
                    vendorSecret: $('#vendorSecret').val(),
                    score: generateScore()
                }),
                contentType: 'application/json',
                type: 'POST'
            }).done(doneFunction);
        });

        $("#createFinalGradeBtn").click(function() {
            startSpinner();

            $.ajax('createFinalGrade', {
                data: JSON.stringify({
                    url: $('#url').val(),
                    key: $("#key").val(),
                    secret: $('#secret').val(),
                    vendorKey: $("#vendorKey").val(),
                    vendorSecret: $('#vendorSecret').val(),
                    grade: generateFinalGrade()
                }),
                contentType: 'application/json',
                type: 'POST'
            }).done(doneFunction);
        });

        $("#testConnectionBtn").click(function() {
            startSpinner();

            var url = 'getOrgs?';
            url += 'url='+ $('#url').val();
            url += '&key=' + $('#key').val();
            url += '&secret=' + $("#secret").val();
            url += '&vendorKey=' + $('#vendorKey').val();
            url += '&vendorSecret=' + $('#vendorSecret').val();

            $.ajax(url, {
                type: 'GET'
            }).done(function(response) {
                stopSpinner();
                $("#responseModalBody").html('');
                if(response.error) {
                    $('#responseModalBody2').html(JSON.stringify(response.error));
                } else {
                    $('#responseModalBody2').html(JSON.stringify(response.response, null, 4));
                }
                $("#responseModal").modal();
            });
        });
    });
})();