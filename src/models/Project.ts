import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, IsUUID, Length, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";



@Table({
    tableName:'projects',
    timestamps:true
})
export class Project extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Length({min:2, max:255})
    @Column(DataType.STRING)
    title !: string;

    @AllowNull(false)
    @Length({min:2, max:255})
    @Column(DataType.STRING)
    description !: string;

    @AllowNull(true)
    @Length({min:2, max:255})
    @Default('https://robohash.org/tech123?size=150x150')
    @Column(DataType.STRING)
    image !: string;

    @AllowNull(true)
    @Length({min:2, max:255})
    @Default('https://github.com/M-VictoriaCM')
    @Column(DataType.STRING)
    repository !: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId !: string;
    
    @BelongsTo(() => User)
    user !: User;


}