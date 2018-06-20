import React, { Component } from 'react';
import {
	StyleSheet, Text,
	View,
	TouchableOpacity
} from 'react-native';
/* TODO:
 *	1) Realtime calculations, on pressing =, implement the long press action instead <== DONE
 *
 *
 */
export default class App extends Component {
	state= {
		resultText: '',
		calculationText: '',
	}
	clearResultText = () => {
		this.setState({resultText: ''});
	}
	removeResultDigit = () => {
		this.setState({resultText: this.state.resultText.slice(0,-1)})
	}
	truncate(number,digits) {
		if((number%1))
		{
			number = (number*Math.pow(10,digits)-(number*Math.pow(10,digits))%1)/Math.pow(10,digits)
		}
		console.log("truncated number is : " + number);
		return number
		
	}
	calculateResult(realTimeExpression, flag) {
		//flag just has the value of true if there is a operator at the end of the expression when pressing =
		let newExpression = realTimeExpression
		if(flag)
		{
			newExpression = newExpression.slice(0,-1);
		}
		newExpression = newExpression.split('');
		for(let i=0;i<newExpression.length; i++)
		{
			if(newExpression[i]==='÷')  newExpression[i]='/';
			if(newExpression[i]==='×')	newExpression[i]='*';
		}
		newExpression = newExpression.join('')
		console.log("Is there an operator at end? : " + flag, "\nEvaluated Expression is : " + newExpression)
		this.setState({calculationText: eval(newExpression)});
		return 
	}
	copyToResultText = () => {
		let x = this.state.calculationText + '';
		x = this.truncate(x,3)
		this.setState({resultText: x + ''});
		this.setState({calculationText: ''});
	}
	realTimeEval = (pressedButton) => {
		const operations = ['+', '-', '×', '÷']
		let realTimeExpression = this.state.resultText + pressedButton;
		const lastInputChar = realTimeExpression.split('').pop()
		console.log("Answer text at this time : " + realTimeExpression, 
					"\nAnswer text at n-1 in result text is : " + lastInputChar);
		var flag = false;
		if(operations.indexOf(lastInputChar)>=0)
		{	
			flag = true;
		}
		return this.calculateResult(realTimeExpression,flag);
		
	}
	buttonPressed(pressedButton) {
		const operations = ['+', '-', '×', '÷']
		//console.log(this.state.resultText);
		const lastInputChar = this.state.resultText.split('').pop()
		if(pressedButton==='=')
		{
			this.copyToResultText();
		}	//calculate result and return answer
		else if(operations.indexOf(lastInputChar)>=0 && operations.indexOf(pressedButton)>=0)
		{
			let removeLastCharAndReplace = this.state.resultText.slice(0,-1)
			this.setState({resultText: removeLastCharAndReplace + pressedButton});
			return
			
		}//if past was a operation disallow adding new operator
		else if((pressedButton==='+'||pressedButton==='×'||pressedButton==='÷'||pressedButton==='-') && this.state.resultText==='') 
			return 	//Empty textbox means no sign will be accepted
		else
			this.setState({resultText: this.state.resultText + pressedButton});
		if(pressedButton!=='=')
			this.realTimeEval(pressedButton);
		console.log(this.state.resultText ? this.state.resultText : 'Nada' , pressedButton ? pressedButton : 'Nada', this.state.calculationText ? this.state.calculationText : 'Nada'  , lastInputChar ? lastInputChar : 'Nada');
			
	}
	render() {
		// For Rendering the numbers on the screen
		let elems = []
		var count = [[7,8,9],[4,5,6],[1,2,3]]
		for(let i=0; i<3; i++)	{
			let row = []
			for(let j=0;j<3;j++) {
				row.push(
					<TouchableOpacity key={count[i][j]} onPress={() => this.buttonPressed(count[i][j])} style={styles.numberBox}>
						<Text style={styles.numpad}>{count[i][j]}</Text>
					</TouchableOpacity>
				);
			}
			elems.push(
				<View key={i} style={styles.numberRow}>
					{row}
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style={styles.result}>
					<Text style={styles.resultText}>
						{this.state.resultText}
					</Text>
				</View>
				<View style={styles.calculation}>
					<Text style={styles.calculationText}>{this.state.calculationText}</Text>
				</View>
				<View style={styles.buttons}>
					<View style={styles.numbers}>
						{elems}
						<View style={styles.numberRow}>
							<TouchableOpacity onPress={() => this.buttonPressed('.')} style={styles.numberBox}>
								<Text style={styles.numpad}>.</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.buttonPressed(0)} style={styles.numberBox}>
								<Text style={styles.numpad}>0</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.buttonPressed('=')} style={styles.specialKeys}>
								<Text style={styles.numpad}>=</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.operations}>
						<TouchableOpacity onLongPress={this.clearResultText} onPress={this.removeResultDigit} style={styles.numberBox}>
							<Text style={styles.del}>DEL</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.buttonPressed('÷')} style={styles.numberBox}>
							<Text style={styles.smallSize}>÷</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.buttonPressed('×')} style={styles.numberBox}>
							<Text style={styles.smallSize}>×</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.buttonPressed('-')} style={styles.numberBox}>
							<Text style={styles.smallSize}>-</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.buttonPressed('+')} style={styles.numberBox}>
							<Text style={styles.smallSize}>+</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
	},
	result: {
		flex: 2,
		backgroundColor: '#fafafa',
		alignItems: 'flex-end',
		justifyContent: 'center',
		elevation: 5
	},
	resultText: {
		color: 'black',
		fontSize: 64
	},
	calculation: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	buttons: {
		flex: 6,
		flexDirection: 'row',
		elevation: 10,

	},
	numbers: {
		flex: 3,
		backgroundColor: '#455A64',
	},
	operations: {
		flex: 1,
		backgroundColor: '#4CAF50',
	},
	numberRow: {
		flex: 1,
		flexDirection: 'row',
		
	},
	numberBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	numpad: {
		color: 'white',
		fontSize: 28
	},
	specialKeys: {
		flex: 1,
		backgroundColor: '#607D8B',
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 10,
	},
	smallSize: {
		color: 'white',
		fontSize: 30
	},
	del:{
		color: 'white',
		fontSize: 20
	},
	calculationText: {
		fontSize: 26
	}
});
