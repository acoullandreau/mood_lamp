import MaiaService from '../components/MaiaService.js';

export const fetchRules = () => {
	return (dispatch) => {
		//fetch JSON of rules
		MaiaService.getRules().then(rulesConfig => {
			dispatch({ type:'FETCH_RULES', payload:rulesConfig })
		});
	}
};

export const editRules = (rules) => {
	return (
		{
			type:'EDIT_RULES', 
			payload:rules
		}
	)
}
