// The controller class will interact with the data and the plot based on the user input
class Controller {
    constructor() {
        // Store the references to important HTML elements
        this.scoresTextArea = document.getElementById("copyPasteData");
        this.maxScoreInput = document.getElementById("courseTotalInput");
        this.courseTitleInput = document.getElementById("courseTitleInput");
        // The elements controlling the grade markers
        this.gradePrefixes = ["a", "am", "b", "bm", "c", "cm", "d", "e"];
        this.checkboxes = [];
        this.sliders = [];
        this.spinners = [];
        for (let i = 0; i < this.gradePrefixes.length; i++) {
            this.checkboxes[i] = document.getElementById(`${this.gradePrefixes[i]}Check`);
            this.sliders[i] = document.getElementById(`${this.gradePrefixes[i]}Slider`);
            this.spinners[i] = document.getElementById(`${this.gradePrefixes[i]}Spinner`);
            // Disable the controls to start with
            this.checkboxes[i].disabled = true;
            this.sliders[i].disabled = true;
            this.spinners[i].disabled = true;
            // Assign the basic callback for the checkbox
            const _this = this;
            this.checkboxes[i].addEventListener("click", function () {
                if (_this.checkboxes[i].checked) {
                    _this.sliders[i].disabled = false;
                    _this.spinners[i].disabled = false;
                } else {
                    _this.sliders[i].disabled = true;
                    _this.spinners[i].disabled = true;
                }
            });
            // Assign the callback for the slider
            this.sliders[i].addEventListener("input", function () {
              _this.spinners[i].value = _this.sliders[i].value;
            });
            // Assign the callback for the spinner
            this.spinners[i].addEventListener("input", function () {
              _this.sliders[i].value = _this.spinners[i].value;
            });
        }
        // Uncheck the minus grades and the E grade in the beginning
        document.getElementById("amCheck").checked = false;
        document.getElementById("bmCheck").checked = false;
        document.getElementById("cmCheck").checked = false;
        document.getElementById("eCheck").checked = false;

        // The output area for showing statistics
        this.averageTd = document.getElementById("tdAverage");
        this.highestTd = document.getElementById("tdHighest");
        this.lowestTd = document.getElementById("tdLowest");
        this.studentCountTd = document.getElementById("tdStudentCount");
        // The plotting div element
        this.plotDivElement = document.getElementById("plotDiv");
        // The plot button
        this.plotButton = document.getElementById("plotHistButton");
        // The download PDF button
        this.savePDFButton = document.getElementById("savePDFButton");
        this.savePDFButton.disabled = true;
        // The download grades button
        this.saveGradesButton = document.getElementById("saveGradesButton");
        this.saveGradesButton.disabled = true;
        // Assign callbacks to the buttons
        this.savePDFButton.onclick = this.savePDF;
        this.plotButton.onclick = this.plotHistogram;
        this.saveGradesButton.onclick = this.saveGrades;
    }

    // What should happen when the user clicks plot histogram
    plotHistogram = () => {
        // Construct the data object
        try {
            this.gradesData = new GradesData(this.scoresTextArea.value, parseInt(this.maxScoreInput.value));
        }
        catch (error) {
            if (error.name == "MaxScoreError") {
                alert(`Course total (${error.maxScore}) cannot be less than the highest marks (${error.highest}).`);
            }
            else if (error.name == "NoMarksError") {
                alert("Please enter valid marks data!");
            }
            return;
        }

        // Check that course total is not empty or an invalid number
        var numbers = /^[0-9\.]+$/;
        if(!this.maxScoreInput.value.match(numbers)){
            alert("Please enter a valid course total.");
            this.maxScoreInput.focus();
            return;
        }

        // Display the statistics
        this.averageTd.innerHTML = this.gradesData.average;
        this.highestTd.innerHTML = this.gradesData.highest;
        this.lowestTd.innerHTML = this.gradesData.lowest;
        this.studentCountTd.innerHTML = this.gradesData.numStudents;
        // Otherwise proceed to create a plot
        this.gradesPlot = new GradesPlot(this.plotDivElement, this.gradesData, this.courseTitleInput.value);
        // Enable the slider controls
        for (let i = 0; i < this.checkboxes.length; i++) {
            // Enable the check box for sure
            this.checkboxes[i].disabled = false;
            if (this.checkboxes[i].checked) {
                // Enable the slider and the spinner only when the checkbox is checked
                this.sliders[i].disabled = false;
                this.spinners[i].disabled = false;
            }
            // Set the spinner and slider max as per the maxScore
            this.sliders[i].max = this.gradesData.maxScore;
            this.spinners[i].max = this.gradesData.maxScore;
            this.sliders[i].value = this.gradesData.gradesArray[i].cutOff;
            this.spinners[i].value = this.gradesData.gradesArray[i].cutOff;
        }
        for (let i = 0; i < this.gradePrefixes.length; i++) {
            // Add event listeners
            var _this = this;
            this.checkboxes[i].addEventListener("click", function () { _this.updateGradeCutOffs(i); });
            this.sliders[i].addEventListener("input", function () { _this.updateGradeCutOffs(i) });
            this.spinners[i].addEventListener("change", function () { _this.updateGradeCutOffs(i) });
        }
        // Enable the save PDF and save Grades buttons
        this.savePDFButton.disabled = false;
        this.saveGradesButton.disabled = false;
    }

    // Call-back function for change in slider/spinner/checkbox value 
    updateGradeCutOffs = index => {
        // Update the grades data object
        this.gradesData.updateCutOff(index, this.checkboxes[index].checked, parseInt(this.sliders[index].value));
        // Update the plot
        this.gradesPlot.updateGradeLayouts(this.gradesData);
        // Update the sliders based on the changes
        for (let i = 0; i < this.gradePrefixes.length; i++) {
            this.sliders[i].value = this.gradesData.gradesArray[i].cutOff;
            this.spinners[i].value = this.gradesData.gradesArray[i].cutOff;
        }
    }

    // To save PDF
    savePDF = () => {
        const canvas = document.getElementsByTagName("canvas")[0];
        // Get the width and height from the image
        const domRect = canvas.getBoundingClientRect();
        const imgWidth = domRect.width;
        const imgHeight = domRect.height;
        //creates image
        //var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
        var canvasImg = canvas.toDataURL("image/png");
        //creates PDF from img
        var doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", putOnlyUsedFonts: true });
        // In Landscape mode, A4 paper has size 297 mm x 210 mm.
        // Out of that we are using 10 mm as margin on both left and right sides.
        // Now we need to rescale the height of the figure as per the aspect ratio
        const scaledImgWidth = 277;
        const scaledImgHeight = Math.round(scaledImgWidth * imgHeight / imgWidth);
        const leftMargin = 10;
        const topMargin = 15;

        // Set the y-coordinate for next PDF element.
        var yWrite = topMargin;

        // We need to vertically position the plot in the center of the page
        doc.addImage(canvasImg, 'JPEG', leftMargin, yWrite, scaledImgWidth, scaledImgHeight);

        // Update the y position
        yWrite = yWrite + scaledImgHeight + 10;

        // Create a tabular data for printing to the PDF
        const tableBody = [];
        var upperLimit = this.gradesData.maxScore;
        for (let i = 0; i < this.gradePrefixes.length; i++) {
            const gradeArray = this.gradesData.gradesArray[i];
            var tableRow = [];
            if (!gradeArray.enabled)
                tableRow = [{ content: gradeArray.label, styles: { halign: "center" } },
                { content: 0, styles: { halign: "right" } },
                { content: 0, styles: { halign: "right" } },
                { content: 0, styles: { halign: "right" } }];
            else {
                tableRow = [{ content: gradeArray.label, styles: { halign: "center" } },
                { content: gradeArray.cutOff, styles: { halign: "right" } },
                { content: upperLimit, styles: { halign: "right" } },
                { content: gradeArray.count, styles: { halign: "right" } }];
                upperLimit = gradeArray.cutOff - 1;
            }
            tableBody.push(tableRow);
        }

        // Add some text
        doc.setFontSize(14);
        doc.setTextColor("#211d70");
        doc.text("Grades Summary Table", Math.round(0.45 * scaledImgWidth), yWrite);
        doc.setFontSize(12);

        // Update the y position
        yWrite = yWrite + 5;

        // Add a table
        doc.autoTable({
            startY: yWrite,
            head: [["Grade", "Lower Limit", "Upper Limit", "Count"]],
            body: tableBody,
            headStyles: {
                fontStyle: "bold",
                halign: "center",
                fillColor: "#211d70",
                textColor: "#ffffff",
                lineWidth: 0.25,
                lineColor: "#211d70",
            },
            bodyStyles: {
                lineColor: "#211d70",
                lineWidth: 0.25,
                fillColor: "#ffffff",
            },
            alternateRowStyles: {
                fillColor: "#f2f2f7",
            },
            tableWidth: Math.round(0.3 * scaledImgWidth),
            margin: { left: Math.round(0.4 * scaledImgWidth) }
        });

        doc.save('histogram.pdf');
    }

    // The save Grades button callback
    saveGrades = () => {
        const gradesArray = this.gradesData.gradesArray;
        const scores = this.gradesData.scores;
        var csv = 'Marks,Grade\n';
        var upperLimit;
        for (const score of scores) {
            var currentGrade = -1;
            upperLimit = this.gradesData.maxScore + 1;
            for (const grade of gradesArray) {
                if (!grade.enabled) {
                    continue;
                }
                if (score >= grade.cutOff && score < upperLimit) {
                    currentGrade = grade.label;
                    upperLimit = grade.cutOff;
                    break;
                }
            }
            if (currentGrade != -1) {
                // We found a valid grade
                csv += `${score},${currentGrade}\n`
            }
            else {
                csv += `${score},NOT_FOUND\n`
            }
        }
        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'grades.csv';
        hiddenElement.click();
    }
}

// A class representing a Grade
class Grade {
    constructor(count, cutOff, enabled, label, weight) {
        this.count = count;
        this.cutOff = cutOff;
        this.enabled = enabled;
        this.label = label;
        this.weight = weight;
    }
}

// The main data class
class GradesData {
    constructor(scoresText, maxScore) {
        // Convert the text data to scores array
        try {
            this.textToScores(scoresText);
        }
        catch (error) {
            throw error;
        }
        // Save the maxScore
        this.maxScore = maxScore;
        // For easy access
        const scores = this.scores;
        // Initialize some statistics
        this.numStudents = scores.length;
        this.average = 0.0;
        this.highest = -1;
        this.lowest = 999;
				//Populate the global array with rounded marks
        for (let i = 0; i < scores.length; i++) {
						// Round up the score
					  const score = Math.ceil(scores[i]);
            if (score > this.highest) {
                this.highest = score;
            }
            if (score < this.lowest) {
                this.lowest = score;
            }
            this.average = this.average + score;
        }
        this.average = Math.round(this.average / scores.length);
        // Check for consistency of the data
        if (maxScore < this.highest) {
            throw { name: "MaxScoreError", maxScore: maxScore, highest: this.highest };
        }
        // The set of grades
        const grades = ["A", "A-", "B", "B-", "C", "C-", "D", "E"];
        // The initial cut-off for the "A" grade
        const highestGradeCutOff = 0.8;
        // Create all grade items
        this.gradesArray = [];
        for (let i = 0; i < grades.length; i++) {
            let enabled = false;
            if (i % 2 == 0) {
                enabled = true;
            }
            let cutOff = Math.round((highestGradeCutOff - i * 0.1) * maxScore);
            this.gradesArray[i] = new Grade(0, cutOff, enabled, grades[i], 10 - i);
        }
        // Calculate histogram data from the scores
        // Initialize frequency array with zeros.
        let histogram = [];
        for (let i = 0; i <= maxScore; i++) {
            histogram[i] = 0;
        }
        // Count the frequency of each score.
        for (const score of scores) {
            histogram[score]++;
        }
        // Create the bin edges for plotting a histogram
        let leftEdges = [];
        let rightEdges = [];
        let binValues = [];
        for (let i = 0; i <= maxScore; i++) {
            leftEdges[i] = -0.4 + i;
            rightEdges[i] = 0.4 + i;
            binValues[i] = i;
        }
        // Update the histogram data object based on the calculations
        this.histData = {
            top: histogram,
            left: leftEdges,
            right: rightEdges,
            binValue: binValues
        };
        // Now that initial cut-offs and the histogram bins are ready
        this.updateMGPA();
    }
    // Function to convert text to scores array
    textToScores(scoresText) {
        // Replace all the tabs and spaces in the string with comma
        const cleanedString = scoresText.trim().replace(/[\s\n]+/g, ",");
        // Parse the numbers from the string
        this.scores = cleanedString.split(",")
            .map(parseFloat)
            .filter(isFinite)
            .map(Math.round);
        if (this.scores.length == 0) {
            throw { name: "NoMarksError" };
        }
    }
    // Function to update the grade cutOff
    updateCutOff(index, status, cutOff) {
        // For easy access
        const gradesArray = this.gradesArray;
        // Enable / disable as per the status
        this.gradesArray[index].enabled = status;
        // Set the new cutOff
        gradesArray[index].cutOff = cutOff;
        // First we will traverse the `gradesArray` object in the usual sequence.
        var higherCutOff = cutOff;
        var lowerCutOff = this.maxScore;
        for (let i = index + 1; i < gradesArray.length; i++) {
            lowerCutOff = gradesArray[i].cutOff;
            if (higherCutOff <= lowerCutOff) {
                // Inconsistent lower cut-off detected. Fix it.
                lowerCutOff = Math.max(0, higherCutOff - 2);
                gradesArray[i].cutOff = lowerCutOff;
            }
            // Update the higherCutOff for the next loop iteration
            higherCutOff = lowerCutOff;
        }
        // Now we will traverse the `gradesData` object in reverse sequence of grades.
        lowerCutOff = cutOff;
        for (let i = index - 1; i >= 0; i--) {
            higherCutOff = gradesArray[i].cutOff;
            if (higherCutOff < lowerCutOff) {
                // Inconsistent higher cut-off detected. Fix it.
                higherCutOff = Math.min(this.maxScore, lowerCutOff + 2);
                gradesArray[i].cutOff = higherCutOff;
            }
            // Update the lowerCutOff for the next loop iteration
            lowerCutOff = higherCutOff;
        }
        // Finally update the MGPA again
        this.updateMGPA();
    }
    // Update MGPA
    updateMGPA() {
        // Reset MGPA
        this.mgpa = 0.0;
        // Count the number of students in each grade
        var upperLimit = this.maxScore + 1;
        var lowerLimit = 0;
        for (let i = 0; i < this.gradesArray.length; i++) {
            const data = this.gradesArray[i];
            if (!data.enabled) {
                continue;
            }
            lowerLimit = data.cutOff;
            var count = 0;
            for (let i = lowerLimit; i < upperLimit; i++) {
                count = count + this.histData.top[i];
            }
            // Set the count in the gradesArray
            data.count = count;
            // Contribution to the MGPA
            this.mgpa = this.mgpa + count * data.weight;
            // update the upperlimit for the lower grade
            upperLimit = lowerLimit;
        }
        // Normalize the MGPA
        this.mgpa = (this.mgpa / this.numStudents).toFixed(2);
    }
}

// The histogram plot
class GradesPlot {
    constructor(divElement, gradesData, title) {
        // Set the data source for the histogram quads
        const columnDataSource = new Bokeh.ColumnDataSource({ data: gradesData.histData });

        // Set the y-axis maximum value. We need some extra space for the label markers.
        let ymax = Math.max(...gradesData.histData.top);
        ymax = Math.ceil(1.25 * ymax);

        // Make the axis ranges
        const xdr = new Bokeh.Range1d({ start: -0.5, end: gradesData.maxScore + 1 });
        const ydr = new Bokeh.Range1d({ start: 0.0, end: ymax });

        // Make the figure
        this.plot = new Bokeh.Plot({
            sizing_mode: "stretch_both",
            x_range: xdr,
            y_range: ydr,
            background_fill_color: "#e5e5e5",
        });

        // For easy referencing of the plot
        const plot = this.plot;

        // Add hover tool to the plot
        const hovertool = new Bokeh.HoverTool({ tooltips: [["Score", "@binValue"], ["Count", "@top"]] });
        plot.add_tools(hovertool);

        // Add other tools
        plot.add_tools(new Bokeh.SaveTool());
        plot.add_tools(new Bokeh.BoxZoomTool());
        plot.add_tools(new Bokeh.PanTool({ dimensions: "width" }));
        plot.add_tools(new Bokeh.ResetTool());
        plot.toolbar_location = "above";

        //Give a title to the plot
        this.courseTitle = title;
        this.plotTitle = new Bokeh.Title({
            text: `${title} MGPA: ${gradesData.mgpa}`,
            align: "center",
            text_font_size: "20pt",
            text_color: "#211d70"
        });
        plot.add_layout(this.plotTitle, "above");

        // Set the axis labels
        const xaxis = new Bokeh.LinearAxis({
            axis_label: "Marks",
            axis_label_text_color: "#211d70",
            axis_label_text_font_style: "normal",
            axis_label_text_font_size: "16pt",
            major_label_text_font_size: "12pt",
            major_label_text_color: "#211d70"
        });
        const yaxis = new Bokeh.LinearAxis({
            axis_label: "Student Count",
            axis_label_text_color: "#211d70",
            axis_label_text_font_style: "normal",
            axis_label_text_font_size: "16pt",
            major_label_text_font_size: "12pt",
            major_label_text_color: "#211d70"
        });
        xaxis.ticker.desired_num_ticks = 20;
        plot.add_layout(xaxis, "below");
        plot.add_layout(yaxis, "left");

        // Add grids to the plot
        const xgrid = new Bokeh.Grid({ ticker: xaxis.ticker, dimension: 0, grid_line_color: '#ffffff' });
        const ygrid = new Bokeh.Grid({ ticker: yaxis.ticker, dimension: 1, grid_line_color: '#ffffff' });
        plot.add_layout(xgrid);
        plot.add_layout(ygrid);

        // Make the histogram
        const quad = new Bokeh.Quad({
            left: { "field": "left" },
            right: { "field": "right" },
            top: { "field": "top" },
            bottom: 0,
            //fill_color: "#e24a33",
            fill_color: "#988ed5",
            line_color: "#e5e5e5"
        });
        plot.add_glyph(quad, columnDataSource);

        // The average marker
        const averageMarker = new Bokeh.Span({
            location: gradesData.average,
            dimension: "height",
            line_color: "#211d70",
            line_dash: "dashed",
            line_width: 1
        });
        plot.add_layout(averageMarker);

        // Create a Span for each grade
        const gradesArray = gradesData.gradesArray;
        this.spans = [];
        this.labels = [];
        for (let i = 0; i < gradesArray.length; i++) {
            // Create a vertical line for the grade
            this.spans[i] = new Bokeh.Span({
                location: gradesArray[i].cutOff - 0.4,
                dimension: "height",
                line_color: "#211d70",
                line_width: 2
            });
            plot.add_layout(this.spans[i]);
            // Create a label for the grade
            this.labels[i] = new Bokeh.Label({
                x: gradesArray[i].cutOff - 0.4,
                y: (0.8 - (i % 2) * 0.1) * ymax,
                y_units: "data",
                text: `${gradesArray[i].label}: ${gradesArray[i].count}`,
                border_line_color: "black",
                background_fill_color: "wheat",
                text_font_size: "16pt",
                text_color: "#211d70"
            });
            plot.add_layout(this.labels[i]);
            // Set the visibility of the spans and labels
            this.spans[i].visible = gradesArray[i].enabled;
            this.labels[i].visible = gradesArray[i].enabled;
        }

        // Create a Label for each grade
        const avgLabel = new Bokeh.Label({
            x: gradesData.average,
            y: 0.9 * ymax,
            y_units: "data",
            text: `Avg: ${gradesData.average}`,
            text_font_size: "16pt",
            text_color: "red",
            border_line_color: "red",
            background_fill_color: "wheat",
        });
        plot.add_layout(avgLabel)
        // Construct a Bokeh document for embedding in a plot
        this.doc = new Bokeh.Document();
        this.doc.add_root(this.plot);
        // Remove any existing plot
        divElement.innerHTML = "";
        Bokeh.embed.add_document_standalone(this.doc, divElement);
    }

    // Update the grade markers
    updateGradeLayouts(gradesData) {
        const gradesArray = gradesData.gradesArray;
        for (let i = 0; i < gradesArray.length; i++) {
            // Update the spans
            this.spans[i].location = gradesArray[i].cutOff - 0.4;
            this.spans[i].visible = gradesArray[i].enabled;
            // Update the labels
            this.labels[i].x = gradesArray[i].cutOff - 0.4;
            this.labels[i].visible = gradesArray[i].enabled;
            this.labels[i].text = `${gradesArray[i].label}: ${gradesArray[i].count}`;
        }
        // Update the MGPA
        this.plotTitle.text = `${this.courseTitle} MGPA: ${gradesData.mgpa}`;
        this.plotTitle.align = "center";
    }
}

// Start the GUI!
const controller = new Controller();
