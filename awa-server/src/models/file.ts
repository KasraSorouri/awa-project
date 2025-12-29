import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../configs/database';

interface IFileAttributes {
  id: number;
  fileName: string;
  folderId: number;
  fileType: string;
  address: string;
  editable: boolean;
  deleted: boolean;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IFileCreationAttributes extends Optional<IFileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'activated' | 'deleted'> {
  id?: number;
  activated?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

class File extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
  declare id: number;
  declare fileName: string;
  declare folderId: number;
  declare fileType: string;
  declare address: string;
  declare editable: boolean;
  declare deleted: boolean;
  declare activated: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    folderId: {
      type: DataTypes.INTEGER,
      references: { model: 'folders', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      defaultValue: 'document',
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    editable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'file',
  }
);

export default File;