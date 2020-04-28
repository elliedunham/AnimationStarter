//calculates the average grade of a certain 
var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}
//determines the max for scaling. 
//tried to do this by doing student.type.max, but was not working. so did it this way. 
 var getMax = function(type)
    {
        if (type == "test")
            {
                return 100;
            }
        if (type == "quizes")
            {
                return 10;
            }
        if (type == "final")
            {
                return 100; 
            }
        if (type == "homework")
            {
                return 50;
            }
    }
//number of duration
var dur = 1000;
//draws scatter plot by taking 6 parameters. 
//takes xScale and yScale parameters to properly grpah the circles

var drawScatter = function(graph, students,target,
              xProp,yProp)
{
 //xProp and yProp are the types of grades 
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
 //calculating scales
     var scales = calculateScales(graph, students, xProp, yProp )
    var xScale = scales.xScale;
    var yScale = scales.yScale;
 updateAxes(target, xScale, yScale);
    
    //full d3 algorithm which allows animation

   var dots = d3.select(target).select(".graph")
    .selectAll("circle")
    .data(students);
   
   dots.enter()
    .append("circle");
    
    dots.exit()
        .remove();
    
    d3.select(target).select(".graph")
        .selectAll("circle")
        .transition()
        .duration(dur)   
        .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));    
    })
        .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));    
    })
        .attr("r",4);
}   
//clears the scatter plot in order of the new information to be drawn. 
var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}

//creates the axes like we did in the other lab 
var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
        .attr("id", "xAxis")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
        .attr("id", "yAxis")
}


//draws the graph
//creates dimensions of the graph
var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    
    createAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(graph, students,target);
    
    setBanner("Click buttons to graphs");
    
    

}
var calculateScales = function(graph, student, xProp, yProp)
{
    var xScale = d3.scaleLinear()
        .domain([0, getMax(xProp)])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0, getMax(yProp) ])
        .range([graph.height,0])
    
    return {xScale:xScale, yScale:yScale};
     
}
//updates axes based on grade maxes
//allows animation
var updateAxes = function(target, xScale, yScale)
{
var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis);
    
    d3.select("#yAxis")
        .transition()
        .duration(dur)
        .call(yAxis);

}

//allows for when the buttons are pressed to show that particular graph
var initButtons = function(graph, students,target)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
      
        drawScatter( graph, students,target,
             "final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
    
        drawScatter(graph, students,target,"homework","quizes");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
      
        drawScatter(graph, students,target,"test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
       
        drawScatter(graph, students,target,"test","quizes");
    })
    
    
    
}
//creates heading/title of the graph being showed
var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}



var penguinPromise = d3.json("/classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});