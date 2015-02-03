var dataInit = [   
];

var DashboardApp = React.createClass({

	getInitialState: function () {
		return {data: dataInit};
	},

	componentDidMount: function () {
			var self =this;
		           
			  $.ajax({
					 url: this.props.url,
					 dataType: 'json',
					 success: function(data2) {
						  this.setState({data:data2.choices});
					}.bind(this),
					error: function(xhr, status, err) {
						  console.error(this.props.url, status, err.toString());
					}.bind(this)
			 });
			
			
			//SignalR Code
			var vhub = $.connection.votingHub;
         
            vhub.client.showLiveResult = function (data) {
				var obj = $.parseJSON(data);	
				self.setState({data: obj});							                
            };	

			$.connection.hub.start();	



	},

	render: function() {
		return (
            <div className="dashboardapp">     		 			  
				<D3PieChart data={this.state.data} title="Fruits"/>			   
            </div>
        );
	}

});


React.render(<DashboardApp  url="/home/surveyquiz"  />, document.getElementById('chartResult'));