

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
				'onLightLevel':{
					'active':true, 
					'startTime':'20:00'
				},
				'onSchedule':{
					'active':false, 
					'startTime':'20:00',
					'startDimmingTime':'19:45'
				},
			},
			'autoOff':{
				'onLightLevel':{
					'active':false, 
					'startTime':'23:00'
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
