import { Expose, Type } from 'class-transformer';

export class LoginResDto {
    @Expose()
    @Type(() => String) 
    _id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    phone: string;

    @Expose() 
    password?: string;

    @Expose()
    role: string;

}
