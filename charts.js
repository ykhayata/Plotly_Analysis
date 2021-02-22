function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesGroup = data.samples;
    //console.log(samplesGroup);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray= samplesGroup.filter(sampleObj => sampleObj.id == sample);
    //console.log(samplesArray);
    //  5. Create a variable that holds the first sample in the array.
    var firstSamples = samplesArray[0];
    console.log(firstSamples);


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = firstSamples.otu_ids;
    //console.log(otu_ids)
    otu_labels = firstSamples.otu_labels;
    //console.log(otu_labels);
    sample_values = firstSamples.sample_values;
    //console.log(sample_values);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks =otu_ids.map(ids => (`OTU  ${ids}`)).slice(0,10).reverse();
    
    //console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      plot_bgcolor: "#E5E6ED",
      paper_bgcolor: "#E5E6ED"
    
    };
    var config = {responsive: true}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, config)


    //DELIVERABLE 2
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth",
      }
    };

    var bubbleData = [bubbleTrace];
    

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture per Sample",
      xaxis: {title: "OTU ID"},
      margin: {l: 80},
      height: 500,
      width: 1000,
      hovermode: otu_labels,
      plot_bgcolor: "#E5E6ED",
      paper_bgcolor: "#E5E6ED"
    };
    
    var config = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config ); 
    });

  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // 1. Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    // 2. Create a variable that holds the first sample in the array created above
    var result = resultArray[0];
    console.log(result)
    //3. Create a variable that converts the washing freq. to a floating point number ?? it is already an integer?
    var wfreq = result.wfreq
    //map(wfreq => wfreq.parseFloat(wfreq));
    console.log(wfreq)
    // 4. Create the trace for the gauge chart.
    

    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: { text: "Scrubs per Week", font: { size: 20 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "black",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4,6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" }
        ],
        
      }
    }

    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: {text: "<b>Belly Button Washing Frequency<b>",
        y:0.80,
        font: {size: 20}},
      width: 400, 
      height: 500, 
      margin: { t: 0, b: 0 },
      paper_bgcolor: "#E5E6ED"
     
    };
    var config = {responsive: true}
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config );
  });
}