

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
				'duration':null
			},
			'autoOn':{
				'onLightLevel':{
					'active':true, 
					'startTime':null
				},
				'onSchedule':{
					'active':false, 
					'startTime':null,
					'startDimmingTime':null
				},
			},
			'autoOff':{
				'onLightLevel':{
					'active':false, 
					'startTime':null
				},
				'onSchedule':{
					'active':true, 
					'startTime':'23:00',
					'startDimmingTime':'22:30'
				},
			},
		}

		dispatch({ type:'FETCH_RULES', payload:rulesConfig })
	}

};
