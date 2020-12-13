import { useEffect, useState } from 'react';

const Route = ({ path, children }) => {
	/**
		This functional component handles the navigation to a new location when the navigation event is triggered.
		This event can be triggered by the user through the SideNavBar, or by the App to redirect the user to the modes menu 
		(after connection is established, or a new mode is saved).
	*/

	const [currentPath, setCurrentPath] = useState(window.location.hash);

	useEffect(() => {
		const onLocationChange = () => {
			setCurrentPath(window.location.hash);
		};

		window.addEventListener('popstate', onLocationChange);

		return () => {
			window.removeEventListener('popstate', onLocationChange);
		};
	}, []);

	return currentPath === path ? children : null;
};

export default Route;
