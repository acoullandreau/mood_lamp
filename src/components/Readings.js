import React from 'react';
import MaiaService from './MaiaService.js';
import configJSON from '../config.json';

class Readings extends React.Component {

	intervalID;
	state = {'lastUpdate':'', 'measures':{}};

	componentDidMount() {
		//fetch the current values of the measurements
		this.getReadings();
		this.getGridSize();
	}

	componentDidUpdate() {
		this.getGridSize();
	}

	componentWillUnmount() {
		//clear the timeout
		clearTimeout(this.intervalID);
	}

	getGridSize() {
		// we ensure that we have a grid the right size
		var numRows = Math.ceil(Object.keys(this.state.measures).length / 2)
		if (this.props.target === 'desktop') {
			document.getElementById("readings-grid").style['grid-template-rows'] = `repeat(${numRows}, minmax(150px, 20vh))`;
		} else {
			document.getElementById("readings-grid").style['grid-template-rows'] = `repeat(${numRows}, minmax(75px, 40vh))`;
		}
	}

	getReadings = () => {
		//this function runs every 500 ms
		MaiaService.getReadings()
		.then(measures => {
			this.setState({ 'lastUpdate':Date.now(), measures: {...measures} });
			this.intervalID = setTimeout(this.getReadings, 500);
		})
	}

	renderTile(item) {
		var measure = this.state.measures[item];
		var title = configJSON.readingsSettings[item]['title'];
		var unit = configJSON.readingsSettings[item]['unit'];
		var img = configJSON.readingsSettings[item]['img'];

		if (this.props.target === 'desktop') {
			return (
				<div className="reading-tile">
					<div className={["reading-title", "grid-row-one"].join(' ')}>{title}</div>
					<div className="reading-measure">
						<div className={["reading-icon", "column-one"].join(' ')}><img  src={`${process.env.PUBLIC_URL}/assets/images/${item}.svg`} alt={title} /></div>
						<div className={["reading-text", "column-two"].join(' ')}>{measure} {unit}</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="reading-tile">
					<div className={["reading-title", "grid-row-one"].join(' ')}>
						<div className={["reading-icon", "column-one"].join(' ')}><img  src={`${process.env.PUBLIC_URL}/assets/images/${item}.svg`} alt={title} /></div>
						<div className={["reading-text", "column-two"].join(' ')}>{title}</div>
					</div>
					<div className="reading-measure">{measure} {unit}</div>
				</div>
			)
		}
	}

	render() {

		return (
			<div id="readings-grid">
				{
					React.Children.toArray(
						Object.keys(this.state.measures).map((item, i) => {		
							return this.renderTile(item)
						})
					)
				}
			</div>
		)
	}
}

export default Readings;