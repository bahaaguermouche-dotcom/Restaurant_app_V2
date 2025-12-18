from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bootstrap import Bootstrap
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'restaurant_app_secret_key_2025'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 🔧 إضافة Bootstrap
Bootstrap(app)

db = SQLAlchemy(app)

# 🔐 إعداد Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Veuillez vous connecter pour accéder à cette page.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ===== تعريف الجداول =====
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    adresse = db.Column(db.String(200))
    password_hash = db.Column(db.String(200))
    date_inscription = db.Column(db.DateTime, default=datetime.utcnow)
    
    commandes = db.relationship('Commande', backref='client', lazy=True)
    panier_items = db.relationship('PanierItem', backref='utilisateur', lazy=True)
    favoris = db.relationship('Favorite', backref='utilisateur', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Plat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prix = db.Column(db.Float, nullable=False)
    categorie = db.Column(db.String(50))
    image = db.Column(db.String(300))
    
    # العلاقات
    dans_paniers = db.relationship('PanierItem', backref='plat', lazy=True)
    dans_favoris = db.relationship('Favorite', backref='plat', lazy=True)

class PanierItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plat_id = db.Column(db.Integer, db.ForeignKey('plat.id'), nullable=False)
    quantite = db.Column(db.Integer, default=1)

class Commande(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_commande = db.Column(db.DateTime, default=datetime.utcnow)
    total = db.Column(db.Float, nullable=False)
    statut = db.Column(db.String(50), default='en attente')
    
    items = db.relationship('CommandeItem', backref='commande', lazy=True)

class CommandeItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    commande_id = db.Column(db.Integer, db.ForeignKey('commande.id'), nullable=False)
    plat_id = db.Column(db.Integer, db.ForeignKey('plat.id'), nullable=False)
    plat_nom = db.Column(db.String(100), nullable=False)
    plat_prix = db.Column(db.Float, nullable=False)
    quantite = db.Column(db.Integer, nullable=False)

# 🆕 جدول المفضلة
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plat_id = db.Column(db.Integer, db.ForeignKey('plat.id'), nullable=False)
    date_ajout = db.Column(db.DateTime, default=datetime.utcnow)

# إنشاء الجداول
with app.app_context():
    db.create_all()

# ===== 🎪 Routes الصفحة الرئيسية =====
@app.route('/')
def accueil():
    """الصفحة الرئيسية الجديدة"""
    # جلب البيانات للصفحة الرئيسية
    plats_populaires = Plat.query.limit(6).all()  # الأطباق الأكثر طلباً (مؤقتاً)
    plats_nouveaux = Plat.query.order_by(Plat.id.desc()).limit(3).all()  # أحدث الأطباق
    
    # في الواقع، ستجلب هذه البيانات من الإحصائيات الحقيقية
    plats_top_rating = Plat.query.limit(3).all()  # الأعلى تقييماً
    
    return render_template('accueil.html', 
                         plats_populaires=plats_populaires,
                         plats_nouveaux=plats_nouveaux,
                         plats_top_rating=plats_top_rating)

@app.route('/plats')
def plats():
    """صفحة قائمة الأطباق"""
    plats_list = Plat.query.all()
    return render_template('plats.html', plats=plats_list)

# ===== 🔐 Routes المستخدمين =====
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('accueil'))
    
    if request.method == 'POST':
        nom = request.form['nom']
        email = request.form['email']
        adresse = request.form['adresse']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # التحقق من كلمات المرور
        if password != confirm_password:
            flash('❌ Les mots de passe ne correspondent pas!', 'error')
            return render_template('register.html')
        
        # التحقق من وجود المستخدم
        user_existant = User.query.filter_by(email=email).first()
        if user_existant:
            flash('❌ Cet email est déjà utilisé!', 'error')
            return render_template('register.html')
        
        # إنشاء المستخدم الجديد
        nouvel_user = User(
            nom=nom,
            email=email,
            adresse=adresse
        )
        nouvel_user.set_password(password)
        
        db.session.add(nouvel_user)
        db.session.commit()
        
        flash('✅ Compte créé avec succès! Vous pouvez maintenant vous connecter.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('profil'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            flash(f'✅ Bienvenue {user.nom}!', 'success')
            
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('profil'))
        else:
            flash('❌ Email ou mot de passe incorrect!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('👋 Vous êtes déconnecté!', 'info')
    return redirect(url_for('accueil'))

# ===== 🔒 Routes محمية =====
@app.route('/profil')
@login_required
def profil():
    return render_template('profil.html', user=current_user)

@app.route('/ajouter-plat', methods=['GET', 'POST'])
@login_required
def ajouter_plat():
    # التحقق من صلاحيات المدير
    if current_user.email != 'admin@example.com':
        flash('❌ Accès non autorisé!', 'error')
        return redirect(url_for('plats'))
    
    if request.method == 'POST':
        nom = request.form['nom']
        prix = float(request.form['prix'])
        categorie = request.form['categorie']
        image = request.form['image']
        
        nouveau_plat = Plat(
            nom=nom,
            prix=prix,
            categorie=categorie,
            image=image
        )
        
        db.session.add(nouveau_plat)
        db.session.commit()
        flash('✅ Plat ajouté avec succès!', 'success')
        return redirect(url_for('plats'))
    
    return render_template('ajouter_plat.html')

# ===== 🛒 Routes السلة =====
@app.route('/ajouter-panier/<int:plat_id>', methods=['POST'])
@login_required
def ajouter_au_panier(plat_id):
    plat = Plat.query.get_or_404(plat_id)
    quantite = int(request.form.get('quantite', 1))
    
    item_existant = PanierItem.query.filter_by(
        user_id=current_user.id, 
        plat_id=plat_id
    ).first()
    
    if item_existant:
        item_existant.quantite += quantite
    else:
        nouvel_item = PanierItem(
            user_id=current_user.id,
            plat_id=plat_id,
            quantite=quantite
        )
        db.session.add(nouvel_item)
    
    db.session.commit()
    flash(f'✅ {quantite} x {plat.nom} ajouté au panier!', 'success')
    return redirect(url_for('plats'))

@app.route('/panier')
@login_required
def panier():
    items_panier = PanierItem.query.filter_by(user_id=current_user.id).all()
    
    total = 0
    for item in items_panier:
        total += item.plat.prix * item.quantite
    
    return render_template('panier.html', items=items_panier, total=total)

@app.route('/supprimer-panier/<int:item_id>')
@login_required
def supprimer_du_panier(item_id):
    item = PanierItem.query.get_or_404(item_id)
    
    # التحقق من أن العنصر يخص المستخدم الحالي
    if item.user_id != current_user.id:
        flash('❌ Accès non autorisé!', 'error')
        return redirect(url_for('panier'))
    
    db.session.delete(item)
    db.session.commit()
    flash('❌ Article supprimé du panier', 'info')
    return redirect(url_for('panier'))

@app.route('/confirmer-commande')
@login_required
def confirmer_commande():
    items_panier = PanierItem.query.filter_by(user_id=current_user.id).all()
    
    if not items_panier:
        flash('🛒 Votre panier est vide!', 'warning')
        return redirect(url_for('panier'))
    
    total = sum(item.plat.prix * item.quantite for item in items_panier)
    
    nouvelle_commande = Commande(
        user_id=current_user.id,
        total=total
    )
    db.session.add(nouvelle_commande)
    db.session.flush()
    
    for item in items_panier:
        commande_item = CommandeItem(
            commande_id=nouvelle_commande.id,
            plat_id=item.plat_id,
            plat_nom=item.plat.nom,
            plat_prix=item.plat.prix,
            quantite=item.quantite
        )
        db.session.add(commande_item)
    
    PanierItem.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    flash(f'✅ Commande #{nouvelle_commande.id} confirmée! Total: {total} DA', 'success')
    return redirect(url_for('commande'))

@app.route('/commande')
@login_required
def commande():
    commandes = Commande.query.filter_by(user_id=current_user.id).order_by(Commande.date_commande.desc()).all()
    return render_template('commande.html', commandes=commandes)

# ===== ❤️ Routes المفضلة =====
@app.route('/ajouter-favori/<int:plat_id>')
@login_required
def ajouter_favori(plat_id):
    plat = Plat.query.get_or_404(plat_id)
    
    favori_existant = Favorite.query.filter_by(
        user_id=current_user.id, 
        plat_id=plat_id
    ).first()
    
    if favori_existant:
        return jsonify({'success': False, 'message': 'Déjà dans les favoris'})
    else:
        nouvel_favori = Favorite(
            user_id=current_user.id,
            plat_id=plat_id
        )
        db.session.add(nouvel_favori)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Ajouté aux favoris'})

@app.route('/supprimer-favori/<int:plat_id>')
@login_required
def supprimer_favori(plat_id):
    favori = Favorite.query.filter_by(
        user_id=current_user.id, 
        plat_id=plat_id
    ).first()
    
    if favori:
        db.session.delete(favori)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Retiré des favoris'})
    else:
        return jsonify({'success': False, 'message': 'Non trouvé dans les favoris'})

@app.route('/favoris')
@login_required
def favoris():
    favoris_list = Favorite.query.filter_by(user_id=current_user.id).all()
    return render_template('favoris.html', favoris=favoris_list)

# ===== 🎯 Routes إضافية =====
@app.context_processor
def utility_processor():
    def format_price(price):
        return "{:,.0f}".format(price).replace(',', ' ')
    return dict(format_price=format_price)

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)