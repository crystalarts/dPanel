# How to use Panel? (VERSION WINDOWS)

If you need help with installation, go to our discord server: https://discord.gg/DRDvwDe8dD

## Step 1: Install Git

1. Install git from the page below:

   ```bash
       https://git-scm.com
   ```

## Step 2: Download mysql

1. Visit the website below:

   ```bash
       https://dev.mysql.com/downloads/installer/
   ```

2. Select the content below to download:

   ```bash
       mysql-installer-web-community-8.0.39.0.msi
   ```

3. After installation, create your first database and create tables as shown in installation.bash:

   ```bash
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
   ```

   ```
    CREATE TABLE IF NOT EXISTS server (
        key INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        id VARCHAR(255),
        owner VARCHAR(255),
        timestart DATETIME,
        timeout DATETIME,
    );
   ```

   ```
    CREATE TABLE IF NOT EXISTS eggs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        download VARCHAR(255),
        description LONGTEXT
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
   ```

   ```
    CREATE TABLE firewall (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `on` ENUM('on', 'off') NOT NULL,
        `type` ENUM('ACCEPT', 'DROP', 'REJECT') NOT NULL,
        interfaces VARCHAR(255) NOT NULL UNIQUE,
        direction ENUM('in', 'out') NOT NULL,
        protocol ENUM('http', 'https','tcp', 'udp', 'icmp', 'igmp', 'ggp', 'ipencap', 'st', 'egp', 'igp', 'pup', 'hmp', 'xns-idp', 'rdp', 'iso-tp4', 'dccp', 'xtp', 'ddp', 'idr-cmtp', 'ipv6', 'ipv6-route', 'ipv6-frag', 'idrp', 'rsvp', 'gre', 'esp', 'ah', 'skip', 'ipv6-icmp', 'ipv6-nonxt', 'ipv6-opts', 'vmtp', 'eigrp', 'ospf', 'ax.25', 'ipip', 'etherip', 'encap', 'pim', 'ipcomp', 'vrrp', 'l2tp', 'isis', 'sctp', 'dc', 'mobility-header', 'udplite', 'mpls-in-ip', 'hip', 'shim6', 'wesp', 'rohc') NOT NULL,
        comment TEXT
    );
   ```

## Step 3: Download files from GitHub

```bash
   git clone https://github.com/dpaneldev/dPanel
```

## Step 4: Complete the missing data:

1. Replace .env.example with .env

2. Complete mysql data:

   ```bash
       DB_USER= <enter mysql username (e.g.) root>
       DB_PASSWORD= <enter mysql user password (e.g.) admin>
       DB_HOST= <enter mysql host (e.g.) localhost>
       DB_NAME= <enter the name of the database that was created when creating the tables and before performing this action.>
   ```

3. Complete the smtp data:

   ```bash
       SMTP_HOST= <enter hostname (e.g.) gmail>
       SMTP_EMAIL= <enter the email name (e.g.) dpanel.smtp@gmail.com>
       SMTP_PASSWORD= <enter your email password here (if you use a gmail host, generate the code to authenticate the application at this link https://myaccount.google.com/apppasswords)>
   ```

4. Tutorial gmail:

   1. https://myaccount.google.com/apppasswords
   2. Generate password
   3. Copy it and paste into SMTP_PASSWORD

5. Complete the name of your panel:

   ```bash
       DPANEL_NAME= <Enter the name of the panel (e.g.) dPanel>
   ```

6. Set nginx:

   ```bash
      NGINX_HOST= <By default, the server starts on port 3000, it is recommended to use the phrase "localhost:3000">
   ```

## Step 5: Start the server

1. Install the package you need:

   ```bash
       npm i
   ```

2. Start the server with the command:

   ```bash
       node run.js
   ```

## Step 6: Finish

1. Enjoy your panel as much as you want, test it and have fun as much as you want. You can report any errors you encounter to us on the following discord.
