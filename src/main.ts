import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* enable cors */
  app.enableCors();


  /* set up swagger interface */
  const config = new DocumentBuilder()
    .setTitle('StuHub')
    .setDescription('The StuHub API description')
    .setVersion('1.0')
    .addTag('stuhub')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  /* setup hmr hot reload */
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
