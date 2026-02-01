import { Model, DataTypes, Optional } from 'sequelize';

import { sequelize } from '../configs/database';

interface IFileAttributes {
  id: number;
  fileName: string;
  userId: number;
  folderId: number;
  fileType: string;
  address: string;
  editable: boolean;
  deleted: boolean;
  activated: boolean;
  currentUser: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IFileCreationAttributes extends Optional<IFileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'activated' | 'deleted' | 'currentUser'> {
  id?: number;
  activated?: boolean;
  currentUser?: number;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

class File extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
  declare id: number;
  declare fileName: string;
  declare folderId: number;
  declare userId: number;
  declare fileType: string;
  declare address: string;
  declare editable: boolean;
  declare deleted: boolean;
  declare activated: boolean;
  declare currentUser: number;
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
    userId:{
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
    folderId: {
      type: DataTypes.INTEGER,
      references: { model: 'folders', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: true,
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
    currentUser: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: true,
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
    tableName: 'files',
  }
);

export default File;