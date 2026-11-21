const { execSync } = require('child_process');

try {
  const output = execSync('netstat -ano', { encoding: 'utf8' });
  const lines = output.split('\n');
  const port4000Lines = lines.filter(l => l.includes(':4000') && l.includes('LISTENING'));

  for (const line of port4000Lines) {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && !isNaN(parseInt(pid))) {
      console.log(`Killing process on port 4000 with PID: ${pid}`);
      try {
        process.kill(parseInt(pid), 'SIGKILL');
      } catch (e) {
        execSync(`taskkill /F /PID ${pid}`);
      }
    }
  }
  console.log('Port 4000 check and clear completed.');
} catch (err) {
  console.error('Error in clearPort4000:', err.message);
}

