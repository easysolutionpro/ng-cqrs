import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { SelectOptions } from './types';

export class Store<S>
{
    private readonly state: BehaviorSubject<S>;
    private readonly defaultState: S;

    constructor(defaultState: S)
    {
        this.state        = new BehaviorSubject<S>(defaultState);
        this.defaultState = defaultState;
    }

    public select(): Observable<S>;
    public select<T>(options: SelectOptions<T, S>): Observable<T>;
    public select<T>(options: SelectOptions<T, S> = {
        once    : false,
        filterBy: undefined,
        mapTo   : undefined,
        debounce: undefined,
        distinct: true
    }): Observable<T|S>
    {
        let subject: Observable<T|S>                        = this.state.asObservable();
        const { once, filterBy, mapTo, debounce, distinct } = options;

        if (mapTo)
        {
            subject = subject.pipe(map(mapTo));
        }

        if (filterBy)
        {
            subject = subject.pipe(filter(filterBy));
        }

        if (distinct !== false)
        {
            subject = subject.pipe(distinctUntilChanged());
        }

        if (debounce)
        {
            subject = subject.pipe(debounceTime(debounce));
        }

        if (once)
        {
            subject = subject.pipe(first());
        }

        return subject;
    }

    public getValue(): S;
    public getValue<T>(selector: (state: S) => T): T;
    public getValue<T>(selector?: (state: S) => T|S): T|S
    {
        selector = selector || (state => state);
        return selector(this.state.getValue());
    }

    public reduce(reducer: (state: S) => S): void
    {
        const newState = reducer(this.state.value);
        this.state.next(newState);
    }

    public update(update: Partial<S>): void
    {
        this.reduce(state =>
        {
            return { ...state, ...update };
        });
    }

    public reset(): void
    {
        this.state.next(this.defaultState);
    }
}

export default function createStore<S>(defaultState: S): Store<S>
{
    return new Store(defaultState);
}
