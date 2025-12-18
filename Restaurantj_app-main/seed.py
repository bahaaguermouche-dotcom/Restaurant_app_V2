from app import app, db, User, Plat, PanierItem, Commande, CommandeItem
from datetime import datetime

def inserer_donnees():
    # 🧹 حذف كل البيانات القديمة وإعادة إنشاء الجداول
    db.drop_all()
    db.create_all()

    # 👤 إنشاء المستخدمين
    user1 = User(
        nom="bozar mohamed",
        email="bozar@example.com",
        adresse="Tlemcen, Algérie"
    )
    user1.set_password("password123")
    
    user2 = User(
        nom="ahmed benali", 
        email="ahmed@example.com",
        adresse="Alger, Algérie"
    )
    user2.set_password("password123")
    
    # 🎯 إضافة مستخدم مدير
    admin = User(
        nom="Administrateur",
        email="admin@example.com",
        adresse="Restaurant Principal"
    )
    admin.set_password("admin123")
    
    db.session.add_all([user1, user2, admin])
    db.session.flush()

    # 🍽️ إنشاء الأطباق
    plats = [
        Plat(
        nom="Couscous Royal",
        prix=2500,
        categorie="Plats principaux",
        image="https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400&q=60"
    ),
    Plat(
        nom="Tajine Poulet",
        prix=2200,
        categorie="Plats principaux", 
        image="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=60"
    ),
    Plat(
        nom="Méchoui",
        prix=3000,
        categorie="Plats principaux",
        image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=60"
    ),
    Plat(
        nom="Salade César", 
        prix=1500,
        categorie="Entrées",
        image="https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=400&q=60"
    ),
        Plat(
            nom="Pizza Margherita",
            prix=2000,
            categorie="Plats principaux",
            image="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=60"
        ),
        Plat(
            nom="Pâtes Bolognaise",
            prix=1800,
            categorie="Plats principaux",
            image="https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=400&q=60"
        ),
        Plat(
            nom="Tiramisu",
            prix=1200,
            categorie="Desserts",
            image="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=60"
        ),
        Plat(
            nom="Burger Maison",
            prix=1500,
            categorie="Plats principaux",
            image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=60"
        ),
        Plat(
            nom="Salade Grecque",
            prix=1200,
            categorie="Entrées",
            image="https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=400&q=60"
        ),
        Plat(
            nom="Fondant au Chocolat",
            prix=900,
            categorie="Desserts",
            image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=60"
        ),
        Plat(
            nom="Jus d'Orange Frais",
            prix=500,
            categorie="Boissons",
            image="https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=60"
        )
    ]

    # 💾 إضافة الأطباق إلى قاعدة البيانات
    db.session.add_all(plats)
    db.session.flush()  # للحصول على IDs الأطباق

    # 🛒 إضافة بعض العناصر في السلة للمستخدم bozar (اختياري - للاختبار)
    panier_items = [
        PanierItem(
            user_id=user1.id,
            plat_id=plats[0].id,  # Pizza Margherita
            quantite=2
        ),
        PanierItem(
            user_id=user1.id,
            plat_id=plats[2].id,  # Tiramisu
            quantite=1
        )
    ]
    db.session.add_all(panier_items)

    # 📦 إنشاء طلب تجريبي للمستخدم bozar (اختياري - للاختبار)
    commande = Commande(
        user_id=user1.id,
        total=5200,  # 2x2000 + 1x1200
        statut="confirmé",
        date_commande=datetime(2024, 1, 15, 14, 30)
    )
    db.session.add(commande)
    db.session.flush()

    # إضافة عناصر الطلب
    commande_items = [
        CommandeItem(
            commande_id=commande.id,
            plat_id=plats[0].id,
            plat_nom="Pizza Margherita",
            plat_prix=2000,
            quantite=2
        ),
        CommandeItem(
            commande_id=commande.id,
            plat_id=plats[2].id,
            plat_nom="Tiramisu",
            plat_prix=1200,
            quantite=1
        )
    ]
    db.session.add_all(commande_items)

    # 📦 إنشاء طلب ثاني للمستخدم ahmed (اختياري - للاختبار)
    commande2 = Commande(
        user_id=user2.id,
        total=1500,  # 1x1500
        statut="livré",
        date_commande=datetime(2024, 1, 16, 12, 15)
    )
    db.session.add(commande2)
    db.session.flush()

    commande_items2 = [
        CommandeItem(
            commande_id=commande2.id,
            plat_id=plats[3].id,
            plat_nom="Burger Maison",
            plat_prix=1500,
            quantite=1
        )
    ]
    db.session.add_all(commande_items2)

    # ✅ حفظ كل التغييرات
    db.session.commit()

    print("✅ Données insérées avec succès dans restaurant.db !")
    print(f"👤 Utilisateurs créés:")
    print(f"   - {user1.nom} ({user1.email}) - Password: password123")
    print(f"   - {user2.nom} ({user2.email}) - Password: password123")
    print(f"   - {admin.nom} ({admin.email}) - Password: admin123")
    print(f"🍽️ {len(plats)} plats ajoutés")
    print(f"🛒 {len(panier_items)} articles dans le panier de {user1.nom}")
    print(f"📦 2 commandes d'exemple créées")
    print("\n🔐 Comptes de test:")
    print("   Admin (avec Ajouter Plat): admin@example.com / admin123")
    print("   User normal: bozar@example.com / password123")
    print("   User normal: ahmed@example.com / password123")

# 🧠 تشغيل الكود داخل contexte Flask
if __name__ == "__main__":
    with app.app_context():
        inserer_donnees()