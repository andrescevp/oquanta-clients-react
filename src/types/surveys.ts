import type { IconType } from 'react-icons';

import {
    ElementOptionsBlock,
    ElementOptionsChoice,
    ElementOptionsLoop,
    ElementOptionsNumber,
    ElementOptionsString,
    ElementOptionsText,
    SurveyModel,
    SurveyRequestChildrenInner,
} from '../api-generated';

export type QuestionType = 'choice' | 'string' | 'number';
export type SpecialType = 'quota' | 'marker' | 'termination' | 'text';
export type FlowControlType = 'block' | 'loop' | 'break_page';
export type SurveyElementType = QuestionType | SpecialType | FlowControlType;
export interface SurveySortableItem {
    /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. DO NOT USE TO IDENTITY AN ENTITY use uuid instead*/
    id: string | number;
    /** When true, the item is selected using MultiDrag */
    selected?: boolean;
    /** When true, the item is deemed "chosen", which basically just a mousedown event. */
    chosen?: boolean;
    /** When true, it will not be possible to pick this item up in the list. */
    filtered?: boolean;
    /** Identifier of the entity */
    uuid: string;
}

export type SurveyQuestionElementOptions = ElementOptionsString | ElementOptionsNumber | ElementOptionsChoice;
export type SurveyElementOptions =
    | ElementOptionsBlock
    | ElementOptionsLoop
    | ElementOptionsText
    | SurveyQuestionElementOptions;

export type SurveyElement =
        SurveyRequestChildrenInner extends Omit<SurveyRequestChildrenInner, 'options'>
        ? SurveyRequestChildrenInner & SurveySortableItem
        : SurveyRequestChildrenInner & SurveySortableItem & { options: SurveyElementOptions };

export type ISurvey = SurveyModel;

export interface ITypeConfig<T extends SurveyRequestChildrenInner> {
    default?: T;
    type: T['type'] | string;
    label: string;
    icon: IconType;
    group?: string;
}

export type ItemChangedReason = 
    | 'sorted'
    | 'dropped'
    | 'dropped_into'
    | 'removed'
    | 'moved';
