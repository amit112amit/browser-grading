// The external modules that must be imported by the html page sourcing this file
//const Bokeh = window.Bokeh;
//const XLSX = window.XLSX;

// The global variables
var averageMarks = 50;
var courseTitle = "BITS F111 Thermodynamics";
var highestMarks = 0;
var lowestMarks = 999;
var maxMarks = 100;
var mgpa = 0.0;
var totalStudents = 100;

var studentMarks = [];
var counts = { "A": 0, "A-": 0, "B": 0, "B-": 0, "C": 0, "C-": 0, "D": 0, "E": 0 };
var histData = { top: [], left: [], right: [], binValue: [] };
var bokehHistCDS = new Bokeh.ColumnDataSource({ data: histData });

// Make the figure
var plot = Bokeh.Plotting.figure({
    sizing_mode: "scale_both",
    tools: "save",
    x_range: [-0.5, maxMarks + 1],
    y_range: [0, 10],
    x_axis_label: "Score",
    y_axis_label: "Frequency",
    max_width: 1000,
    max_height: 300,
    aspect_ratio: 2
});

// Add hover tool to the plot
var hovertool = new Bokeh.HoverTool({ tooltips: [["Score", "@binValue"], ["Count", "@top"]] });
plot.add_tools(hovertool)

//Give a title to the plot
plot.title.text = courseTitle;

// make the histogram
plot.quad({ field: "left" }, { field: "right" }, { field: "top" }, 0, { source: bokehHistCDS });

// The average marker
averageMarker = new Bokeh.Span({
    location: averageMarks,
    dimension: "height",
    line_color: "red",
    line_dash: "dashed",
    line_width: 3
});
plot.add_layout(averageMarker);

// Create a Span for each grade
aSpan = new Bokeh.Span({
    location: Math.round(0.8 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(aSpan);
amSpan = new Bokeh.Span({
    location: Math.round(0.7 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(amSpan);
bSpan = new Bokeh.Span({
    location: Math.round(0.6 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(bSpan);
bmSpan = new Bokeh.Span({
    location: Math.round(0.5 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(bmSpan);
cSpan = new Bokeh.Span({
    location: Math.round(0.4 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(cSpan);
cmSpan = new Bokeh.Span({
    location: Math.round(0.3 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(cmSpan);
dSpan = new Bokeh.Span({
    location: Math.round(0.2 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(dSpan);
eSpan = new Bokeh.Span({
    location: Math.round(0.1 * maxMarks),
    dimension: "height",
    line_color: "green",
    line_width: 3
});
plot.add_layout(eSpan);

// Create a Label for each grade
aLabel = new Bokeh.Label({ x: Math.round(0.8 * maxMarks), y: 9, text: "A: 0" });
plot.add_layout(aLabel)
amLabel = new Bokeh.Label({ x: Math.round(0.7 * maxMarks), y: 9, text: "A-: 0" });
plot.add_layout(amLabel)
bLabel = new Bokeh.Label({ x: Math.round(0.6 * maxMarks), y: 9, text: "B: 0" });
plot.add_layout(bLabel)
bmLabel = new Bokeh.Label({ x: Math.round(0.5 * maxMarks), y: 9, text: "B-: 0" });
plot.add_layout(bmLabel)
cLabel = new Bokeh.Label({ x: Math.round(0.4 * maxMarks), y: 9, text: "C: 0" });
plot.add_layout(cLabel)
cmLabel = new Bokeh.Label({ x: Math.round(0.3 * maxMarks), y: 9, text: "C-: 0" });
plot.add_layout(cmLabel)
dLabel = new Bokeh.Label({ x: Math.round(0.2 * maxMarks), y: 9, text: "D: 0" });
plot.add_layout(dLabel)
eLabel = new Bokeh.Label({ x: Math.round(0.1 * maxMarks), y: 9, text: "E: 0" });
plot.add_layout(eLabel)

// Show the plot
Bokeh.Plotting.show(plot);


// The following data-structure stores the state of the app -- which grades are
// enabled, what are their cutoffs and counts.
var gradesData = {
    "A": {
        Enabled: true,
        Weight: 10,
        CutOff: Math.round(0.8 * maxMarks),
        Slider: "aSlider",
        Span: aSpan,
        Label: aLabel
    },
    "A-": {
        Enabled: false,
        Weight: 9,
        CutOff: Math.round(0.7 * maxMarks),
        Slider: "amSlider",
        Span: amSpan,
        Label: amLabel
    },
    "B": {
        Enabled: true,
        Weight: 8,
        CutOff: Math.round(0.6 * maxMarks),
        Slider: "bSlider",
        Span: bSpan,
        Label: bLabel
    },
    "B-": {
        Enabled: false,
        Weight: 7,
        CutOff: Math.round(0.5 * maxMarks),
        Slider: "bmSlider",
        Span: bmSpan,
        Label: bmLabel
    },
    "C": {
        Enabled: true,
        Weight: 6,
        CutOff: Math.round(0.4 * maxMarks),
        Slider: "cSlider",
        Span: cSpan,
        Label: cLabel
    },
    "C-": {
        Enabled: false,
        Weight: 5,
        CutOff: Math.round(0.3 * maxMarks),
        Slider: "cmSlider",
        Span: cmSpan,
        Label: cmLabel
    },
    "D": {
        Enabled: true,
        Weight: 4,
        CutOff: Math.round(0.2 * maxMarks),
        Slider: "dSlider",
        Span: dSpan,
        Label: dLabel
    },
    "E": {
        Enabled: false,
        Weight: 2,
        CutOff: Math.round(0.1 * maxMarks),
        Slider: "eSlider",
        Span: eSpan,
        Label: eLabel
    },
};


function UploadExcel() {
    //
    var textAreaData = document.getElementById("copyPasteData").value;
    //alert(textAreaData)
    document.getElementById("output").innerHTML = textAreaData;

    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:\(\)])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    GetMarksFromExcelFile(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    GetMarksFromExcelFile(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};

function GetMarksFromExcelFile(data) {
    //Read the Excel File data in binary
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //get the name of First Sheet.
    var Sheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);

    //Add the data rows from Excel file.
    var average = 0.0;
    for (let i = 0; i < excelRows.length; i++) {
        //Populate the global array
        let marks = excelRows[i].Total;
        studentMarks[i] = marks;
        if (marks > highestMarks) {
            highestMarks = marks;
        }
        if (marks < lowestMarks) {
            lowestMarks = marks;
        }
        average = average + marks;
    }
    // Update the total number of students
    totalStudents = excelRows.length;

    // Update the course average
    average = Math.round(average / excelRows.length);
    averageMarks = average;
};

function PlotHistogram() {
    // Read the data from input fields
    courseTitle = document.getElementById("courseTitleInput").value;
    maxMarks = parseInt(document.getElementById("courseTotalInput").value);

    // Check for consistency of the uploaded Excel sheet data and the course total.
    if (maxMarks < highestMarks) {
        alert(`Course total (${maxMarks}) cannot be less than the highest marks (${highestMarks}).`)
        return
    }

    // Initialize frequency array with zeros.
    let histogram = [];
    for (let i = 0; i <= maxMarks; i++) {
        histogram[i] = 0;
    }
    // Count the frequency of each score.
    for (const marks of studentMarks) {
        histogram[marks]++;
    }

    // Create the bin edges for plotting a histogram
    let binEdges = [];
    for (let i = 0; i <= maxMarks + 1; i++) {
        binEdges[i] = -0.5 + i;
    }

    // Update the histogram data object based on the calculations
    histData.top = histogram;
    histData.left = binEdges.slice(0, -1);
    histData.right = binEdges.slice(1);
    histData.binValue = binEdges.slice(0, -1).map(function (v) { return v + 0.5; });

    // Update the label locations
    var ymax = Math.max(...histogram);
    aLabel.y = ymax - 1;
    amLabel.y = ymax - 1;
    bLabel.y = ymax - 1;
    bmLabel.y = ymax - 1;
    cLabel.y = ymax - 1;
    cmLabel.y = ymax - 1;
    dLabel.y = ymax - 1;
    eLabel.y = ymax - 1;

    // Update plot ranges, title and the average marker
    plot.title.text = "${courseTitle} MGPA: 0.0"
    plot.x_range.end = maxMarks + 1;
    plot.y_range.end = ymax + 3;
    averageMarker.location = averageMarks;

    // Update the slider limits
    document.getElementById("aSlider").max = maxMarks;
    document.getElementById("amSlider").max = maxMarks;
    document.getElementById("bSlider").max = maxMarks;
    document.getElementById("bmSlider").max = maxMarks;
    document.getElementById("cSlider").max = maxMarks;
    document.getElementById("cmSlider").max = maxMarks;
    document.getElementById("dSlider").max = maxMarks;
    document.getElementById("eSlider").max = maxMarks;

    // Update the course title
    plot.title.text = courseTitle;

    // Update the column data source
    bokehHistCDS.data = histData;

    // Signal that the data has changed
    bokehHistCDS.change.emit();

    // Update the plot
    updatePlot();
};

function updateGradeCutoff(grade) {
    /*
    Update the cut-off value in `grades_data` for the specified grade.
    Make all other grades consistent with this new cut-off. Finally,
    update the plot.
    */
    var cutoff = parseInt(document.getElementById(gradesData[grade].Slider).value);

    // Set the cutoff value in the data structure
    gradesData[grade].CutOff = cutoff;

    // Check and update the cut-off values for the higher grades
    // We will take advantage of the alphabetical ordering of the grades
    // 'A' > 'A-' > 'B' > 'B-' > 'C' > 'C-' > 'D' > 'E'
    var grades = ["A", "A-", "B", "B-", "C", "C-", "D", "E"];

    // First we will traverse the `gradesData` object in the usual
    // sequence.
    var higherCutoff = cutoff;
    var lowerCutoff = maxMarks;
    for (let i = grades.indexOf(grade) + 1; i < grades.length; i++) {
        lowerCutoff = gradesData[grades[i]].CutOff;
        if (higherCutoff < lowerCutoff) {
            // Inconsistent lower cut-off detected. Fix it.
            lowerCutoff = Math.max(0, higherCutoff - 2);
            gradesData[grades[i]].CutOff = lowerCutoff;
        }
        // Update the higherCutoff for the next loop iteration
        higherCutoff = lowerCutoff;
    }

    // Now we will traverse the `gradesData` object in reverse sequence of grades.
    lowerCutoff = cutoff;
    for (let i = grades.indexOf(grade) - 1; i >= 0; i--) {
        higherCutoff = gradesData[grades[i]].CutOff;
        if (higherCutoff < lowerCutoff) {
            // Inconsistent higher cut-off detected. Fix it.
            higherCutoff = Math.min(maxMarks, lowerCutoff + 2);
            gradesData[grades[i]].CutOff = higherCutoff;
        }
        // Update the lowerCutoff for the next loop iteration
        lowerCutoff = higherCutoff;
    }
    // By now, cut-offs for all the grades (enabled or disabled) should be
    // consistent. So now we can update the plot.
    updatePlot();
};

function updatePlot() {
    // Update MGPA and the counts
    calculateMgpa();
    for (const grade in gradesData) {
        var data = gradesData[grade];
        if (data.Enabled) {
            // Set the locations for the Span and the Label
            data.Span.location = data.CutOff - 0.5;
            data.Label.x = data.CutOff - 0.5;
            // Update the Label text
            data.Label.text = `${grade}: ${counts[grade]}`;
            // Make the Span and Label visible
            data.Span.visible = true;
            data.Label.visible = true;
            // Enable the slider
            document.getElementById(data.Slider).disabled = false;
            document.getElementById(data.Slider).value = data.CutOff;
        }
        else {
            // Turn off the disabled grades
            data.Span.visible = false;
            data.Label.visible = false;
            // Disable the slider
            document.getElementById(data.Slider).disabled = true;
        }
    }
    // Set the MGPA in the title
    plot.title.text = `${courseTitle} MGPA: ${mgpa.toFixed(2)}`;
};

function calculateMgpa() {
    // Reset MGPA
    mgpa = 0.0;
    // Count the number of students in each grade
    var upperLimit = maxMarks + 1;
    var lowerLimit = 0;
    for (const grade in gradesData) {
        var data = gradesData[grade];
        if (!data.Enabled) {
            continue;
        }
        lowerLimit = data.CutOff;
        var count = 0;
        for (let i = lowerLimit; i < upperLimit; i++) {
            count = count + histData.top[i];
        }
        // Set the count in the global variable
        counts[grade] = count;
        // Contribution to the MGPA
        mgpa = mgpa + count * data.Weight;
        // update the upperlimit for the lower grade
        upperLimit = lowerLimit - 1;
    }
    // Normalize the MGPA
    mgpa = mgpa / totalStudents;
};

function enableDisableGrade(grade) {
    var currvalue = gradesData[grade].Enabled;
    gradesData[grade].Enabled = !currvalue;
    updatePlot();
};

