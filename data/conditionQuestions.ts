export interface ConditionQuestion {
    id: string;
    text: string;
    extraCost?: number;
}

export const CONDITION_QUESTIONS: ConditionQuestion[] = [
    {
        id: 'pet_hair',
        text: 'Does the vehicle have excessive pet hair?',
        extraCost: 20
    },
    {
        id: 'mud',
        text: 'Is there heavy mud or dirt on the exterior?',
        extraCost: 15
    },
    {
        id: 'mold',
        text: 'Is there any mold or mildew present?',
        extraCost: 50
    },
    {
        id: 'bodily_fluids',
        text: 'Are there any bodily fluids inside?',
        extraCost: 100
    }
];
