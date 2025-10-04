import { Model } from "sequelize-typescript";
import { AllowNull, Column, DataType, Default, HasMany, IsUUID, Length, PrimaryKey, Table } from "sequelize-typescript";
import { Technology } from "./Technology";


@Table({
    tableName:'categories',
    timestamps:true
})
export class Category extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Length({ min: 2, max: 255 })
    @Column(DataType.STRING)
    title!: string;

    @AllowNull(true)
    @Length({ min: 2, max: 255 })
    @Default("default-icon")
    @Column(DataType.STRING)
    icon!: string;

    // 👇 Relación inversa
    @HasMany(() => Technology, { as: "skills" })
    skills!: Technology[];

}