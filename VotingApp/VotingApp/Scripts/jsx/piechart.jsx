var colors = ['#FD9827', '#DA3B21', '#3669C9', '#1D9524', '#971497'];
var D3Legend = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    colors: React.PropTypes.array.isRequired,
    data: React.PropTypes.array.isRequired,
  },

  render: function() {
    var color = this.props.colors;
    var data = this.props.data;
    var elements = data.map(function(item, i){
      return (
        <LegendElement color={color} xpos="0" ypos={100+i*20} data={item.name} key={i} ikey={i}/>
      )
    })

    return(
        <svg className="legend" width={this.props.width} height={this.props.height}>{elements}</svg>
    );
  }
});



var LegendElement = React.createClass({
  render: function() {
    var position =  "translate(" + this.props.xpos + "," + this.props.ypos + ")";
    return (
      <g transform={position}>
        <rect width="18" height="18" fill={this.props.color[this.props.ikey]}></rect>
        <text x="24" y="9" dy=".35em">{this.props.data}</text>
      </g>
    );
  }
});

var Sector = React.createClass({
  getInitialState: function() {
    return {text: '', opacity:'arc'};
  },
  render: function() {
    var outerRadius = this.props.width/2.2;
    var innerRadius = this.props.width/8;
    var arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);
    var data = this.props.data;
    var center = "translate(" + arc.centroid(data) + ")";
    var percentCenter = "translate(0,3)";
    var color = this.props.colors;
    return (
      <g onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}>
        <path className={this.state.opacity} fill={colors[this.props.ikey]} d={arc(this.props.data)}></path>
        <text fill="white" transform={center} textAnchor="middle" fontSize="15px">{data.value}</text>
        <text fill={colors[this.props.ikey]} stroke={color} fontSize="15px" transform={percentCenter} textAnchor="middle">{this.state.text}</text>
      </g>
    );
  },

  onMouseOver: function() {
    this.setState({text: '', opacity:'arc-hover'});
    var percent = (this.props.data.value/this.props.total)*100;
    percent = percent.toFixed(1);
    this.setState({text: percent + " %"});
  },
  onMouseOut: function() {
    this.setState({text: '', opacity:'arc'});
  },
  onClick: function() {
    alert("You clicked "+this.props.name);
  }
});

var DataSeries = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    color: React.PropTypes.array,
    data: React.PropTypes.array.isRequired,
  },
  render: function() {
    var color = this.props.colors;
    var data = this.props.data;
    var width = this.props.width;
    var height = this.props.height;
    var pie = d3.layout.pie();
    var result = data.map(function(item){
      return item.count;
    })
    var names = data.map(function(item){
      return item.name;
    })
    var sum = result.reduce(function(memo, num){ return memo + num; }, 0);
    var position = "translate(" + (width)/2 + "," + (height)/2 + ")";
    var bars = (pie(result)).map(function(point, i) {
      return (
        <Sector data={point} ikey={i} key={i} name={names[i]} colors={color} total=  
        {sum} width={width} height={height}/>
      )
    });

    return (
        <g transform={position}>{bars}</g>
    );
  }
});

var D3Chart = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    children: React.PropTypes.node,
  },
  render: function() {
    return (
      <svg width={this.props.width} height={this.props.height}>        
      {this.props.children}</svg>
    );
  }
});

var D3PieChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
  },

  getDefaultProps: function() {
    return {
      width: 300,
      height: 350,
      title: '',
      Legend: true,
    };
  },

  render: function() {
 
    return (
      <div>
        <h4> {this.props.title} </h4>
        <D3Chart width={this.props.width} height={this.props.height}>
              <DataSeries data={this.props.data} colors={colors} width=
                {this.props.width} height={this.props.height}/>
        </D3Chart>
        <D3Legend data={this.props.data} colors={colors} width={this.props.width - 100} height={this.props.height} />
      </div>
    );
  }
});



