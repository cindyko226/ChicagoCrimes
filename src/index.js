



let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg.attr('viewBox', '250 100 600 600');

let scale = 0.70,
    w = 1400 * scale,
    h = 1200 * scale,
    data = [],
    map_portion = 0.65;

let projection = d3.geoAlbers()
    .translate([(w * map_portion) / 2, h / 2])
    .scale(82000)
    .rotate([87.750, 0])
    .center([0, 41.825]);




let path = d3.geoPath()
    .projection(projection);

let promises = [
    d3.json("wards.json"),
    d3.csv('data.csv')
];

let g = svg.append('g');


let colorset = ["red", "plum", "yellow", "blue", "pink","green",'white', ''];





Promise.all(promises).then(ready);      



function ready([chicago, data]) {

    let precincts = topojson.feature(chicago, chicago.objects.wards);

    
       g.attr("class", "precinct")
        .selectAll("path")
        .data(precincts.features)
        .enter()
        .append("path")
        .attr("d", path);

       g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle') 
        .attr('cx', function(d){
            return projection([d.Longitude,d.Latitude])[0];
        })
        .attr('cy', function(d){
            return projection([d.Longitude, d.Latitude])[1];
        })
        .attr('r', "3")
        .style('fill', function(d){
            if (d.PrimaryType === "THEFT" || d.PrimaryType === "MOTOR VEHICLE THEFT") {
                return "red";
            } else if (d.PrimaryType === "BATTERY" || d.PrimaryType === "ASSAULT") {
                return "plum";
            } else if (d.PrimaryType === "WEAPONS VIOLATION" || d.PrimaryType === "CRIM SEXUAL ASSAULT") {
                return "yellow";
            } else if (d.PrimaryType === "BURGLARY" || d.PrimaryType === "ROBBERY") {
                return "blue";
            } else if (d.PrimaryType === "NARCOTICS") {
                return "pink";
            } else if (d.PrimaryType === "OTHER OFFENSE" || d.PrimaryType === "OFFENSE INVOLVING CHILDREN") {
                return "green";
            } else {
                return "white";
            }
        })
        .style('stroke', 'none')
        .attr('class', function(d){
            if (d.PrimaryType === "THEFT" || d.PrimaryType === "MOTOR VEHICLE THEFT") {
                return "red";
            } else if (d.PrimaryType === "BATTERY" || d.PrimaryType === "ASSAULT") {
                return "plum";
            } else if (d.PrimaryType === "WEAPONS VIOLATION" || d.PrimaryType === "CRIM SEXUAL ASSAULT") {
                return "yellow";
            } else if (d.PrimaryType === "BURGLARY" || d.PrimaryType === "ROBBERY") {
                return "blue";
            } else if (d.PrimaryType === "NARCOTICS") {
                return "pink";
            } else if (d.PrimaryType === "OTHER OFFENSE" || d.PrimaryType === "OFFENSE INVOLVING CHILDREN") {
                return "green";
            } else {
                return "white";
            }
        })
        .on('mouseover', function(d){
            d3.selectAll('circle').style('opacity', 0.7);
            d3.select(this)
              .style("opacity", 1)
              .attr("r", 20);
            d3.select("#date").text(d.Date);
            d3.select("#location").text(d.Block);
            d3.select("#primarytype").text( d.PrimaryType);
            d3.select("#arrest")
                .text(d.Arrest)
                .style('color', (d.Arrest === "true") ? "green" : "red");
            d3.select('#tooltip')
                .style('left', (d3.event.pageX + 20) + 'px')
                .style('top', (d3.event.pageY - 80) + 'px')
                .style('display', 'block')
           
                
                
        })
        .on('mouseout', function (d) {
            d3.selectAll('circle').style('opacity', 1)
            d3.select(this).attr("r", 3);
            d3.select('#tooltip')
                .style('display', 'none');
        });
        
  

        g.selectAll("rect")
          .data(colorset)
          .enter()
          .append("rect")
          .attr("height", 20)
          .attr("x", 500)
          .attr("y", function(d, i) {
            return 130 + (i * 30);
          })
          .attr("width", 20)
          .attr("fill", function(d) {
            return d;
          })
          .attr("class", "colorbar")
          .style('stroke', 'none')
          .on('click', function(d){
              if(d === 'red'){
                  d3.selectAll('circle').style('display','none');
                  d3.selectAll('.red').style('display', 'block');
              }else if( d === 'plum'){
                  d3.selectAll('circle').style('display', 'none');
                  d3.selectAll('.plum').style('display', 'block');
              } else if (d === 'yellow'){
                  d3.selectAll('circle').style('display', 'none');
                  d3.selectAll('.yellow').style('display', 'block');
              }else if (d === 'blue'){
                  d3.selectAll('circle').style('display', 'none');
                  d3.selectAll('.blue').style('display', 'block');
              }else if (d === 'pink'){
                  d3.selectAll('circle').style('display', 'none');
                  d3.selectAll('.pink').style('display', 'block');
              }else if ( d === 'green'){
                  d3.selectAll('circle').style('display', 'none');
                  d3.selectAll('.green').style('display', 'block');
              }else if (d === 'white'){
                  d3.selectAll('circle').style('display', 'none');
                  d3.selectAll('.white').style('display', 'block');
              }else{
                  d3.selectAll('circle').style('display', 'block');
              }
          });





    let numberRed = d3.selectAll('.red').size();
    let numberPlum = d3.selectAll('.plum').size();
    let numberYellow = d3.selectAll('.yellow').size();
    let numberBlue = d3.selectAll('.blue').size();
    let numberPink= d3.selectAll('.pink').size();
    let numberGreen = d3.selectAll('.green').size();
    let numberWhite = d3.selectAll('.white').size();


    let textset = {
        type: [`THEFT / MOTOR VEHICLE THEFT - ${numberRed} ` ,
            `BATTERY / ASSAULT - ${numberPlum}`,
            `WEAPONS VIOLATION / CRIM SEXUAL ASSAULT - ${numberYellow}`,
            `BURGLARY / ROBBERY - ${numberBlue}`,
            `NARCOTICS - ${numberPink}`,
            `OTHER OFFENSE / OFFENSE INVOLVING CHILDREN - ${numberGreen}`,
            `HOMICIDE / OTHERS - ${numberWhite}`,
            "SHOW ALL",
            "CLICK COLOR SQUARE TO FILTER CRIMES",
            "=> HOVER ON CIRCLE TO SEE DETAILS"]
       
    };
    
    
       
        g.selectAll("text")
        .data(textset.type)
        .enter()
        .append("text")
        .text((d) => d)
        .attr("x", 550)
        .attr("y", function(d, i){
            if (d === "=> HOVER ON CIRCLE TO SEE DETAILS"){
                return 500;
            }else{
                return 145 + (i * 30);
            }
        })
        .style('stroke', function (d) {
            if (
              d === "CLICK COLOR SQUARE TO FILTER CRIMES" 
            ) {
              return "Aqua";
            } else if (d === "=> HOVER ON CIRCLE TO SEE DETAILS"){
                return 'Brown';
            } else {
              return "white";
            }
            })
        .style('fill', function(d) {
            if (
              d === "CLICK COLOR SQUARE TO FILTER CRIMES"
            ) {
              return "Aqua";
            } else if (d === "=> HOVER ON CIRCLE TO SEE DETAILS"){
                return 'Brown';
            } else {
              return "white";
            }
        })
        .style('font-family', 'Arial')
        .attr('class', function(d){
            if (
              d === "CLICK COLOR SQUARE TO FILTER CRIMES" 
            ) {
              return "pulse";
            }
        });
        
       

    }
    
                         