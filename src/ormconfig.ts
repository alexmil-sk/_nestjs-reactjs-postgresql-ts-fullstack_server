import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
import * as colors from 'colors';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts, .js}'],
  synchronize: false,
  logging: true,
  migrations: [__dirname + '/migrations/**/*{.ts, .js}'],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log(colors.yellow('Data Source has been initialized!'.bgGreen));
  })
  .catch((err) => {
    console.error(
      colors.white('Error during Data Source initialization'.bgRed),
      err,
    );
  });

export default dataSource;
