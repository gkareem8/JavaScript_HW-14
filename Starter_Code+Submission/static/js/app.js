// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_metadata = metadata.filter (row => row.id == parseInt(sample))[0];
    console.log(sample_metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let metadata_keys = Object.keys(sample_metadata);
    for (let i = 0; i < metadata_keys.length; i++) {

      let key = metadata_keys[i]; 
      let value = sample_metadata[key];

      // add to html
      panel.append("p").text(`${key}: ${value}`);
    }
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sample_data = samples.filter(row => row.id == sample)[0];  // Access the first matching sample
    console.log(sample_data);
    

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_data.otu_ids;
    let otu_labels = sample_data.otu_labels;
    let sample_values = sample_data.sample_values;

    // Build a Bubble Chart
    // Create the trace for the Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'YlGnBu'
      }
    };

    // Define the layout for the Bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures for Sample ' + sample,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Sample Value'
      },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_ticks = otu_ids.map(x => `OTU: ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sortedBySampleValue = sample_values
      .map((value, index) => ({
        value,
        index,
        label: otu_labels[index],
        id: otu_ids[index]
      }))
      .sort((a, b) => b.value - a.value);

    let slicedData = sortedBySampleValue.slice(0, 10);
    slicedData.reverse();

    let trace1 = {
      x: slicedData.map(object => object.value),
      y: slicedData.map(object => 'OTU ' + object.id),
      text: slicedData.map(object => object.label),
      type: "bar",
      orientation: "h"
    };

    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Sample Value' },
      yaxis: { title: 'OTU ID', tickmode: 'array' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [trace1], layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(names);

    for (let i = 0; i < names.length; i++) {
      let name = names[i];

    // Create an option 
    dropdown.append("option").text(name); //.property("value", name);
  }

    // Get the first sample from the list
    let first_sample = names [0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
