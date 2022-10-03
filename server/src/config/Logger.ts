const getTimeStamp = (): string => {
    return new Date().toLocaleString();
};

const info = (namespace: string, message: string, object?: any) => {
    if (object) console.info(`[INFO] [${getTimeStamp()}] [${namespace}] ${message}`, object);
    else console.info(`[INFO] [${getTimeStamp()}] [${namespace}] ${message}`);
};

const warn = (namespace: string, message: string, object?: any) => {
    if (object) console.warn(`[WARN] [${getTimeStamp()}] [${namespace}] ${message}`, object);
    else console.warn(`[WARN] [${getTimeStamp()}] [${namespace}] ${message}`);
};

const error = (namespace: string, message: string, object?: any) => {
    if (object) console.error(`[ERROR] [${getTimeStamp()}] [${namespace}] ${message}`, object);
    else console.error(`[ERROR] [${getTimeStamp()}] [${namespace}] ${message}`);
};

const debug = (namespace: string, message: string, object?: any) => {
    if (object) console.debug(`[DEBUG] [${getTimeStamp()}] [${namespace}] ${message}`, object);
    else console.debug(`[DEBUG] [${getTimeStamp()}] [${namespace}] ${message}`);
};

export default {
    info,
    warn,
    error,
    debug,
};
