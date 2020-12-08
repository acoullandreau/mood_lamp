export const initRules = (rulesConfig) => {
	return { type:'FETCH_RULES', payload:rulesConfig };
};

export const editRules = (rules) => {
	return (
		{
			type:'EDIT_RULES',
			payload:rules
		}
	)
}
