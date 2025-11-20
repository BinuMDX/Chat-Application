import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type jwtPayLoad = {
    sub: string,
    email: string,
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'at-secret',
    });
}

validate(payload: any) {
    return payload;
}
}
