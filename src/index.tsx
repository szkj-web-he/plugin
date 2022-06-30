import React, { Fragment, useEffect, useRef, useState } from "react";
import { PluginComms, ConfigYML } from "@possie-engine/dr-plugin-sdk";
import { normalData, NormalItem, OptionItem } from "./normal";

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
    const stateRef = useRef(normalData(true));

    const [state, setState] = useState([...stateRef.current]);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const data: Record<string, Record<string, number>> = {};

        for (let i = 0; i < state.length; i++) {
            data[state[i].code] = {};
            for (let j = 0; j < state[i].children.length; j++) {
                const col = state[i].children[j];
                data[state[i].code][col.code] = col.value ?? 0;
            }
        }
        comms.state = data;
    }, [state]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const handleChange = (row: NormalItem, col: OptionItem, value: boolean) => {
        for (let i = 0; i < stateRef.current.length; ) {
            const rows = stateRef.current[i];
            if (rows.code === row.code) {
                for (let j = 0; j < rows.children.length; ) {
                    if (col.code === rows.children[j].code) {
                        rows.children[j].value = value ? 1 : 0;
                        j = rows.children.length;
                    } else {
                        ++j;
                    }
                }
                i = stateRef.current.length;
            } else {
                ++i;
            }
        }

        setState([...stateRef.current]);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div>
            {normalData().map((row) => {
                return (
                    <>
                        {row.children.map((item) => {
                            return (
                                <Fragment key={item.code}>
                                    <label key={item.code} htmlFor={item.code + row.code}>
                                        <input
                                            type="checkbox"
                                            id={item.code + row.code}
                                            name={row.code}
                                            key={item.code + row.code}
                                            value={item.code}
                                            onChange={(e) => {
                                                handleChange(row, item, e.currentTarget.checked);
                                            }}
                                        />
                                        {item.content}
                                    </label>
                                </Fragment>
                            );
                        })}
                        <br />
                    </>
                );
            })}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
