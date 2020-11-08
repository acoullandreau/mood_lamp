

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
					'startTime':'20:00',
					'withStartTime':false,
					'active':true
				},
				'onSchedule':{
					'startTime':'20:00',
					'withStartDimmingTime':false,
					'startDimmingTime':'19:45',
					'active':false
				},
			},
			'autoOff':{
				'active':true,
				'onLightLevel':{
					'startTime':'23:00',
					'withStartTime':false,
					'active':false
				},
				'onSchedule':{
					'startTime':'23:00',
					'withStartDimmingTime':false,
					'startDimmingTime':'22:30',
					'active':true
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
