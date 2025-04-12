import { BelongsTo, Column, DataType, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Project } from "./Project";
import { Technology } from "./Technology";

@Table({
    tableName:'projectTechnology',
    timestamps:true
})
export class ProjectTechnology extends Model{
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => Project)
    @Column(DataType.UUID)
    projectId !: string;
    
    @BelongsTo(() => Project)
    Project !: Project;

    @ForeignKey(() => Technology)
    @Column(DataType.UUID)
    technologyId !: string;
    
    @BelongsTo(() => Technology)
    Technology !: Technology;
}