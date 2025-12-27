import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('folders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      folder_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      parent_folder: {
        type: DataTypes.INTEGER,
        references: { model: 'folders', key: 'id' },
        allowNull: true,
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
    await queryInterface.dropTable('folders');
  };
