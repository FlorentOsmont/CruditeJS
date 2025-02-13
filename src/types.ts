// Définition des types centralisés

export interface DateRange {
    start: string;
    end: string;
}

export interface Column {
    key: string;
    label: string;
    type: string;
    visible: boolean;
    filter?: string;
    choices?: string[];
    value?: string | boolean | DateRange;
}
