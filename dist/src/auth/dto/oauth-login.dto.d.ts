export declare enum OAuthProvider {
    GOOGLE = "GOOGLE",
    FACEBOOK = "FACEBOOK"
}
export declare class OAuthLoginDto {
    provider: OAuthProvider;
    token: string;
}
