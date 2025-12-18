import sequelize from './config/database.js';
import { User, Dish } from './models/index.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('✅ Database cleared and synchronized');

        // Create admin user with hashed password
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            nom: 'Administrateur',
            email: 'admin@example.com',
            adresse: 'Restaurant Principal',
            password_hash: hashedPassword,
        });
        console.log('✅ Admin user created');

        // Create sample dishes
        const dishes = [
            {
                nom: 'Couscous Royal',
                prix: 2500,
                categorie: 'Plats principaux',
                image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Tajine Poulet',
                prix: 2200,
                categorie: 'Plats principaux',
                image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Mechoui',
                prix: 3000,
                categorie: 'Plats principaux',
                image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Salade César',
                prix: 1500,
                categorie: 'Entrées',
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Soupe Harira',
                prix: 800,
                categorie: 'Entrées',
                image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Baklava',
                prix: 1200,
                categorie: 'Desserts',
                image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Crème Brûlée',
                prix: 1000,
                categorie: 'Desserts',
                image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Jus d\'Orange Frais',
                prix: 500,
                categorie: 'Boissons',
                image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Thé à la Menthe',
                prix: 300,
                categorie: 'Boissons',
                image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Pizza Margherita',
                prix: 1800,
                categorie: 'Plats principaux',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Burger Classique',
                prix: 1600,
                categorie: 'Plats principaux',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            },
            {
                nom: 'Pâtes Carbonara',
                prix: 1900,
                categorie: 'Plats principaux',
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80',
            },
        ];

        await Dish.bulkCreate(dishes);
        console.log('✅ Sample dishes created');

        console.log('\\n🎉 Database seeded successfully!');
        console.log('\\n📝 Login credentials:');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
