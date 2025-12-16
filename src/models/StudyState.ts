import { AllowNull, Column, DataType, Default, HasMany, IsUUID, Length, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Study } from "./Study";

@Table({
    tableName: "studyState",
    timestamps: false
})
export class StudyState extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id:string
    
    @AllowNull(false)
    @Length({ min: 2, max: 255 })
    @Column(DataType.STRING)
    state!: string;

    @HasMany(()=> Study, {as: 'study'})
    study !: Study[];
}