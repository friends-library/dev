# entered password from buttercup, left everything else empty
adduser jared

# grant sudo privs
usermod -aG sudo jared

ufw allow OpenSSH
ufw enable

su jared
mkdir -p ~/.ssh
# back to root
exit
# copy over authorized keys
rsync --archive --chown=jared:jared ~/.ssh /home/jared
# don't ask `jared` for sudo password
echo "jared ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# for very small VM, postgres can gett OOM-killed, add swap
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
echo "vm.vfs_cache_pressure=50" | sudo tee -a /etc/sysctl.conf

# other programs
sudo apt update
sudo apt install -y unzip
sudo apt install -y tree
sudo apt install -y ripgrep

# install postgresql
su jared
# use directions here: https://www.postgresql.org/download/linux/ubuntu/
# to get correct version (currently 17)

# switch to created postgres user
sudo -i -u postgres
createuser jared

# open psql shell for a hot second and then
psql
> ALTER USER jared WITH SUPERUSER;
> \q;
exit;# get back to being jared
# ... in order to create the database as jared
createdb flp

# then, INSIDE of the psql terminal i had to:
psql -d flp
> GRANT ALL PRIVILEGES ON DATABASE flp TO jared;
> \password jared # then type in password twice

# my connection string was then (in .env) `DATABASE_URL=postgresql://<user>:<pass>@localhost/<dbname>`

# create `staging` database
createdb staging
psql -d staging
> GRANT ALL PRIVILEGES ON DATABASE staging TO jared;

# create `staging_test` database
createdb staging_test
psql -d staging_test
> GRANT ALL PRIVILEGES ON DATABASE staging_test TO jared;

# prevent "unattended upgrades" from upgrading postgres,
# because the api maintains a cache of previously prepared statements
# and an auto-upgrade restarts postgres, resulting in a cascade
# of `prepared statement plan X does not exist` errors
sudo vim /etc/apt/apt.conf.d/50unattended-upgrades
# add `"postgresql-";` (no backticks) INSIDE the "Package-Blacklist" block

# install nodejs for pm2 (follow nodejs.org directions)

# nginx
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# make /etc/nginx/sites-available/default look approximately like this:
```
server {
  server_name api.friendslibrary.com;
  location / {
      proxy_pass http://127.0.0.1:8080;
      proxy_http_version 1.1;
      # https://github.com/vapor/vapor/issues/2482
      # proxy_set_header Upgrade $http_upgrade;
      # proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass_header Server;
      proxy_cache_bypass $http_upgrade;
      proxy_connect_timeout 3s;
      proxy_read_timeout 10s;
   }
}

server {
  server_name api--staging.friendslibrary.com;
  location / {
      proxy_pass http://127.0.0.1:8090;
      proxy_http_version 1.1;
      # https://github.com/vapor/vapor/issues/2482
      # proxy_set_header Upgrade $http_upgrade;
      # proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass_header Server;
      proxy_cache_bypass $http_upgrade;
      proxy_connect_timeout 3s;
      proxy_read_timeout 10s;
   }
}
```

# then install and run let's encrypt, letting it finish the config
sudo apt install -y certbot python3-certbot-nginx
# choose 2 for https redirect
sudo certbot --nginx -d api.friendslibrary.com
sudo certbot --nginx -d api--staging.friendslibrary.com
sudo systemctl reload nginx

# set timezone to EST for scheduled jobs, etc.
sudo timedatectl set-timezone America/New_York


# DO SPACES (s3) DB BACKUPS
# install aws cli @see https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html
sudo apt install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf ./aws
rm awscliv2.zip
# check with `aws --version`
# then configure with: (only answer first two secret/id questions, leave others [NONE])
aws configure

# vim this script into ~/backup-db.sh
```
/usr/bin/pg_dump --inserts flp | /usr/bin/gzip -c > /home/jared/$(date -u +'%FT%H%MZ').sql.gz
/usr/local/bin/aws s3 cp /home/jared/*.sql.gz s3://flp-assets/storage/db-backups/ --endpoint=https://nyc3.digitaloceanspaces.com --quiet
/usr/bin/rm /home/jared/*.sql.gz
```
# then
crontab -e
# add line `30 3 * * * /usr/bin/bash /home/jared/backup/backup-db.sh` to start backups


