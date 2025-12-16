import { 
  PrimaryKey, Model, IsUUID, DataType, Default, Column, Table, 
  ForeignKey, BelongsTo, AllowNull 
} from "sequelize-typescript";
import { User } from "./User";
import { StudyType } from "./StudyType";
import { StudyState } from "./StudyState";

@Table({
  tableName: "studies",
  timestamps: false,
})
export class Study extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  institution!: string;

  @Column(DataType.INTEGER)
  startYear?: number;

  @Column(DataType.INTEGER)
  endYear?: number;

  @ForeignKey(() => StudyType)
  @AllowNull(false)
  @Column(DataType.UUID)
  studyTypeId!: string;

  @ForeignKey(() => StudyState)
  @AllowNull(false)
  @Column(DataType.UUID)
  studyStateId!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => StudyType, { foreignKey: "studyTypeId" })
  studyType!: StudyType;

  @BelongsTo(() => StudyState, { foreignKey: "studyStateId" })
  studyState!: StudyState;
}
