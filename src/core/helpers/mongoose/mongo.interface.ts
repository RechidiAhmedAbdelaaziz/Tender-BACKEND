interface PopulateOptions {
    path: string;
    select?: string;
    match?: string;
    populate?: PopulateOptions[];
}

export interface FindOneOptions {
    fields?: string;
    populate?: PopulateOptions[];
}

export interface FindOptions extends FindOneOptions {
    limit?: number;
    skip?: number;
    sort?: string;
}
