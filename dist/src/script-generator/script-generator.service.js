"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScriptGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ScriptGeneratorService = ScriptGeneratorService_1 = class ScriptGeneratorService {
    configService;
    logger = new common_1.Logger(ScriptGeneratorService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async generateScript(data) {
        this.logger.log(`Generating script for ${data.productName} on ${data.platform}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    hook: "Tired of manual video creation?",
                    problem: "Creating video ads is time consuming and expensive.",
                    solution: `${data.productName} automates everything with AI!`,
                    cta: "Click the link to try it now!",
                    scenes: [
                        { scene: 1, text: "Person looking frustrated at computer", duration: "5s" },
                        { scene: 2, text: "Screen showing AI generating video", duration: "5s" },
                        { scene: 3, text: "Happy person watching results", duration: "5s" }
                    ]
                });
            }, 1500);
        });
    }
};
exports.ScriptGeneratorService = ScriptGeneratorService;
exports.ScriptGeneratorService = ScriptGeneratorService = ScriptGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ScriptGeneratorService);
//# sourceMappingURL=script-generator.service.js.map