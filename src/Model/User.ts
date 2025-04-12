
import { AllowNull, Column, DataType, Default, HasMany, IsEmail, IsUUID, Length, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Project } from "./Project";

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

    @AllowNull(false)
    @Length({min: 2, max:255})
    @Column(DataType.STRING)
    name !: string;
    

    @AllowNull(false)
    @Length({min: 6, max:255})
    @Column(DataType.STRING)
    password !: string;

    @HasMany(() => Project)
    Project!: Project[];

}