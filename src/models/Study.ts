import { PrimaryKey, Model, IsUUID, DataType, Default, Column, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

/**
 * Modelo de Estudio
*/
@Table({
    tableName: "studies",
    timestamps: false,
})

export class Study extends Model{
   @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    title !: string;

    @Column(DataType.STRING)
    institution !: string;

    @Column(DataType.INTEGER)
    startYear ?: number;

    @Column(DataType.INTEGER) //este campo es opcional
    endYear ?: number;

    @ForeignKey(()=> User)
    @Column(DataType.UUID)
    userId !: string;

    @BelongsTo(() => User)
    user!: User;

}

