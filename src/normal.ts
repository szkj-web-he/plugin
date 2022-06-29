import { comms } from ".";

export interface OptionItem {
    code: string;
    content: string;
}

export interface NormalItem extends OptionItem {
    children: (OptionItem & { value?: number })[];
}

export const normalData = (isState?: boolean): NormalItem[] => {
    const rows = comms.config.options?.[0] ?? [];
    const cols = comms.config.options?.[1] ?? [];

    const arr: (OptionItem & { children: OptionItem[] })[] = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const data: NormalItem = {
            code: row.code,
            content: row.content,
            children: [],
        };
        for (let j = 0; j < cols.length; j++) {
            const col = cols[j];
            data.children.push(
                isState
                    ? {
                          code: col.code,
                          content: col.content,
                          value: 0,
                      }
                    : {
                          code: col.code,
                          content: col.content,
                      },
            );
        }
        arr.push(data);
    }
    return arr;
};
