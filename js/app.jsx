import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', function(){

	class Header extends React.Component {

		render() {
			return(
				<h1>Form Builder</h1>
			)
		}
	}
	
	class FormItem extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				data: {id: this.props.id, parentId: this.props.parentId},
				question: '',
				type: 'text',
				condition: '',
				conditionValue: '',
			};
		}
	
		handleSelectCondition = event => {
			this.setState({
				condition: event.currentTarget.value,
				data: {...this.state.data, condition: event.currentTarget.value}
			  });
		}

		handleChangeConditionValue = event => {
			this.setState({
				conditionValue: event.currentTarget.value,
				data: {...this.state.data, conditionValue: event.currentTarget.value}
			  });
		}

		handleChange = event =>{
			this.setState({
			 question: event.currentTarget.value,
			 data: {...this.state.data, question: event.currentTarget.value}
			});
	   }

		handleSelect = event =>{
			this.setState({
				type: event.currentTarget.value,
				data: {...this.state.data, type: event.currentTarget.value}
			});
			if ( typeof this.props.returnType === 'function' ){
				this.props.returnType(this.props.id, event.currentTarget.value);
			};
		}
 
		addSubInput = () => {
			if ( typeof this.props.addSubInput === 'function' ){
				this.props.addSubInput(this.props.id, this.state.type);
			};			
		}

		deleteInput = () => {
			if ( typeof this.props.toDelete === 'function' ){
				this.props.toDelete(this.props.id);
			};
		}

		componentDidUpdate() {
			sessionStorage.setItem(this.props.id, JSON.stringify(this.state.data));
		}
	
		render() {
			let condition;
			let conditionValue;
			if (this.props.type == 'yesNo') {
				condition = 
					<select  className="conditionItemLeft"
								onChange={event => this.handleSelectCondition(event)}
								value={this.state.condition}>
						<option value=''>select</option>
						<option value='Equals'>Equals</option>
					</select>;
				conditionValue = 
					<select  className="conditionItemRight"
								onChange={event => this.handleChangeConditionValue(event)}
								value={this.state.conditionValue}>
						<option value=''>select</option>
						<option value='Yes'>Yes</option>
						<option value='No'>No</option>
					</select>;
			} else {
				conditionValue = 
					<input type='text' className="conditionItemRight"
										 	 value={this.state.conditionValue}
										 	 onChange={event=>this.handleChangeConditionValue(event) }/>;
				if (this.props.type === 'number') {
					condition = 
						<select  className="conditionItemLeft"
									onChange={event => this.handleSelectCondition(event)}
									value={this.state.condition}>
							<option value=''>select</option>
							<option value='Equals'>Equals</option>
							<option value='Great than'>Great than</option>
							<option value='Less than'>Less than</option>
						</select>;
				} else if (this.props.type === 'text') {
					condition = 
					<select  className="conditionItemLeft"
								onChange={event => this.handleSelectCondition(event)}
								value={this.state.condition}>
						<option value=''>select</option>
						<option value='Equals' defaultValue>Equals</option>
					</select>;
				}; 
			}

			return(
				<div className="form" style = {{marginLeft: 40*this.props.level}}>
					<div className={(this.props.type == null) ? "nonActive" : "row"}>
						<p className="descryption">Condition</p>
						<div className="item condition">
							{condition} {conditionValue}
						</div>
					</div>
					<div className="row">
						<p className="descryption">Question</p>
						<input type='text' className="item"
                    value={this.state.question}
                    onChange={event=>this.handleChange(event) }/>
					</div>
					<div className="row">
						<p className="descryption">Type</p>
						<select  className="item"
									onChange={event => this.handleSelect(event)}
                  			value={this.state.type}>
							<option value='text'>Text</option>
							<option value='number'>Number</option>
							<option value='yesNo'>Yes / No</option>
						</select>
					</div>
					<div className="rowButtons">
					<button onClick={this.addSubInput} className="button">Add Sub-Input</button>
					<button onClick={this.deleteInput} className="button">Delete</button>
					</div>
				</div>
			)
		}
	}
	
	class Form extends React.Component {

		returnType = (id, data) => {
			if ( typeof this.props.returnType === 'function' ){
				this.props.returnType(id, data);
			};
		}

		addSubInput = (id, type) => {
			if ( typeof this.props.addSubInput === 'function' ){
				this.props.addSubInput(id, type);
			};
		}

		toDelete = id => {
			if ( typeof this.props.toDelete === 'function' ){
				this.props.toDelete(id);
			};
		}

		render() {
			const item = this.props.inputs.map( item => <FormItem 
				key={item.id} 
				id={item.id}
				type={item.type}
				level={item.level}
				parentId={item.parentId} 
				returnType={this.returnType}
				addSubInput={this.addSubInput}
				toDelete={this.toDelete}
			/> )

			return(
				<ul>
            	{item}
        		</ul>
			)
		}

	}

	class AddInput extends React.Component {

		buttonAddInput = () => {
			if ( typeof this.props.addInput === 'function' ){
				this.props.addInput();
			};
		}

		render() {
			return(
				<button onClick={this.buttonAddInput} className="buttonAdd">Add Input</button>
			)
		}
	}
	
	class App extends React.Component {
		
		constructor(props) {
			super(props);
			this.state = {
				inputs: [],
				id: 0,
			};
		}
	
		addInput = (nextId) => {
			this.setState({
				inputs: [...this.state.inputs, {id: this.state.id,  childrenId: [], level: 0}],
				id: this.state.id +1
			 });	
		}

		checkId = (id) => {
			for (let i=0; i<this.state.inputs.length; i++) {
				if (this.state.inputs[i].id===id) {
					return i;
				};
			};
		}

		addChildren = (id, array) => {
			if (typeof array[this.checkId(id)].parentId !== 'undefined') {
				array[this.checkId(array[this.checkId(id)].parentId)].childrenId.push(this.state.id);
				this.addChildren(array[this.checkId(id)].parentId, array);
			 };
		}	

		checkLevel = (id) => {
			if (typeof this.state.inputs[this.checkId(id)].parentId !== 'undefined') {
				return this.state.inputs[this.checkId(id)].level+1;
		 	} else { return 1} 
		}	

		returnType = (id, data) => {
			let temp=this.state.inputs;
			temp.map(item => {
				if (item.parentId == id) {
					item.type=data
				}
			})
			this.setState({
				inputs: temp
			 });
		}

		addSubInput = (id, type) => {
			let temp=[];
			for (var i=0; i<this.state.inputs.length;i++) {
				if (this.state.inputs[i].id===id) {
					const temp2 = this.state.inputs[i];
					temp2.childrenId=[...temp2.childrenId, this.state.id];
					temp.push(temp2);
					temp.push({id: this.state.id,  childrenId: [], parentId: id, type: type, level: this.checkLevel(id)})
				} else {
					temp.push(this.state.inputs[i]);
				};
			}
			this.addChildren(id, temp);
			this.setState({
				inputs: temp,
				id: this.state.id +1			
			 });	
		}

		toDelete = id => {
			let temp = this.state.inputs[this.checkId(id)].childrenId;
			temp.push(id);
			let inputs = this.state.inputs.filter(item => !temp.includes(item.id));
        this.setState({
            inputs: inputs
        });
		}
	
		render(){
			return (
				<div className="container">	
					<Header />
					<Form 
						inputs={this.state.inputs}
						addSubInput={this.addSubInput}
						returnType={this.returnType}
						toDelete={this.toDelete}
					/>
					<AddInput 
						addInput={this.addInput}
					/>
				</div>
			)
		}
	}

	ReactDOM.render(
		<App/>,
		document.getElementById('app')
	);

});
