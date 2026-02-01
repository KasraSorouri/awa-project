import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../configs/database';

interface IShareAttributes {
  id: number;
  fileId: number;
  link: string;
  expires_at:Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IShareCreationAttributes extends Optional<IShareAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

class Share extends Model<IShareAttributes, IShareCreationAttributes> implements IShareAttributes {
  declare id: number;
  declare fileId: number;
  declare link: string;
  declare expires_at: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Share.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileId:{
      type: DataTypes.INTEGER,
      references: { model: 'files', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'share',
    tableName: 'shares',
  }
);

export default Share;