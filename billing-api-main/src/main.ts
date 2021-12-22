import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/main/app.module';
import { setupSwagger } from './swagger';
import { BadRequestExceptionFilter } from './shared/exceptions/filters/bad.request.exception.filter';
import { ResourceNotFoundExceptionFilter } from './shared/exceptions/filters/resource.not.found.exception.filter';
import { TimeoutInterceptor } from './shared/timeout.interceptor';
import * as compression from 'compression';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new ResourceNotFoundExceptionFilter(),
  );
  app.use(helmet());
  app.enableCors();
  app.use(compression());
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    // new LoggingInterceptor(),
    new TimeoutInterceptor(),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(3000);
}
bootstrap().then(() => true);
