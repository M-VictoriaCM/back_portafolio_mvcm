
import { AllowNull, BeforeCreate, BeforeUpdate,  Column, DataType, Default, HasMany, IsEmail, IsUUID, Length, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Project } from "./Project";
import { Study } from "./Study";
import { Badge } from "./Badge"; 
import bcrypt from 'bcrypt';
import { Technology } from "./Technology";
import { Category } from "./Category";

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
    
    @AllowNull(false)
    @IsEmail
    @Unique
    @Column(DataType.STRING)
    email !: string;

    @AllowNull(true)
    @Unique
    @Length({ min: 3, max: 50 })
    @Column(DataType.STRING)
    username?: string;

    @Column(DataType.STRING)
    fullName ?: string;
    
    @AllowNull(true)
    @Default('https://robohash.org/tech123?size=50x50')
    @Column(DataType.STRING)
    urlAvatar?: string;

    @Column(DataType.TEXT)
    aboutMe ?: string;

    @Column(DataType.JSON)
    socialLinks ?: {linkedin ?: string, github ?: string};

    @AllowNull(false)
    @Length({min: 6, max:255})
    @Column(DataType.STRING)
    password !: string;

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
        if(instance.changed('password')){
            const saltRounds = 10;
            instance.password= await bcrypt.hash(instance.password, saltRounds);
        }
    }
    async validPassword(password:string):Promise<boolean>{
        return await bcrypt.compare(password, this.password);
    
    }
        
}