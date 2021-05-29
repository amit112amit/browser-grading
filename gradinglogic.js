// The global variables
var averageMarks = 50;
var courseTitle = "BITS F123 XYZ";
var highestMarks = 0;
var lowestMarks = 999;
var maxMarks = 100;
var mgpa = 0.0;
var totalStudents = 100;

var studentMarks = [];
var counts = { "A": 0, "A-": 0, "B": 0, "B-": 0, "C": 0, "C-": 0, "D": 0, "E": 0 };
var histData = { top: [], left: [], right: [], binValue: [] };
var bokehHistCDS = new Bokeh.ColumnDataSource({ data: histData });

// Make the axis ranges
var xdr = new Bokeh.Range1d({ start: -0.5, end: maxMarks + 1 });
var ydr = new Bokeh.Range1d({ start: 0.0, end: 10 });

// Make the figure
var plot = new Bokeh.Plot({
    sizing_mode: "scale_both",
    x_range: xdr,
    y_range: ydr,
    height: 170,
    background_fill_color: "#F2F2F7",
    background_fill_alpha: 0.5
});

// Add hover tool to the plot
var hovertool = new Bokeh.HoverTool({ tooltips: [["Score", "@binValue"], ["Count", "@top"]] });
var savetool = new Bokeh.SaveTool();
plot.add_tools(hovertool);
plot.add_tools(savetool);

//Give a title to the plot
var plotTitle = new Bokeh.Title({ text: `${courseTitle} MGPA: 0.0`, align: "center", text_font_size: "24pt" });
plot.add_layout(plotTitle, "above");

// Set the axis labels
var xticker = new Bokeh.SingleIntervalTicker({interval:5, num_minor_ticks:10});
var xaxis = new Bokeh.LinearAxis({ axis_label: "Score", axis_label_text_font_size: "20pt", major_label_text_font_size: "16pt", ticker: xticker });
plot.add_layout(xaxis, "left");
var yaxis = new Bokeh.LinearAxis({ axis_label: "Frequency", axis_label_text_font_size: "20pt", major_label_text_font_size: "16pt" });
plot.add_layout(yaxis, "below");

// add grids to the plot
var xgrid = new Bokeh.Grid({ ticker: xaxis.ticker, dimension: 0, grid_line_color: '#d8dcd6' });
var ygrid = new Bokeh.Grid({ ticker: yaxis.ticker, dimension: 1, grid_line_color: '#d8dcd6' });
plot.add_layout(xgrid);
plot.add_layout(ygrid);


// make the histogram
var quad = new Bokeh.Quad({ left: { "field": "left" }, right: { "field": "right" }, top: { "field": "top" }, bottom: 0, line_color: 'black', fill_color: "#b5485d", line_alpha: 0.5, fill_alpha: 0.5 });
plot.add_glyph(quad, bokehHistCDS);

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
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(aSpan);
amSpan = new Bokeh.Span({
    location: Math.round(0.7 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(amSpan);
bSpan = new Bokeh.Span({
    location: Math.round(0.6 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(bSpan);
bmSpan = new Bokeh.Span({
    location: Math.round(0.5 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(bmSpan);
cSpan = new Bokeh.Span({
    location: Math.round(0.4 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(cSpan);
cmSpan = new Bokeh.Span({
    location: Math.round(0.3 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(cmSpan);
dSpan = new Bokeh.Span({
    location: Math.round(0.2 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(dSpan);
eSpan = new Bokeh.Span({
    location: Math.round(0.1 * maxMarks),
    dimension: "height",
    line_color: "#410200",
    line_width: 3
});
plot.add_layout(eSpan);

// Create a Label for each grade
aLabel = new Bokeh.Label({ x: Math.round(0.8 * maxMarks), y: 9, text: "A: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5 });
plot.add_layout(aLabel)
amLabel = new Bokeh.Label({ x: Math.round(0.7 * maxMarks), y: 9, text: "A-: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(amLabel)
bLabel = new Bokeh.Label({ x: Math.round(0.6 * maxMarks), y: 9, text: "B: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(bLabel)
bmLabel = new Bokeh.Label({ x: Math.round(0.5 * maxMarks), y: 9, text: "B-: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(bmLabel)
cLabel = new Bokeh.Label({ x: Math.round(0.4 * maxMarks), y: 9, text: "C: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(cLabel)
cmLabel = new Bokeh.Label({ x: Math.round(0.3 * maxMarks), y: 9, text: "C-: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(cmLabel)
dLabel = new Bokeh.Label({ x: Math.round(0.2 * maxMarks), y: 9, text: "D: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(dLabel)
eLabel = new Bokeh.Label({ x: Math.round(0.1 * maxMarks), y: 9, text: "E: 0", text_font_size: "18pt", border_line_color: "black", background_fill_color: "wheat", background_fill_alpha: 0.5  });
plot.add_layout(eLabel)

// Initially only the main grades should be shown
amSpan.visible = false;
bmSpan.visible = false;
cmSpan.visible = false;
eSpan.visible = false;
amLabel.visible = false;
bmLabel.visible = false;
cmLabel.visible = false;
eLabel.visible = false;

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
        SliderVal: "aSliderVal",
        Span: aSpan,
        Label: aLabel
    },
    "A-": {
        Enabled: false,
        Weight: 9,
        CutOff: Math.round(0.7 * maxMarks),
        Slider: "amSlider",
        SliderVal: "amSliderVal",
        Span: amSpan,
        Label: amLabel
    },
    "B": {
        Enabled: true,
        Weight: 8,
        CutOff: Math.round(0.6 * maxMarks),
        Slider: "bSlider",
        SliderVal: "bSliderVal",
        Span: bSpan,
        Label: bLabel
    },
    "B-": {
        Enabled: false,
        Weight: 7,
        CutOff: Math.round(0.5 * maxMarks),
        Slider: "bmSlider",
        SliderVal: "bmSliderVal",
        Span: bmSpan,
        Label: bmLabel
    },
    "C": {
        Enabled: true,
        Weight: 6,
        CutOff: Math.round(0.4 * maxMarks),
        Slider: "cSlider",
        SliderVal: "cSliderVal",
        Span: cSpan,
        Label: cLabel
    },
    "C-": {
        Enabled: false,
        Weight: 5,
        CutOff: Math.round(0.3 * maxMarks),
        Slider: "cmSlider",
        SliderVal: "cmSliderVal",
        Span: cmSpan,
        Label: cmLabel
    },
    "D": {
        Enabled: true,
        Weight: 4,
        CutOff: Math.round(0.2 * maxMarks),
        Slider: "dSlider",
        SliderVal: "dSliderVal",
        Span: dSpan,
        Label: dLabel
    },
    "E": {
        Enabled: false,
        Weight: 2,
        CutOff: Math.round(0.1 * maxMarks),
        Slider: "eSlider",
        SliderVal: "eSliderVal",
        Span: eSpan,
        Label: eLabel
    },
};


function LoadData() {
    // Load Data from the TextArea
    var textAreaData = document.getElementById("copyPasteData").value;
    // Replace all the tabs and spaces in the string with comma
    var cleanedString = textAreaData.trim().replace(/[\s\n]+/g, ",");
    // Parse the numbers from the string
    var marksArray = cleanedString.split(",").map(parseFloat).filter(isFinite);
    if (marksArray.length == 0) {
        alert("Please enter marks data!");
        return false;
    }
    // Reset the studentMarks array
    studentMarks = [];
    // Reset some variables
    var average = 0.0;
    var highest = -1;
    var lowest = 999;
    for (let i = 0; i < marksArray.length; i++) {
        //Populate the global array
        let marks = marksArray[i];
        studentMarks[i] = marks;
        if (marks > highest) {
            highest = marks;
        }
        if (marks < lowest) {
            lowest = marks;
        }
        average = average + marks;
    }
    average = Math.round(average / marksArray.length);

    // Update the global variables
    totalStudents = marksArray.length;
    averageMarks = average;
    highestMarks = highest;
    lowestMarks = lowest;
    // Show some message to the user
    document.getElementById("output").innerHTML = `Number of marks = ${totalStudents}, Average = ${averageMarks}.`;
    return true;
};

function PlotHistogram() {
    // First get the data
    var success = LoadData();
    if (!success) {
        return;
    }

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
    aLabel.y = ymax + 1;
    amLabel.y = ymax + 1;
    bLabel.y = ymax + 1;
    bmLabel.y = ymax + 1;
    cLabel.y = ymax + 1;
    cmLabel.y = ymax + 1;
    dLabel.y = ymax + 1;
    eLabel.y = ymax + 1;

    // Update plot ranges, title and the average marker
    plotTitle.text = "${courseTitle} MGPA: 0.0"
    xdr.end = maxMarks + 1;
    ydr.end = ymax + 3;
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
            document.getElementById(data.SliderVal).innerHTML = data.CutOff;
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
    plotTitle.text = `${courseTitle} MGPA: ${mgpa.toFixed(2)}`;
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

