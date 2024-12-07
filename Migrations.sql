CREATE DATABASE celerates_camp_b1;
USE celerates_camp_b1;

-- Categories Table
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    description LONGTEXT,
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Images Table
CREATE TABLE images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT,
    image_url VARCHAR(255),
    image_path VARCHAR(255),
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert into Categories
INSERT INTO categories (slug, name) 
VALUES 
    ('makanan-minuman', 'Makanan & Minuman'),
    ('perawatan-kecantikan', 'Perawatan & Kecantikan'),
    ('buku-alat-tulis', 'Buku & Alat Tulis');

-- Insert into Products
INSERT INTO products (slug, name, category_id, price, stock, description)
VALUES
    ('nabati-richeese-122gr-x3', 'NABATI Richeese 122gr bundle 3', 1, 26000, 500, 
    '<p class="description-text">Nabati Wafer Richeese: Wafer Renyah, Krim Keju Berlimpah.
    Kombinasi sempurna antara renyahnya wafer dan krim keju Richeese signature flavor Nabati yang berlimpah. 
    Dibuat dengan bahan-bahan berkualitas tinggi, Nabati Richeese Wafer diperkaya dengan vitamin A, B1, B2, B6, dan B12. 
    Setiap gigitan membuat kamu lebih bersemangat!</p>'),
    
    ('Nextar-Star-Double-Richoco-84g', 'Nextar Star Double Richoco 84g', 1, 9000, 2000, 
    '<p class="description-text">Mencari sumber semangat untuk setiap aktivitasmu? Nextar Star Double Richoco adalah jawabannya! 
    Dengan star-shape kukis yang unik, terletak kelezatan dalam setiap gigitan. Double cream-nya yang lezat dan melimpah, 
    Nextar Double Richoco adalah kombinasi yang sempurna antara kukis tekstur renyah dan rasa double cream Richoco yang lezat. 
    Cokelatnya bikin semangatmu naik terus!</p>'),
    
    ('PANTENE-GOLD-SERIES-SHAMPOO-125-ML', 'PANTENE GOLD SERIES SHAMPOO 125 ML', 2, 20000, 100, 
    '<p class="description-text">Pantene Pro-V Gold Series Smooth & Sleek Sampo merupakan shampo yang mengandung Vitamin B3, Pro-V, 
    Anti-Oxidant dapat membuat rambut lembut sepanjang hari dan membantu menjaga kekuatan rambut sehingga rambut fleksibel dan
    tidak mudah patah. Gunakan Pantene Kondisioner untuk rambut yang lembut dan mudah diatur.</p>'),
    
    ('Semua-Ada-Prosesnya-Rendy-Arianto', 'Semua Ada Prosesnya - Rendy Arianto', 3, 87000, 50, 
    '<p class="description-text">Disadari atau tidak, hampir semua orang pernah membandingkan dirinya dengan orang lain.
    Kebiasaan ini sering disebut dengan social comparison atau perbandingan sosial. Terkadang, ini bisa menginspirasi 
    dan menyadarkan segala kekurangan yang dimiliki, sehingga memicu diri untuk memperbaikinya dan menjadi lebih baik. 
    Tetapi, membandingkan diri dengan orang lain tidak lagi menjadi hal yang baik ketika orang lain dijadikan standar 
    kualitas hidup. Bahkan, terlalu banyak membandingkan justru bisa menyebabkan hilangnya identitas diri kita, 
    memicu perasaan iri, menurunkan rasa percaya diri, dan menghambat potensi diri.</p>');


        CREATE TABLE roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL,
        access_secret BIGINT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT NOW(),
        deleted_at DATETIME
    );


        -- Users
        CREATE TABLE users (
            id BIGINT PRIMARY KEY AUTO_INCREMENT,
            fullname VARCHAR(255) NOT NULL,
            google_id VARCHAR(255) UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            role_id INT NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted_at DATETIME,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
            password VARCHAR(255),
            local_auth BOOLEAN DEFAULT FALSE
        );

    INSERT INTO roles (name, access_secret) VALUES ('CLIENT', 787383722828), ('ADMIN', 787376522828);