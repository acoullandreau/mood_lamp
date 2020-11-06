

export const fetchRules = () => {
	return (dispatch) => {
		//fetch JSON of rules
		const rulesConfig = {
			'dayTimeAuto': 
			{
				'active':false
			},
			'silentAutoOff':
			{
				'active':false,
				'duration':12
			},
			'autoOn':{
				'active':false,
				'onLightLevel':{
					'active':true, 
					'withStartTime':false,
					'startTime':'20:00'
				},
				'onSchedule':{
					'active':false, 
					'startTime':'20:00',
					'withStartDimmingTime':false,
					'startDimmingTime':'19:45'
				},
			},
			'autoOff':{
				'active':true,
				'onLightLevel':{
					'active':false, 
					'withStartTime':false,
					'startTime':'23:00'
				},
				'onSchedule':{
					'active':true, 
					'startTime':'23:00',
					'withStartDimmingTime':false,
					'startDimmingTime':'22:30'
				},
			},
		}

		dispatch({ type:'FETCH_RULES', payload:rulesConfig })
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
