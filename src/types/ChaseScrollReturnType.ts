export interface IChaseScrollReturnType<T> {
    content: T;
        pageable: {
            sort: { sorted: boolean, unsorted: boolean, empty: boolean },
            pageNumber: number,
            pageSize: number,
            offset: number,
            paged: boolean,
            unpaged: boolean
        },
     totalPages: number;
     totalElements: number;
     last: boolean;
     size: number;
     number: number;
     sort: { sorted: false, unsorted: true, empty: true },
     first: true,
     numberOfElements: number;
     empty: boolean;
}