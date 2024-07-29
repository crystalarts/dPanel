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
        0 ) echo "I continue the installation...";;
        1 ) echo "dPanel installation was interrupted."; exit;;
        * ) echo "Select '0' to continue or '1' to interrupt."; confirm_continue;;
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

## ------------------------------
## ----- Installation MySQL -----
## ------------------------------

echo "* I am installing MySQL..."
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
mysql -e "CREATE DATABASE dpanel-user;"
mysql -e "CREATE DATABASE dpanel-server;"
mysql -e "FLUSH PRIVILEGES;"

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

read -p "* Provide the dPanel admin username: " admin_name
read -p "* Provide the dPanel admin email: " admin_email
read -s -p "* Provide the dPanel admin password: " admin_password
echo

if [ -z "$admin_name" ] || [ -z "$admin_email" ] || [ -z "$password" ]; then
    echo "* The admin username, email, and password cannot be empty."
    exit 1
fi

echo "* Creating the dPanel admin account..."
mysql -u"$username" -p"$password" -h "localhost" -D "dpanel-user" -e "
CREATE TABLE IF NOT EXISTS dpanel-user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    admin BOOLEAN,
    servers JSON
);
INSERT INTO dpanel-user (name, email, password, admin, servers) VALUES ('$admin_name', '$admin_email', '$admin_password', TRUE, '[]');
"

echo "* The dPanel admin account has been created."
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