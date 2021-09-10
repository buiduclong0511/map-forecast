export * from "./userDebounce";
export * from "./dimensionHook";

export const sleep = (delayTime: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("");
        }, delayTime);
    });
};
