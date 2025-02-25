import { Expose } from 'class-transformer';

export class LoginResDto {
    @Expose()
    _id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    password: string;

    @Expose()
    role: string;

}
