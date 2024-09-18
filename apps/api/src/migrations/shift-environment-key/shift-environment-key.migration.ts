import '../../config';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { EnvironmentRepository } from '@impler/dal';

export async function run() {
  console.log('Start migration - moving key to root and adding role to apiKeys');

  // Initialize the MongoDB connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const environmentRepository = new EnvironmentRepository();

  const environments = await environmentRepository.find({});

  for (const environment of environments) {
    if (environment.apiKeys && environment.apiKeys.length > 0) {
      const firstApiKey = environment.apiKeys[0];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const key = firstApiKey.key;

      // Remove the key field from each apiKey
      const updatedApiKeys = environment.apiKeys.map((apiKey) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        const { ...rest } = apiKey;

        return { ...rest, role: 'admin' };
      });

      if (key === null || key === undefined) {
        console.error(`Skipping environment ${environment._id} due to null key`);
        continue;
      }

      try {
        // First, update the document to move the key to the root
        await environmentRepository.update(
          { _id: environment._id },
          {
            $set: {
              key: key,
              apiKeys: updatedApiKeys, // Update the apiKeys array with the role field and without the key field
            },
          }
        );

        // Log the updated environment document after migration
        await environmentRepository.findOne({
          _id: environment._id,
        });
      } catch (error) {
        console.error(`Error updating environment ${environment._id}:`, error);
      }
    } else {
      console.log('Skipping environment with no apiKeys:', JSON.stringify(environment, null, 2));
    }
  }

  console.log('End migration - key moved to root and role added to apiKeys');

  app.close();
  process.exit(0);
}
run();
