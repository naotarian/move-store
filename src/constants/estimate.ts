export enum BuildingType {
	MANSION = 'mansion',
	APARTMENT = 'apartment',
	HOUSE = 'house',
	OTHER = 'other',
}

export enum Elevator {
	YES = 'yes',
	NO = 'no',
}

export enum PeopleCount {
	ONE = '1',
	TWO = '2',
	THREE = '3',
	FOUR = '4',
}

export enum MovingDateType {
	UNDECIDED = 'undecided',
	DECIDED = 'decided',
}

export enum WorkStartTimeType {
	ANYTIME = 'anytime',
	SPECIFIC = 'specific',
}

export enum WorkStartTime {
	MORNING = 'morning',
	AFTERNOON = 'afternoon',
	EVENING = 'evening',
}

// 日本語変換関数
export const getBuildingTypeLabel = (type: BuildingType | string): string => {
	const labels: Record<string, string> = {
		[BuildingType.MANSION]: 'マンション',
		[BuildingType.APARTMENT]: 'アパート',
		[BuildingType.HOUSE]: '一戸建て',
		[BuildingType.OTHER]: 'その他',
	}
	return labels[type] || type || 'データなし'
}

export const getElevatorLabel = (elevator: Elevator | string): string => {
	const labels: Record<string, string> = {
		[Elevator.YES]: 'あり',
		[Elevator.NO]: 'なし',
	}
	return labels[elevator] || elevator || 'データなし'
}

export const getPeopleCountLabel = (
	peopleCount: PeopleCount | string
): string => {
	const labels: Record<string, string> = {
		[PeopleCount.ONE]: '1人',
		[PeopleCount.TWO]: '2人',
		[PeopleCount.THREE]: '3人',
		[PeopleCount.FOUR]: '4人以上',
	}
	return labels[peopleCount] || peopleCount || 'データなし'
}

export const getMovingDateTypeLabel = (
	dateType: MovingDateType | string
): string => {
	const labels: Record<string, string> = {
		[MovingDateType.UNDECIDED]: '決まっていない',
		[MovingDateType.DECIDED]: '決まっている',
	}
	return labels[dateType] || dateType || 'データなし'
}

export const getWorkStartTimeTypeLabel = (
	workStartTimeType: WorkStartTimeType | string
): string => {
	const labels: Record<string, string> = {
		[WorkStartTimeType.ANYTIME]: '指定しない',
		[WorkStartTimeType.SPECIFIC]: '指定する',
	}
	return labels[workStartTimeType] || workStartTimeType || 'データなし'
}

export const getWorkStartTimeLabel = (
	workStartTime: WorkStartTime | string
): string => {
	const labels: Record<string, string> = {
		[WorkStartTime.MORNING]: '午前中',
		[WorkStartTime.AFTERNOON]: '12時~15時',
		[WorkStartTime.EVENING]: '15時以降',
	}
	return labels[workStartTime] || workStartTime || 'データなし'
}
