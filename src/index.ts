//main entry point for the application
import Options from "./options";

class Strategy {
    private options: Options;
    constructor(options: Options) {
        this.options = {
            verify: (username: string, password: string) => {
                return false;
            },
            rateLimit: 10,
            rateLimitTime: 60,
            blockIP: true,
            saltRounds: 10
        }
    }
    public setOptions(options: Options) {
        Object.assign(this.options, options);
    }
}