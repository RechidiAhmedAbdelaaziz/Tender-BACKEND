import { FilterQuery, Model, Document, SaveOptions, } from 'mongoose';
import { FindOneOptions, FindOptions } from './mongo.interface';
import { isArray } from 'class-validator';



export class Repository<T extends Document> {
    private allowedFields: string[];
    constructor(private readonly model: Model<T>) {
        this.allowedFields = Object.keys(model.schema.obj);
    }

    async create(data: Partial<T>, options?: SaveOptions) {
        const doc = new this.model(data);

        return await doc.save(options);
    }


    find(query: FilterQuery<T>, options?: FindOptions) {
        if (options?.fields) options.fields = this.filterFields(options.fields);

        return this.model.find(query)
            .select(options?.fields)
            .populate(options?.populate)
            .limit(options?.limit)
            .skip(options?.skip)
    }


    findOne(query: FilterQuery<T>, options?: FindOneOptions) {
        if (options?.fields) options.fields = this.filterFields(options.fields);

        return this.model.findOne(query)
            .select(options?.fields)
            .populate(options?.populate)
    }


    private filterFields(fields: string) {
        return fields.split(' ').filter((field_) => {
            const field = field_.replace(/^[+-]/, '');
            return this.allowedFields.includes(field);
        }

        ).join(' ');
    }
}