import { DataSource, DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './ormconfig';
import * as colors from 'colors';

export const dataSeedSourceOptions: DataSourceOptions = {
  ...dataSourceOptions,
  migrations: [__dirname + '/seeds/**/*{.ts, .js}'],
};

const dataSeedSource = new DataSource(dataSeedSourceOptions);

dataSeedSource
  .initialize()
  .then(() => console.log('DataSeed Source has been initialized!'.bgBlue))
  .catch((err) => {
    console.error(
      colors.bold.white(
        colors.bgMagenta('Error during DataSeed Source initialization'),
      ),
      err,
    );
  });

export default dataSeedSource;
