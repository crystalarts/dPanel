## ----------------------------------
## ----- Rozpoczęcie instalacji -----
## ----------------------------------

function confirm_continue {
    echo "* dPanel installation script @ v1.0"
    echo "*"
    echo "* Copyright (C) 2024 dPanel, Jakub Burzyński"
    echo "* https://github.com/icruxnet/dPanel"
    echo "*"
    echo "* What do you want to do?"
    echo "* [0] Install dPanel"
    echo "* [1] Exit"
    read -p "* Input 0-1: " choice
    case "$choice" in
        0 ) echo "* I continue the installation...";;
        1 ) echo "* dPanel installation was interrupted."; exit;;
        * ) echo "* Select '0' to continue or '1' to interrupt."; confirm_continue;;
    esac
}

confirm_continue

## -------------------------------
## ----- Installation Docker -----
## -------------------------------

echo "* I'm installing Docker..."
apt update
apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt update
apt-get install -y docker-ce docker-ce-cli containerd.io

if [ -x "$(command -v docker)" ]; then
    echo "* Docker has been successfully installed."
    echo "*"
else
    echo "* An error occurred while installing Docker."
    echo "*"
fi


## -------------------------------------
## ----- Installation Dependencies -----
## -------------------------------------

echo "* Installing Dependencies..."

apt-get install -y nodejs
NODEJS_INSTALLED=$?

apt-get install -y npm
NPM_INSTALLED=$?

if [ $NODEJS_INSTALLED -eq 0 ] && [ $NPM_INSTALLED -eq 0 ]; then
    echo "All dependencies installed successfully."
else
    echo "Failed to install dependencies." >&2
    exit 1
fi

## ------------------------------
## ----- Installation MySQL -----
## ------------------------------

echo "* Installing MySQL..."
read -p "* Provide a MySQL username: " username

if [ -z "$username" ]; then
    echo "* The username cannot be empty."
    exit 1
fi

read -s -p "* Provide a password for the MySQL user \"$username\": " password
echo

if [ -z "$password" ]; then
    echo "* The password cannot be empty."
    exit 1
fi

apt-get update
apt-get install -y mysql-server

echo "* I set up a username and password in MySQL..."
mysql -e "CREATE USER '$username'@'localhost' IDENTIFIED BY '$password';"
mysql -e "GRANT ALL PRIVILEGES ON *.* TO '$username'@'localhost' WITH GRANT OPTION;"
mysql -e "CREATE DATABASE dpanel;"
mysql -e "FLUSH PRIVILEGES;"

mysql -u"$username" -p"$password" -h "localhost" -D "dpanel" -e "
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    admin BOOLEAN,
    servers JSON,
    verify VARCHAR(255),
    token VARCHAR(255),
    twofa VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS server (
    key INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    id VARCHAR(255),
    owner VARCHAR(255),
    timestart DATETIME,
    timeout DATETIME,
);

CREATE TABLE IF NOT EXISTS eggs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    download VARCHAR(255),
    description LONGTEXT
);

CREATE TABLE firewall (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `on` ENUM('on', 'off') NOT NULL,
    `type` ENUM('ACCEPT', 'DROP', 'REJECT') NOT NULL,
    interfaces VARCHAR(255) NOT NULL UNIQUE,
    direction ENUM('in', 'out') NOT NULL,
    protocol ENUM('tcp', 'udp', 'icmp', 'igmp') NOT NULL,
    comment TEXT
);

INSERT INTO eggs (name, download, description) VALUES ('nginx', 'false', 'Nginx is a high-performance web server and reverse proxy server that efficiently handles large volumes of traffic, serving web content and balancing load across multiple servers.');
INSERT INTO eggs (name, download, description) VALUES ('teamspeak', 'false', 'TeamSpeak is a voice communication platform designed for gamers and teams, offering high-quality, low-latency voice chat with customizable channels and robust administrative features.');
INSERT INTO eggs (name, download, description) VALUES ('armathree', 'false', 'ARMA 3 is an open-world, realism-based tactical shooter with a wide range of vehicles and over 40 weapons. Enjoy diverse playstyles in both official and popular unofficial multiplayer modes. Test your squad’s skills in this tactical game with our game server hosting!');
INSERT INTO eggs (name, download, description) VALUES ('assettocorsa', 'false', 'Get behind the wheel in Assetto Corsa with confidence. Whether you are new to sim racing or a seasoned pro, our server hosting provides a lag-free experience with top performance and 24/7 support. We’re the best pit crew for your racing needs.');
INSERT INTO eggs (name, download, description) VALUES ('astroneer', 'false', 'In Astroneer, explore and colonize space with endless possibilities. Our server hosting gives you the tools to shape your galaxy, whether solo or with friends. Plus, our 24/7 live chat support ensures you always have guidance among the stars!');
INSERT INTO eggs (name, download, description) VALUES ('dayz', 'false', 'Roaming the roads of DayZ is challenging, especially with other players around. However, setting up a DayZ dedicated server is straightforward with us. Enjoy a lag-free, reliable, and customizable DayZ server to create your ideal experience.');
INSERT INTO eggs (name, download, description) VALUES ('factorio', 'false', 'Factorio lets you build an automated empire in a world full of challenges. Our servers provide a seamless experience, so you can focus on factory automation. With dPanel’s 24/7 support, top hardware, and mod compatibility, you get unmatched performance and value!');
INSERT INTO eggs (name, download, description) VALUES ('fivem', 'false', 'Grand Theft Auto V continues to evolve with the FiveM mod, offering fresh online experiences with friends. Dive into the city with style using our FiveM server hosting today!');
INSERT INTO eggs (name, download, description) VALUES ('garrysmod', 'false', 'Garrys Mod is a physics sandbox game with no set objectives, letting you create freely. Spawn NPCs, ragdolls, and props to bring your wildest ideas to life. For the ultimate creative experience with friends, explore our Garry’s Mod game server rentals and start building today!');
INSERT INTO eggs (name, download, description) VALUES ('minecraft', 'false', 'Minecraft is a popular sandbox game where players can explore, build, and survive in a blocky, open world. It features creative mode for unlimited building and survival mode where players gather resources and fend off monsters.');
INSERT INTO eggs (name, download, description) VALUES ('palworld', 'false', 'Palworld offers limitless possibilities — become a hero, conqueror, builder, industrialist, or top trainer. Explore the world your way with our dedicated game server hosting services, tailored to support your unique adventure.');
INSERT INTO eggs (name, download, description) VALUES ('projectzomboid', 'false', 'With our Project Zomboid servers, your survival story continues endlessly! Experience a persistent online world with customizable or preset settings and mod support, making each playthrough unique. Plus, our team of veteran survivors is always ready to assist you!');
INSERT INTO eggs (name, download, description) VALUES ('raft', 'false', 'In Raft, players begin with humble beginnings but face a grand and mysterious journey ahead. Set sail on your adventure with RDS (Raft Dedicated Server) and explore wherever the winds take you!');
INSERT INTO eggs (name, download, description) VALUES ('rust', 'false', 'Rust is a multiplayer survival game where you face starvation, dehydration, wild animals, and other players. Gather resources, craft tools and weapons, and build defenses. With our game server rentals, you will be ready to survive and conquer.');
INSERT INTO eggs (name, download, description) VALUES ('terraria', 'false', 'Terraria is a 2D sandbox survival game with no set goals. Build, craft, create, or explore — its your choice! Enjoy endless adventures and possibilities with friends in your customizable world.');
INSERT INTO eggs (name, download, description) VALUES ('theforest', 'false', 'A mysterious forest, isolated from civilization, where hostile locals and relentless survival challenges test your strength and ingenuity.');
INSERT INTO eggs (name, download, description) VALUES ('valheim', 'false', 'Valheim is an exploration and survival game set in a procedurally-generated world inspired by Norse mythology. Battle mythical beasts, uncover mysteries, and survive with friends. Build warships, design bases, and prove your worth to Odin.');
"

if systemctl is-active --quiet mysql; then
    echo "* MySQL has been successfully installed and configured."
    echo "*"
else
    echo "* An error occurred during the installation and configuration of MySQL."
    echo "*"
fi

## -------------------------------------
## ----- Creating an admin account -----
## -------------------------------------

echo "* Creating an admin account..."
read -p "* Provide the dPanel admin username: " admin_name
read -p "* Provide the dPanel admin email: " admin_email
read -s -p "* Provide the dPanel admin password: " admin_password

if [ -z "$admin_name" ] || [ -z "$admin_email" ] || [ -z "$password" ]; then
    echo "* The admin username, email, and password cannot be empty."
    exit 1
fi

echo "* Creating the dPanel admin account..."
mysql -u"$username" -p"$password" -h "localhost" -D "user" -e "
INSERT INTO user (name, email, password, admin, servers) VALUES ('$admin_name', '$admin_email', '$admin_password', TRUE, '[]');
"

echo "* The dPanel admin account has been created."
echo "*"


## ------------------------------
## ----- SMTP configuration -----
## ------------------------------

echo "* Configuring SMTP..."

read -p "* Provide the SMTP host (e.g. gmail): " smtp_host
read -p "* Provide the SMTP address: " smtp_email
read -p "* Provide the SMTP password: " smtp_pass

if [ -z "$smtp_host" ] || [ -z "$smtp_email" ] || [ -z "$smtp_pass" ]; then
    echo "* The SMTP host, address, and password cannot be empty."
    exit 1
fi

echo "* SMTP configuration completed"
echo "*"

## -----------------------------------
## ----- Dashboard configuration -----
## -----------------------------------

echo "* Dashboard configuration..."

read -p "* Provide the dashboard name: " dash_name

if [ -z "$dash_name" ]; then
    echo "* The dashboard name cannot be empty."
    exit 1
fi

echo "* Dashboard configuration completed"
echo "*"

## ------------------------------
## ----- Installation NGINX -----
## ------------------------------

echo "* I'm installing Nginx..."
read -p "* Enter your domain (e.g. panel.example.com): " domain
read -p "* Enter the port (e.g. 8080): " port

if [ -z "$domain" ] || [ -z "$port" ]; then
    echo "* The domain and port cannot be empty."
    exit 1
fi

sudo apt-get update
sudo apt-get install -y nginx

config_file="/etc/nginx/sites-available/${domain}_config"
echo "server {
    listen ${port};
    server_name ${domain};

    # Server configuration
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}" | sudo tee "$config_file" > /dev/null

sudo ln -s "$config_file" "/etc/nginx/sites-enabled/"

if ! sudo nginx -t; then
    echo "* Error in Nginx configuration. Please check the configuration file and try again."
    exit 1
fi

sudo systemctl reload nginx

echo "* Nginx configuration has been updated. You can now use the server on ${port} at ${domain}."

## -------------------------------
## ----- Saving data in .env -----
## -------------------------------

env_file=".env"

db_host="localhost"
db_name="dpanel-user"

if [ -f "$env_file" ]; then
    awk -v user="$db_user" -v pass="$db_password" -v host="$db_host" -v name="$db_name" \
        -v admin_user="$admin_name" -v admin_email="$admin_email" -v admin_pass="$admin_password" \
        -v smtp_host="$smtp_host" -v smtp_email="$smtp_email" -v smtp_pass="$smtp_password" \
        -v nginx_host="$domain" -v nginx_port="$port" -v dpanel_name="$dash_name" '
    BEGIN { 
        user_set=0; pass_set=0; host_set=0; name_set=0; 
        admin_user_set=0; admin_email_set=0; admin_pass_set=0;
        smtp_host_set=0; smtp_email_set=0; smtp_pass_set=0;
        nginx_host_set=0; nginx_port_set=0; dpanel_name_set=0;
    }
    /^DB_USER=/ { print "DB_USER=" user; user_set=1; next; }
    /^DB_PASSWORD=/ { print "DB_PASSWORD=" pass; pass_set=1; next; }
    /^DB_HOST=/ { print "DB_HOST=" host; host_set=1; next; }
    /^DB_NAME=/ { print "DB_NAME=" name; name_set=1; next; }
    /^ADMIN_NAME=/ { print "ADMIN_NAME=" admin_user; admin_user_set=1; next; }
    /^ADMIN_EMAIL=/ { print "ADMIN_EMAIL=" admin_email; admin_email_set=1; next; }
    /^ADMIN_PASSWORD=/ { print "ADMIN_PASSWORD=" admin_pass; admin_pass_set=1; next; }
    /^SMTP_HOST=/ { print "SMTP_HOST=" smtp_host; smtp_host_set=1; next; }
    /^SMTP_EMAIL=/ { print "SMTP_EMAIL=" smtp_email; smtp_email_set=1; next; }
    /^SMTP_PASSWORD=/ { print "SMTP_PASSWORD=" smtp_pass; smtp_pass_set=1; next; }
    /^NGINX_HOST=/ { print "NGINX_HOST=" nginx_host; nginx_host_set=1; next; }
    /^NGINX_PORT=/ { print "NGINX_PORT=" nginx_port; nginx_port_set=1; next; }
    /^DPANEL_NAME=/ { print "DPANEL_NAME=" dpanel_name; dpanel_name_set=1; next; }
    { print; }
    END {
        if (!user_set) print "DB_USER=" user;
        if (!pass_set) print "DB_PASSWORD=" pass;
        if (!host_set) print "DB_HOST=" host;
        if (!name_set) print "DB_NAME=" name;
        if (!admin_user_set) print "ADMIN_NAME=" admin_user;
        if (!admin_email_set) print "ADMIN_EMAIL=" admin_email;
        if (!admin_pass_set) print "ADMIN_PASSWORD=" admin_pass;
        if (!smtp_host_set) print "SMTP_HOST=" smtp_host;
        if (!smtp_email_set) print "SMTP_EMAIL=" smtp_email;
        if (!smtp_pass_set) print "SMTP_PASSWORD=" smtp_pass;
        if (!nginx_host_set) print "NGINX_HOST=" nginx_host;
        if (!nginx_port_set) print "NGINX_PORT=" nginx_port;
        if (!dpanel_name_set) print "DPANEL_NAME=" dpanel_name;
    }' "$env_file" > "$env_file.tmp" && mv "$env_file.tmp" "$env_file"
else
    echo "DB_USER=${db_user}" > "$env_file"
    echo "DB_PASSWORD=${db_password}" >> "$env_file"
    echo "DB_HOST=${db_host}" >> "$env_file"
    echo "DB_NAME=${db_name}" >> "$env_file"
    echo "ADMIN_NAME=${admin_name}" >> "$env_file"
    echo "ADMIN_EMAIL=${admin_email}" >> "$env_file"
    echo "ADMIN_PASSWORD=${admin_password}" >> "$env_file"
    echo "SMTP_HOST=${smtp_host}" >> "$env_file"
    echo "SMTP_EMAIL=${smtp_email}" >> "$env_file"
    echo "SMTP_PASSWORD=${smtp_password}" >> "$env_file"
    echo "NGINX_HOST=${domain}" >> "$env_file"
    echo "NGINX_PORT=${port}" >> "$env_file"
    echo "DPANEL_NAME=${dash_name}" >> "$env_file"
fi

echo "* Details have been saved in the .env file."
echo "*"
