import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

const bootstrap = async (): Promise<void> => {
  await CommandFactory.run(AppModule, ['error']);
};

void bootstrap();
