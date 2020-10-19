import React from 'react';
import logo from './image_library/logo.svg';
import SideNavBar from './SideNavBar.js';

class App extends React.Component {

	render() {
		return (
			<div className="App">
				<div id='logo'>
					<img src={logo} alt='Maïa' />
				</div>
				<div className='nav-bar'>
					<SideNavBar/>
				</div>

			</div>
		);

  }
}

export default App;
