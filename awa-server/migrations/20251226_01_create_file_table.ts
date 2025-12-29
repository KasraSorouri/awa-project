import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('files', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      folder_id: {
        type: DataTypes.INTEGER,
        references: { model: 'folders', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true
      },
      file_type: {
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

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.createTable('user_files', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      file_id: {
        type: DataTypes.INTEGER,
        references: { model: 'files', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['owner','edit','view'],
        defaultValue: 'owner',
        allowNull: false,
      },
      activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  };



export const down = async ({ context: queryInterface }: any) => {
    await queryInterface.dropTable('user_files');
    await queryInterface.dropTable('files');
  };
