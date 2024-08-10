# How to install Panel?

If you need help with installation, go to our discord server: https://discord.gg/DRDvwDe8dD

## Step 1: Install Git

1. Update package list:

   ```bash
   sudo apt update
   ```

2. Install Git:

   ```bash
   sudo apt install -y git
   ```

3. Check if Git has been installed correctly:

   ```bash
   git --version
   ```

## Step 2: Download files from GitHub

```bash
git clone https://github.com/dpaneldev/dPanel
cd dPanel
```

## Step 3: Run the installation file

```bash
chmod +x installation.bash
./installation.bash
```

Follow the instructions provided during installation.

## Step 4: Start the server

```bash
node run.js
```
