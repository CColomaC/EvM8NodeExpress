const { Sequelize } = require('sequelize');
const { User, Bootcamp, Users_Bootcamps } = require('./models');

const sequelize = new Sequelize('postgres://postgres:2024@localhost:5432/db_bootcamp');

sequelize.sync({ force: true }).then(async () => {
    console.log('Base de datos sincronizada.');

    // Crear usuarios
    const usersData = [
        { firstName: 'Mateo', lastName: 'Díaz', email: 'mateo.diaz@correo.com' },
        { firstName: 'Santiago', lastName: 'Mejías', email: 'santiago.mejias@correo.com' },
        { firstName: 'Lucas', lastName: 'Rojas', email: 'lucas.rojas@correo.com' },
        { firstName: 'Facundo', lastName: 'Fernandez', email: 'facundo.fernandez@correo.com' }
    ];

    for (const userData of usersData) {
        const [user, created] = await User.findOrCreate({
            where: { email: userData.email },
            defaults: { firstName: userData.firstName, lastName: userData.lastName }
        });
        if (!created) {
            await user.update({ firstName: userData.firstName, lastName: userData.lastName });
        }
    }

    console.log('Usuarios creados o actualizados.');

    // Crear bootcamps
    const bootcamps = await Bootcamp.bulkCreate([
        { title: 'Introduciendo El Bootcamp De React', cue: 10, description: 'React es la librería más usada en JavaScript para el desarrollo de interfaces.' },
        { title: 'Bootcamp Desarrollo Web Full Stack', cue: 12, description: 'Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares, como: JavaScript, nodeJS, Angular, MongoDB, ExpressJS.' },
        { title: 'Bootcamp Big Data, Inteligencia Artificial & Machine Learning', cue: 18, description: 'Domina Data Science, y todo el ecosistema de lenguajes y herramientas de Big Data, e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning.' }
    ]);

    console.log('Bootcamps creados.');

    // Agregar usuarios a los bootcamps
    const reactBootcamp = await Bootcamp.findOne({ where: { title: 'Introduciendo El Bootcamp De React' } });
    const fullStackBootcamp = await Bootcamp.findOne({ where: { title: 'Bootcamp Desarrollo Web Full Stack' } });
    const bigDataBootcamp = await Bootcamp.findOne({ where: { title: 'Bootcamp Big Data, Inteligencia Artificial & Machine Learning' } });

    const mateo = await User.findOne({ where: { firstName: 'Mateo', lastName: 'Díaz' } });
    const santiago = await User.findOne({ where: { firstName: 'Santiago', lastName: 'Mejías' } });
    const lucas = await User.findOne({ where: { firstName: 'Lucas', lastName: 'Rojas' } });

    if (reactBootcamp && mateo && santiago) {
        await Users_Bootcamps.create({ userId: mateo.id, bootcampId: reactBootcamp.id });
        await Users_Bootcamps.create({ userId: santiago.id, bootcampId: reactBootcamp.id });
    }

    if (fullStackBootcamp && mateo) {
        await Users_Bootcamps.create({ userId: mateo.id, bootcampId: fullStackBootcamp.id });
    }

    if (bigDataBootcamp && mateo && santiago && lucas) {
        await Users_Bootcamps.create({ userId: mateo.id, bootcampId: bigDataBootcamp.id });
        await Users_Bootcamps.create({ userId: santiago.id, bootcampId: bigDataBootcamp.id });
        await Users_Bootcamps.create({ userId: lucas.id, bootcampId: bigDataBootcamp.id });
    }

    console.log('Usuarios agregados a los Bootcamps.');
}).catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
});
