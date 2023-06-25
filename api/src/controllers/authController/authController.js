const generateTokenJwt = require('../../helpers/tokenjwt/generateTokenJwt');
const handlerbars = require('handlebars');
const {encrypt} = require("../../helpers/password/bcryptHelper")
const fs = require('fs');

const { User, Rol } = require("../../db")

const authGoogle = async ({ name, surname, mail }) => {
    try {
      const passwordHash = await encrypt(`${mail}${process.env.JWT_SECRET}`);

        const roles = await Rol.findOne({ where: { rol_name: 'user' } });

        const [ user, created ] = await User.findOrCreate({
            where: { mail },
            defaults: {
                name, 
                surname, 
                password: passwordHash,
                mail,
                phone: "11222333",
                date_of_birth: "2000-01-01",
                rolId: roles.id
            }
        });

        const token = await generateTokenJwt(user);

        if(!created) {
          return {
            message: "User in login",
            token
          }
        };

        return {
          message: "User created",
          token
        }

    } catch (error) {
      throw new Error(error.message);
    }
};



module.exports = {
  authGoogle,
};
