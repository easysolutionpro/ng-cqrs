export interface SelectOptions<T, S>
{
    once?: boolean;
    mapTo?: (state: S) => T;
    filterBy?: (value: T) => boolean;
    debounce?: number;
    distinct?: boolean;
}
