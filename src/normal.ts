import { comms } from ".";

export interface OptionItem {
    code: string;
    content: string;
}

export interface NormalItem extends OptionItem {
    children: (OptionItem & { value: number | null })[];
}

export const normalData = (): NormalItem[] => {
    const rows = comms.config.options?.[0] ?? [];
    const cols = comms.config.options?.[1] ?? [];

    const arr: NormalItem[] = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const data: NormalItem = {
            code: row.code,
            content: row.content,
            children: [],
        };
        for (let j = 0; j < cols.length; j++) {
            const col = cols[j];
            data.children.push({
                code: col.code,
                content: col.content,
                value: null,
            });
        }
        arr.push(data);
    }
    return arr;
};
