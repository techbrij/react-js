var RadioInput = React.createClass( {
    handleClick: function() {
        this.props.onChoiceSelect( this.props.choice );
    },
    render: function() {
        var disable = this.props.disable;
        var classString = !disable ?  "radio" :  "radio disabled";
        return (
            <div className={classString}>
                <label className={this.props.classType}>
                    <input type="radio" name="optionsRadios" id={this.props.index} value={this.props.choice} onChange={this.handleClick}  />
                    {this.props.choice}
                </label>
            </div>
        );
    }
} );


var QuizContainer = React.createClass( {
    getInitialState: function() {
        return {           
            current_quiz: { question : '', choices:[] },
            user_choice: "",
			is_done: false           
        };
    },
	componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState( {           
            current_quiz: data,
            user_choice: "",
			is_done: false           
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
   },
    selectedAnswer: function( option ) {
        this.setState( { user_choice: option } );
    },
    handleSubmit: function() {           			

				var selectedChoice = this.state.user_choice;
				 var vhub = $.connection.votingHub;
				  $.connection.hub.start().done(function () {				
                    // Call the Send method on the hub.
                    vhub.server.send(selectedChoice);
                    // Clear text box and reset focus for next comment.                   
				});
				this.setState({ is_done: true });
        },
    render: function() {
        var self = this;

		if (this.state.is_done === true){
			return (
				<div className="quizContainer">
					<h1>Thank you for your vote. </h1>
				</div>
			);
		}
		else 
		{
        var choices = this.state.current_quiz.choices.map( function( choice, index ) {           
            return (
                <RadioInput key={choice.name} choice={choice.name} index={index} onChoiceSelect={self.selectedAnswer} />
            );
        } );
        var button_name = "Submit";
        return(
            <div className="quizContainer">
                <h1>Quiz</h1>
                <p>{this.state.current_quiz.question}</p>
                {choices}
                <button id="submit" className="btn btn-default" onClick={this.handleSubmit}>{button_name}</button>               
            </div>
        );
		}
    }
} );

React.render(
    <QuizContainer url="/home/surveyquiz" />,
    document.getElementById('container')
);