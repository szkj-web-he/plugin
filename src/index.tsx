import React, { useEffect, useRef, useState } from "react";
import { PluginComms, ConfigYML } from "@possie-engine/dr-plugin-sdk";

const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        options?: { code: string; content: string }[];
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};
const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const stateRef = useRef(
        comms.config.options?.map((item) => {
            return { code: item.code, value: 0 };
        }) ?? [],
    );

    const [state, setState] = useState([...stateRef.current]);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const data: Record<string, number> = {};
        for (let i = 0; i < state.length; i++) {
            const item = state[i];
            data[item.code] = item.value;
        }
        console.log(JSON.stringify(data));
        comms.state = data;
    }, [state]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const handleChange = (item: { code: string; content: string }, value: boolean) => {
        for (let i = 0; i < stateRef.current.length; ) {
            if (stateRef.current[i].code === item.code) {
                stateRef.current[i].value = value ? 1 : 0;
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
            {comms.config.options?.map((item) => {
                return (
                    <label key={item.code} htmlFor={item.code}>
                        <input
                            id={item.code}
                            value={item.code}
                            name="多选"
                            type="checkbox"
                            onChange={(e) => handleChange(item, e.currentTarget.checked)}
                        />
                        {item.content}
                    </label>
                );
            })}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
