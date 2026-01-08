import exec from 'x-exec';
import { gray, green, magenta, red } from 'x-chalk';

if (!exec.success(`ls /Users/$USER`)) {
  red(`ERROR! db:sync may only be run from local dev machine!\n`);
  process.exit(1);
}

magenta(`\nStarting db sync process\n`);
exec.exit(`rm -f ./sync.sql.gz ./sync.sql`);
gray(`  • Dumping remote database...`);
// -Z 9 enables maximum compression for pg_dump
exec.exit(`ssh fapi "pg_dump flp --file sync.sql.gz -Z 9"`);
gray(`  • Downloading gzipped dump...`);
exec.exit(`scp fapi:~/sync.sql.gz .`);
gray(`  • Deleting remote dump file...`);
exec.exit(`ssh fapi "rm sync.sql.gz"`);
gray(`  • Unzipping local dump file...`);
exec.exit(`gunzip ./sync.sql.gz`);
gray(`  • Killing any running instances of Postico...`);
exec(`killall Postico`);
gray(`  • Dropping and re-creating local flp (\`flp_dev\`) database...`);
exec.exit(`dropdb flp_dev`);
exec.exit(`createdb flp_dev`);
gray(`  • Importing records...`);
exec.exit(`psql -d flp_dev -f ./sync.sql`);
gray(`  • Cleaning up...`);
exec.exit(`rm -f ./sync.sql.gz ./sync.sql`);
green(`\nSync complete!\n`);
