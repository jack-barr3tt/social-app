import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatModule } from './chats/chat.module'
import { FriendRequestModule } from './friendrequests/request.module'
import { MessageModule } from './messages/message.module'
import { PostModule } from './posts/post.module'
import { UserModule } from './users/user.module'
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/jwt.guard'

@Module({
    imports: [
        AuthModule,
        UserModule,
        PostModule,
        ChatModule,
        MessageModule,
        FriendRequestModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +(process.env.POSTGRES_PORT || ''),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true,
            synchronize: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
          }
    ]
})
export class AppModule {}
