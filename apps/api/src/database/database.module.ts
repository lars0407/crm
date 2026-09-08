import { type Db, db } from "@crm/db";
import { ensureCompanyGoogleBusinessColumn } from "@crm/db/schema-ensure";
import {
	Global,
	Logger,
	Module,
	type OnApplicationShutdown,
	type OnModuleInit,
} from "@nestjs/common";
import { DATABASE, InjectDatabase } from "./database.constants";

@Global()
@Module({
	providers: [{ provide: DATABASE, useValue: db }],
	exports: [DATABASE],
})
export class DatabaseModule implements OnModuleInit, OnApplicationShutdown {
	private readonly logger = new Logger(DatabaseModule.name);

	constructor(@InjectDatabase() private readonly db: Db) {}

	async onModuleInit(): Promise<void> {
		try {
			await this.db.$connect();
		} catch (error) {
			this.logger.fatal(
				{ message: "Database connection failed" },
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}

		try {
			await ensureCompanyGoogleBusinessColumn(this.db);
		} catch (error) {
			this.logger.error(
				{ message: "Could not add company.googleBusinessId" },
				error instanceof Error ? error.stack : String(error),
			);
		}

		this.logger.log({ message: "Database connected" });
	}

	async onApplicationShutdown(signal?: string): Promise<void> {
		await this.db.$disconnect();
		this.logger.log({ message: "Database disconnected", signal });
	}
}
