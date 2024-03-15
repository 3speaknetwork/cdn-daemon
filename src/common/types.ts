export type WithInsertTime<T> = T & {
    insertedAt: Date;
};

export type RequiredRecursive<T> = T extends object ? { [K in keyof T]-?: RequiredRecursive<T[K]> } : T;