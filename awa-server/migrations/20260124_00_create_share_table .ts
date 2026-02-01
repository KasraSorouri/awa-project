import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('shares', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_id: {
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
    await queryInterface.dropTable('shares');
  };
