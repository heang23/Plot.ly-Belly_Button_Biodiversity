function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var filteredData = metadata.filter(sampleobject => sampleobject.id == sample);
    var DATA = filteredData[0];
    var meta_panel = d3.select("#sample-metadata");
    meta_panel.html("");
    Object.entries(DATA).forEach(([key, value]) => {
      meta_panel.append("h6").text(`${key}: ${value}`);
      console.log(key, value);
        });
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var filteredData = samples.filter(sampleobject => sampleobject.id == sample);
    var DATA = filteredData[0];
    // Step 1: Plotly
    var ids = DATA.otu_ids;
    var labels = DATA.otu_labels;
    var values = DATA.sample_values;
    console.log(ids, labels, values);

    // Create a bar chart
    var barData = [{
      y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: values.slice(0, 10).reverse(),
      text: labels.slice(0, 10).reverse(),
      //y: ids,
      //x: values,
      //text: labels,
      type: "bar",
      orientation: "h"
    }];
    // Define our bar chart's layout
    var barlayout = {
      title: "Top 10 OTUs fount in that individual",
      margin: { t: 50, l: 150}
    };
    // Plot the chart
    Plotly.newPlot("bar", barData, barlayout);

    // Build Bubble chart
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
      }
    }];
    
    var bubblelayout = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID"},
      hovermode: "closest",
    }

    Plotly.newPlot("bubble", bubbleData, bubblelayout);
    });
}

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
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();