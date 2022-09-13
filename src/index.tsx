import { ConfigYML, PluginComms } from "@possie-engine/dr-plugin-sdk";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { normalData, OptionItem } from "./normal";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        options?: [OptionItem[], OptionItem[]];
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};
const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const stateRef = useRef(normalData());

    const [state, setState] = useState([...stateRef.current]);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const data: Record<string, Record<string, number | null>> = {};
        for (let i = 0; i < state.length; i++) {
            const row = state[i];
            data[row.code] = {};
            for (let j = 0; j < row.children.length; j++) {
                const col = row.children[j];
                data[row.code][col.code] = col.value;
            }
        }
        console.log(JSON.stringify(data));
        comms.state = data;
    }, [state]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const handleChange = (col: OptionItem, index: number, value: string) => {
        const cols = stateRef.current[index].children;
        for (let i = 0; i < cols.length; ) {
            const item = cols[i];
            if (item.code === col.code) {
                item.value = value ? Number(value) : null;
                i = cols.length;
            } else {
                ++i;
            }
        }

        setState([...stateRef.current]);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div>
            {state.map((row, n) => {
                return (
                    <Fragment key={n}>
                        {row.children.map((col) => {
                            return (
                                <Fragment key={col.code}>
                                    {col.content} :
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            handleChange(col, n, e.currentTarget.value)
                                        }
                                    />
                                </Fragment>
                            );
                        })}

                        <br />
                    </Fragment>
                );
            })}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
