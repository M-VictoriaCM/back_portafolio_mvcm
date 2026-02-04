import { AllowNull, BeforeCreate, BeforeUpdate,  Column, DataType, Default, HasMany, IsEmail, IsUUID, Length, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import bcrypt from 'bcrypt';
import { Project } from "./Project";
import { Technology } from "./Technology";
import { Category } from "./Category";
import { Study } from "./Study";
import { Badge } from "./Badge"; 

@Table({
    tableName: 'users',
    timestamps:true
})
export class User extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(true)
    @Unique
    @Column(DataType.STRING)
    firebaseUid?: string;

    @AllowNull(false)
    @IsEmail
    @Unique
    @Column(DataType.STRING)
    email !: string;

    @AllowNull(true)
    @Length({min: 6, max:255})
    @Column(DataType.STRING)
    password ?: string;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    totpEnabled !: boolean;

    @AllowNull(true)
    @Column(DataType.TEXT)
    totpSecret ?: string;
    
    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    mfaVerified!: boolean;

    @HasMany(() => Project)
    Project!: Project[];

    @HasMany(() => Study)
    studies !: Study[];

    @HasMany(()=> Technology)
    technologyId !: Technology[];

    @HasMany(() => Category)
    categories !: Category[];

    @HasMany(() => Badge)
    badges !: Badge[];

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(instance: User) {
        if(instance.changed('password') && instance.password){
            const saltRounds = 10;
            instance.password= await bcrypt.hash(instance.password, saltRounds);
        }
    }
    async validPassword(password:string):Promise<boolean>{
        if(!this.password) return false;
        return await bcrypt.compare(password, this.password);   
    }
        
}