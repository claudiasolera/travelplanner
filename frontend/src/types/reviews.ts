export interface Place {
    id: string;
    name: string;
    type: string;
    photo?: string;
    rating?: number;
    review?: string;
    address?: string;
    dish?: string;
}

export interface Tip {
    id: string;
    category: string;
    content: string;
}

export interface Activity {
    id: string;
    name: string;
    type: string;
    time?: string;
    photos?: string[];
}

export const tipCategoryColors: Record<string, { bg: string; text: string }> = {
    clima:      { bg: 'bg-sky-50',    text: 'text-sky-600'    },
    transporte: { bg: 'bg-amber-50',  text: 'text-amber-600'  },
    cultura:    { bg: 'bg-purple-50', text: 'text-purple-600' },
    dinero:     { bg: 'bg-green-50',  text: 'text-green-600'  },
    seguridad:  { bg: 'bg-red-50',    text: 'text-red-600'    },
};