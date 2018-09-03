import express from 'express';
// import { createRoles, addMemberToGroup } from '../models/helpers';
// import { userRepository, userGroupRepository } from '../models';

const router = express.Router();

// router.get('/', async (req, res) => {
//     // get a user
//     const user = await (await userRepository()).findOne({
//         where: { username: 'janedoe' },
//         relations: ['groupAssocs']
//     });

//     // get the link
//     const link = user && user.groupAssocs;

//     // for every link in groupAssocs
//     const group =
//         link &&
//         link.map((l) => {
//             return l.group;
//         });

//     // for each user get the link to group repo in array
//     // const test = users.map((user) => {
//     //     user.groupAssocs.map(async (userlink) => {
//     //         const linkId = userlink.id;
//     //         const link = await (await userGroupRepository()).find({
//     //             where: { id: linkId },
//     //             relations: ['group']
//     //         });
//     //     });
//     // });

//     res.json({
//         msg: group
//     });
// });

// router.get('/create-roles', async (req, res) => {
//     try {
//         await createRoles();
//         res.json({
//             msg: 'roles created'
//         });
//     } catch (e) {
//         res.status(500).json({
//             msg: 'error creating roles'
//         });
//     }
// });

// router.get('/add-user-to-group', async (req, res) => {
//     const { err, group } = await addMemberToGroup('Test Room', 'janedoe');
//     if (err) {
//         throw err;
//     }

//     return res.json({
//         msg: group
//     });
// });

export default router;
