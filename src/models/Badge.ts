import { BelongsTo, Column, DataType, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./User";

@Table({
    tableName:'badges',
    timestamps:true,
})
export class Badge extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column(DataType.STRING)
    creadly !: string; 

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;

    @BelongsTo(() => User)
    user!: User;

}