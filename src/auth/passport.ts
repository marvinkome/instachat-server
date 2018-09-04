// import passport from 'passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { userRepository } from '../models';
// import { SECRET_KEY } from '../../config';

// passport.use(
//     new Strategy(
//         {
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: SECRET_KEY
//         },
//         async (payload, cb) => {
//             // find user
//             try {
//                 const repo = await userRepository();
//                 const user = await repo.findOne({ id: payload.userId });
//                 return user ? cb(null, true) : cb(null, false);
//             } catch (e) {
//                 return cb(e, false);
//             }
//         }
//     )
// );
